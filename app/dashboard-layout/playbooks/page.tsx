"use client"

import { useState } from "react"

const industries = [
  { id: "gym", icon: "🏋️", name: "Gimnasios", desc: "Captación, membresías, retención y eventos fitness", campaigns: 12, templates: 8 },
  { id: "clinic", icon: "🏥", name: "Clínicas y salud", desc: "Citas médicas, procedimientos estéticos y bienestar", campaigns: 9, templates: 6 },
  { id: "restaurant", icon: "🍽️", name: "Restaurantes", desc: "Domicilios, reservas, eventos y fidelización", campaigns: 11, templates: 7 },
  { id: "real_estate", icon: "🏢", name: "Inmobiliarias", desc: "Proyectos, apartamentos, casas y preventas", campaigns: 14, templates: 10 },
  { id: "ecommerce", icon: "🛒", name: "Ecommerce", desc: "Ventas online, carritos abandonados y retención", campaigns: 16, templates: 12 },
  { id: "education", icon: "🎓", name: "Educación", desc: "Cursos, diplomados, matrículas y webinars", campaigns: 10, templates: 8 },
  { id: "hotel", icon: "🏨", name: "Hoteles", desc: "Reservas directas, paquetes y temporadas", campaigns: 8, templates: 6 },
  { id: "coach", icon: "🎯", name: "Coaches y consultores", desc: "Sesiones, programas y mentoría", campaigns: 9, templates: 7 },
  { id: "lawyer", icon: "⚖️", name: "Abogados", desc: "Consultas, casos y posicionamiento legal", campaigns: 7, templates: 5 },
  { id: "constructor", icon: "🏗️", name: "Constructoras", desc: "Proyectos, salas de ventas y preventas", campaigns: 13, templates: 9 },
]

const gymPlaybook = [
  { step: 1, title: "Campaña de captación fría", desc: "Meta Ads dirigida a personas 18-40 años interesadas en fitness en tu ciudad", platform: "Meta", type: "Leads" },
  { step: 2, title: "Landing de membresía", desc: "Página de captura con oferta irresistible: primera semana gratis o descuento", platform: "Web", type: "Conversión" },
  { step: 3, title: "WhatsApp de bienvenida", desc: "Mensaje automático en menos de 5 minutos con propuesta de valor clara", platform: "WhatsApp", type: "Contacto" },
  { step: 4, title: "Seguimiento automatizado", desc: "Secuencia de 5 mensajes en 7 días si no visita el gimnasio", platform: "WhatsApp", type: "Nurturing" },
  { step: 5, title: "Remarketing plan anual", desc: "Campaña para convertir mensualistas a plan anual con descuento especial", platform: "Meta", type: "Upsell" },
  { step: 6, title: "Referidos y reseñas", desc: "Automatización para pedir reseñas a afiliados satisfechos y activar referidos", platform: "WhatsApp", type: "Retención" },
]

export default function PlaybooksPage() {
  const [selected, setSelected] = useState<string | null>(null)

  const industry = industries.find((i) => i.id === selected)

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/10">
        <div>
          <h1 className="text-white text-sm font-semibold">Industry Playbooks</h1>
          <p className="text-gray-500 text-xs mt-0.5">Estrategias completas listas para activar</p>
        </div>
        {selected && (
          <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-xs px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 transition-colors">
            ← Volver
          </button>
        )}
      </div>

      <div className="flex-1 p-6">
        {!selected ? (
          <>
            <div className="mb-6">
              <p className="text-gray-400 text-sm">Selecciona tu industria y activa un sistema de marketing completo en minutos.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {industries.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setSelected(ind.id)}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-left hover:border-violet-500/40 hover:bg-violet-600/5 transition-all group"
                >
                  <span className="text-3xl block mb-3">{ind.icon}</span>
                  <p className="text-white font-semibold text-sm mb-1 group-hover:text-violet-300 transition-colors">{ind.name}</p>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3">{ind.desc}</p>
                  <div className="flex gap-3 text-xs text-gray-600">
                    <span>{ind.campaigns} campañas</span>
                    <span>{ind.templates} templates</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{industry?.icon}</span>
              <div>
                <h2 className="text-white font-semibold text-base">{industry?.name}</h2>
                <p className="text-gray-500 text-sm">{industry?.desc}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-600/20 to-purple-900/20 border border-violet-500/20 rounded-2xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">P</div>
                <div>
                  <p className="text-white text-sm font-medium mb-1">Estrategia recomendada para {industry?.name}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Este playbook cubre el ciclo completo: desde captar un extraño hasta convertirlo en cliente fiel.
                    Incluye {industry?.campaigns} campañas probadas y {industry?.templates} templates listos para usar.
                    Tiempo de activación estimado: 30 minutos.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-white font-semibold text-sm mb-4">Flujo de crecimiento paso a paso</h3>
            <div className="space-y-3 mb-6">
              {gymPlaybook.map((step) => (
                <div key={step.step} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/20 flex items-center justify-center text-violet-400 text-sm font-bold flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-medium text-sm">{step.title}</p>
                      <span className="px-1.5 py-0.5 bg-violet-500/20 text-violet-300 rounded text-xs">{step.platform}</span>
                      <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">{step.type}</span>
                    </div>
                    <p className="text-gray-400 text-xs">{step.desc}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 text-violet-300 text-xs font-medium rounded-lg transition-all flex-shrink-0">
                    Activar
                  </button>
                </div>
              ))}
            </div>

            <button className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all active:scale-95">
              🚀 Activar playbook completo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
