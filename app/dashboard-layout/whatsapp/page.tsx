"use client"

import { useState } from "react"

const conversations = [
  { id: 1, name: "Carlos Mendoza", last: "Quiero saber más del plan anual", time: "2 min", unread: 2, stage: "Interesado", avatar: "CM" },
  { id: 2, name: "María García", last: "¿Tienen clases los domingos?", time: "15 min", unread: 1, stage: "Nuevo lead", avatar: "MG" },
  { id: 3, name: "Andrés López", last: "Perfecto, agendamos el martes", time: "1h", unread: 0, stage: "Cita agendada", avatar: "AL" },
  { id: 4, name: "Valentina Ríos", last: "Gracias por la info 🙏", time: "3h", unread: 0, stage: "Contactado", avatar: "VR" },
  { id: 5, name: "Felipe Castillo", last: "Ya me inscribí! 💪", time: "Ayer", unread: 0, stage: "Cerrado", avatar: "FC" },
]

const messages: Record<number, { from: "ai" | "user"; text: string; time: string }[]> = {
  1: [
    { from: "user", text: "Hola, vi su publicidad en Instagram", time: "3:20pm" },
    { from: "ai", text: "¡Hola Carlos! 👋 Bienvenido a Iron Gym. Vi que te interesó nuestra publicidad. ¿Qué plan te llamó la atención? Tenemos membresías mensuales desde $120.000 y planes anuales con descuento especial 💪", time: "3:20pm" },
    { from: "user", text: "Quiero saber más del plan anual", time: "3:22pm" },
  ],
}

const stageColors: Record<string, string> = {
  "Nuevo lead": "bg-gray-500/20 text-gray-400",
  "Interesado": "bg-amber-500/20 text-amber-300",
  "Cita agendada": "bg-blue-500/20 text-blue-300",
  "Contactado": "bg-violet-500/20 text-violet-300",
  "Cerrado": "bg-emerald-500/20 text-emerald-400",
}

export default function WhatsAppPage() {
  const [selected, setSelected] = useState(1)
  const [input, setInput] = useState("")
  const [aiMode, setAiMode] = useState(true)

  const conv = conversations.find((c) => c.id === selected)
  const msgs = messages[selected] || []

  return (
    <div className="flex h-full overflow-hidden">
      {/* Lista de conversaciones */}
      <div className="w-72 border-r border-white/10 flex flex-col flex-shrink-0">
        <div className="px-4 py-4 border-b border-white/10">
          <h1 className="text-white text-sm font-semibold mb-3">WhatsApp AI</h1>
          <input
            type="text"
            placeholder="Buscar conversación..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-gray-600 outline-none focus:border-violet-500/50"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelected(c.id)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-white/5 ${
                selected === c.id ? "bg-violet-600/10" : "hover:bg-white/5"
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold">
                  {c.avatar}
                </div>
                {c.unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    {c.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-white text-xs font-medium truncate">{c.name}</p>
                  <p className="text-gray-600 text-[10px] flex-shrink-0 ml-2">{c.time}</p>
                </div>
                <p className="text-gray-500 text-xs truncate mt-0.5">{c.last}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1 inline-block ${stageColors[c.stage]}`}>
                  {c.stage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {conv && (
          <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold">
                  {conv.avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{conv.name}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${stageColors[conv.stage]}`}>{conv.stage}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs">IA activa</span>
                  <button
                    onClick={() => setAiMode(!aiMode)}
                    className={`w-10 h-5 rounded-full transition-all relative ${aiMode ? "bg-emerald-500" : "bg-white/10"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${aiMode ? "left-5.5" : "left-0.5"}`} style={{ left: aiMode ? "22px" : "2px" }} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  {m.from === "ai" && (
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs flex-shrink-0 mt-0.5">
                      🤖
                    </div>
                  )}
                  <div className={`max-w-xs rounded-2xl px-3 py-2 text-sm ${
                    m.from === "user"
                      ? "bg-emerald-600 text-white rounded-tr-sm"
                      : "bg-white/10 border border-white/10 text-gray-200 rounded-tl-sm"
                  }`}>
                    <p className="leading-relaxed">{m.text}</p>
                    <p className={`text-[10px] mt-1 ${m.from === "user" ? "text-emerald-200" : "text-gray-500"}`}>{m.time}</p>
                  </div>
                </div>
              ))}

              {aiMode && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mx-2">
                  <p className="text-emerald-300 text-xs font-medium mb-1">🤖 La IA está redactando respuesta...</p>
                  <p className="text-emerald-200/60 text-xs">
                    "¡Excelente elección Carlos! Nuestro plan anual tiene un valor de $900.000 COP — eso es solo $75.000 al mes, un 37% de descuento vs el plan mensual. Además incluye: acceso ilimitado 6am-10pm, todos los equipos, clases grupales y valoración física inicial. ¿Te gustaría venir esta semana a conocer las instalaciones? 🏋️"
                  </p>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-white/10 bg-black/10 flex-shrink-0">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={aiMode ? "La IA responde automáticamente..." : "Escribe un mensaje..."}
                  disabled={aiMode}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50"
                />
                <button className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-all active:scale-95">
                  Enviar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
