import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { platform, objective, description, business } = await req.json()

    const prompt = `Eres un experto copywriter especializado en publicidad digital para el mercado latinoamericano.

Genera 3 copies de alto impacto para ${platform} con objetivo de ${objective}.

Información del negocio:
${business ? `Negocio: ${business}` : ""}
${description ? `Objetivo específico: ${description}` : ""}

Responde ÚNICAMENTE en JSON con este formato exacto, sin texto adicional:
{
  "copies": [
    {
      "headline": "título llamativo",
      "body": "copy principal",
      "cta": "llamada a la acción",
      "score": 85
    },
    {
      "headline": "título llamativo",
      "body": "copy principal",
      "cta": "llamada a la acción",
      "score": 82
    },
    {
      "headline": "título llamativo",
      "body": "copy principal",
      "cta": "llamada a la acción",
      "score": 79
    }
  ]
}

Los copies deben usar lenguaje coloquial latinoamericano, emojis relevantes, crear urgencia y hablar al dolor del cliente.`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
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
    console.error("Error generando copy:", error)
    return NextResponse.json({ error: "Error al generar copies" }, { status: 500 })
  }
}
