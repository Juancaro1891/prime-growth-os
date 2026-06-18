"use client"

import { useState } from "react"

const copies = [
  {
    platform: "Meta Ads",
    type: "Principal",
    text: "¿Cansado de pagar gimnasios caros sin resultados? 💪 En Iron Gym entrenamos diferente. Plan mensual desde $120.000. Primeras 2 semanas GRATIS. ¡Cupos limitados!",
    score: 94,
  },
  {
    platform: "Meta Ads",
    type: "Variante B",
    text: "Transforma tu cuerpo en 90 días o te devolvemos el dinero. 🔥 Iron Gym Medellín — donde los resultados son la única opción. Únete desde $120.000/mes.",
    score: 87,
  },
  {
    platform: "TikTok",
    type: "Hook",
    text: "POV: Llevas 3 meses sin ir al gym y necesitas volver... Ven a Iron Gym, primera semana gratis, sin excusas 💪 #gym #fitness #medellin",
    score: 91,
  },
  {
    platform: "WhatsApp",
    type: "Mensaje",
    text: "Hola [nombre] 👋 Vi que te interesó nuestro plan de membresía. ¿Te gustaría agendar una visita esta semana? Tenemos cupos disponibles para empezar mañana mismo 🏋️",
    score: 89,
  },
  {
    platform: "Google",
    type: "Título",
    text: "Gimnasio Medellín desde $120K | Iron Gym | Primera Semana Gratis",
    score: 82,
  },
]

export default function CreativesPage() {
  const [generating, setGenerating] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [platform, setPlatform] = useState("Meta Ads")

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 2000))
    setGenerating(false)
    setPrompt("")
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/10">
        <div>
          <h1 className="text-white text-sm font-semibold">Motor de Copies y Creativos</h1>
          <p className="text-gray-500 text-xs mt-0.5">Genera copies de alto impacto con IA</p>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Generador */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="text-white text-sm font-semibold mb-4">Generar nuevo copy</h2>
          <div className="flex gap-2 mb-4 flex-wrap">
            {["Meta Ads", "TikTok", "Google", "WhatsApp", "Email", "Landing"].map((p) => (
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
          <div className="flex gap-3">
            <input
              type="text"
              placeholder={`Describe qué quieres comunicar para ${platform}...`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors"
            />
            <button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all active:scale-95 flex items-center gap-2"
            >
              {generating ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : "✨ Generar"}
            </button>
          </div>
        </div>

        {/* Copies generados */}
        <div>
          <h2 className="text-white text-sm font-semibold mb-3">Copies generados</h2>
          <div className="space-y-3">
            {copies.map((copy, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded-full text-xs font-medium">{copy.platform}</span>
                    <span className="text-gray-500 text-xs">{copy.type}</span>
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
                    <button className="text-gray-500 hover:text-white text-xs transition-colors px-2 py-1 bg-white/5 rounded-lg hover:bg-white/10">
                      Copiar
                    </button>
                  </div>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed">{copy.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
