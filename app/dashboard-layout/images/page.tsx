"use client"

import { useState } from "react"

const formats = [
  { label: "Cuadrado", value: "1024x1024" },
  { label: "Horizontal", value: "1792x1024" },
  { label: "Vertical", value: "1024x1792" },
]

const styles = ["Fotorrealista", "Ilustración", "Minimalista", "Cinematográfico"]

export default function ImagesPage() {
  const [prompt, setPrompt] = useState("")
  const [size, setSize] = useState(formats[0].value)
  const [style, setStyle] = useState(styles[0])
  const [generating, setGenerating] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [revisedPrompt, setRevisedPrompt] = useState("")

  const handleGenerate = async () => {
    if (!prompt.trim() || generating) return
    setGenerating(true)
    setError("")

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, size, style }),
      })

      const data = await response.json()
      if (!response.ok || data.error) {
        throw new Error(data.details || data.error || "Error al generar la imagen")
      }

      setImageUrl(data.url)
      setRevisedPrompt(data.revisedPrompt || "")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hubo un error generando la imagen. Intenta de nuevo.")
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!imageUrl) return
    setDownloading(true)
    try {
      const res = await fetch(imageUrl)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = blobUrl
      a.download = `prime-creativo-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(blobUrl)
    } catch {
      setError("No se pudo descargar la imagen. Intenta abrir la imagen en otra pestaña y guardarla manualmente.")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/10">
        <div>
          <h1 className="text-white text-sm font-semibold">Imágenes con IA</h1>
          <p className="text-gray-500 text-xs mt-0.5">Genera creativos visuales con DALL-E 3</p>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 max-w-4xl mx-auto w-full">
        {/* Generador */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="text-white text-sm font-semibold mb-4">Configurar imagen</h2>

          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs mb-1.5 block">Describe el creativo que necesitas</label>
              <textarea
                placeholder="Ej: Persona entrenando en un gimnasio moderno, ambiente motivador, colores violeta y negro"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1.5 block">Formato</label>
              <div className="flex gap-2 flex-wrap">
                {formats.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setSize(f.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      size === f.value
                        ? "bg-violet-600/30 border-violet-500/50 text-violet-300"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {f.label} ({f.value})
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1.5 block">Estilo</label>
              <div className="flex gap-2 flex-wrap">
                {styles.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      style === s
                        ? "bg-violet-600/30 border-violet-500/50 text-violet-300"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generando imagen con IA...
                </>
              ) : "🎨 Generar imagen con IA"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Resultado */}
        {imageUrl && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white text-sm font-semibold">Imagen generada</h2>
              <span className="text-gray-500 text-xs">{style} · {size}</span>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt={prompt} className="w-full h-auto" />
            </div>

            {revisedPrompt && (
              <p className="text-gray-500 text-xs mt-3 leading-relaxed">
                <span className="text-gray-400 font-medium">Prompt usado por la IA:</span> {revisedPrompt}
              </p>
            )}

            <p className="text-amber-400/80 text-xs mt-2">
              ⚠️ Esta imagen es temporal. Descárgala antes de salir de la página o el enlace expirará.
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
              >
                {downloading ? "Descargando..." : "⬇️ Descargar"}
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 text-gray-300 text-sm font-medium rounded-xl transition-all active:scale-95"
              >
                {generating ? "Regenerando..." : "🔄 Regenerar"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
