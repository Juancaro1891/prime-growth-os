"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Show } from "@clerk/nextjs"

const problems = [
  {
    stat: "68%",
    label: "de los leads",
    title: "nunca recibe seguimiento",
    desc: "Sin un CRM conectado a WhatsApp, los leads se enfrían en horas y la venta se pierde sola.",
  },
  {
    stat: "73%",
    label: "de las pymes",
    title: "no sabe su ROI real en ads",
    desc: "Gastan en Meta, Google y TikTok Ads sin saber qué campaña realmente está vendiendo.",
  },
  {
    stat: "3M+",
    label: "COP/mes",
    title: "cuesta armar un equipo completo",
    desc: "Agencia, community manager, diseñador y CRM por separado — y aun así la ejecución es lenta.",
  },
]

const problemStyles = [
  {
    iconBg: "from-amber-500 to-orange-600",
    glowRgb: "245,158,11",
    borderGradient: "from-amber-500/40 to-orange-600/15",
    shadowBase: "shadow-[0_0_24px_-4px_rgba(245,158,11,0.18)]",
    shadowHover: "hover:shadow-[0_0_32px_-2px_rgba(245,158,11,0.32)]",
  },
  {
    iconBg: "from-blue-500 to-cyan-600",
    glowRgb: "59,130,246",
    borderGradient: "from-blue-500/40 to-cyan-600/15",
    shadowBase: "shadow-[0_0_24px_-4px_rgba(59,130,246,0.18)]",
    shadowHover: "hover:shadow-[0_0_32px_-2px_rgba(59,130,246,0.32)]",
  },
  {
    iconBg: "from-rose-500 to-pink-600",
    glowRgb: "236,72,153",
    borderGradient: "from-rose-500/40 to-pink-600/15",
    shadowBase: "shadow-[0_0_24px_-4px_rgba(236,72,153,0.18)]",
    shadowHover: "hover:shadow-[0_0_32px_-2px_rgba(236,72,153,0.32)]",
  },
]

const liveStats = [
  {
    num: "284+",
    label: "Leads generados / mes",
    delta: "+12% vs mes ant.",
    iconBg: "from-blue-500 to-cyan-600",
    sparkColor: "#3b82f6",
    glowRgb: "59,130,246",
    sparkPoints: "0 28 20 20 40 22 60 12 80 16 100 6",
    borderGradient: "from-blue-500/40 to-cyan-600/15",
    shadowBase: "shadow-[0_0_24px_-4px_rgba(59,130,246,0.18)]",
    shadowHover: "hover:shadow-[0_0_32px_-2px_rgba(59,130,246,0.32)]",
  },
  {
    num: "478%",
    label: "ROI promedio documentado",
    delta: "+6.2% vs mes ant.",
    iconBg: "from-violet-500 to-purple-600",
    sparkColor: "#8b5cf6",
    glowRgb: "139,92,246",
    sparkPoints: "0 26 20 18 40 20 60 8 80 12 100 4",
    borderGradient: "from-violet-500/40 to-purple-600/15",
    shadowBase: "shadow-[0_0_24px_-4px_rgba(139,92,246,0.18)]",
    shadowHover: "hover:shadow-[0_0_32px_-2px_rgba(139,92,246,0.32)]",
  },
  {
    num: "70%",
    label: "Más barato que una agencia",
    delta: "vs agencia trad.",
    iconBg: "from-emerald-400 to-teal-600",
    sparkColor: "#10b981",
    glowRgb: "16,185,129",
    sparkPoints: "0 24 20 16 40 18 60 10 80 8 100 4",
    borderGradient: "from-emerald-400/40 to-teal-600/15",
    shadowBase: "shadow-[0_0_24px_-4px_rgba(16,185,129,0.18)]",
    shadowHover: "hover:shadow-[0_0_32px_-2px_rgba(16,185,129,0.32)]",
  },
]

const steps = [
  {
    num: "01",
    title: "Conecta tu negocio",
    desc: "En minutos configuras tu perfil, conectas tu cuenta de Meta Ads y la IA empieza a aprender sobre tu negocio, tu industria y tus clientes ideales.",
    mockup: "analyzer" as const,
  },
  {
    num: "02",
    title: "La IA genera tu estrategia",
    desc: "Tu Growth Copilot analiza tu negocio y genera campañas, copies y creativos personalizados listos para lanzar — sin briefings ni reuniones.",
    mockup: "campaigns" as const,
  },
  {
    num: "03",
    title: "Lanza, mide y escala",
    desc: "Aprueba campañas con un clic, actívalas directo en Meta Ads y monitorea el ROI en tiempo real. La IA te dice qué pausar y qué escalar.",
    mockup: "analytics" as const,
  },
]

