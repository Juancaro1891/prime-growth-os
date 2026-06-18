"use client"

import { useState } from "react"

const campaigns = [
  {
    id: 1, name: "Membresías enero", platform: "Meta", status: "active",
    budget: "$800.000", spent: "$612.000", leads: 94, roas: "6.2x", objective: "Leads",
  },
  {
    id: 2, name: "Plan anual diciembre", platform: "Instagram", status: "active",
    budget: "$600.000", spent: "$540.000", leads: 61, roas: "7.1x", objective: "Conversiones",
  },
  {
    id: 3, name: "Captación fría", platform: "TikTok", status: "paused",
    budget: "$1.000.000", spent: "$960.000", leads: 72, roas: "3.8x", objective: "Tráfico",
  },
  {
    id: 4, name: "Remarketing WhatsApp", platform: "Meta", status: "active",
    budget: "$300.000", spent: "$280.000", leads: 48, roas: "9.4x", objective: "Mensajes",
  },
  {
    id: 5, name: "Google Search Gym", platform: "Google", status: "active",
    budget: "$700.000", spent: "$600.000", leads: 29, roas: "4.1x", objective: "Leads",
  },
]

const platformColors: Record<string, string> = {
  Meta: "bg-blue-500/20 text-blue-300",
  Instagram: "bg-pink-500/20 text-pink-300",
  TikTok: "bg-gray-500/20 text-gray-300",
  Google: "bg-amber-500/20 text-amber-300",
  WhatsApp: "bg-emerald-500/20 text-emerald-300",
}

export default function CampaignsPage() {
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ platform: "", objective: "", budget: "", description: "" })
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 2500))
    setGenerating(false)
    setGenerated(true)
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/10">
        <div>
          <h1 className="text-white text-sm font-semibold">Campañas</h1>
          <p className="text-gray-500 text-xs mt-0.5">Gestiona y crea campañas con IA</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setStep(1); setGenerated(false); setForm({ platform: "", objective: "", budget: "", description: "" }) }}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
        >
          <span>+</span> Nueva campaña
        </button>
      </div>

      <div className="flex-1 p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Campañas activas", value: "4" },
            { label: "Inversión total", value: "$2.992.000" },
            { label: "Leads totales", value: "304" },
            { label: "ROAS promedio", value: "6.1x" },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-500 text-xs">{s.label}</p>
              <p className="text-white text-xl font-semibold mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium">Campaña</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium">Plataforma</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium">Objetivo</th>
                <th className="text-right px-4 py-3 text-gray-500 text-xs font-medium">Presupuesto</th>
                <th className="text-right px-4 py-3 text-gray-500 text-xs font-medium">Leads</th>
                <th className="text-right px-4 py-3 text-gray-500 text-xs font-medium">ROAS</th>
                <th className="text-right px-4 py-3 text-gray-500 text-xs font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${platformColors[c.platform]}`}>
                      {c.platform}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{c.objective}</td>
                  <td className="px-4 py-3 text-gray-300 text-right">{c.budget}</td>
                  <td className="px-4 py-3 text-gray-300 text-right">{c.leads}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-medium ${parseFloat(c.roas) >= 5 ? "text-emerald-400" : parseFloat(c.roas) >= 4 ? "text-amber-400" : "text-red-400"}`}>
                      {c.roas}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}>
                      {c.status === "active" ? "Activa" : "Pausada"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal nueva campaña */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111118] border border-white/10 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Nueva campaña con IA</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">✕</button>
            </div>

            {!generated ? (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">Plataforma</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Meta", "Google", "TikTok", "Instagram", "WhatsApp", "YouTube"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setForm({ ...form, platform: p })}
                        className={`py-2 rounded-lg text-sm font-medium transition-all border ${
                          form.platform === p
                            ? "bg-violet-600/30 border-violet-500/50 text-violet-300"
                            : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">Objetivo</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Leads", "Conversiones", "Tráfico", "Mensajes WhatsApp"].map((o) => (
                      <button
                        key={o}
                        onClick={() => setForm({ ...form, objective: o })}
                        className={`py-2 rounded-lg text-sm font-medium transition-all border ${
                          form.objective === o
                            ? "bg-violet-600/30 border-violet-500/50 text-violet-300"
                            : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">Presupuesto diario (COP)</label>
                  <input
                    type="text"
                    placeholder="Ej: $50.000"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">Descripción del objetivo</label>
                  <textarea
                    placeholder="Ej: Quiero conseguir afiliados nuevos para el plan mensual de $120.000..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating || !form.platform || !form.objective}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Generando campaña con IA...
                    </>
                  ) : "Generar campaña con IA"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-emerald-300 text-sm font-medium mb-1">✅ Campaña generada por IA</p>
                  <p className="text-emerald-200/70 text-xs">La IA creó tu campaña optimizada para {form.platform} con objetivo de {form.objective}</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-1">Nombre sugerido</p>
                    <p className="text-white text-sm font-medium">Captación nuevos afiliados — {form.platform} — {new Date().toLocaleDateString("es-CO", { month: "long", year: "numeric" })}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-2">Copy principal generado</p>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      "¿Cansado de pagar gimnasios caros que no te dan resultados? 💪 En Iron Gym Medellín entrenamos diferente. Plan mensual desde $120.000 COP. Primeras 2 semanas GRATIS. Cupos limitados. ¡Únete hoy!"
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-1">Segmentación recomendada</p>
                    <p className="text-gray-200 text-sm">Hombres y mujeres 18-35 años · Medellín +10km · Intereses: fitness, gym, salud, bienestar</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all active:scale-95 text-sm"
                  >
                    Guardar campaña
                  </button>
                  <button
                    onClick={() => setGenerated(false)}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-all text-sm border border-white/10"
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
  )
}
