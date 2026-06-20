"use client"

import { useState } from "react"

const problems = [
  {
    icon: "📉",
    stat: "68% de los leads",
    title: "nunca recibe seguimiento",
    desc: "Sin un CRM conectado a WhatsApp, los leads se enfrían en horas y la venta se pierde sola.",
  },
  {
    icon: "💸",
    stat: "73% de las pymes",
    title: "no sabe su ROI real en ads",
    desc: "Gastan en Meta, Google y TikTok Ads sin saber qué campaña realmente está vendiendo.",
  },
  {
    icon: "🤹",
    stat: "+$3.000.000 COP/mes",
    title: "cuesta armar un equipo de marketing",
    desc: "Agencia, community manager, diseñador y CRM por separado — y aun así la ejecución es lenta.",
  },
  {
    icon: "🧠",
    stat: "0 horas libres",
    title: "le quedan al dueño del negocio",
    desc: "Termina haciendo de todo un poco: estrategia, copies, ventas y atención — sin sistema y sin foco.",
  },
]

const modules = [
  { icon: "💬", label: "Growth Copilot", desc: "Tu director de marketing con IA, disponible 24/7 para crear estrategia y resolver dudas." },
  { icon: "🔍", label: "Analizar Negocio", desc: "Describe tu negocio y la IA construye tu perfil, buyer persona y oferta ideal en segundos." },
  { icon: "📣", label: "Campañas", desc: "Gestiona y monitorea tus campañas de Meta, Google y TikTok Ads en un solo panel." },
  { icon: "✍️", label: "Creativos & Copies", desc: "Genera copies publicitarios de alto impacto listos para publicar, en segundos." },
  { icon: "🏗️", label: "Landings", desc: "Crea páginas de aterrizaje que convierten, sin programar ni diseñar." },
  { icon: "💚", label: "WhatsApp AI", desc: "Un asistente con IA que responde, califica y da seguimiento a tus leads por WhatsApp." },
  { icon: "👥", label: "CRM", desc: "Organiza tu pipeline de leads con vista de lista o Kanban, sin hojas de cálculo." },
  { icon: "⚡", label: "Automatizaciones", desc: "Flujos automáticos de seguimiento que nunca dejan un lead sin respuesta." },
  { icon: "📊", label: "ROI & Métricas", desc: "Visualiza cuánto inviertes, cuánto vendes y cuál es tu retorno real." },
  { icon: "📚", label: "Playbooks", desc: "Estrategias ya probadas por industria: gimnasios, clínicas, restaurantes y más." },
]

const benefits = [
  { icon: "⚡", title: "Lánzate en minutos, no semanas", desc: "Sin procesos de onboarding eternos ni reuniones de briefing." },
  { icon: "🤖", title: "IA que conoce tu negocio", desc: "No es un chatbot genérico — entiende tu industria, tu oferta y tu cliente ideal." },
  { icon: "📈", title: "ROI claro en tiempo real", desc: "Sabes exactamente cuánto inviertes y cuánto te está generando cada campaña." },
  { icon: "💬", title: "Nunca pierdas un lead", desc: "El WhatsApp AI responde y da seguimiento 24/7, incluso fuera de horario." },
  { icon: "💰", title: "Hasta 70% más barato que una agencia", desc: "Reemplaza varias herramientas y contrataciones con una sola plataforma." },
  { icon: "🌎", title: "Hecho para Latinoamérica", desc: "Lenguaje, moneda y canales (WhatsApp primero) pensados para tu mercado." },
]

