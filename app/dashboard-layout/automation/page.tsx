"use client"

import { useState } from "react"

const flows = [
  {
    id: 1, name: "Bienvenida nuevo lead", trigger: "Lead entra al CRM", active: true,
    steps: ["Enviar WhatsApp de bienvenida", "Esperar 2 horas", "Si no responde → Enviar seguimiento", "Crear tarea para vendedor"],
    runs: 284, conversions: 94,
  },
  {
    id: 2, name: "Seguimiento post-visita", trigger: "Lead visitó el gym", active: true,
    steps: ["Enviar mensaje de agradecimiento", "Esperar 24 horas", "Enviar oferta especial", "Notificar vendedor si no cierra"],
    runs: 67, conversions: 31,
  },
  {
    id: 3, name: "Reactivación leads fríos", trigger: "Lead sin actividad 7 días", active: false,
    steps: ["Enviar mensaje de reactivación", "Esperar 48 horas", "Enviar caso de éxito", "Marcar como perdido si no responde"],
    runs: 45, conversions: 8,
  },
]

export default function AutomationPage() {
  const [selected, setSelected] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 2500))
    setGenerating(false)
    setGenerated(true)
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/10">
        <div>
          <h1 className="text-white text-sm font-semibold">Automation Engine</h1>
          <p className="text-gray-500 text-xs mt-0.5">Flujos automáticos que trabajan 24/7</p>
        </div>
        <button
          onClick={() => { setCreating(true); setGenerated(false); setPrompt("") }}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
        >
          + Nuevo flujo con IA
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Flujos activos", value: "2" },
            { label: "Ejecuciones totales", value: "396" },
            { label: "Leads convertidos", value: "133" },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-500 text-xs">{s.label}</p>
              <p className="text-white text-xl font-semibold mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Flujos */}
        <div className="space-y-3">
          {flows.map((flow) => (
            <div
              key={flow.id}
              className={`bg-white/5 border rounded-xl p-4 cursor-pointer transition-all ${
                selected === flow.id ? "border-violet-500/40 bg-violet-600/5" : "border-white/10 hover:border-white/20"
              }`}
              onClick={() => setSelected(selected === flow.id ? null : flow.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${flow.active ? "bg-emerald-400" : "bg-gray-500"}`} />
                  <p className="text-white font-medium text-sm">{flow.name}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{flow.runs} ejecuciones</span>
                  <span className="text-emerald-400">{flow.conversions} conversiones</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium ${flow.active ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}>
                    {flow.active ? "Activo" : "Pausado"}
                  </span>
                </div>
              </div>

              <p className="text-gray-500 text-xs mb-3">Trigger: {flow.trigger}</p>

              {selected === flow.id && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  {flow.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-violet-600/20 border border-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-gray-300 text-xs">{step}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal crear flujo */}
        {creating && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111118] border border-white/10 rounded-2xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-semibold">Crear flujo con IA</h2>
                <button onClick={() => setCreating(false)} className="text-gray-500 hover:text-white">✕</button>
              </div>

              {!generated ? (
                <div className="space-y-4">
                  <div className="bg-violet-600/10 border border-violet-500/20 rounded-xl p-4">
                    <p className="text-violet-300 text-sm font-medium mb-1">💡 Describe el flujo que necesitas</p>
                    <p className="text-gray-400 text-xs">La IA construirá automáticamente los pasos, condiciones y acciones.</p>
                  </div>
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ej: Cuando llega un nuevo lead de Meta Ads, quiero que la IA le envíe un WhatsApp de bienvenida, espere 2 horas, y si no responde le envíe un mensaje con la oferta del mes..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50 resize-none"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={generating || !prompt.trim()}
                    className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {generating ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Construyendo flujo con IA...
                      </>
                    ) : "Generar flujo automático"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                    <p className="text-emerald-300 text-sm font-medium">✅ Flujo generado por IA</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      "🎯 Trigger: Lead entra desde Meta Ads",
                      "💬 Paso 1: Enviar WhatsApp de bienvenida personalizado",
                      "⏱️ Paso 2: Esperar 2 horas",
                      "❓ Condición: ¿Respondió el lead?",
                      "✅ Si sí → Iniciar conversación de calificación",
                      "❌ Si no → Enviar oferta especial del mes",
                      "⏱️ Esperar 24 horas",
                      "📋 Crear tarea para vendedor si no cierra",
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 bg-white/5 rounded-lg">
                        <p className="text-gray-200 text-xs">{step}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCreating(false)}
                      className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl text-sm transition-all"
                    >
                      Activar flujo
                    </button>
                    <button
                      onClick={() => setGenerated(false)}
                      className="px-4 py-2.5 bg-white/5 border border-white/10 text-gray-300 font-medium rounded-xl text-sm transition-all hover:bg-white/10"
                    >
                      Regenerar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