const modules = [
  { icon: "💬", label: "Growth Copilot", desc: "Tu director de marketing con IA, disponible 24/7 para crear estrategia y resolver dudas.", borderGradient: "from-violet-500/35 to-purple-600/10", shadowBase: "shadow-[0_0_20px_-4px_rgba(139,92,246,0.14)]", shadowHover: "hover:shadow-[0_0_28px_-2px_rgba(139,92,246,0.28)]", glowRgb: "139,92,246", iconBg: "bg-violet-600/15 border-violet-500/20 group-hover:bg-violet-600/25" },
  { icon: "🔍", label: "Analizar Negocio", desc: "Describe tu negocio y la IA construye tu perfil, buyer persona y oferta ideal en segundos.", borderGradient: "from-blue-500/35 to-cyan-600/10", shadowBase: "shadow-[0_0_20px_-4px_rgba(59,130,246,0.14)]", shadowHover: "hover:shadow-[0_0_28px_-2px_rgba(59,130,246,0.28)]", glowRgb: "59,130,246", iconBg: "bg-blue-600/15 border-blue-500/20 group-hover:bg-blue-600/25" },
  { icon: "📣", label: "Campañas", desc: "Gestiona y lanza campañas de Meta Ads con sugerencias generadas automáticamente por IA.", borderGradient: "from-orange-500/35 to-amber-600/10", shadowBase: "shadow-[0_0_20px_-4px_rgba(249,115,22,0.14)]", shadowHover: "hover:shadow-[0_0_28px_-2px_rgba(249,115,22,0.28)]", glowRgb: "249,115,22", iconBg: "bg-orange-600/15 border-orange-500/20 group-hover:bg-orange-600/25" },
  { icon: "✍️", label: "Creativos & Copies", desc: "Genera copies publicitarios de alto impacto listos para publicar, en segundos.", borderGradient: "from-rose-500/35 to-pink-600/10", shadowBase: "shadow-[0_0_20px_-4px_rgba(244,63,94,0.14)]", shadowHover: "hover:shadow-[0_0_28px_-2px_rgba(244,63,94,0.28)]", glowRgb: "244,63,94", iconBg: "bg-rose-600/15 border-rose-500/20 group-hover:bg-rose-600/25" },
  { icon: "🏗️", label: "Landings", desc: "Crea páginas de aterrizaje que convierten, sin programar ni diseñar.", borderGradient: "from-amber-500/35 to-yellow-600/10", shadowBase: "shadow-[0_0_20px_-4px_rgba(245,158,11,0.14)]", shadowHover: "hover:shadow-[0_0_28px_-2px_rgba(245,158,11,0.28)]", glowRgb: "245,158,11", iconBg: "bg-amber-600/15 border-amber-500/20 group-hover:bg-amber-600/25" },
  { icon: "💚", label: "WhatsApp AI", desc: "Un asistente con IA que responde, califica y da seguimiento a tus leads por WhatsApp.", borderGradient: "from-emerald-400/35 to-teal-600/10", shadowBase: "shadow-[0_0_20px_-4px_rgba(16,185,129,0.14)]", shadowHover: "hover:shadow-[0_0_28px_-2px_rgba(16,185,129,0.28)]", glowRgb: "16,185,129", iconBg: "bg-emerald-600/15 border-emerald-500/20 group-hover:bg-emerald-600/25" },
  { icon: "👥", label: "CRM", desc: "Organiza tu pipeline de leads con vista Kanban, sin hojas de cálculo.", borderGradient: "from-cyan-500/35 to-sky-600/10", shadowBase: "shadow-[0_0_20px_-4px_rgba(6,182,212,0.14)]", shadowHover: "hover:shadow-[0_0_28px_-2px_rgba(6,182,212,0.28)]", glowRgb: "6,182,212", iconBg: "bg-cyan-600/15 border-cyan-500/20 group-hover:bg-cyan-600/25" },
  { icon: "⚡", label: "Automatizaciones", desc: "Flujos automáticos de seguimiento que nunca dejan un lead sin respuesta.", borderGradient: "from-yellow-400/35 to-orange-500/10", shadowBase: "shadow-[0_0_20px_-4px_rgba(234,179,8,0.14)]", shadowHover: "hover:shadow-[0_0_28px_-2px_rgba(234,179,8,0.28)]", glowRgb: "234,179,8", iconBg: "bg-yellow-600/15 border-yellow-500/20 group-hover:bg-yellow-600/25" },
  { icon: "📊", label: "ROI & Métricas", desc: "Visualiza cuánto inviertes, cuánto vendes y cuál es tu retorno real.", borderGradient: "from-purple-500/35 to-indigo-600/10", shadowBase: "shadow-[0_0_20px_-4px_rgba(168,85,247,0.14)]", shadowHover: "hover:shadow-[0_0_28px_-2px_rgba(168,85,247,0.28)]", glowRgb: "168,85,247", iconBg: "bg-purple-600/15 border-purple-500/20 group-hover:bg-purple-600/25" },
  { icon: "📚", label: "Playbooks", desc: "Estrategias ya probadas por industria: gimnasios, clínicas, restaurantes y más.", borderGradient: "from-indigo-500/35 to-blue-600/10", shadowBase: "shadow-[0_0_20px_-4px_rgba(99,102,241,0.14)]", shadowHover: "hover:shadow-[0_0_28px_-2px_rgba(99,102,241,0.28)]", glowRgb: "99,102,241", iconBg: "bg-indigo-600/15 border-indigo-500/20 group-hover:bg-indigo-600/25" },
]

const adExamples = [
  {
    src: "/landing/mockup-ad-1.png",
    industry: "Restaurante",
    title: "Campaña de captación",
    result: "+58% reservas en 2 semanas",
    objective: "Leads",
  },
  {
    src: "/landing/mockup-ad-2.png",
    industry: "Gimnasio",
    title: "Campaña de membresías",
    result: "+40% inscripciones nuevas",
    objective: "Tráfico",
  },
  {
    src: "/landing/mockup-ad-3.png",
    industry: "Moda",
    title: "Campaña de temporada",
    result: "9.4x ROAS en 3 días",
    objective: "Conversiones",
  },
]

