"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { label: "Growth Copilot", href: "/dashboard", icon: "💬" },
  { label: "Analizar Negocio", href: "/analyzer", icon: "🔍" },
  { label: "Estrategia de Campaña", href: "/strategy", icon: "🎯" },
  { label: "Campañas", href: "/campaigns", icon: "📣" },
  { label: "Creativos & Copies", href: "/creatives", icon: "✍️" },
  { label: "Imágenes IA", href: "/images", icon: "🎨" },
  { label: "Landings", href: "/landings", icon: "🏗️" },
  { label: "WhatsApp AI", href: "/whatsapp", icon: "💚" },
  { label: "CRM", href: "/crm", icon: "👥" },
  { label: "Automatizaciones", href: "/automation", icon: "⚡" },
  { label: "ROI & Métricas", href: "/analytics", icon: "📊" },
  { label: "Playbooks", href: "/playbooks", icon: "📚" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col border-r border-white/10 bg-black/20">
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">PRIME</p>
            <p className="text-gray-500 text-xs leading-none mt-0.5">Growth OS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-300 hover:bg-white/5 cursor-pointer transition-colors">
          <span>⚙️</span> Configuración
        </div>
      </div>
    </aside>
  )
}
