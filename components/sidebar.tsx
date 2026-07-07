"use client"

import Link from "next/link"
import Image from "next/image"
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
    <aside className="w-56 flex-shrink-0 flex flex-col border-r border-white/[0.06] bg-black/30">
      <div className="px-4 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <Image src="/logo-pg.png" alt="PRIME Growth OS" width={32} height={32} className="w-8 h-8 rounded-xl flex-shrink-0" />
          <div>
            <p className="text-white text-sm font-bold leading-none tracking-wide">PRIME</p>
            <p className="text-gray-600 text-[10px] leading-none mt-0.5 tracking-widest uppercase">Growth OS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? "px-3 text-violet-200 bg-gradient-to-r from-violet-600/20 to-transparent border-l-2 border-violet-500 pl-[10px]"
                  : "px-3 text-gray-500 hover:text-gray-300 hover:bg-white/[0.05]"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-2.5 py-3 border-t border-white/[0.06]">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
            pathname === "/settings" ? "text-violet-200 bg-white/[0.05]" : "text-gray-600 hover:text-gray-300 hover:bg-white/[0.05]"
          }`}
        >
          <span>⚙️</span>
          <span className="font-medium">Configuración</span>
        </Link>
      </div>
    </aside>
  )
}