const testimonials = [
  {
    name: "Carlos Mendoza",
    role: "Dueño, Iron Gym",
    result: "+40% inscripciones",
    avatar: "CM",
    quote: "Antes perdíamos la mitad de los leads porque nadie los contactaba a tiempo. Con el WhatsApp AI respondemos en segundos. Las inscripciones subieron en dos meses.",
    borderGradient: "from-emerald-400/35 to-teal-600/10",
    shadowBase: "shadow-[0_0_24px_-4px_rgba(16,185,129,0.15)]",
    shadowHover: "hover:shadow-[0_0_32px_-2px_rgba(16,185,129,0.28)]",
    glowRgb: "16,185,129",
    avatarBg: "from-emerald-600/40 to-teal-600/40",
    avatarBorder: "border-emerald-500/30",
    avatarText: "text-emerald-200",
    resultColor: "text-emerald-300",
  },
  {
    name: "Daniela Restrepo",
    role: "Directora, Clínica Bella Piel",
    result: "−35% costo por lead",
    avatar: "DR",
    quote: "El Analizador de Negocio nos ayudó a entender a nuestro cliente ideal mejor que cualquier agencia. Hoy gastamos menos en ads y agendamos más citas.",
    borderGradient: "from-rose-500/35 to-pink-600/10",
    shadowBase: "shadow-[0_0_24px_-4px_rgba(244,63,94,0.15)]",
    shadowHover: "hover:shadow-[0_0_32px_-2px_rgba(244,63,94,0.28)]",
    glowRgb: "244,63,94",
    avatarBg: "from-rose-600/40 to-pink-600/40",
    avatarBorder: "border-rose-500/30",
    avatarText: "text-rose-200",
    resultColor: "text-rose-300",
  },
  {
    name: "Andrés Gómez",
    role: "Fundador, Sabor de Casa",
    result: "5× más rápido",
    avatar: "AG",
    quote: "Lo que antes nos tomaba una semana con el community manager, ahora lo hacemos en una tarde. Copies, campañas y creativos desde la misma plataforma.",
    borderGradient: "from-amber-500/35 to-orange-600/10",
    shadowBase: "shadow-[0_0_24px_-4px_rgba(245,158,11,0.15)]",
    shadowHover: "hover:shadow-[0_0_32px_-2px_rgba(245,158,11,0.28)]",
    glowRgb: "245,158,11",
    avatarBg: "from-amber-600/40 to-orange-600/40",
    avatarBorder: "border-amber-500/30",
    avatarText: "text-amber-200",
    resultColor: "text-amber-300",
  },
]

const plans = [
  {
    name: "Starter",
    price: "$39",
    firstMonth: "$27.30",
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
    borderGradient: "from-slate-400/30 to-gray-500/10",
    shadowBase: "shadow-[0_0_24px_-4px_rgba(148,163,184,0.12)]",
    shadowHover: "hover:shadow-[0_0_32px_-2px_rgba(148,163,184,0.22)]",
  },
  {
    name: "Growth",
    price: "$79",
    firstMonth: "$55.30",
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
    borderGradient: "from-violet-500/60 to-purple-700/30",
    shadowBase: "shadow-[0_0_32px_-4px_rgba(139,92,246,0.28)]",
    shadowHover: "hover:shadow-[0_0_44px_-2px_rgba(139,92,246,0.45)]",
  },
  {
    name: "Scale",
    price: "$199",
    firstMonth: "$139.30",
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
    borderGradient: "from-amber-500/40 to-orange-600/15",
    shadowBase: "shadow-[0_0_24px_-4px_rgba(245,158,11,0.15)]",
    shadowHover: "hover:shadow-[0_0_32px_-2px_rgba(245,158,11,0.30)]",
  },
]

const faqs = [
  {
    q: "¿Necesito saber de marketing o tecnología para usar PRIME GROWTH OS?",
    a: "No. La plataforma está diseñada para dueños de negocio sin experiencia técnica. El Growth Copilot te guía paso a paso y la mayoría de las tareas se generan automáticamente con IA.",
  },
  {
    q: "¿Funciona para mi tipo de negocio?",
    a: "Tenemos playbooks listos para gimnasios, clínicas, restaurantes, inmobiliarias, ecommerce, educación, hoteles, coaches, abogados y constructoras. Si tu industria no está en la lista, el Growth Copilot se adapta igual.",
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
    q: "¿Hay alguna promoción de lanzamiento?",
    a: "Sí. Por tiempo limitado, todos los planes incluyen 30% de descuento en el primer mes. Pagas el precio reducido el mes uno y luego el precio regular a partir del mes dos. Sin contratos ni permanencia mínima.",
  },
]

