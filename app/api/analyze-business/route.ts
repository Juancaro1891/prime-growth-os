import Anthropic from "@anthropic-ai/sdk"
import { NextRequest } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json()

    const prompt = `Eres un experto analista de negocios y estratega de marketing digital para el mercado latinoamericano.

Analiza este negocio y genera un perfil completo:

"${description}"

Responde ÚNICAMENTE en JSON con este formato exacto:
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

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    })

    const content = response.content[0]
    if (content.type !== "text") throw new Error("Invalid response")

    const cleanJson = content.text.replace(/```json\n?|\n?```/g, "").trim()
    const data = JSON.parse(cleanJson)

    return Response.json(data)
  } catch (error) {
    console.error("Error analizando negocio:", error)
    return Response.json({ error: "Error al analizar el negocio" }, { status: 500 })
  }
}
