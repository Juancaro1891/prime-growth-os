import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 60

const styleDescriptions: Record<string, string> = {
  "Fotorrealista": "fotografía fotorrealista, alta calidad, iluminación profesional, parece una foto real tomada con cámara",
  "Ilustración": "ilustración digital moderna, arte vectorial, colores vibrantes, estilo ilustrado",
  "Minimalista": "diseño minimalista, composición limpia, mucho espacio negativo, pocos colores, líneas simples",
  "Cinematográfico": "estilo cinematográfico, iluminación dramática, alto contraste, composición de escena de película",
}

// El frontend (app/dashboard-layout/images/page.tsx) sigue enviando tamaños estilo DALL-E.
const aspectRatioBySize: Record<string, string> = {
  "1024x1024": "1:1", // Cuadrado
  "1792x1024": "16:9", // Horizontal
  "1024x1792": "9:16", // Vertical
}

const POLL_INTERVAL_MS = 2000
const POLL_TIMEOUT_MS = 60000

export async function POST(req: NextRequest) {
  try {
    const { prompt, size, style } = await req.json()

    if (!process.env.REPLICATE_API_KEY) {
      console.error("REPLICATE_API_KEY no está configurada en este entorno")
      return NextResponse.json({ error: "Error al generar la imagen", details: "REPLICATE_API_KEY no está configurada en el servidor" }, { status: 500 })
    }

    const fullPrompt = `${prompt}. Estilo visual: ${styleDescriptions[style] || style}. Imagen publicitaria de alta calidad para redes sociales, sin texto ni marcas de agua.`
    const aspectRatio = aspectRatioBySize[size] || "1:1"

    console.log("Generando imagen con Flux Pro (Replicate):", { aspectRatio, style, promptLength: fullPrompt.length })

    const createResponse = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-pro/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${process.env.REPLICATE_API_KEY}`,
      },
      body: JSON.stringify({
        input: {
          prompt: fullPrompt,
          aspect_ratio: aspectRatio,
          output_format: "webp",
        },
      }),
    })

    let prediction = await createResponse.json().catch((parseError) => {
      console.error("La respuesta de Replicate no es JSON válido:", parseError)
      return null
    })

    console.log("Replicate respondió con status HTTP:", createResponse.status)

    if (!createResponse.ok) {
      console.error("Replicate API error completo:", JSON.stringify(prediction))
      const details = prediction?.detail || `Replicate devolvió HTTP ${createResponse.status} sin detalle`
      return NextResponse.json({ error: "Error al generar la imagen", details }, { status: 500 })
    }

    const pollUrl = prediction?.urls?.get

    if (!pollUrl) {
      console.error("Respuesta de Replicate sin URL de consulta:", JSON.stringify(prediction))
      return NextResponse.json({ error: "Error al generar la imagen", details: "Replicate no devolvió una URL para consultar el estado de la predicción" }, { status: 500 })
    }

    const startTime = Date.now()

    while (prediction.status !== "succeeded" && prediction.status !== "failed" && prediction.status !== "canceled") {
      if (Date.now() - startTime > POLL_TIMEOUT_MS) {
        console.error("Tiempo de espera agotado consultando la predicción de Replicate:", JSON.stringify(prediction))
        return NextResponse.json({ error: "Error al generar la imagen", details: "Se agotó el tiempo de espera generando la imagen" }, { status: 504 })
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))

      const pollResponse = await fetch(pollUrl, {
        headers: {
          "Authorization": `Token ${process.env.REPLICATE_API_KEY}`,
        },
      })

      const polled = await pollResponse.json().catch((parseError) => {
        console.error("La respuesta de consulta de Replicate no es JSON válido:", parseError)
        return null
      })

      if (!pollResponse.ok || !polled) {
        console.error("Error consultando la predicción de Replicate:", JSON.stringify(polled))
        const details = polled?.detail || `Replicate devolvió HTTP ${pollResponse.status} sin detalle al consultar el estado`
        return NextResponse.json({ error: "Error al generar la imagen", details }, { status: 500 })
      }

      prediction = polled
    }

    if (prediction.status !== "succeeded") {
      console.error("Replicate no pudo generar la imagen:", JSON.stringify(prediction))
      const details = prediction?.error || "Replicate no pudo generar la imagen"
      return NextResponse.json({ error: "Error al generar la imagen", details }, { status: 500 })
    }

    const imageUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output

    if (!imageUrl) {
      console.error("Respuesta de Replicate sin URL de imagen:", JSON.stringify(prediction))
      return NextResponse.json({ error: "Error al generar la imagen", details: "Replicate no devolvió una imagen en la respuesta" }, { status: 500 })
    }

    return NextResponse.json({ url: imageUrl })
  } catch (error) {
    console.error("Error generando imagen (excepción):", error)
    const details = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Error al generar la imagen", details }, { status: 500 })
  }
}
