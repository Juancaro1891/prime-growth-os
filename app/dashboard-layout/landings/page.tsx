"use client"

import { useState } from "react"

const templates = [
  { id: 1, name: "Captación membresías", industry: "Gimnasio", visits: 1240, conversions: "8.4%", status: "published" },
  { id: 2, name: "Plan anual oferta", industry: "Gimnasio", visits: 890, conversions: "11.2%", status: "published" },
  { id: 3, name: "Clase prueba gratis", industry: "Gimnasio", visits: 430, conversions: "15.6%", status: "draft" },
]

export default function LandingsPage() {
  const [creating, setCreating] = useState(false)
  const [step, setStep] = useState(0)
  const [type, setType] = useState("")

  const handleCreate = async () => {
    setCreating(true)
    await new Promise((r) => setTimeout(r, 3000))
    setCreating(false)
    setStep(2)
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/10">
        <div>
          <h1 className="text-white text-sm font-semibold">Landing Engine</h1>
          <p className="text-gray-500 text-xs mt-0.5">Crea páginas de captura de alto impacto</p>
        </div>
        <button
          onClick={() => { setStep(1); setType("") }}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
        >
          + Nueva landing
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {step === 0 && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Landings activas", value: "2" },
                { label: "Visitas totales", value: "2.130" },
                { label: "Conversión promedio", value: "9.8%" },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-gray-500 text-xs">{s.label}</p>
                  <p className="text-white text-xl font-semibold mt-1">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {templates.map((t) => (
                <div key={t.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-600/20 border border-violet-500/20 rounded-xl flex items-center justify-center text-violet-400 text-lg">
                        🏗️
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{t.name}</p>
                        <p className="text-gray-500 text-xs">{t.industry} · {t.visits} visitas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-emerald-400 text-sm font-semibold">{t.conversions}</p>
                        <p className="text-gray-500 text-xs">conversión</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.status === "published" ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}>
                        {t.status === "published" ? "Publicada" : "Borrador"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <div className="max-w-lg mx-auto">
            <h2 className="text-white font-semibold text-base mb-1">¿Qué tipo de landing necesitas?</h2>
            <p className="text-gray-500 text-sm mb-5">La IA creará todo el copy, estructura y diseño automáticamente.</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { id: "capture", label: "Página de captura", desc: "Formulario para captar leads", icon: "📋" },
                { id: "sales", label: "Sales page", desc: "Venta directa de producto o servicio", icon: "💰" },
                { id: "webinar", label: "Página de webinar", desc: "Registro para evento online", icon: "🎥" },
                { id: "launch", label: "Lanzamiento", desc: "Preventa o lanzamiento de producto", icon: "🚀" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    type === t.id
                      ? "bg-violet-600/20 border-violet-500/50"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="text-2xl block mb-2">{t.icon}</span>
                  <p className={`text-sm font-medium ${type === t.id ? "text-violet-300" : "text-white"}`}>{t.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
            <button
              onClick={handleCreate}
              disabled={creating || !type}
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {creating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Construyendo tu landing con IA...
                </>
              ) : "Crear landing con IA"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              ✅
            </div>
            <h2 className="text-white font-semibold text-base mb-2">¡Landing creada exitosamente!</h2>
            <p className="text-gray-400 text-sm mb-6">La IA generó tu página completa con copy optimizado, formulario de captura, pixel de Meta y configuración SEO.</p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">URL</span>
                <span className="text-violet-300">primegrowth.io/gym-captura</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pixel Meta</span>
                <span className="text-emerald-400">Configurado ✓</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">SEO</span>
                <span className="text-emerald-400">Optimizado ✓</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Formulario</span>
                <span className="text-emerald-400">Activo ✓</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-xl transition-all text-sm">
                Ver todas
              </button>
              <button className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all text-sm">
                Ver landing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
