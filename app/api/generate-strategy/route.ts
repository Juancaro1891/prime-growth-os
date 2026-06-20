import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { budget, industry, objective, context } = await req.json()

    const prompt = `Eres un estratega senior de marketing digital para pymes del mercado latinoamericano.

Genera una estrategia de campaña publicitaria completa para este negocio:

Presupuesto mensual: $${budget} COP
Industria: ${industry}
Objetivo principal: ${objective}
${context ? `Contexto adicional del negocio: ${context}` : ""}

Responde ÚNICAMENTE en JSON con este formato exacto, sin texto adicional:
{
  "summary": "resumen ejecutivo de la estrategia en 2-3 líneas",
  "budgetAllocation": [
    { "platform": "nombre de la plataforma", "percentage": 50, "reason": "por qué se le asigna ese porcentaje, en una línea" }
  ],
  "phases": [
    { "name": "Fase 1: Testeo", "duration": "Semana 1-2", "focus": "foco principal de la fase", "actions": ["acción concreta 1", "acción concreta 2"] }
  ],
  "estimatedCPL": "rango estimado de costo por lead en COP",
  "estimatedLeads": "rango estimado de leads mensuales con ese presupuesto",
  "keyMessage": "ángulo de comunicación o propuesta de valor principal a usar en los anuncios",
  "nextSteps": ["acción concreta 1", "acción concreta 2", "acción concreta 3"]
}

Reglas:
- Los "percentage" de budgetAllocation deben sumar exactamente 100.
- Usa máximo 3 plataformas, las más relevantes para la industria y el objetivo.
- Genera exactamente 3 fases: testeo, optimización y escalamiento.
- Sé específico y realista para el mercado latinoamericano, considerando el presupuesto dado.`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error("Anthropic API error:", err)
      throw new Error("Anthropic API error")
    }

    const result = await response.json()

    if (result.stop_reason === "max_tokens") {
      console.error("Anthropic cortó la respuesta por max_tokens, el JSON puede venir incompleto")
    }

    const text = result.content?.[0]?.text
    if (!text) {
      console.error("Respuesta de Anthropic sin contenido de texto:", JSON.stringify(result))
      throw new Error("Respuesta de Anthropic sin contenido")
    }

    const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim()

    let data
    try {
      data = JSON.parse(cleanJson)
    } catch (parseError) {
      console.error("Fallo el JSON.parse directo:", parseError)
      console.error("Texto crudo devuelto por Claude:", text)

      const match = cleanJson.match(/\{[\s\S]*\}/)
      if (!match) {
        console.error("No se encontró ningún objeto JSON dentro del texto")
        throw new Error("Claude no devolvió JSON válido")
      }

      try {
        data = JSON.parse(match[0])
      } catch (fallbackError) {
        console.error("Fallo también el JSON.parse del fallback con regex:", fallbackError)
        console.error("Substring que se intentó parsear:", match[0])
        throw new Error("Claude no devolvió JSON válido")
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error generando estrategia:", error)
    return NextResponse.json({ error: "Error al generar la estrategia" }, { status: 500 })
  }
}
