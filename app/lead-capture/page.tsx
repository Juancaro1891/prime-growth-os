"use client"

import { useState } from "react"

export default function LeadCapturePage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", business: "" })
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim()) return
    setStatus("submitting")
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || undefined,
          source: "Formulario Web",
          stage: "Nuevo lead",
          notes: form.business ? `Negocio: ${form.business}` : undefined,
        }),
      })
      if (!response.ok) throw new Error("Error")
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-2.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-lg font-bold">P</span>
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-semibold leading-none">PRIME</p>
            <p className="text-gray-500 text-xs leading-none mt-0.5">Growth OS</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          {status === "success" ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
              <p className="text-white font-semibold">¡Listo! Ya tenemos tus datos</p>
              <p className="text-gray-500 text-sm mt-2">Muy pronto te vamos a contactar por WhatsApp.</p>
            </div>
          ) : (
            <>
              <h1 className="text-white text-lg font-semibold text-center">Cuéntanos de ti</h1>
              <p className="text-gray-500 text-sm text-center mt-1 mb-5">
                Déjanos tus datos y un asesor te contacta enseguida.
              </p>

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
                  <label className="text-gray-400 text-xs mb-1 block">Teléfono / WhatsApp *</label>
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
                  <label className="text-gray-400 text-xs mb-1 block">Negocio</label>
                  <input
                    type="text"
                    placeholder="Ej: Iron Gym"
                    value={form.business}
                    onChange={(e) => setForm({ ...form, business: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50"
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-400 text-xs">Hubo un error enviando tus datos. Intenta de nuevo.</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={status === "submitting" || !form.name.trim() || !form.phone.trim()}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {status === "submitting" ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    "Enviar"
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-gray-600 text-xs text-center mt-5">Powered by PRIME GROWTH OS</p>
      </div>
    </div>
  )
}
