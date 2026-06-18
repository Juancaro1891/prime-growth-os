"use client"

import { useState } from "react"

const metrics = [
  { label: "Inversión total", value: "$3.200.000", change: "+12%", up: true, color: "violet" },
  { label: "Ventas generadas", value: "$18.500.000", change: "+34%", up: true, color: "emerald" },
  { label: "ROI", value: "478%", change: "+89pts", up: true, color: "emerald" },
  { label: "Leads generados", value: "284", change: "+22%", up: true, color: "blue" },
  { label: "Costo por lead", value: "$11.267", change: "-8%", up: true, color: "emerald" },
  { label: "ROAS", value: "5.78x", change: "+0.4x", up: true, color: "emerald" },
  { label: "Tasa de conversión", value: "4.2%", change: "-0.3%", up: false, color: "red" },
  { label: "Ticket promedio", value: "$65.140", change: "+5%", up: true, color: "emerald" },
]

const campaigns = [
  { name: "Membresías enero — Meta", spend: "$820.000", leads: 94, roas: "6.2x", status: "active" },
  { name: "Plan anual — Instagram", spend: "$540.000", leads: 61, roas: "7.1x", status: "active" },
  { name: "Remarketing — WhatsApp", spend: "$280.000", leads: 48, roas: "9.4x", status: "active" },
  { name: "Captación fría — TikTok", spend: "$960.000", leads: 72, roas: "3.8x", status: "paused" },
  { name: "Google Search — Gym", spend: "$600.000", leads: 29, roas: "4.1x", status: "active" },
]

const insights = [
  { type: "warning", text: "Tu campaña de TikTok tiene ROAS de 3.8x — por debajo del umbral. Considera pausarla y reasignar ese presupuesto a remarketing de WhatsApp que está en 9.4x." },
  { type: "success", text: "El remarketing por WhatsApp es tu canal más rentable. Aumenta el presupuesto un 40% esta semana para aprovechar el momentum." },
  { type: "info", text: "La tasa de conversión bajó 0.3% — revisa tu landing page. El formulario puede estar generando fricción en móvil." },
  { type: "success", text: "Llevas 3 semanas consecutivas superando el objetivo de CPL. El sistema de segmentación está funcionando bien." },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30d")

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/10">
        <div>
          <h1 className="text-white text-sm font-semibold">ROI & Métricas</h1>
          <p className="text-gray-500 text-xs mt-0.5">Resultados explicados en lenguaje humano</p>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === p
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {p === "7d" ? "7 días" : p === "30d" ? "30 días" : "90 días"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Resumen IA */}
        <div className="bg-gradient-to-br from-violet-600/20 to-purple-900/20 border border-violet-500/20 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
              P
            </div>
            <div>
              <p className="text-white text-sm font-medium mb-1">Análisis de los últimos 30 días</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Invertiste <span className="text-violet-300 font-medium">$3.200.000 COP</span> y generaste{" "}
                <span className="text-emerald-300 font-medium">$18.500.000 COP</span> en ventas. Tu ROI fue de{" "}
                <span className="text-emerald-300 font-medium">478%</span> — por cada peso invertido, recuperaste 5.78 pesos.
                El canal más rentable fue <span className="text-violet-300 font-medium">remarketing por WhatsApp</span> con un ROAS de 9.4x.
                Oportunidad inmediata: pausar TikTok y doblar presupuesto en WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Métricas grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">{m.label}</p>
              <p className="text-white text-xl font-semibold">{m.value}</p>
              <p className={`text-xs mt-1 font-medium ${m.up ? "text-emerald-400" : "text-red-400"}`}>
                {m.up ? "↑" : "↓"} {m.change} vs mes anterior
              </p>
            </div>
          ))}
        </div>

        {/* Insights IA */}
        <div>
          <h2 className="text-white text-sm font-semibold mb-3">Recomendaciones de la IA</h2>
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <div
                key={i}
                className={`flex gap-3 p-4 rounded-xl border text-sm ${
                  ins.type === "warning"
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-200"
                    : ins.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
                    : "bg-blue-500/10 border-blue-500/20 text-blue-200"
                }`}
              >
                <span className="text-base flex-shrink-0">
                  {ins.type === "warning" ? "⚠️" : ins.type === "success" ? "✅" : "💡"}
                </span>
                <p className="leading-relaxed">{ins.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabla campañas */}
        <div>
          <h2 className="text-white text-sm font-semibold mb-3">Rendimiento por campaña</h2>
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium">Campaña</th>
                  <th className="text-right px-4 py-3 text-gray-500 text-xs font-medium">Inversión</th>
                  <th className="text-right px-4 py-3 text-gray-500 text-xs font-medium">Leads</th>
                  <th className="text-right px-4 py-3 text-gray-500 text-xs font-medium">ROAS</th>
                  <th className="text-right px-4 py-3 text-gray-500 text-xs font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white">{c.name}</td>
                    <td className="px-4 py-3 text-gray-300 text-right">{c.spend}</td>
                    <td className="px-4 py-3 text-gray-300 text-right">{c.leads}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${parseFloat(c.roas) >= 5 ? "text-emerald-400" : parseFloat(c.roas) >= 4 ? "text-amber-400" : "text-red-400"}`}>
                        {c.roas}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        c.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"
                      }`}>
                        {c.status === "active" ? "Activa" : "Pausada"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