const plans = [
  {
    name: "Starter",
    price: "$97",
    desc: "Para negocios que están empezando a sistematizar su marketing.",
    features: [
      "Growth Copilot con IA (chat ilimitado)",
      "CRM con hasta 500 leads",
      "1 línea de WhatsApp AI",
      "Generador de copies: 50 al mes",
      "1 landing page",
      "Soporte por chat",
    ],
    popular: false,
  },
  {
    name: "Growth",
    price: "$197",
    desc: "El plan más elegido por pymes que quieren escalar en serio.",
    features: [
      "Todo lo de Starter, sin límite de leads",
      "Analizador de negocio con IA",
      "3 líneas de WhatsApp AI",
      "Copies y landings ilimitadas",
      "Automatizaciones de seguimiento",
      "Reportes de ROI y métricas",
      "Soporte prioritario",
    ],
    popular: true,
  },
  {
    name: "Scale",
    price: "$397",
    desc: "Para negocios o cadenas con múltiples sucursales o marcas.",
    features: [
      "Todo lo de Growth",
      "Multi-negocio / multi-marca",
      "Automatizaciones avanzadas e ilimitadas",
      "Onboarding y estrategia 1:1",
      "Acceso anticipado a nuevas funciones",
      "Soporte dedicado por WhatsApp",
    ],
    popular: false,
  },
]

const testimonials = [
  {
    name: "Carlos Mendoza",
    role: "Dueño, Iron Gym",
    avatar: "CM",
    quote:
      "Antes perdíamos la mitad de los leads porque nadie los contactaba a tiempo. Con el WhatsApp AI de PRIME respondemos en segundos y las inscripciones subieron 40% en dos meses.",
  },
  {
    name: "Daniela Restrepo",
    role: "Directora, Clínica Bella Piel",
    avatar: "DR",
    quote:
      "El Analizador de Negocio nos ayudó a entender a nuestro cliente ideal mejor que cualquier agencia que contratamos antes. Hoy gastamos menos en ads y agendamos más citas.",
  },
  {
    name: "Andrés Gómez",
    role: "Fundador, Sabor de Casa",
    avatar: "AG",
    quote:
      "Generamos copies y campañas desde la misma plataforma. Lo que antes nos tomaba una semana con el community manager, ahora lo hacemos en una tarde.",
  },
]

