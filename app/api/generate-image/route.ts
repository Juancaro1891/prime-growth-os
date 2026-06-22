import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 60

const styleDescriptions: Record<string, string> = {
  "Fotorrealista": "fotografía fotorrealista, alta calidad, iluminación profesional, parece una foto real tomada con cámara",
  "Ilustración": "ilustración digital moderna, arte vectorial, colores vibrantes, estilo ilustrado",
  "Minimalista": "diseño minimalista, composición limpia, mucho espacio negativo, pocos colores, líneas simples",
  "Cinematográfico": "estilo cinematográfico, iluminación dramática, alto contraste, composición de escena de película",
}

// El frontend sigue enviando tamaños estilo DALL-E 3; gpt-image-1 solo acepta 1024x1024 / 1536x1024 / 1024x1536.
const openAiSizeBySize: Record<string, string> = {
  "1024x1024": "1024x1024", // Cuadrado / feed
  "1792x1024": "1536x1024", // Horizontal
  "1024x1792": "1024x1536", // Vertical / stories
}

function dataUrlToBlob(dataUrl: string): { blob: Blob; extension: string } | null {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl)
  if (!match) return null
  const [, mimeType, base64Data] = match
  const buffer = Buffer.from(base64Data, "base64")
  const extension = mimeType.split("/")[1] || "png"
  return { blob: new Blob([buffer], { type: mimeType }), extension }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, size, style, imagePrompt } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY no está configurada en este entorno")
      return NextResponse.json({ error: "Error al generar la imagen", details: "OPENAI_API_KEY no está configurada en el servidor" }, { status: 500 })
    }

    const fullPrompt = `${prompt}. Estilo visual: ${styleDescriptions[style] || style}. Imagen publicitaria de alta calidad para redes sociales, sin texto ni marcas de agua.`
    const openAiSize = openAiSizeBySize[size] || "1024x1024"

    console.log("Generando imagen con GPT Image (OpenAI):", { size: openAiSize, style, promptLength: fullPrompt.length, hasImagePrompt: !!imagePrompt })

    let response: Response

    if (imagePrompt) {
      const referenceImage = dataUrlToBlob(imagePrompt)
      if (!referenceImage) {
        return NextResponse.json({ error: "Error al generar la imagen", details: "La imagen de referencia no es un data URI base64 válido" }, { status: 400 })
      }

      // Con imagen de referencia usamos /v1/images/edits (multipart/form-data), no /v1/images/generations.
      const formData = new FormData()
      formData.append("model", "gpt-image-1")
      formData.append("prompt", fullPrompt)
      formData.append("size", openAiSize)
      formData.append("quality", "high")
      formData.append("n", "1")
      formData.append("output_format", "png")
      formData.append("image[]", referenceImage.blob, `reference.${referenceImage.extension}`)

      response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
        body: formData,
      })
    } else {
      response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: fullPrompt,
          size: openAiSize,
          quality: "high",
          n: 1,
          output_format: "png",
        }),
      })
    }

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

    const b64 = result?.data?.[0]?.b64_json

    if (!b64) {
      console.error("Respuesta de OpenAI sin imagen en base64:", JSON.stringify(result))
      return NextResponse.json({ error: "Error al generar la imagen", details: "OpenAI no devolvió una imagen en la respuesta" }, { status: 500 })
    }

    return NextResponse.json({ url: `data:image/png;base64,${b64}` })
  } catch (error) {
    console.error("Error generando imagen (excepción):", error)
    const details = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Error al generar la imagen", details }, { status: 500 })
  }
}
