import { getSupabaseUrl, getSupabaseServiceHeaders } from "@/lib/supabase-admin"

export const META_OBJECTIVES = ["OUTCOME_TRAFFIC", "OUTCOME_LEADS", "OUTCOME_AWARENESS"] as const
export type MetaObjective = (typeof META_OBJECTIVES)[number]

export type CampaignSuggestion = {
  id: string
  user_id: string
  name: string
  objective: string
  daily_budget: number | null
  copy: string
  audience: string
  justification: string
  status: string
  meta_campaign_id: string | null
  created_at: string
}

export type SuggestedCampaignFields = {
  name: string
  objective: string
  dailyBudget: number | null
  copy: string
  audience: string
  justification: string
}

type BusinessAnalysisRow = {
  icp: string | null
  buyer_persona: string | null
  swot: { strengths?: string[]; weaknesses?: string[]; opportunities?: string[]; threats?: string[] } | null
  recommended_strategy: string | null
}

export async function getLatestBusinessAnalysis(userId: string): Promise<BusinessAnalysisRow | null> {
  const url = getSupabaseUrl()
  const headers = getSupabaseServiceHeaders()

  if (!url || !headers.apikey) {
    console.error("Supabase no está configurado (falta SUPABASE_SERVICE_ROLE_KEY o la URL)")
    return null
  }

  const response = await fetch(
    `${url}/rest/v1/business_analysis?user_id=eq.${encodeURIComponent(userId)}&select=*&order=generated_at.desc&limit=1`,
    { headers }
  )

  if (!response.ok) {
    console.error("Error consultando business_analysis en Supabase:", await response.text())
    return null
  }

  const rows = await response.json()
  return rows?.[0] || null
}

export async function getCampaignSuggestions(userId: string, status?: string): Promise<CampaignSuggestion[]> {
  const url = getSupabaseUrl()
  const headers = getSupabaseServiceHeaders()

  if (!url || !headers.apikey) {
    console.error("Supabase no está configurado (falta SUPABASE_SERVICE_ROLE_KEY o la URL)")
    return []
  }

  let query = `${url}/rest/v1/campaign_suggestions?user_id=eq.${encodeURIComponent(userId)}&select=*&order=created_at.desc`
  if (status) query += `&status=eq.${encodeURIComponent(status)}`

  const response = await fetch(query, { headers })

  if (!response.ok) {
    console.error("Error consultando campaign_suggestions en Supabase:", await response.text())
    return []
  }

  return response.json()
}

export async function getCampaignSuggestion(id: string, userId: string): Promise<CampaignSuggestion | null> {
  const url = getSupabaseUrl()
  const headers = getSupabaseServiceHeaders()

  const response = await fetch(
    `${url}/rest/v1/campaign_suggestions?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(userId)}&select=*&limit=1`,
    { headers }
  )

  if (!response.ok) {
    console.error("Error consultando campaign_suggestion en Supabase:", await response.text())
    return null
  }

  const rows = await response.json()
  return rows?.[0] || null
}

export async function replacePendingSuggestions(userId: string, suggestions: SuggestedCampaignFields[]): Promise<CampaignSuggestion[] | null> {
  const url = getSupabaseUrl()
  const headers = getSupabaseServiceHeaders()

  if (!url || !headers.apikey) {
    console.error("Supabase no está configurado (falta SUPABASE_SERVICE_ROLE_KEY o la URL)")
    return null
  }

  const deleteResponse = await fetch(
    `${url}/rest/v1/campaign_suggestions?user_id=eq.${encodeURIComponent(userId)}&status=eq.pending`,
    { method: "DELETE", headers }
  )

  if (!deleteResponse.ok) {
    console.error("Error borrando campaign_suggestions pendientes anteriores:", await deleteResponse.text())
    return null
  }

  const insertResponse = await fetch(`${url}/rest/v1/campaign_suggestions`, {
    method: "POST",
    headers: { ...headers, "Prefer": "return=representation" },
    body: JSON.stringify(
      suggestions.map((s) => ({
        user_id: userId,
        name: s.name,
        objective: s.objective,
        daily_budget: s.dailyBudget,
        copy: s.copy,
        audience: s.audience,
        justification: s.justification,
        status: "pending",
      }))
    ),
  })

  if (!insertResponse.ok) {
    console.error("Error insertando campaign_suggestions:", await insertResponse.text())
    return null
  }

  return insertResponse.json()
}

