"use client"

import { useState, useEffect } from "react"

const stages = ["Nuevo lead", "Contactado", "Interesado", "Propuesta", "Cerrado"]

const sourceColors: Record<string, string> = {
  "Meta Ads": "bg-blue-500/20 text-blue-300",
  "WhatsApp": "bg-emerald-500/20 text-emerald-300",
  "Instagram": "bg-pink-500/20 text-pink-300",
  "Google": "bg-amber-500/20 text-amber-300",
  "TikTok": "bg-gray-500/20 text-gray-300",
  "Referido": "bg-violet-500/20 text-violet-300",
  "Landing": "bg-indigo-500/20 text-indigo-300",
  "Manual": "bg-gray-500/20 text-gray-400",
}

const stageColors: Record<string, string> = {
  "Nuevo lead": "bg-gray-500/20 text-gray-400",
  "Contactado": "bg-blue-500/20 text-blue-300",
  "Interesado": "bg-amber-500/20 text-amber-300",
  "Propuesta": "bg-violet-500/20 text-violet-300",
  "Cerrado": "bg-emerald-500/20 text-emerald-400",
}

interface Lead {
  id: string
  created_at: string
  name: string
  email?: string
  phone?: string
  source?: string
  stage: string
  value?: string
  notes?: string
}

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Lead | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [view, setView] = useState<"list" | "kanban">("list")
  const [form, setForm] = useState({ name: "", email: "", phone: "", source: "Manual", value: "", notes: "" })
  const [saving, setSaving] = useState(false)

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads")
      const data = await res.json()
      if (Array.isArray(data)) setLeads(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLeads() }, [])

  const handleCreate = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, stage: "Nuevo lead" }),
      })
      setShowModal(false)
      setForm({ name: "", email: "", phone: "", source: "Manual", value: "", notes: "" })
      fetchLeads()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleStageChange = async (lead: Lead, newStage: string) => {
    setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, stage: newStage } : l))
    await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lead.id, stage: newStage }),
    })
    if (selected?.id === lead.id) setSelected({ ...lead, stage: newStage })
  }

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  const formatDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return "Hace menos de 1h"
    if (hours < 24) return `Hace ${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `Hace ${days}d`
    return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" })
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
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
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
            >
              + Nuevo lead
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-0 border-b border-white/10 flex-shrink-0">
          {stages.map((s) => {
            const count = leads.filter((l) => l.stage === s).length
            return (
              <div key={s} className="px-4 py-3 border-r border-white/10 last:border-r-0">
                <p className="text-gray-500 text-xs">{s}</p>
                <p className="text-white text-lg font-semibold mt-0.5">{count}</p>
              </div>
            )
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-500 text-sm">Cargando leads...</div>
          </div>
        )}

        {/* Empty state */}
        {!loading && leads.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-violet-600/20 rounded-2xl flex items-center justify-center text-3xl">👥</div>
            <p className="text-white font-semibold">No hay leads todavía</p>
            <p className="text-gray-500 text-sm">Agrega tu primer lead manualmente o conéctalo a un formulario</p>
            <button onClick={() => setShowModal(true)} className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-all">
              + Agregar primer lead
            </button>
          </div>
        )}

        {/* List view */}
        {!loading && leads.length > 0 && view === "list" && (
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
                    onClick={() => setSelected(selected?.id === lead.id ? null : lead)}
                    className={`border-b border-white/5 cursor-pointer transition-colors ${selected?.id === lead.id ? "bg-violet-600/10" : "hover:bg-white/5"}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold">
                          {getInitials(lead.name)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{lead.name}</p>
                          <p className="text-gray-500 text-xs">{lead.phone || lead.email || "Sin contacto"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sourceColors[lead.source || "Manual"] || "bg-gray-500/20 text-gray-400"}`}>
                        {lead.source || "Manual"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stageColors[lead.stage]}`}>
                        {lead.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-right font-medium">{lead.value || "—"}</td>
                    <td className="px-4 py-3 text-gray-500 text-right text-xs">{formatDate(lead.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Kanban view */}
        {!loading && leads.length > 0 && view === "kanban" && (
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
                      <div
                        key={lead.id}
                        onClick={() => setSelected(selected?.id === lead.id ? null : lead)}
                        className="bg-white/5 border border-white/10 rounded-xl p-3 cursor-pointer hover:border-violet-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold">
                            {getInitials(lead.name)}
                          </div>
                          <p className="text-white text-sm font-medium">{lead.name}</p>
                        </div>
                        <p className="text-gray-500 text-xs">{lead.source || "Manual"} · {lead.value || "Sin valor"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Panel lateral */}
      {selected && (
        <div className="w-72 border-l border-white/10 bg-black/20 flex flex-col overflow-y-auto flex-shrink-0">
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white text-sm font-semibold">Detalle del lead</p>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-xs">✕</button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300 font-bold text-sm">
                {getInitials(selected.name)}
              </div>
              <div>
                <p className="text-white font-semibold">{selected.name}</p>
                <p className="text-gray-500 text-xs">{selected.phone || selected.email || "Sin contacto"}</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <p className="text-gray-500 text-xs mb-2">Cambiar etapa</p>
              <div className="space-y-1">
                {stages.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStageChange(selected, s)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      selected.stage === s
                        ? "bg-violet-600/30 text-violet-300 border border-violet-500/30"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {selected.value && (
              <div>
                <p className="text-gray-500 text-xs mb-1">Valor potencial</p>
                <p className="text-white font-semibold">{selected.value}</p>
              </div>
            )}

            {selected.notes && (
              <div>
                <p className="text-gray-500 text-xs mb-1">Notas</p>
                <p className="text-gray-300 text-sm">{selected.notes}</p>
              </div>
            )}

            <div>
              <p className="text-gray-500 text-xs mb-1">Registrado</p>
              <p className="text-gray-300 text-sm">{formatDate(selected.created_at)}</p>
            </div>

            <div className="pt-2 space-y-2">
              {selected.phone && (
                <a
                  href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  className="w-full py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  💬 Enviar WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal nuevo lead */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111118] border border-white/10 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Nuevo lead</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Nombre *</label>
                <input
                  type="text"
                  placeholder="Juan García"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Teléfono</label>
                <input
                  type="text"
                  placeholder="3001234567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Email</label>
                <input
                  type="email"
                  placeholder="juan@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Fuente</label>
                <select
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-violet-500/50"
                >
                  {["Manual", "Meta Ads", "Google", "Instagram", "TikTok", "WhatsApp", "Referido", "Landing"].map((s) => (
                    <option key={s} value={s} className="bg-[#111118]">{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Valor potencial</label>
                <input
                  type="text"
                  placeholder="$120.000"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Notas</label>
                <textarea
                  placeholder="Información adicional..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50 resize-none"
                />
              </div>
              <button
                onClick={handleCreate}
                disabled={saving || !form.name.trim()}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Guardando...
                  </>
                ) : "Guardar lead"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
