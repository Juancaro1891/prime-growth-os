import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 60

const styleDescriptions: Record<string, string> = {
  "Fotorrealista": "fotografía fotorrealista, alta calidad, iluminación profesional, parece una foto real tomada con cámara",
  "Ilustración": "ilustración digital moderna, arte vectorial, colores vibrantes, estilo ilustrado",
  "Minimalista": "diseño minimalista, composición limpia, mucho espacio negativo, pocos colores, líneas simples",
  "Cinematográfico": "estilo cinematográfico, iluminación dramática, alto contraste, composición de escena de película",
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, size, style } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY no está configurada en este entorno")
      return NextResponse.json({ error: "Error al generar la imagen", details: "OPENAI_API_KEY no está configurada en el servidor" }, { status: 500 })
    }

    const fullPrompt = `${prompt}. Estilo visual: ${styleDescriptions[style] || style}. Imagen publicitaria de alta calidad para redes sociales, sin texto ni marcas de agua.`

    console.log("Generando imagen con DALL-E 3:", { size, style, promptLength: fullPrompt.length })

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: fullPrompt,
        n: 1,
        size: size || "1024x1024",
      }),
    })

    const result = await response.json().catch((parseError) => {
      console.error("La respuesta de OpenAI no es JSON válido:", parseError)
      return null
    })

    console.log("OpenAI respondió con status:", response.status)

    if (!response.ok) {
      console.error("OpenAI API error completo:", JSON.stringify(result))
      const details = result?.error?.message || `OpenAI devolvió HTTP ${response.status} sin detalle`
      return NextResponse.json({ error: "Error al generar la imagen", details }, { status: 500 })
    }

    const imageUrl = result?.data?.[0]?.url

    if (!imageUrl) {
      console.error("Respuesta de OpenAI sin URL de imagen:", JSON.stringify(result))
      return NextResponse.json({ error: "Error al generar la imagen", details: "OpenAI no devolvió una imagen en la respuesta" }, { status: 500 })
    }

    return NextResponse.json({
      url: imageUrl,
      revisedPrompt: result.data[0].revised_prompt as string | undefined,
    })
  } catch (error) {
    console.error("Error generando imagen (excepción):", error)
    const details = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Error al generar la imagen", details }, { status: 500 })
  }
}
