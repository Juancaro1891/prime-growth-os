"use client"

import { formatCurrency } from "@/lib/utils"
import { useState } from "react"

const industries = [
  "Gimnasios", "Clínicas y salud", "Restaurantes", "Inmobiliarias", "Ecommerce",
  "Educación", "Hoteles", "Coaches y consultores", "Abogados", "Constructoras",
]

const objectives = ["Leads", "Ventas", "Tráfico", "Mensajes WhatsApp", "Reconocimiento"]

interface BudgetAllocation {
  platform: string
  percentage: number
  reason: string
}

interface Phase {
  name: string
  duration: string
  focus: string
  actions: string[]
}

interface StrategyPlan {
  summary: string
  budgetAllocation: BudgetAllocation[]
  phases: Phase[]
  estimatedCPL: string
  estimatedLeads: string
  keyMessage: string
  nextSteps: string[]
}

export default function StrategyPage() {
  const [budget, setBudget] = useState("")
  const [industry, setIndustry] = useState(industries[0])
  const [objective, setObjective] = useState(objectives[0])
  const [context, setContext] = useState("")
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const [plan, setPlan] = useState<StrategyPlan | null>(null)
  const [step, setStep] = useState<"input" | "result">("input")

  const handleGenerate = async () => {
    const budgetNumber = Number(budget)
    if (!budgetNumber || budgetNumber <= 0) return
    setGenerating(true)
    setError("")

    try {
      const response = await fetch("/api/generate-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget: budgetNumber, industry, objective, context }),
      })

      if (!response.ok) throw new Error("Error al generar")
      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setPlan(data)
      setStep("result")
    } catch {
      setError("Hubo un error generando la estrategia. Intenta de nuevo.")
    } finally {
      setGenerating(false)
    }
  }

  const reset = () => {
    setStep("input")
    setPlan(null)
  }

  const budgetNumber = Number(budget) || 0

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/10">
        <div>
          <h1 className="text-white text-sm font-semibold">Generador de Estrategia de Campaña</h1>
          <p className="text-gray-500 text-xs mt-0.5">Tu plan de medios y fases de campaña, en segundos</p>
        </div>
        {step === "result" && (
          <button
            onClick={reset}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium rounded-xl transition-all"
          >
            ← Nueva estrategia
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
                    Cuéntale a la IA tu presupuesto, tu industria y tu objetivo principal. Te va a
                    proponer en qué plataformas invertir, cuánto destinar a cada una y un plan de
                    campaña en fases (testeo, optimización y escalamiento).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">Presupuesto mensual (COP)</label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  placeholder="1500000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors"
                />
                {budgetNumber > 0 && (
                  <p className="text-gray-600 text-xs mt-1.5">{formatCurrency(budgetNumber)} al mes</p>
                )}
              </div>

              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">Industria</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-violet-500/50 transition-colors"
                >
                  {industries.map((i) => (
                    <option key={i} value={i} className="bg-[#111118]">{i}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">Objetivo principal</label>
                <div className="flex gap-2 flex-wrap">
                  {objectives.map((o) => (
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
                <label className="text-gray-400 text-xs mb-1.5 block">Cuéntanos más de tu negocio (opcional)</label>
                <textarea
                  placeholder="Ej: Gimnasio en Medellín, membresías desde $120.000/mes, ya hacemos Meta Ads pero sin estrategia clara..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating || budgetNumber <= 0}
              className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-base"
            >
              {generating ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generando estrategia con IA...
                </>
              ) : "🎯 Generar estrategia con IA"}
            </button>
          </div>
        )}

        {step === "result" && plan && (
          <div className="space-y-5">
            {/* Resumen */}
            <div className="bg-gradient-to-br from-violet-600/20 to-purple-900/20 border border-violet-500/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">P</div>
                <div>
                  <p className="text-white font-semibold text-base">Estrategia para {industry}</p>
                  <p className="text-violet-300 text-sm">{formatCurrency(budgetNumber)}/mes · Objetivo: {objective}</p>
                  <p className="text-gray-300 text-sm mt-2 leading-relaxed">{plan.summary}</p>
                </div>
              </div>
            </div>

            {/* KPIs estimados */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-gray-500 text-xs">CPL estimado</p>
                <p className="text-white text-lg font-semibold mt-1">{plan.estimatedCPL}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-gray-500 text-xs">Leads estimados/mes</p>
                <p className="text-white text-lg font-semibold mt-1">{plan.estimatedLeads}</p>
              </div>
            </div>

            {/* Distribución de presupuesto */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-blue-400 text-xs font-semibold mb-3 uppercase tracking-wide">💰 Distribución del Presupuesto</p>
              <div className="space-y-3">
                {plan.budgetAllocation.map((b, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white text-sm font-medium">{b.platform}</p>
                      <p className="text-gray-300 text-sm">
                        {b.percentage}% · {formatCurrency(Math.round((budgetNumber * b.percentage) / 100))}
                      </p>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: `${b.percentage}%` }} />
                    </div>
                    <p className="text-gray-500 text-xs mt-1">{b.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mensaje clave */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <p className="text-emerald-400 text-xs font-semibold mb-2 uppercase tracking-wide">💎 Ángulo de Comunicación Sugerido</p>
              <p className="text-emerald-200 text-sm leading-relaxed">{plan.keyMessage}</p>
            </div>

            {/* Fases */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-amber-400 text-xs font-semibold mb-3 uppercase tracking-wide">🗺️ Fases de la Campaña</p>
              <div className="space-y-4">
                {plan.phases.map((phase, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white text-sm font-medium">{phase.name}</p>
                        <span className="text-gray-500 text-xs">· {phase.duration}</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">{phase.focus}</p>
                      <div className="space-y-1 mt-2">
                        {phase.actions.map((a, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                            <p className="text-gray-300 text-sm">{a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Próximos pasos */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-violet-400 text-xs font-semibold mb-3 uppercase tracking-wide">✅ Próximos Pasos</p>
              <div className="space-y-2">
                {plan.nextSteps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button
                onClick={() => window.location.href = "/campaigns"}
                className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all active:scale-95 text-sm"
              >
                📣 Ir a Campañas
              </button>
              <button
                onClick={() => window.location.href = "/creatives"}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-xl transition-all text-sm"
              >
                ✍️ Generar copies con esta estrategia
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
