"use client"

import { useEffect, useState } from "react"

type MetaPage = {
  id: string
  name?: string
  category?: string
  fan_count?: number
}

type MetaAdAccount = {
  id: string
  name?: string
  currency?: string
  timezone_name?: string
}

interface MetaAssetSelectorProps {
  onConfirm: () => void
  onExpired?: () => void
}

export function MetaAssetSelector({ onConfirm, onExpired }: MetaAssetSelectorProps) {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [pages, setPages] = useState<MetaPage[]>([])
  const [adAccounts, setAdAccounts] = useState<MetaAdAccount[]>([])
  const [pageId, setPageId] = useState<string | null>(null)
  const [adAccountId, setAdAccountId] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [confirmError, setConfirmError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/meta/pending-selection")
        if (!res.ok) throw new Error()
        const data = await res.json()
        const loadedPages: MetaPage[] = data.pages || []
        const loadedAdAccounts: MetaAdAccount[] = data.adAccounts || []
        setPages(loadedPages)
        setAdAccounts(loadedAdAccounts)
        if (loadedPages.length === 1) setPageId(loadedPages[0].id)
        if (loadedAdAccounts.length === 1) setAdAccountId(loadedAdAccounts[0].id)
      } catch {
        setLoadError("No pudimos cargar tus páginas y cuentas publicitarias de Meta.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleConfirm() {
    setConfirming(true)
    setConfirmError(null)
    try {
      const res = await fetch("/api/meta/confirm-selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, adAccountId }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        if (body?.code === "no_pending_selection") {
          setConfirmError(body.error || "Tu selección expiró. Reconecta tu cuenta de Meta desde cero.")
          setConfirming(false)
          onExpired?.()
          return
        }
        setConfirmError(body?.error || "No se pudo guardar tu selección. Intenta de nuevo.")
        setConfirming(false)
        return
      }
      onConfirm()
    } catch {
      setConfirmError("No se pudo guardar tu selección. Intenta de nuevo.")
      setConfirming(false)
    }
  }

  const isAutoSelected = pages.length <= 1 && adAccounts.length <= 1

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-sm">Cargando tus páginas y cuentas publicitarias...</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-400 text-sm">{loadError}</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-white text-xl font-bold mb-1">
          {isAutoSelected ? "Confirma tu conexión" : "Elige tu página y cuenta publicitaria"}
        </h2>
        <p className="text-gray-400 text-sm">
          {isAutoSelected
            ? "Detectamos lo siguiente en tu cuenta de Meta. ¿Continuar con esto?"
            : "Tu cuenta de Meta administra varias opciones. Elige con cuál quieres trabajar."}
        </p>
      </div>

      {pages.length > 0 && (
        <div className="space-y-2">
          <p className="text-gray-300 text-sm font-medium">Página de Facebook</p>
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setPageId(page.id)}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all ${
                pageId === page.id
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border flex-shrink-0 ${
                  pageId === page.id ? "border-violet-400 bg-violet-500" : "border-white/30"
                }`}
              />
              <span className="min-w-0">
                <span className="block text-white text-sm font-medium truncate">{page.name || "Página sin nombre"}</span>
                <span className="block text-gray-500 text-xs truncate">
                  {[page.category, typeof page.fan_count === "number" ? `${page.fan_count} seguidores` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {adAccounts.length > 0 && (
        <div className="space-y-2">
          <p className="text-gray-300 text-sm font-medium">Cuenta publicitaria</p>
          {adAccounts.map((account) => (
            <button
              key={account.id}
              onClick={() => setAdAccountId(account.id)}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all ${
                adAccountId === account.id
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border flex-shrink-0 ${
                  adAccountId === account.id ? "border-violet-400 bg-violet-500" : "border-white/30"
                }`}
              />
              <span className="min-w-0">
                <span className="block text-white text-sm font-medium truncate">{account.name || "Cuenta sin nombre"}</span>
                <span className="block text-gray-500 text-xs truncate">
                  {[account.currency, account.timezone_name].filter(Boolean).join(" · ")}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {confirmError && <p className="text-red-400 text-xs">{confirmError}</p>}

      <button
        onClick={handleConfirm}
        disabled={confirming || (pages.length > 0 && !pageId) || (adAccounts.length > 0 && !adAccountId)}
        className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
      >
        {confirming ? "Guardando..." : "Continuar"}
      </button>
    </div>
  )
}
