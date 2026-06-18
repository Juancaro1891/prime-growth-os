"use client"

import { useState } from "react"

interface Copy {
  headline: string
  body: string
  cta: string
  score: number
}

export default function CreativesPage() {
  const [platform, setPlatform] = useState("Meta Ads")
  const [objective, setObjective] = useState("Leads")
  const [description, setDescription] = useState("")
  const [business, setBusiness] = useState("")
  const [copies, setCopies] = useState<Copy[]>([])
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!description.trim()) return
    setGenerating(true)
    setError("")
    setCopies([])

    try {
      const response = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, objective, description, business }),
      })

      if (!response.ok) throw new Error("Error al generar")
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setCopies(data.copies || [])
    } catch (err) {
      setError("Hubo un error generando los copies. Intenta de nuevo.")
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/10">
        <div>
          <h1 className="text-white text-sm font-semibold">Motor de Copies con IA</h1>
          <p className="text-gray-500 text-xs mt-0.5">Genera copies de alto impacto en segundos</p>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 max-w-4xl mx-auto w-full">
        {/* Generador */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="text-white text-sm font-semibold mb-4">Configurar generación</h2>

          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs mb-1.5 block">Tu negocio (opcional — mejora los resultados)</label>
              <input
                type="text"
                placeholder="Ej: Gimnasio en Medellín, membresías desde $120.000/mes"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1.5 block">Plataforma</label>
              <div className="flex gap-2 flex-wrap">
                {["Meta Ads", "Google", "TikTok", "Instagram", "WhatsApp", "Email"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      platform === p
                        ? "bg-violet-600/30 border-violet-500/50 text-violet-300"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1.5 block">Objetivo</label>
              <div className="flex gap-2 flex-wrap">
                {["Leads", "Ventas", "Tráfico", "Mensajes WhatsApp", "Reconocimiento"].map((o) => (
                  <button
                    key={o}
                    onClick={() => setObjective(o)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      objective === o
                        ? "bg-violet-600/30 border-violet-500/50 text-violet-300"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1.5 block">¿Qué quieres comunicar?</label>
              <textarea
                placeholder="Ej: Quiero conseguir nuevos afiliados para el plan mensual. Ofrezco las primeras 2 semanas gratis..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !description.trim()}
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Generando copies con IA...
                </>
              ) : "✨ Generar copies con IA"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Copies generados */}
        {copies.length > 0 && (
          <div>
            <h2 className="text-white text-sm font-semibold mb-3">
              ✅ {copies.length} copies generados para {platform}
            </h2>
            <div className="space-y-4">
              {copies.map((copy, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded-full text-xs font-medium">
                        Copy {i + 1}
                      </span>
                      <span className="text-gray-500 text-xs">{platform}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${copy.score >= 90 ? "bg-emerald-400" : copy.score >= 80 ? "bg-amber-400" : "bg-red-400"}`}
                            style={{ width: `${copy.score}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${copy.score >= 90 ? "text-emerald-400" : copy.score >= 80 ? "text-amber-400" : "text-red-400"}`}>
                          {copy.score}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(`${copy.headline}\n\n${copy.body}\n\n${copy.cta}`, i)}
                        className="text-gray-500 hover:text-white text-xs transition-colors px-2 py-1 bg-white/5 rounded-lg hover:bg-white/10"
                      >
                        {copied === i ? "✅ Copiado" : "Copiar"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Headline</p>
                      <p className="text-white font-semibold text-sm">{copy.headline}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Copy principal</p>
                      <p className="text-gray-200 text-sm leading-relaxed">{copy.body}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">CTA</p>
                      <p className="text-violet-300 text-sm font-medium">{copy.cta}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
