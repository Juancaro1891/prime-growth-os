"use client"

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
        </div>
        <div>
          <h1 className="text-white text-xl font-bold mb-2">Algo salió mal</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Ocurrió un error inesperado. Puedes intentar de nuevo o volver al dashboard.
          </p>
        </div>
        <div className="space-y-2">
          <button
            onClick={reset}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors"
          >
            Reintentar
          </button>
          <a
            href="/dashboard-layout/dashboard"
            className="block w-full py-2 text-gray-400 hover:text-gray-300 text-sm transition-colors"
          >
            Volver al dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
