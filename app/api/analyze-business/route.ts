import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json()

    const prompt = `Eres un experto analista de negocios y estratega de marketing digital para el mercado latinoamericano.

Analiza este negocio y genera un perfil completo:

"${description}"

Responde ÚNICAMENTE en JSON con este formato exacto, sin texto adicional:
{
  "businessName": "nombre del negocio",
  "industry": "industria",
  "product": "descripción del producto/servicio",
  "icp": "perfil del cliente ideal",
  "buyerPersona": "descripción detallada del buyer persona",
  "valueProposition": "propuesta de valor única",
  "mainPain": "dolor principal del cliente",
  "competitors": ["competidor 1", "competidor 2", "competidor 3"],
  "strengths": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
  "opportunities": ["oportunidad 1", "oportunidad 2", "oportunidad 3"],
  "recommendedChannels": ["canal 1", "canal 2", "canal 3"],
  "suggestedOffer": "oferta irresistible sugerida",
  "estimatedCPL": "rango estimado de costo por lead en COP"
}`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error("Anthropic API error:", err)
      throw new Error("Anthropic API error")
    }

    const result = await response.json()
    const text = result.content[0].text
    const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim()
    const data = JSON.parse(cleanJson)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error analizando negocio:", error)
    return NextResponse.json({ error: "Error al analizar el negocio" }, { status: 500 })
  }
}
