"use client"

import { useEffect, useState } from "react"
import { formatCurrency } from "@/lib/utils"

type Suggestion = {
  id: string
  name: string
  objective: string
  daily_budget: number | null
  copy: string
  audience: string
  justification: string
  status: string
  meta_campaign_id: string | null
}

type StatusResponse = {
  connected: boolean
  businessName: string | null
  hasAnalysis: boolean
  suggestions: Suggestion[]
}

const objectiveLabels: Record<string, { label: string; color: string }> = {
  OUTCOME_TRAFFIC: { label: "Tráfico", color: "bg-blue-500/20 text-blue-300" },
  OUTCOME_LEADS: { label: "Leads", color: "bg-emerald-500/20 text-emerald-300" },
  OUTCOME_AWARENESS: { label: "Reconocimiento", color: "bg-amber-500/20 text-amber-300" },
}

function Spinner({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function ConnectCard() {
  return (
    <div className="max-w-lg mx-auto bg-gradient-to-br from-violet-600/20 to-purple-900/20 border border-violet-500/20 rounded-2xl p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold mx-auto mb-4">M</div>
      <h2 className="text-white font-semibold text-lg mb-2">Conecta tu cuenta de Meta Ads</h2>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
        Conecta tu página de Facebook y tu cuenta publicitaria para que la IA analice tu negocio y te proponga campañas listas para lanzar.
      </p>
      <button
        onClick={() => { window.location.href = "/api/meta/auth" }}
        className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all active:scale-95"
      >
        Conectar Meta Ads
      </button>
    </div>
  )
}

function GenerateCard({
  businessName,
  hasAnalysis,
  generating,
  error,
  onGenerate,
}: {
  businessName: string | null
  hasAnalysis: boolean
  generating: boolean
  error: string
  onGenerate: () => void
}) {
  return (
    <div className="max-w-lg mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 text-lg font-bold mx-auto mb-4">✓</div>
      <h2 className="text-white font-semibold text-lg mb-2">
        {businessName ? `${businessName} está conectado` : "Meta Ads conectado"}
      </h2>
      <p className="text-gray-400 text-sm mb-2 leading-relaxed">
        Todavía no tienes campañas sugeridas. Deja que la IA analice tu negocio y te proponga 3 campañas listas para lanzar.
      </p>
      {!hasAnalysis && (
        <p className="text-amber-300/80 text-xs mb-2">
          Tu análisis de negocio detallado todavía se está generando — puedes generar campañas ya mismo, la IA usará lo que tenga disponible.
        </p>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-300 text-sm mt-4 mb-2">{error}</div>
      )}
      <button
        onClick={onGenerate}
        disabled={generating}
        className="px-6 py-3 mt-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all active:scale-95 inline-flex items-center gap-2"
      >
        {generating ? (
          <>
            <Spinner /> Generando estrategia...
          </>
        ) : (
          "Generar mi estrategia de campañas con IA"
        )}
      </button>
    </div>
  )
}

function SuggestionCard({ suggestion, onUpdate }: { suggestion: Suggestion; onUpdate: (s: Suggestion) => void }) {
  const [launching, setLaunching] = useState(false)
  const [launchError, setLaunchError] = useState("")
  const [adjustOpen, setAdjustOpen] = useState(false)
  const [instruction, setInstruction] = useState("")
  const [adjusting, setAdjusting] = useState(false)
  const [adjustError, setAdjustError] = useState("")

  const objectiveInfo = objectiveLabels[suggestion.objective] || { label: suggestion.objective, color: "bg-gray-500/20 text-gray-300" }
  const launched = suggestion.status === "launched"

  const handleLaunch = async () => {
    setLaunching(true)
    setLaunchError("")
    try {
      const response = await fetch("/api/meta/create-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suggestionId: suggestion.id,
          name: suggestion.name,
          objective: suggestion.objective,
          dailyBudget: suggestion.daily_budget,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.details || data.error || "Error al lanzar la campaña")
      onUpdate({ ...suggestion, status: "launched", meta_campaign_id: data.id })
    } catch (err) {
      setLaunchError(err instanceof Error ? err.message : "Hubo un error lanzando la campaña.")
    } finally {
      setLaunching(false)
    }
  }

  const handleAdjust = async () => {
    if (!instruction.trim()) return
    setAdjusting(true)
    setAdjustError("")
    try {
      const response = await fetch("/api/meta/adjust-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestionId: suggestion.id, instruction }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.details || data.error || "Error al ajustar la campaña")
      onUpdate(data.suggestion)
      setInstruction("")
      setAdjustOpen(false)
    } catch (err) {
      setAdjustError(err instanceof Error ? err.message : "Hubo un error ajustando la campaña.")
    } finally {
      setAdjusting(false)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-white font-medium text-sm leading-snug">{suggestion.name}</h3>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${objectiveInfo.color}`}>
          {objectiveInfo.label}
        </span>
      </div>

      {suggestion.daily_budget != null && (
        <p className="text-violet-300 text-sm font-medium">{formatCurrency(suggestion.daily_budget)}/día</p>
      )}

      <div className="bg-black/20 border border-white/5 rounded-xl p-3">
        <p className="text-gray-500 text-xs mb-1">Copy del anuncio</p>
        <p className="text-gray-200 text-sm leading-relaxed">&ldquo;{suggestion.copy}&rdquo;</p>
      </div>

      <div>
        <p className="text-gray-500 text-xs mb-1">Audiencia</p>
        <p className="text-gray-300 text-sm">{suggestion.audience}</p>
      </div>

      <div>
        <p className="text-gray-500 text-xs mb-1">Por qué esta campaña</p>
        <p className="text-gray-400 text-sm">{suggestion.justification}</p>
      </div>

      {launchError && <p className="text-red-400 text-xs">{launchError}</p>}

      <div className="flex gap-2 mt-auto pt-2">
        <button
          onClick={handleLaunch}
          disabled={launching || launched}
          className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {launching ? <Spinner /> : launched ? "Lanzada ✅" : "Aprobar y lanzar"}
        </button>
        <button
          onClick={() => setAdjustOpen((v) => !v)}
          disabled={launched}
          className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 text-gray-300 text-sm font-medium rounded-lg transition-all"
        >
          Ajustar con IA
        </button>
      </div>

      {adjustOpen && !launched && (
        <div className="bg-black/20 border border-white/10 rounded-xl p-3 space-y-2">
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Ej: sube el presupuesto a 80.000 y hazlo más agresivo"
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors resize-none"
          />
          {adjustError && <p className="text-red-400 text-xs">{adjustError}</p>}
          <button
            onClick={handleAdjust}
            disabled={adjusting || !instruction.trim()}
            className="w-full py-2 bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/30 disabled:opacity-50 text-violet-200 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {adjusting ? (
              <>
                <Spinner /> Ajustando...
              </>
            ) : (
              "Enviar a la IA"
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default function CampaignsPage() {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [error, setError] = useState("")
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadStatus = async () => {
      try {
        const response = await fetch("/api/meta/generate-campaigns")
        const data = await response.json()
        if (!response.ok) throw new Error(data.details || data.error || "Error al cargar el estado")
        if (!cancelled) setStatus(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Hubo un error cargando tus campañas.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadStatus()
    return () => { cancelled = true }
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    setError("")
    try {
      const response = await fetch("/api/meta/generate-campaigns", { method: "POST" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.details || data.error || "Error al generar campañas")
      setStatus((prev) => (prev ? { ...prev, suggestions: data.suggestions } : prev))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hubo un error generando las campañas. Intenta de nuevo.")
    } finally {
      setGenerating(false)
    }
  }

  const updateSuggestion = (updated: Suggestion) => {
    setStatus((prev) => (prev ? { ...prev, suggestions: prev.suggestions.map((s) => (s.id === updated.id ? updated : s)) } : prev))
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/10">
        <div>
          <h1 className="text-white text-sm font-semibold">Campañas</h1>
          <p className="text-gray-500 text-xs mt-0.5">Estrategia de Meta Ads generada por IA a partir de tu negocio</p>
        </div>
        {status?.connected && status.suggestions.length > 0 && (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 text-gray-300 text-sm font-medium rounded-xl transition-all"
          >
            {generating ? <Spinner /> : "↻"} Regenerar todo
          </button>
        )}
      </div>

      <div className="flex-1 p-6">
        {loading && (
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-20">
            <Spinner /> Cargando...
          </div>
        )}

        {!loading && error && !status && (
          <div className="max-w-lg mx-auto bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300 text-sm">{error}</div>
        )}

        {!loading && status && !status.connected && <ConnectCard />}

        {!loading && status && status.connected && status.suggestions.length === 0 && (
          <GenerateCard
            businessName={status.businessName}
            hasAnalysis={status.hasAnalysis}
            generating={generating}
            error={error}
            onGenerate={handleGenerate}
          />
        )}

        {!loading && status && status.connected && status.suggestions.length > 0 && (
          <div className="grid md:grid-cols-3 gap-5">
            {status.suggestions.map((s) => (
              <SuggestionCard key={s.id} suggestion={s} onUpdate={updateSuggestion} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
