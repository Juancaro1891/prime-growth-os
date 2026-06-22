import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 60

const styleDescriptions: Record<string, string> = {
  "Fotorrealista": "fotografía fotorrealista, alta calidad, iluminación profesional, parece una foto real tomada con cámara",
  "Ilustración": "ilustración digital moderna, arte vectorial, colores vibrantes, estilo ilustrado",
  "Minimalista": "diseño minimalista, composición limpia, mucho espacio negativo, pocos colores, líneas simples",
  "Cinematográfico": "estilo cinematográfico, iluminación dramática, alto contraste, composición de escena de película",
}

const OPENAI_IMAGE_MODEL = "gpt-image-2-2026-04-21"

// El frontend sigue enviando tamaños estilo DALL-E 3. gpt-image-2 acepta resoluciones arbitrarias
// (múltiplos de 16px, lado máx. 3840px, relación de aspecto ≤3:1, 655.360–8.294.400px totales) en vez
// del enum fijo de gpt-image-1, pero estos 3 valores ya satisfacen esas reglas, así que no hace falta cambiarlos.
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
      // Separamos explícitamente "qué hacer con la foto adjunta" de "instrucciones de composición" (que ya
      // pueden incluir dónde poner un logo, etc.) para que el modelo no mezcle ambas cosas.
      const editsPrompt = `Usa la imagen adjunta únicamente como referencia visual de estilo, color y composición general — no la copies literalmente, genera una imagen nueva inspirada en ella. Sigue además estas instrucciones de composición para la imagen final: ${fullPrompt}`

      const formData = new FormData()
      formData.append("model", OPENAI_IMAGE_MODEL)
      formData.append("prompt", editsPrompt)
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
          model: OPENAI_IMAGE_MODEL,
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
