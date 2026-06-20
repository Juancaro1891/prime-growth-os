import { NextRequest, NextResponse } from "next/server"

const styleDescriptions: Record<string, string> = {
  "Fotorrealista": "fotografía fotorrealista, alta calidad, iluminación profesional, parece una foto real tomada con cámara",
  "Ilustración": "ilustración digital moderna, arte vectorial, colores vibrantes, estilo ilustrado",
  "Minimalista": "diseño minimalista, composición limpia, mucho espacio negativo, pocos colores, líneas simples",
  "Cinematográfico": "estilo cinematográfico, iluminación dramática, alto contraste, composición de escena de película",
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, size, style } = await req.json()

    const fullPrompt = `${prompt}. Estilo visual: ${styleDescriptions[style] || style}. Imagen publicitaria de alta calidad para redes sociales, sin texto ni marcas de agua.`

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

    if (!response.ok) {
      const err = await response.text()
      console.error("OpenAI API error:", err)
      throw new Error("OpenAI API error")
    }

    const result = await response.json()
    const imageUrl = result.data?.[0]?.url

    if (!imageUrl) {
      console.error("Respuesta de OpenAI sin URL de imagen:", JSON.stringify(result))
      throw new Error("OpenAI no devolvió una imagen")
    }

    return NextResponse.json({
      url: imageUrl,
      revisedPrompt: result.data[0].revised_prompt as string | undefined,
    })
  } catch (error) {
    console.error("Error generando imagen:", error)
    return NextResponse.json({ error: "Error al generar la imagen" }, { status: 500 })
  }
}
