import Anthropic from "@anthropic-ai/sdk"
import { NextRequest } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const { platform, objective, description, business } = await req.json()

    const prompt = `Eres un experto copywriter especializado en publicidad digital para el mercado latinoamericano.

Genera 3 copies de alto impacto para ${platform} con objetivo de ${objective}.

Información del negocio:
${business ? `Negocio: ${business}` : ""}
${description ? `Objetivo específico: ${description}` : ""}

Para cada copy genera:
1. Un copy principal (máximo 150 caracteres para Meta, 100 para Google, 200 para WhatsApp)
2. Un headline llamativo
3. Un CTA específico

Responde en JSON con este formato exacto:
{
  "copies": [
    {
      "headline": "título llamativo",
      "body": "copy principal",
      "cta": "llamada a la acción",
      "score": 85
    }
  ]
}

Los copies deben:
- Usar lenguaje coloquial latinoamericano
- Incluir emojis relevantes
- Crear urgencia o escasez cuando aplique
- Hablar directamente al dolor o deseo del cliente
- Ser específicos con números o resultados cuando sea posible`

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    })

    const content = response.content[0]
    if (content.type !== "text") throw new Error("Invalid response")

    const cleanJson = content.text.replace(/```json\n?|\n?```/g, "").trim()
    const data = JSON.parse(cleanJson)

    return Response.json(data)
  } catch (error) {
    console.error("Error generando copy:", error)
    return Response.json({ error: "Error al generar copies" }, { status: 500 })
  }
}
