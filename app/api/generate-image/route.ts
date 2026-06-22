import { NextRequest, NextResponse } from "next/server"

// gpt-image-2 a quality "high" tardó ~168s en una prueba real (vs. ~38-49s de gpt-image-1) — 60s no alcanza.
// Esto requiere que el plan de Vercel del proyecto permita funciones de esta duración (Hobby suele topar
// más bajo que Pro/Enterprise); si el despliegue sigue cortando la función, hay que subir el plan o bajar
// "quality" en vez de subir este número más todavía.
export const maxDuration = 300

const styleDescriptions: Record<string, string> = {
  "Fotorrealista": "fotografía fotorrealista, alta calidad, iluminación profesional, parece una foto real tomada con cámara",
  "Ilustración": "ilustración digital moderna, arte vectorial, colores vibrantes, estilo ilustrado",
  "Minimalista": "diseño minimalista, composición limpia, mucho espacio negativo, pocos colores, líneas simples",
  "Cinematográfico": "estilo cinematográfico, iluminación dramática, alto contraste, composición de escena de película",
}

const OPENAI_IMAGE_MODEL = "gpt-image-2-2026-04-21"
const OPENAI_IMAGE_FALLBACK_MODEL = "gpt-image-1"

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

// Heurística sobre el error de OpenAI: ¿el modelo pedido no existe / no está disponible para esta cuenta?
// (a diferencia de, por ejemplo, prompt rechazado por moderación, tamaño inválido, rate limit, etc.)
function isModelUnavailableError(result: unknown, httpStatus: number): boolean {
  const err = (result as { error?: { code?: string; type?: string; message?: string } } | null)?.error
  if (!err) return false
  const code = (err.code || "").toLowerCase()
  const message = (err.message || "").toLowerCase()
  return (
    httpStatus === 404 ||
    code === "model_not_found" ||
    message.includes("does not exist") ||
    message.includes("do not have access") ||
    message.includes("not supported") ||
    message.includes("unknown model")
  )
}

async function callOpenAiImages(params: {
  model: string
  prompt: string
  openAiSize: string
  referenceImage: { blob: Blob; extension: string } | null
}) {
  if (params.referenceImage) {
    // Con imagen de referencia usamos /v1/images/edits (multipart/form-data), no /v1/images/generations.
    const formData = new FormData()
    formData.append("model", params.model)
    formData.append("prompt", params.prompt)
    formData.append("size", params.openAiSize)
    formData.append("quality", "high")
    formData.append("n", "1")
    formData.append("output_format", "png")
    formData.append("image[]", params.referenceImage.blob, `reference.${params.referenceImage.extension}`)

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
      body: formData,
    })
    const result = await response.json().catch((parseError) => {
      console.error("La respuesta de OpenAI no es JSON válido:", parseError)
      return null
    })
    return { response, result }
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: params.model,
      prompt: params.prompt,
      size: params.openAiSize,
      quality: "high",
      n: 1,
      output_format: "png",
    }),
  })
  const result = await response.json().catch((parseError) => {
    console.error("La respuesta de OpenAI no es JSON válido:", parseError)
    return null
  })
  return { response, result }
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

    let referenceImage: { blob: Blob; extension: string } | null = null
    if (imagePrompt) {
      referenceImage = dataUrlToBlob(imagePrompt)
      if (!referenceImage) {
        return NextResponse.json({ error: "Error al generar la imagen", details: "La imagen de referencia no es un data URI base64 válido" }, { status: 400 })
      }
    }

    // Separamos explícitamente "qué hacer con la foto adjunta" de "instrucciones de composición" (que ya
    // pueden incluir dónde poner un logo, etc.) para que el modelo no mezcle ambas cosas.
    const editsPrompt = `Usa la imagen adjunta únicamente como referencia visual de estilo, color y composición general — no la copies literalmente, genera una imagen nueva inspirada en ella. Sigue además estas instrucciones de composición para la imagen final: ${fullPrompt}`
    const requestPrompt = referenceImage ? editsPrompt : fullPrompt

    console.log("Generando imagen con GPT Image (OpenAI):", {
      model: OPENAI_IMAGE_MODEL,
      size: openAiSize,
      style,
      promptLength: fullPrompt.length,
      hasImagePrompt: !!imagePrompt,
    })

    let { response, result } = await callOpenAiImages({
      model: OPENAI_IMAGE_MODEL,
      prompt: requestPrompt,
      openAiSize,
      referenceImage,
    })

    let modelUsed = OPENAI_IMAGE_MODEL

    if (!response.ok && isModelUnavailableError(result, response.status)) {
      console.error(
        `El modelo ${OPENAI_IMAGE_MODEL} no está disponible (HTTP ${response.status}), reintentando con ${OPENAI_IMAGE_FALLBACK_MODEL}. Error original de OpenAI:`,
        JSON.stringify(result)
      )

      modelUsed = OPENAI_IMAGE_FALLBACK_MODEL
      ;({ response, result } = await callOpenAiImages({
        model: OPENAI_IMAGE_FALLBACK_MODEL,
        prompt: requestPrompt,
        openAiSize,
        referenceImage,
      }))
    }

    console.log("OpenAI respondió con status:", response.status, "modelo usado:", modelUsed)

    if (!response.ok) {
      // Log completo (no solo el .message) para poder diagnosticar cualquier tipo de error: moderación,
      // tamaño inválido, rate limit, cuota agotada, modelo no disponible, etc.
      console.error("OpenAI API error completo:", JSON.stringify(result))
      const err = (result as { error?: { message?: string; code?: string; type?: string } } | null)?.error
      const details = err?.message
        ? `${err.message}${err.code ? ` (code: ${err.code})` : ""}`
        : `OpenAI devolvió HTTP ${response.status} sin detalle`
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