function AnalyzerMockup() {
  return (
    <div className="bg-[#0e0e1a] border border-white/10 rounded-2xl p-5 space-y-3 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <span className="text-white text-[8px] font-bold">P</span>
        </div>
        <span className="text-gray-400 text-xs">Analizar Negocio</span>
      </div>
      <div>
        <p className="text-gray-600 text-[10px] mb-1">Nombre del negocio</p>
        <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">Iron Gym Medellín</div>
      </div>
      <div>
        <p className="text-gray-600 text-[10px] mb-1">Industria</p>
        <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">Salud y bienestar · Gym</div>
      </div>
      <div>
        <p className="text-gray-600 text-[10px] mb-1">Describe tu negocio</p>
        <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-500 leading-relaxed">
          Gym de alto rendimiento con 3 sedes en Medellín, membresías mensuales...
        </div>
      </div>
      <div className="pt-1">
        <div className="w-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-xl py-2.5 text-center text-white text-xs font-semibold">
          Analizar con IA →
        </div>
      </div>
    </div>
  )
}

function CampaignsMockup() {
  return (
    <div className="bg-[#0e0e1a] border border-white/10 rounded-2xl p-5 space-y-3 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
        <span className="text-gray-400 text-xs">Campañas generadas por IA</span>
        <span className="ml-auto px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded-full font-medium">3 listas</span>
      </div>
      {[
        { name: "Captación de nuevos socios", obj: "Leads", budget: "$25.000", color: "bg-emerald-500/20 text-emerald-300" },
        { name: "Reconocimiento de marca local", obj: "Alcance", budget: "$15.000", color: "bg-blue-500/20 text-blue-300" },
        { name: "Reactivación de ex-clientes", obj: "Tráfico", budget: "$20.000", color: "bg-amber-500/20 text-amber-300" },
      ].map((c) => (
        <div key={c.name} className="bg-white/5 border border-white/[0.08] rounded-xl p-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{c.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${c.color}`}>{c.obj}</span>
              <span className="text-gray-600 text-[10px]">{c.budget}/día</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-violet-600 to-purple-500 rounded-lg px-2.5 py-1 text-[10px] text-white font-semibold whitespace-nowrap">
            Aprobar
          </div>
        </div>
      ))}
    </div>
  )
}

