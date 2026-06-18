"use client"

import { useState } from "react"

const stages = ["Nuevo lead", "Contactado", "Interesado", "Propuesta", "Cerrado"]

const leads = [
  { id: 1, name: "Carlos Mendoza", phone: "3104567890", source: "Meta Ads", stage: "Interesado", value: "$120.000", date: "Hoy 2:30pm", avatar: "CM" },
  { id: 2, name: "María García", phone: "3209876543", source: "WhatsApp", stage: "Propuesta", value: "$900.000", date: "Hoy 11:00am", avatar: "MG" },
  { id: 3, name: "Andrés López", phone: "3156789012", source: "Instagram", stage: "Nuevo lead", value: "$120.000", date: "Ayer 4:15pm", avatar: "AL" },
  { id: 4, name: "Valentina Ríos", phone: "3012345678", source: "Google", stage: "Contactado", value: "$360.000", date: "Ayer 9:00am", avatar: "VR" },
  { id: 5, name: "Felipe Castillo", phone: "3187654321", source: "TikTok", stage: "Cerrado", value: "$900.000", date: "Jun 15", avatar: "FC" },
  { id: 6, name: "Laura Sánchez", phone: "3145678901", source: "Meta Ads", stage: "Interesado", value: "$120.000", date: "Jun 15", avatar: "LS" },
  { id: 7, name: "Diego Moreno", phone: "3223456789", source: "Referido", stage: "Nuevo lead", value: "$120.000", date: "Jun 14", avatar: "DM" },
]

const sourceColors: Record<string, string> = {
  "Meta Ads": "bg-blue-500/20 text-blue-300",
  "WhatsApp": "bg-emerald-500/20 text-emerald-300",
  "Instagram": "bg-pink-500/20 text-pink-300",
  "Google": "bg-amber-500/20 text-amber-300",
  "TikTok": "bg-gray-500/20 text-gray-300",
  "Referido": "bg-violet-500/20 text-violet-300",
}

const stageColors: Record<string, string> = {
  "Nuevo lead": "bg-gray-500/20 text-gray-400",
  "Contactado": "bg-blue-500/20 text-blue-300",
  "Interesado": "bg-amber-500/20 text-amber-300",
  "Propuesta": "bg-violet-500/20 text-violet-300",
  "Cerrado": "bg-emerald-500/20 text-emerald-400",
}

export default function CRMPage() {
  const [view, setView] = useState<"list" | "kanban">("list")
  const [selected, setSelected] = useState<number | null>(null)

  const selectedLead = leads.find((l) => l.id === selected)

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/10 flex-shrink-0">
          <div>
            <h1 className="text-white text-sm font-semibold">CRM</h1>
            <p className="text-gray-500 text-xs mt-0.5">{leads.length} leads en el pipeline</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5">
              <button onClick={() => setView("list")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === "list" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}>Lista</button>
              <button onClick={() => setView("kanban")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === "kanban" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}>Kanban</button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-all active:scale-95">
              + Nuevo lead
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-0 border-b border-white/10 flex-shrink-0">
          {stages.map((s) => {
            const count = leads.filter((l) => l.stage === s).length
            const value = leads.filter((l) => l.stage === s).reduce((acc, l) => acc + parseInt(l.value.replace(/\D/g, "")), 0)
            return (
              <div key={s} className="px-4 py-3 border-r border-white/10 last:border-r-0">
                <p className="text-gray-500 text-xs">{s}</p>
                <p className="text-white text-lg font-semibold mt-0.5">{count}</p>
                <p className="text-gray-600 text-xs">${value.toLocaleString("es-CO")}</p>
              </div>
            )
          })}
        </div>

        {/* List view */}
        {view === "list" && (
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#0a0a0f]">
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium">Contacto</th>
                  <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium">Fuente</th>
                  <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium">Etapa</th>
                  <th className="text-right px-4 py-3 text-gray-500 text-xs font-medium">Valor</th>
                  <th className="text-right px-4 py-3 text-gray-500 text-xs font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelected(lead.id === selected ? null : lead.id)}
                    className={`border-b border-white/5 cursor-pointer transition-colors ${selected === lead.id ? "bg-violet-600/10" : "hover:bg-white/5"}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold">
                          {lead.avatar}
                        </div>
                        <div>
                          <p className="text-white font-medium">{lead.name}</p>
                          <p className="text-gray-500 text-xs">{lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sourceColors[lead.source]}`}>{lead.source}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stageColors[lead.stage]}`}>{lead.stage}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-right font-medium">{lead.value}</td>
                    <td className="px-4 py-3 text-gray-500 text-right text-xs">{lead.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Kanban view */}
        {view === "kanban" && (
          <div className="flex-1 overflow-x-auto p-4">
            <div className="flex gap-4 h-full min-w-max">
              {stages.map((stage) => (
                <div key={stage} className="w-64 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-xs font-medium">{stage}</span>
                    <span className="text-gray-600 text-xs">{leads.filter((l) => l.stage === stage).length}</span>
                  </div>
                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {leads.filter((l) => l.stage === stage).map((lead) => (
                      <div key={lead.id} className="bg-white/5 border border-white/10 rounded-xl p-3 cursor-pointer hover:border-violet-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold">
                            {lead.avatar}
                          </div>
                          <p className="text-white text-sm font-medium">{lead.name}</p>
                        </div>
                        <p className="text-gray-500 text-xs">{lead.source} · {lead.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Panel lateral del lead seleccionado */}
      {selectedLead && (
        <div className="w-72 border-l border-white/10 bg-black/20 flex flex-col overflow-y-auto flex-shrink-0">
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white text-sm font-semibold">Detalle del lead</p>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-xs">✕</button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300 font-bold">
                {selectedLead.avatar}
              </div>
              <div>
                <p className="text-white font-semibold">{selectedLead.name}</p>
                <p className="text-gray-500 text-xs">{selectedLead.phone}</p>
              </div>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <p className="text-gray-500 text-xs mb-1">Etapa actual</p>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stageColors[selectedLead.stage]}`}>{selectedLead.stage}</span>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Fuente</p>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sourceColors[selectedLead.source]}`}>{selectedLead.source}</span>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Valor potencial</p>
              <p className="text-white font-semibold">{selectedLead.value}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Último contacto</p>
              <p className="text-gray-300 text-sm">{selectedLead.date}</p>
            </div>
            <div className="pt-2 space-y-2">
              <button className="w-full py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-sm font-medium rounded-xl transition-all">
                💬 Enviar WhatsApp
              </button>
              <button className="w-full py-2.5 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-sm font-medium rounded-xl transition-all">
                📋 Cambiar etapa
              </button>
              <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium rounded-xl transition-all">
                📝 Agregar nota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
