"use client"

import { useState } from "react"

interface BusinessProfile {
  businessName: string
  industry: string
  product: string
  icp: string
  buyerPersona: string
  valueProposition: string
  mainPain: string
  competitors: string[]
  strengths: string[]
  opportunities: string[]
  recommendedChannels: string[]
  suggestedOffer: string
  estimatedCPL: string
}

export default function AnalyzerPage() {
  const [description, setDescription] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [profile, setProfile] = useState<BusinessProfile | null>(null)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"input" | "result">("input")

  const handleAnalyze = async () => {
    if (!description.trim()) return
    setAnalyzing(true)
    setError("")

    try {
      const response = await fetch("/api/analyze-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      })

      if (!response.ok) throw new Error("Error al analizar")
      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setProfile(data)
      setStep("result")
    } catch (err) {
      setError("Hubo un error analizando el negocio. Intenta de nuevo.")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/10">
        <div>
          <h1 className="text-white text-sm font-semibold">Analizador de Negocio con IA</h1>
          <p className="text-gray-500 text-xs mt-0.5">Tu estrategia completa en segundos</p>
        </div>
        {step === "result" && (
          <button
            onClick={() => { setStep("input"); setProfile(null); setDescription("") }}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium rounded-xl transition-all"
          >
            ← Nuevo análisis
          </button>
        )}
      </div>

      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        {step === "input" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-violet-600/20 to-purple-900/20 border border-violet-500/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">P</div>
                <div>
                  <p className="text-white text-sm font-medium mb-1">¿Cómo funciona?</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Describe tu negocio con la mayor cantidad de detalles posible. La IA analizará todo y construirá automáticamente tu ICP, Buyer Persona, propuesta de valor, análisis de competencia y estrategia de marketing completa.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <label className="text-gray-400 text-xs mb-2 block font-medium">Describe tu negocio</label>
              <textarea
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Ejemplos de lo que puedes escribir:

• "Tengo un gimnasio en Medellín llamado Iron Gym. Llevamos 2 años, vendemos membresías mensuales a $120.000 y planes anuales a $900.000. Nuestros clientes son personas de 20-40 años que quieren ponerse en forma. Competimos con Smart Fit y gimnasios del barrio."

• "Soy coach de finanzas personales, ofrezco un programa de 3 meses a $1.500.000 para ayudar a personas a salir de deudas y empezar a invertir. Tengo Instagram con 5.000 seguidores."

• "Tenemos una clínica estética en Bogotá, ofrecemos tratamientos de reducción de medidas, botox y cuidado facial. Precios entre $200.000 y $2.000.000."`}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors resize-none leading-relaxed"
              />
              <p className="text-gray-600 text-xs mt-2">{description.length} caracteres — más detalle = mejor análisis</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={analyzing || description.trim().length < 30}
              className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-base"
            >
              {analyzing ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Analizando tu negocio con IA...
                </>
              ) : "🔍 Analizar negocio con IA"}
            </button>
          </div>
        )}

        {step === "result" && profile && (
          <div className="space-y-5">
            {/* Header */}
            <div className="bg-gradient-to-br from-violet-600/20 to-purple-900/20 border border-violet-500/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">P</div>
                <div>
                  <p className="text-white font-semibold text-base">{profile.businessName}</p>
                  <p className="text-violet-300 text-sm">{profile.industry}</p>
                  <p className="text-gray-300 text-sm mt-2 leading-relaxed">{profile.product}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ICP */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-violet-400 text-xs font-semibold mb-2 uppercase tracking-wide">👤 Cliente Ideal (ICP)</p>
                <p className="text-gray-200 text-sm leading-relaxed">{profile.icp}</p>
              </div>

              {/* Buyer Persona */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-blue-400 text-xs font-semibold mb-2 uppercase tracking-wide">🎯 Buyer Persona</p>
                <p className="text-gray-200 text-sm leading-relaxed">{profile.buyerPersona}</p>
              </div>

              {/* Propuesta de valor */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-emerald-400 text-xs font-semibold mb-2 uppercase tracking-wide">💎 Propuesta de Valor</p>
                <p className="text-gray-200 text-sm leading-relaxed">{profile.valueProposition}</p>
              </div>

              {/* Dolor principal */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-amber-400 text-xs font-semibold mb-2 uppercase tracking-wide">😤 Dolor Principal del Cliente</p>
                <p className="text-gray-200 text-sm leading-relaxed">{profile.mainPain}</p>
              </div>
            </div>

            {/* Oferta sugerida */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <p className="text-emerald-400 text-xs font-semibold mb-2 uppercase tracking-wide">🎁 Oferta Irresistible Sugerida</p>
              <p className="text-emerald-200 text-sm leading-relaxed">{profile.suggestedOffer}</p>
              <p className="text-emerald-400/70 text-xs mt-2">CPL estimado: {profile.estimatedCPL}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Competidores */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-red-400 text-xs font-semibold mb-3 uppercase tracking-wide">⚔️ Competidores</p>
                <div className="space-y-2">
                  {profile.competitors.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                      <p className="text-gray-300 text-sm">{c}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fortalezas */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-emerald-400 text-xs font-semibold mb-3 uppercase tracking-wide">💪 Fortalezas</p>
                <div className="space-y-2">
                  {profile.strengths.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <p className="text-gray-300 text-sm">{s}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Oportunidades */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-amber-400 text-xs font-semibold mb-3 uppercase tracking-wide">🚀 Oportunidades</p>
                <div className="space-y-2">
                  {profile.opportunities.map((o, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      <p className="text-gray-300 text-sm">{o}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Canales recomendados */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-blue-400 text-xs font-semibold mb-3 uppercase tracking-wide">📣 Canales de Marketing Recomendados</p>
              <div className="flex flex-wrap gap-2">
                {profile.recommendedChannels.map((c, i) => (
                  <span key={i} className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button
                onClick={() => window.location.href = "/creatives"}
                className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all active:scale-95 text-sm"
              >
                ✍️ Generar copies con esta estrategia
              </button>
              <button
                onClick={() => window.location.href = "/dashboard"}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-xl transition-all text-sm"
              >
                💬 Hablar con el Growth Copilot
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