function AnalyticsMockup() {
  return (
    <div className="bg-[#0e0e1a] border border-white/10 rounded-2xl p-5 space-y-3 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
        <span className="text-gray-400 text-xs">ROI & Métricas</span>
        <span className="ml-auto text-gray-600 text-[10px]">últimos 30 días</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Inversión", value: "$3.2M", color: "text-white" },
          { label: "Ventas", value: "$18.5M", color: "text-emerald-300" },
          { label: "ROI", value: "478%", color: "text-emerald-300" },
          { label: "Leads", value: "284", color: "text-violet-300" },
        ].map((m) => (
          <div key={m.label} className="bg-white/5 border border-white/[0.08] rounded-xl p-3">
            <p className="text-gray-600 text-[10px]">{m.label}</p>
            <p className={`text-xl font-black mt-0.5 ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3">
        <p className="text-violet-300 text-[10px] font-semibold mb-1">💡 Recomendación IA</p>
        <p className="text-gray-400 text-[10px] leading-relaxed">Pausa TikTok (3.8x) y aumenta presupuesto en WhatsApp (9.4x ROAS)</p>
      </div>
    </div>
  )
}

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className={`relative rounded-2xl p-[1px] bg-gradient-to-br transition-all duration-300 ${open ? "from-violet-500/40 to-purple-600/15 shadow-[0_0_26px_-4px_rgba(139,92,246,0.25)]" : "from-violet-500/18 to-purple-600/5 shadow-[0_0_16px_-4px_rgba(139,92,246,0.08)] hover:from-violet-500/28 hover:to-purple-600/10 hover:shadow-[0_0_22px_-4px_rgba(139,92,246,0.18)]"}`}>
      <div className="bg-[#0a0a12] rounded-[15px] overflow-hidden">
        <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/[0.02] transition-colors">
          <span className="text-white text-sm font-medium">{q}</span>
          <span className={`text-violet-400 text-xl flex-shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
        </button>
        {open && <p className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{a}</p>}
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % adExamples.length), 4000)
    return () => clearInterval(t)
  }, [])

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

  const ctaGradient = "bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white font-bold shadow-lg shadow-violet-500/30 transition-all active:scale-[0.98]"
  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-colors"

  return (
    <div className="bg-[#0a0a0f] text-white min-h-screen overflow-x-hidden">

      {/* ── Nav — píldora flotante centrada ── */}
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto flex items-center gap-1 px-3 py-2 rounded-full bg-black/65 backdrop-blur-md border border-white/[0.09] shadow-2xl shadow-black/60">

          {/* Logo + pulse dot */}
          <a href="#" className="flex items-center gap-2 pr-3 mr-0.5 border-r border-white/[0.08]">
            <div className="relative flex-shrink-0">
              <Image src="/logo-pg.png" alt="PRIME Growth OS" width={28} height={28} className="w-7 h-7 rounded-xl" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ring-[1.5px] ring-black" />
            </div>
          </a>

          {/* Links — cada uno es una mini-píldora en hover */}
          <div className="hidden md:flex items-center gap-0.5">
            <a href="#problema" className="px-3 py-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/[0.07] transition-all duration-200 text-sm">
              Problema
            </a>
            <a href="#como-funciona" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/[0.07] transition-all duration-200 text-sm">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="opacity-70"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Cómo funciona
            </a>
            <a href="#precios" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/[0.07] transition-all duration-200 text-sm">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
              Precios
            </a>
            <a href="#faq" className="px-3 py-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/[0.07] transition-all duration-200 text-sm">
              FAQ
            </a>
          </div>

          {/* Separador */}
          <div className="hidden md:block w-px h-4 bg-white/[0.09] mx-1" />

          {/* Selector de idioma */}
          <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-500 hover:text-gray-300 hover:bg-white/[0.06] transition-all duration-200 text-xs">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            ES
          </button>

          {/* Sesión — solo visible para visitantes sin sesión iniciada */}
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="px-3 py-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/[0.07] transition-all duration-200 text-sm"
            >
              Iniciar sesión
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/[0.07] transition-all duration-200 text-sm"
            >
              Ir al Dashboard
            </Link>
          </Show>

          {/* CTA — borde gradiente, interior oscuro */}
          <div className="ml-1 p-[1px] rounded-full bg-gradient-to-r from-violet-500 via-purple-400 to-pink-500 shadow-lg shadow-violet-500/25">
            <a href="#contacto" className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#08080f] hover:bg-[#0d0d1c] transition-colors text-white text-xs font-bold whitespace-nowrap">
              🔥 30% OFF
            </a>
          </div>

        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden hero-dots">
        {/* Hero background — mascota + aurora compuestos en una sola imagen */}
        <Image
          src="/landing/hero-background.png"
          alt=""
          fill
          priority
          className="object-cover object-right opacity-80 pointer-events-none select-none"
        />
        {/* Gradient overlay — oscurece el área del titular para legibilidad del texto blanco */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/75 via-[#0a0a0f]/25 to-transparent pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-10 md:pt-28 md:pb-12 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600/10 border border-violet-500/25 text-violet-300 text-xs font-medium mb-8">
            🚀 Plataforma #1 de marketing con IA para LATAM
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
            Tu Director de Marketing
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              con IA, 24/7
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
            La plataforma que reemplaza tu agencia, tu CRM y tu copywriter — con inteligencia artificial hecha para Latinoamérica.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <a href="#contacto" className={`px-9 py-4 rounded-full text-base inline-flex items-center gap-2 ${ctaGradient}`}>
              Empieza con 30% OFF
              <span className="text-violet-200">→</span>
            </a>
            <p className="text-gray-600 text-xs">30% OFF tu primer mes · Cancela cuando quieras</p>
          </div>
        </div>

        {/* Chat mockup + floating stat cards */}
        <div className="relative max-w-2xl mx-auto px-6 pb-24 md:pb-32">
          {/* Floating card — top left · +40% inscripciones */}
          <div className="float-1 hidden sm:flex absolute -left-6 md:-left-16 top-6 z-20 items-center gap-3 bg-[#0b0b17]/90 backdrop-blur-md border border-white/[0.08] rounded-2xl px-4 py-3 shadow-[0_8px_32px_-6px_rgba(16,185,129,0.28),0_4px_20px_-4px_rgba(0,0,0,0.75)]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-600/30">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                <polyline points="16 7 22 7 22 13"/>
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-black leading-none tracking-tight">+40%</p>
              <p className="text-gray-400 text-[10px] mt-1 font-medium">más inscripciones</p>
            </div>
          </div>

          {/* Floating card — bottom right · 9.4x ROAS */}
          <div className="float-2 hidden sm:flex absolute -right-6 md:-right-16 bottom-28 z-20 items-center gap-3 bg-[#0b0b17]/90 backdrop-blur-md border border-white/[0.08] rounded-2xl px-4 py-3 shadow-[0_8px_32px_-6px_rgba(139,92,246,0.32),0_4px_20px_-4px_rgba(0,0,0,0.75)]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-600/30">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-black leading-none tracking-tight">9.4x ROAS</p>
              <p className="text-gray-400 text-[10px] mt-1 font-medium">WhatsApp AI</p>
            </div>
          </div>

          {/* Mockup with 3D perspective tilt */}
          <div
            style={{ transform: "perspective(1400px) rotateX(5deg) rotateY(-3deg)", willChange: "transform" }}
            className="bg-[#0d0d1a]/95 backdrop-blur-sm border border-white/10 rounded-3xl p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),0_0_60px_-10px_rgba(109,40,217,0.15)]"
          >
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/[0.06]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-gray-500 text-xs">Growth Copilot · IA activa</span>
              <div className="ml-auto flex gap-1.5">
                {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/10" />)}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-violet-500/30">
                  <span className="text-white text-[9px] font-bold">P</span>
                </div>
                <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-200">
                  ¡Hola! 👋 Soy tu Growth Copilot. Cuéntame de tu negocio y te armo una estrategia completa en minutos.
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-gradient-to-r from-violet-600 to-purple-500 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white max-w-[75%]">
                  Tengo un gimnasio en Medellín y quiero más inscripciones
                </div>
              </div>
              <div className="flex gap-3 max-w-[90%]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-violet-500/30">
                  <span className="text-white text-[9px] font-bold">P</span>
                </div>
                <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-200">
                  Perfecto 💪 Te recomiendo una campaña con oferta de &quot;primera semana gratis&quot; en Meta Ads + seguimiento automático por WhatsApp. ¿La lanzamos ahora?
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats — Métricas en vivo ── */}
      <section className="py-12 px-6 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          {/* Label bar */}
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span className="text-gray-400 text-sm font-medium">Rendimiento en tiempo real</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-gray-500 cursor-default select-none">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span>Últimos 30 días</span>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </div>
          </div>
          {/* Individual colored cards */}
          <div className="grid grid-cols-3 gap-4">
            {liveStats.map((s, i) => (
              <div
                key={s.num}
                className={`relative rounded-2xl p-[1px] bg-gradient-to-br ${s.borderGradient} ${s.shadowBase} ${s.shadowHover} hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className="relative bg-[#0a0a12] rounded-[15px] px-5 py-5 overflow-hidden h-full">
                  {/* Radial glow bg */}
                  <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 40% 85%, rgba(${s.glowRgb},0.11) 0%, transparent 65%)` }} />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" style={{ background: `radial-gradient(circle at 40% 30%, rgba(${s.glowRgb},0.08) 0%, transparent 60%)` }} />
                  {/* Sparkline */}
                  <svg className="absolute bottom-0 left-0 right-0 w-full pointer-events-none" height="30" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
                    <polyline points={s.sparkPoints} fill="none" stroke={s.sparkColor} strokeWidth="1.5" opacity="0.20" />
                  </svg>
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.iconBg} flex items-center justify-center mb-3 shadow-lg`}>
                      {i === 0 && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      )}
                      {i === 1 && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                          <polyline points="16 7 22 7 22 13"/>
                        </svg>
                      )}
                      {i === 2 && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                          <line x1="7" y1="7" x2="7.01" y2="7"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-3xl md:text-4xl font-black text-white">{s.num}</span>
                      <span className="text-[11px] font-semibold text-emerald-400 whitespace-nowrap">↑ {s.delta}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1.5 leading-snug">{s.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problema ── */}
      <section id="problema" className="relative overflow-hidden">
        <Image
          src="/landing/section-bg-texture-1.png"
          alt=""
          fill
          className="object-cover opacity-[0.07] pointer-events-none select-none"
        />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-violet-400 text-xs font-semibold uppercase tracking-widest">El problema</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 leading-tight">
              La mayoría de los negocios pierde dinero por falta de sistema
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {problems.map((p, i) => (
              <div
                key={p.title}
                className={`relative rounded-2xl p-[1px] bg-gradient-to-br ${problemStyles[i].borderGradient} ${problemStyles[i].shadowBase} ${problemStyles[i].shadowHover} hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className="relative bg-[#0a0a12] rounded-[15px] p-8 overflow-hidden h-full">
                  {/* Hover glow overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 30% 20%, rgba(${problemStyles[i].glowRgb},0.09) 0%, transparent 65%)` }}
                  />
                  {/* Icon */}
                  <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${problemStyles[i].iconBg} flex items-center justify-center mb-5 shadow-lg`}>
                    {i === 0 && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                        <line x1="23" y1="18" x2="17" y2="12"/><line x1="17" y1="18" x2="23" y2="12"/>
                      </svg>
                    )}
                    {i === 1 && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
                      </svg>
                    )}
                    {i === 2 && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    )}
                  </div>
                  <p className="stat-glow text-6xl font-black text-white leading-none mb-1 group-hover:text-violet-300 transition-colors duration-300">
                    {p.stat}
                  </p>
                  <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider mb-5">{p.label}</p>
                  <p className="text-white font-semibold text-sm mb-2">{p.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section id="como-funciona" className="border-t border-white/[0.06] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-700/[0.07] blur-[150px] rounded-full pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center max-w-2xl mx-auto mb-24">
            <span className="text-violet-400 text-xs font-semibold uppercase tracking-widest">Cómo funciona</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 leading-tight">
              De cero a campañas activas a la velocidad de la IA
            </h2>
          </div>
          <div className="space-y-28">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`grid md:grid-cols-2 gap-12 md:gap-20 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div>
                  <p className="text-[8rem] md:text-[10rem] font-black leading-none text-white/[0.05] select-none -mb-6">
                    {step.num}
                  </p>
                  <span className="text-violet-400 text-xs font-semibold uppercase tracking-widest">Paso {step.num}</span>
                  <h3 className="text-2xl md:text-3xl font-black mt-2 mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
                <div>
                  {step.mockup === "analyzer" && <AnalyzerMockup />}
                  {step.mockup === "campaigns" && <CampaignsMockup />}
                  {step.mockup === "analytics" && <AnalyticsMockup />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Módulos ── */}
      <section id="demo" className="border-t border-white/[0.06] relative overflow-hidden">
        <Image
          src="/landing/section-bg-texture-2.png"
          alt=""
          fill
          className="object-cover opacity-[0.06] pointer-events-none select-none"
        />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-violet-400 text-xs font-semibold uppercase tracking-widest">Módulos</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 leading-tight">Todo lo que necesitas en un solo lugar</h2>
            <p className="text-gray-500 mt-4">Activos desde el primer día, sin configuraciones complejas.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {modules.map((m) => (
              <div
                key={m.label}
                className={`relative rounded-2xl p-[1px] bg-gradient-to-br ${m.borderGradient} ${m.shadowBase} ${m.shadowHover} hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className="relative bg-[#0a0a12] rounded-[15px] p-5 overflow-hidden h-full">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: `radial-gradient(circle at 30% 20%, rgba(${m.glowRgb},0.09) 0%, transparent 60%)` }} />
                  <div className={`relative w-10 h-10 rounded-xl ${m.iconBg} border flex items-center justify-center text-lg mb-3 transition-colors`}>{m.icon}</div>
                  <p className="relative text-white font-semibold text-sm">{m.label}</p>
                  <p className="relative text-gray-500 text-xs mt-1.5 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Anuncios IA ── */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-violet-400 text-xs font-semibold uppercase tracking-widest">Creativos con IA</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 leading-tight">
              Campañas listas para publicar en segundos
            </h2>
            <p className="text-gray-500 mt-4">La IA genera el copy, la imagen y la segmentación — tú solo apruebas.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
            {/* Carousel */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl aspect-square shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7),0_0_40px_-8px_rgba(109,40,217,0.15)]">
                {adExamples.map((ad, i) => (
                  <div
                    key={ad.src}
                    className={`absolute inset-0 transition-opacity duration-700 ${i === slide ? "opacity-100" : "opacity-0"}`}
                  >
                    <Image src={ad.src} alt={ad.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-2.5 py-1 bg-violet-600/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full mb-2">
                        {ad.industry}
                      </span>
                      <p className="text-white font-bold text-sm">{ad.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Dots */}
              <div className="flex items-center justify-center gap-2 mt-5">
                {adExamples.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    className={`rounded-full transition-all duration-300 ${i === slide ? "w-6 h-1.5 bg-violet-400" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"}`}
                  />
                ))}
              </div>
            </div>

            {/* Result cards */}
            <div className="space-y-4">
              {adExamples.map((ad, i) => (
                <button
                  key={ad.src}
                  onClick={() => setSlide(i)}
                  className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                    i === slide
                      ? "bg-violet-600/10 border-violet-500/40 shadow-lg shadow-violet-500/5"
                      : "bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.05] hover:border-white/[0.12]"
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold border transition-colors duration-300 ${
                    i === slide ? "bg-violet-600/20 border-violet-500/40 text-violet-300" : "bg-white/[0.05] border-white/[0.08] text-gray-500"
                  }`}>
                    0{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold transition-colors duration-300 ${i === slide ? "text-white" : "text-gray-400"}`}>
                      {ad.industry} — {ad.title}
                    </p>
                    <p className={`text-xs mt-0.5 transition-colors duration-300 ${i === slide ? "text-violet-300" : "text-gray-600"}`}>
                      {ad.result}
                    </p>
                  </div>
                  <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide transition-colors duration-300 ${
                    i === slide ? "bg-violet-600/20 text-violet-300" : "bg-white/[0.05] text-gray-600"
                  }`}>
                    {ad.objective}
                  </span>
                </button>
              ))}

              <div className="pt-2">
                <a
                  href="#contacto"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold ${ctaGradient}`}
                >
                  Genera tus campañas gratis →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section id="testimonios" className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-violet-400 text-xs font-semibold uppercase tracking-widest">Resultados reales</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 leading-tight">
              Negocios que ya están creciendo con PRIME
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className={`relative rounded-2xl p-[1px] bg-gradient-to-br ${t.borderGradient} ${t.shadowBase} ${t.shadowHover} hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className="relative bg-[#0a0a12] rounded-[15px] p-7 flex flex-col overflow-hidden h-full">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, rgba(${t.glowRgb},0.08) 0%, transparent 65%)` }} />
                  <p className={`relative text-4xl font-black leading-none mb-5 ${t.resultColor}`}>{t.result}</p>
                  <div className="relative flex mb-3">
                    {[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-xs">★</span>)}
                  </div>
                  <p className="relative text-gray-400 text-sm leading-relaxed flex-1">&quot;{t.quote}&quot;</p>
                  <div className="relative flex items-center gap-3 mt-6 pt-5 border-t border-white/[0.06]">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.avatarBg} border ${t.avatarBorder} flex items-center justify-center ${t.avatarText} text-xs font-bold flex-shrink-0`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider glow ── */}
      <div className="relative h-36 overflow-hidden pointer-events-none select-none">
        <Image
          src="/landing/section-divider-glow.png"
          alt=""
          fill
          className="object-cover opacity-75"
        />
      </div>

      {/* ── Precios ── */}
      <section id="precios">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-violet-400 text-xs font-semibold uppercase tracking-widest">Planes</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3">Planes simples, sin sorpresas</h2>
            <p className="text-gray-500 mt-4">Cancela cuando quieras. Sin contratos.</p>
          </div>

          {/* Promo banner */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40">
              <span className="text-base">🔥</span>
              <p className="text-amber-300 text-sm font-bold">30% OFF en tu primer mes — oferta por tiempo limitado</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-[1px] bg-gradient-to-b ${plan.borderGradient} ${plan.shadowBase} ${plan.shadowHover} transition-all duration-300`}
              >
                <div className={`relative rounded-[15px] p-7 flex flex-col ${plan.popular ? "bg-[#0f0f1e]" : "bg-[#0a0a12]"}`}>
                  {/* Top badges row */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {plan.popular && (
                      <span className="inline-flex px-3 py-1 bg-gradient-to-r from-violet-600 to-purple-500 text-white text-xs font-bold rounded-full">
                        Más popular
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                      🔥 30% OFF
                    </span>
                  </div>

                  <p className="text-white font-bold text-lg">{plan.name}</p>
                  <p className="text-gray-500 text-xs mt-1">{plan.desc}</p>

                  {/* Price block */}
                  <div className="mt-5 mb-6">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-4xl font-black text-white">{plan.firstMonth}</span>
                      <span className="text-gray-500 text-sm line-through">{plan.price}</span>
                    </div>
                    <p className="text-gray-600 text-xs mt-1.5">
                      primer mes · luego <span className="text-gray-400">{plan.price} USD/mes</span>
                    </p>
                  </div>

                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-gray-300 text-sm">
                        <span className="text-emerald-400 mt-0.5 flex-shrink-0 font-bold text-xs">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePlanClick(plan.name)}
                    className={`w-full mt-7 py-3.5 font-bold rounded-xl text-sm transition-all active:scale-[0.98] ${
                      plan.popular
                        ? ctaGradient
                        : "bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 text-white"
                    }`}
                  >
                    Empieza con 30% OFF →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl mb-12">
            <span className="text-violet-400 text-xs font-semibold uppercase tracking-widest">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3">Preguntas frecuentes</h2>
          </div>
          <div className="max-w-3xl space-y-2">
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
        </div>
      </section>

      {/* ── CTA final ── */}
      <section id="contacto" className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="relative rounded-3xl overflow-hidden border border-violet-500/40 shadow-[0_0_55px_-10px_rgba(139,92,246,0.30)]">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/15 via-purple-600/8 to-transparent" />
            <div className="absolute -top-24 -right-24 w-[450px] h-[450px] bg-violet-600/15 blur-[120px] rounded-full" />
            <div className="relative p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-violet-400 text-xs font-semibold uppercase tracking-widest">Empieza hoy</span>
                <h2 className="text-3xl md:text-4xl font-black mt-3 leading-tight">
                  Transforma tu marketing con IA en las próximas 24 horas
                </h2>
                <p className="text-gray-400 mt-4 leading-relaxed">
                  Déjanos tus datos y un asesor te contacta por WhatsApp para activar tu cuenta y configurar tu Growth Copilot.
                </p>
                <div className="mt-6 space-y-2.5">
                  {["7 días de prueba gratis", "Configuración asistida incluida", "Sin contratos de permanencia"].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-violet-400 text-[10px] font-bold leading-none">✓</span>
                      </div>
                      <span className="text-gray-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-violet-500/40 to-purple-700/20 shadow-[0_0_36px_-6px_rgba(139,92,246,0.28)]">
                <div className="bg-[#0a0a0f] backdrop-blur-sm rounded-[15px] p-6">
                {status === "success" ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
                    <p className="text-white font-bold text-lg">¡Listo! Ya tenemos tus datos</p>
                    <p className="text-gray-500 text-sm mt-2">Un asesor te contacta por WhatsApp muy pronto.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedPlan && (
                      <div className="px-3 py-2 bg-violet-600/15 border border-violet-500/25 rounded-xl">
                        <p className="text-violet-300 text-xs font-medium">Plan seleccionado: <span className="font-bold">{selectedPlan}</span></p>
                      </div>
                    )}
                    <div>
                      <label className="text-gray-400 text-xs font-medium mb-1.5 block">Nombre *</label>
                      <input type="text" placeholder="Juan García" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-medium mb-1.5 block">WhatsApp *</label>
                      <input type="text" placeholder="3001234567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-medium mb-1.5 block">Email</label>
                      <input type="email" placeholder="juan@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
                    </div>
                    {status === "error" && <p className="text-red-400 text-xs">Hubo un error. Intenta de nuevo.</p>}
                    <button
                      onClick={handleSubmit}
                      disabled={status === "submitting" || !form.name.trim() || !form.phone.trim()}
                      className={`w-full mt-1 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50 ${ctaGradient}`}
                    >
                      {status === "submitting" ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Enviando...
                        </>
                      ) : "Quiero mi demo gratis →"}
                    </button>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <Image src="/logo-pg.png" alt="PRIME Growth OS" width={28} height={28} className="w-7 h-7 rounded-lg" />
                <p className="text-white text-sm font-bold">PRIME GROWTH OS</p>
              </div>
              <p className="text-gray-600 text-xs max-w-xs leading-relaxed">
                La plataforma de marketing con IA hecha para pymes latinoamericanas.
              </p>
              <div className="flex items-center gap-2.5 mt-5">
                {[
                  { title: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                  { title: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                ].map((s) => (
                  <a key={s.title} href="#" title={s.title} className="w-8 h-8 rounded-full bg-white/5 border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-white hover:border-violet-500/40 hover:bg-white/10 transition-all">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d={s.path} /></svg>
                  </a>
                ))}
              </div>
            </div>

            <div className="flex gap-14 text-sm">
              <div className="space-y-3">
                <p className="text-white font-bold text-xs uppercase tracking-wider">Producto</p>
                <div className="space-y-2.5">
                  {[["#como-funciona","Cómo funciona"],["#demo","Módulos"],["#precios","Precios"],["#faq","FAQ"]].map(([href, label]) => (
                    <a key={href} href={href} className="block text-gray-500 hover:text-gray-300 transition-colors text-xs">{label}</a>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-white font-bold text-xs uppercase tracking-wider">Legal</p>
                <div className="space-y-2.5">
                  <a href="/privacy" className="block text-gray-500 hover:text-gray-300 transition-colors text-xs">Privacidad</a>
                  <a href="/terms" className="block text-gray-500 hover:text-gray-300 transition-colors text-xs">Términos</a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-gray-600 text-xs">© 2026 PRIME GROWTH OS · Hecho en Latinoamérica</p>
            <a href="#contacto" className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-semibold">Empezar ahora →</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
