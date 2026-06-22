import { getSupabaseUrl, getSupabaseServiceHeaders } from "@/lib/supabase-admin"

export type BusinessAnalysisInput = {
  businessName: string | null
  businessCategory: string | null
  businessDescription: string | null
  pageFanCount: number | null
  adAccountName: string | null
  currency: string | null
  timezoneName: string | null
}

export type BusinessAnalysisResult = {
  icp: string
  buyerPersona: string
  swot: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  recommendedStrategy: string
}

export async function generateBusinessAnalysis(input: BusinessAnalysisInput): Promise<BusinessAnalysisResult | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY no está configurada, no se puede generar el análisis de negocio")
    return null
  }

  const prompt = `Eres un experto analista de negocios y estratega de marketing digital para el mercado latinoamericano.

Esta es la información disponible del negocio, obtenida automáticamente desde su página de Facebook y su cuenta publicitaria de Meta:

Nombre del negocio: ${input.businessName || "No disponible"}
Categoría: ${input.businessCategory || "No disponible"}
Descripción / about: ${input.businessDescription || "No disponible"}
Seguidores en Facebook: ${input.pageFanCount ?? "No disponible"}
Cuenta publicitaria: ${input.adAccountName || "No disponible"} (moneda: ${input.currency || "No disponible"}, zona horaria: ${input.timezoneName || "No disponible"})

Con esta información, genera un análisis inicial del negocio. Si la información es limitada, infiere de forma razonable a partir de la categoría y el nombre, pero no inventes datos numéricos ni afirmes hechos específicos que no puedas inferir razonablemente.

Responde ÚNICAMENTE en JSON con este formato exacto, sin texto adicional:
{
  "icp": "descripción del cliente ideal (ICP)",
  "buyerPersona": "descripción detallada del buyer persona: demografía, motivaciones, objeciones principales",
  "swot": {
    "strengths": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
    "weaknesses": ["debilidad 1", "debilidad 2"],
    "opportunities": ["oportunidad 1", "oportunidad 2", "oportunidad 3"],
    "threats": ["amenaza 1", "amenaza 2"]
  },
  "recommendedStrategy": "estrategia de marketing recomendada en 3-5 líneas, específica para este negocio"
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
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      console.error("Anthropic API error generando análisis de negocio:", await response.text())
      return null
    }

    const result = await response.json()
    const text = result.content?.[0]?.text

    if (!text) {
      console.error("Respuesta de Anthropic sin contenido de texto:", JSON.stringify(result))
      return null
    }

    const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim()

    try {
      return JSON.parse(cleanJson)
    } catch (parseError) {
      console.error("Falló el JSON.parse directo del análisis de negocio:", parseError)
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
  } catch (error) {
    console.error("Error generando análisis de negocio (excepción):", error)
    return null
  }
}

export async function saveBusinessAnalysis(userId: string, analysis: BusinessAnalysisResult): Promise<boolean> {
  const url = getSupabaseUrl()
  const headers = getSupabaseServiceHeaders()

  if (!url || !headers.apikey) {
    console.error("Supabase no está configurado, no se pudo guardar el análisis de negocio")
    return false
  }

  const response = await fetch(`${url}/rest/v1/business_analysis`, {
    method: "POST",
    headers: { ...headers, "Prefer": "return=minimal" },
    body: JSON.stringify({
      user_id: userId,
      icp: analysis.icp,
      buyer_persona: analysis.buyerPersona,
      swot: analysis.swot,
      recommended_strategy: analysis.recommendedStrategy,
      generated_at: new Date().toISOString(),
    }),
  })

  if (!response.ok) {
    console.error("Error guardando business_analysis en Supabase:", await response.text())
    return false
  }

  return true
}