const faqs = [
  {
    q: "¿Necesito saber de marketing o tecnología para usar PRIME GROWTH OS?",
    a: "No. La plataforma está diseñada para dueños de negocio sin experiencia técnica. El Growth Copilot te guía paso a paso y la mayoría de las tareas se generan automáticamente con IA.",
  },
  {
    q: "¿Funciona para mi tipo de negocio?",
    a: "Tenemos playbooks listos para gimnasios, clínicas, restaurantes, inmobiliarias, ecommerce, educación, hoteles, coaches, abogados y constructoras. Si tu industria no está en la lista, el Growth Copilot se adapta a tu negocio igual.",
  },
  {
    q: "¿Qué pasa con mis campañas actuales en Meta, Google o TikTok Ads?",
    a: "Puedes seguir usándolas. PRIME GROWTH OS te ayuda a monitorearlas, mejorar sus copies y conectarlas a tu CRM y WhatsApp para que ningún lead se pierda.",
  },
  {
    q: "¿El WhatsApp AI es un chatbot genérico?",
    a: "No. Está entrenado con el contexto de tu negocio: tu oferta, tus precios y tus preguntas frecuentes, para responder y calificar leads como lo haría tu mejor vendedor.",
  },
  {
    q: "¿Puedo cambiar de plan o cancelar cuando quiera?",
    a: "Sí. No hay contratos de permanencia. Puedes subir, bajar o cancelar tu plan cuando quieras desde tu cuenta.",
  },
  {
    q: "¿Tienen periodo de prueba?",
    a: "Sí, todos los planes incluyen 7 días de prueba gratis para que valides el sistema con tu propio negocio antes de comprometerte.",
  },
]

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-white text-sm font-medium">{q}</span>
        <span className={`text-violet-400 text-lg flex-shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <p className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">{a}</p>}
    </div>
  )
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  const handlePlanClick = (planName: string) => {
    setSelectedPlan(planName)
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim()) return
    setStatus("submitting")
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email || undefined,
          phone: form.phone,
          source: "Landing",
          stage: "Nuevo lead",
          notes: selectedPlan ? `Plan de interés: ${selectedPlan}` : undefined,
        }),
      })
      if (!response.ok) throw new Error("Error")
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="bg-[#0a0a0f] text-white min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <div className="leading-none">
              <p className="text-sm font-semibold">PRIME</p>
              <p className="text-gray-500 text-xs mt-0.5">Growth OS</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#problema" className="hover:text-white transition-colors">Problema</a>
            <a href="#solucion" className="hover:text-white transition-colors">Solución</a>
            <a href="#demo" className="hover:text-white transition-colors">Módulos</a>
            <a href="#precios" className="hover:text-white transition-colors">Precios</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <a
            href="#contacto"
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
          >
            Empezar
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-6">
            🚀 Impulsado por IA
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            El Director de Marketing con IA que tu negocio necesitaba
          </h1>
          <p className="text-gray-400 text-base md:text-lg mt-5 leading-relaxed">
            PRIME GROWTH OS reemplaza tu agencia, tu CRM y tu equipo de copywriting con un solo
            sistema de crecimiento. Crea campañas, atiende leads por WhatsApp y mide tu ROI — todo con inteligencia artificial.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <a
              href="#contacto"
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all active:scale-95 shadow-lg shadow-violet-500/25"
            >
              Empieza gratis 7 días
            </a>
            <a
              href="#demo"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all active:scale-95"
            >
              Ver cómo funciona
            </a>
          </div>
          <p className="text-gray-600 text-xs mt-4">Sin tarjeta de crédito · Cancela cuando quieras</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-gray-500 text-xs">Growth Copilot · IA activa</span>
          </div>
          <div className="space-y-3">
            <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-sm p-3 text-sm text-gray-200 max-w-[85%]">
              ¡Hola! 👋 Cuéntame de tu negocio y te armo una estrategia en minutos
            </div>
            <div className="bg-violet-600 rounded-2xl rounded-tr-sm p-3 text-sm text-white max-w-[85%] ml-auto">
              Tengo un gimnasio en Medellín y quiero más inscripciones
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-sm p-3 text-sm text-gray-200 max-w-[90%]">
              Perfecto 💪 Te recomiendo una campaña en Meta Ads con oferta de &quot;primera semana gratis&quot; y seguimiento automático por WhatsApp. ¿La lanzamos?
            </div>
          </div>
        </div>
      </section>

      {/* Problema */}
      <section id="problema" className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl font-bold">
            La mayoría de los negocios no fracasan por falta de clientes — fracasan por falta de sistema
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {problems.map((p) => (
            <div key={p.title} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-2xl mb-3">{p.icon}</div>
              <p className="text-violet-300 font-semibold text-sm">{p.stat}</p>
              <p className="text-white font-medium text-sm mt-1">{p.title}</p>
              <p className="text-gray-500 text-xs mt-2 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solución */}
      <section id="solucion" className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold">
              Una sola plataforma con IA que actúa como tu director de marketing
            </h2>
            <p className="text-gray-400 mt-5 leading-relaxed">
              PRIME GROWTH OS combina estrategia, ejecución y datos en un mismo lugar. Tu Growth
              Copilot analiza tu negocio, crea campañas, escribe copies, atiende tus leads por
              WhatsApp y te muestra el ROI real — sin que tengas que armar un equipo completo.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-gray-500 text-xs font-medium mb-3">Antes</p>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>🐌 Agencia + freelancers</li>
                <li>📋 Hojas de cálculo</li>
                <li>📵 Leads sin seguimiento</li>
                <li>❓ ROI desconocido</li>
              </ul>
            </div>
            <div className="bg-violet-600/10 border border-violet-500/20 rounded-2xl p-5">
              <p className="text-violet-300 text-xs font-medium mb-3">Con PRIME</p>
              <ul className="space-y-2 text-gray-200 text-sm">
                <li>🤖 Un solo Growth Copilot</li>
                <li>👥 CRM centralizado</li>
                <li>💬 WhatsApp AI 24/7</li>
                <li>📊 ROI en tiempo real</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Demo / módulos */}
      <section id="demo" className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl font-bold">Todo lo que necesitas para crecer, en un solo lugar</h2>
          <p className="text-gray-400 mt-3">Estos son los módulos que vienen activos desde el primer día.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => (
            <div
              key={m.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-violet-500/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center text-lg mb-3">
                {m.icon}
              </div>
              <p className="text-white font-medium text-sm">{m.label}</p>
              <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl font-bold">Por qué los negocios eligen PRIME GROWTH OS</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="flex gap-4">
              <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                {b.icon}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{b.title}</p>
                <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Precios */}
      <section id="precios" className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
        <div className="max-w-2xl mb-12 mx-auto text-center">
          <h2 className="text-3xl font-bold">Planes simples, sin sorpresas</h2>
          <p className="text-gray-400 mt-3">Elige el plan según el tamaño de tu negocio. Cancela cuando quieras.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 flex flex-col ${
                plan.popular
                  ? "bg-violet-600/10 border-2 border-violet-500/40 relative md:-mt-3"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-violet-600 text-white text-xs font-medium rounded-full">
                  Más popular
                </span>
              )}
              <p className="text-white font-semibold">{plan.name}</p>
              <p className="text-gray-500 text-xs mt-1">{plan.desc}</p>
              <p className="mt-5">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-500 text-sm"> USD/mes</span>
              </p>
              <ul className="space-y-2.5 mt-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-gray-300 text-sm">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePlanClick(plan.name)}
                className={`w-full mt-6 py-3 font-medium rounded-xl transition-all active:scale-95 ${
                  plan.popular
                    ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25"
                    : "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                }`}
              >
                Empieza con {plan.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonios */}
      <section id="testimonios" className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl font-bold">Negocios que ya están creciendo con PRIME</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
              <p className="text-amber-400 text-sm mb-3">★★★★★</p>
              <p className="text-gray-300 text-sm leading-relaxed flex-1">&quot;{t.quote}&quot;</p>
              <div className="flex items-center gap-3 mt-5">
                <div className="w-9 h-9 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl font-bold">Preguntas frecuentes</h2>
        </div>
        <div className="max-w-3xl space-y-3">
          {faqs.map((f, i) => (
            <FaqItem
              key={f.q}
              q={f.q}
              a={f.a}
              open={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>
      </section>

      {/* CTA final / formulario */}
      <section id="contacto" className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
        <div className="bg-gradient-to-br from-violet-600/20 to-purple-600/10 border border-violet-500/20 rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold">Empieza a crecer con IA hoy mismo</h2>
            <p className="text-gray-400 mt-4 leading-relaxed">
              Déjanos tus datos y un asesor te contacta por WhatsApp para activar tu cuenta y
              configurar tu Growth Copilot.
            </p>
          </div>

          <div className="bg-[#111118] border border-white/10 rounded-2xl p-6">
            {status === "success" ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
                <p className="text-white font-semibold">¡Listo! Ya tenemos tus datos</p>
                <p className="text-gray-500 text-sm mt-2">Un asesor te va a contactar por WhatsApp muy pronto.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedPlan && (
                  <p className="text-violet-300 text-xs font-medium">Plan seleccionado: {selectedPlan}</p>
                )}
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
                  <label className="text-gray-400 text-xs mb-1 block">WhatsApp *</label>
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
                    "Quiero mi demo gratis"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">P</span>
            </div>
            <p className="text-gray-500 text-xs">PRIME GROWTH OS</p>
          </div>
          <p className="text-gray-600 text-xs">© 2026 PRIME GROWTH OS · Hecho en Latinoamérica</p>
        </div>
      </footer>
    </div>
  )
}