export async function updateCampaignSuggestion(id: string, userId: string, fields: Record<string, unknown>): Promise<CampaignSuggestion | null> {
  const url = getSupabaseUrl()
  const headers = getSupabaseServiceHeaders()

  const response = await fetch(
    `${url}/rest/v1/campaign_suggestions?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      headers: { ...headers, "Prefer": "return=representation" },
      body: JSON.stringify(fields),
    }
  )

  if (!response.ok) {
    console.error("Error actualizando campaign_suggestion:", await response.text())
    return null
  }

  const rows = await response.json()
  return rows?.[0] || null
}

function buildBusinessContext(business: {
  businessName: string | null
  businessCategory: string | null
  businessDescription: string | null
  currency: string | null
  timezoneName: string | null
}, analysis: BusinessAnalysisRow | null) {
  let context = `Nombre del negocio: ${business.businessName || "No disponible"}
Categoría: ${business.businessCategory || "No disponible"}
Descripción: ${business.businessDescription || "No disponible"}
Moneda de la cuenta publicitaria: ${business.currency || "COP"}
Zona horaria: ${business.timezoneName || "No disponible"}`

  if (analysis) {
    context += `

Análisis de negocio ya generado:
ICP: ${analysis.icp || "No disponible"}
Buyer persona: ${analysis.buyer_persona || "No disponible"}
Fortalezas: ${analysis.swot?.strengths?.join(", ") || "No disponible"}
Oportunidades: ${analysis.swot?.opportunities?.join(", ") || "No disponible"}
Estrategia recomendada: ${analysis.recommended_strategy || "No disponible"}`
  } else {
    context += `

Aún no hay un análisis de negocio detallado disponible; infiere de forma razonable a partir del nombre y la categoría, sin inventar datos específicos.`
  }

  return context
}

function parseClaudeJson<T>(text: string): T | null {
  const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim()

  try {
    return JSON.parse(cleanJson)
  } catch (parseError) {
    console.error("Falló el JSON.parse directo:", parseError)
    console.error("Texto crudo devuelto por Claude:", text)

    const match = cleanJson.match(/\{[\s\S]*\}/)
    if (!match) {
      console.error("No se encontró ningún objeto JSON en la respuesta de Claude")
      return null
    }

    try {
      return JSON.parse(match[0])
    } catch (fallbackError) {
      console.error("Falló también el JSON.parse del fallback con regex:", fallbackError)
      return null
    }
  }
}

function normalizeObjective(objective: unknown): MetaObjective {
  return META_OBJECTIVES.includes(objective as MetaObjective) ? (objective as MetaObjective) : "OUTCOME_LEADS"
}

export async function generateCampaignSuggestions(business: {
  businessName: string | null
  businessCategory: string | null
  businessDescription: string | null
  currency: string | null
  timezoneName: string | null
}, analysis: BusinessAnalysisRow | null): Promise<SuggestedCampaignFields[] | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY no está configurada, no se pueden generar campañas")
    return null
  }

  const prompt = `Eres un estratega senior de Meta Ads (Facebook/Instagram) para pymes del mercado latinoamericano.

${buildBusinessContext(business, analysis)}

Genera exactamente 3 campañas de Meta Ads recomendadas para este negocio, cada una con un objetivo y un ángulo distinto.

Responde ÚNICAMENTE en JSON con este formato exacto, sin texto adicional:
{
  "campaigns": [
    {
      "name": "nombre de la campaña",
      "objective": "OUTCOME_TRAFFIC",
      "dailyBudget": 50000,
      "copy": "copy del anuncio principal, persuasivo, en español latinoamericano",
      "audience": "descripción de la audiencia objetivo: edad, ubicación, intereses",
      "justification": "por qué se recomienda esta campaña para este negocio, en 1-2 líneas"
    }
  ]
}

Reglas:
- Genera exactamente 3 campañas, una por cada uno de estos objetivos: OUTCOME_TRAFFIC, OUTCOME_LEADS, OUTCOME_AWARENESS (uno por campaña, sin repetir).
- "dailyBudget" es un número entero en la moneda de la cuenta publicitaria indicada arriba, sin símbolos ni separadores de miles.
- Sé específico y realista para el negocio dado, no genérico.`

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2500,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      console.error("Anthropic API error generando campañas sugeridas:", await response.text())
      return null
    }

    const result = await response.json()
    const text = result.content?.[0]?.text

    if (!text) {
      console.error("Respuesta de Anthropic sin contenido de texto:", JSON.stringify(result))
      return null
    }

    const parsed = parseClaudeJson<{ campaigns: SuggestedCampaignFields[] }>(text)
    if (!parsed?.campaigns) return null

    return parsed.campaigns.map((c) => ({ ...c, objective: normalizeObjective(c.objective) }))
  } catch (error) {
    console.error("Error generando campañas sugeridas (excepción):", error)
    return null
  }
}

export async function adjustCampaignSuggestion(current: CampaignSuggestion, instruction: string): Promise<SuggestedCampaignFields | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY no está configurada, no se puede ajustar la campaña")
    return null
  }

  const prompt = `Eres un estratega de Meta Ads. Esta es una campaña sugerida actualmente:

Nombre: ${current.name}
Objetivo: ${current.objective}
Presupuesto diario: ${current.daily_budget ?? "No definido"}
Copy: ${current.copy}
Audiencia: ${current.audience}
Justificación: ${current.justification}

El usuario pide este cambio: "${instruction}"

Ajusta la campaña según lo que pide el usuario. Mantén los campos que no se vean afectados por el cambio igual a como estaban.

Responde ÚNICAMENTE en JSON con este formato exacto, sin texto adicional:
{
  "name": "...",
  "objective": "OUTCOME_TRAFFIC",
  "dailyBudget": 50000,
  "copy": "...",
  "audience": "...",
  "justification": "..."
}`

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      console.error("Anthropic API error ajustando campaña:", await response.text())
      return null
    }

    const result = await response.json()
    const text = result.content?.[0]?.text

    if (!text) {
      console.error("Respuesta de Anthropic sin contenido de texto:", JSON.stringify(result))
      return null
    }

    const parsed = parseClaudeJson<SuggestedCampaignFields>(text)
    if (!parsed) return null

    return { ...parsed, objective: normalizeObjective(parsed.objective) }
  } catch (error) {
    console.error("Error ajustando campaña sugerida (excepción):", error)
    return null
  }
}
