import Link from "next/link"

export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string
  lastUpdated: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#0a0a0f] text-white min-h-screen flex flex-col">
      <header className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <div className="leading-none">
              <p className="text-sm font-semibold">PRIME</p>
              <p className="text-gray-500 text-xs mt-0.5">Growth OS</p>
            </div>
          </Link>
          <Link href="/landing" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-500 text-sm mb-10">Última actualización: {lastUpdated}</p>
        <div className="space-y-8">{children}</div>
      </main>

      <footer className="border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">P</span>
            </div>
            <p className="text-gray-500 text-xs">PRIME GROWTH OS</p>
          </div>
          <p className="text-gray-600 text-xs">© 2026 PRIME GROWTH OS · Medellín, Colombia</p>
        </div>
      </footer>
    </div>
  )
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      <div className="text-gray-300 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  )
}
