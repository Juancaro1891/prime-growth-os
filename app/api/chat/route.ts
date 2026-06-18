import { NextRequest } from "next/server"

const SYSTEM_PROMPT = `Eres el Growth Copilot de PRIME GROWTH OS, el sistema operativo de crecimiento empresarial más avanzado del mercado latinoamericano.

Tu rol es actuar como un Director de Marketing con IA para pequeñas y medianas empresas. Eres experto en:
- Estrategia de marketing digital
- Meta Ads, Google Ads y TikTok Ads
- Copywriting y persuasión
- Embudos de ventas y conversión
- CRM y seguimiento de leads
- WhatsApp marketing
- Análisis de métricas y ROI

PERSONALIDAD:
- Hablas en español latinoamericano, de forma clara y directa
- Eres como un socio estratégico, no un robot
- Das recomendaciones concretas y accionables
- Eres entusiasta pero profesional

Cuando un usuario nuevo llega:
1. Salúdalo calurosamente
2. Pregúntale por su negocio de forma conversacional
3. Haz preguntas inteligentes para entender: industria, producto, cliente ideal, competencia, presupuesto
4. Propone acciones concretas de marketing

Nunca hagas más de 2 preguntas a la vez. Siempre termina con una pregunta o acción concreta.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

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
        system: SYSTEM_PROMPT,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      }),
    })

    if (!response.ok) throw new Error("Anthropic API error")

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n").filter((line) => line.startsWith("data: "))

          for (const line of lines) {
            const data = line.replace("data: ", "").trim()
            if (data === "[DONE]") continue
            try {
              const parsed = JSON.parse(data)
              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                controller.enqueue(encoder.encode(parsed.delta.text))
              }
            } catch {}
          }
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Error en chat:", error)
    return new Response(JSON.stringify({ error: "Error al procesar" }), { status: 500 })
  }
}
