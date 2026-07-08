"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import { useMetaConnect } from "@/hooks/use-meta-connect"
import { MetaAssetSelector } from "@/components/meta-asset-selector"
import { INDUSTRIES, COUNTRIES } from "@/components/onboarding-modal"

interface Profile {
  business_name: string | null
  industry: string | null
  country: string | null
  city: string | null
  notification_preferences: NotificationPreferences | null
}

interface NotificationPreferences {
  weeklySummary: boolean
  newLeads: boolean
  productUpdates: boolean
}

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  weeklySummary: true,
  newLeads: true,
  productUpdates: true,
}

interface MetaStatus {
  connected: boolean
  pageName: string | null
  adAccountName: string | null
  businessCategory: string | null
}

const META_ERROR_MESSAGES: Record<string, string> = {
  access_denied: "Cancelaste la conexión con Facebook antes de completarla.",
  invalid_state: "Tu sesión de conexión expiró o no es válida. Intenta de nuevo.",
  token_exchange_failed: "Facebook no pudo confirmar la autorización. Intenta de nuevo.",
  no_assets_found: "No encontramos páginas ni cuentas publicitarias en tu cuenta de Facebook.",
  save_failed: "No pudimos guardar tu conexión con Meta. Intenta de nuevo.",
  not_configured: "La conexión con Meta Ads no está disponible en este momento.",
  popup_blocked: "El navegador bloqueó la ventana de conexión. Habilita las ventanas emergentes para este sitio e intenta de nuevo.",
  exception: "Ocurrió un error inesperado conectando con Meta.",
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-white font-semibold text-base mb-1">{title}</h2>
      {description && <p className="text-gray-500 text-xs mb-4">{description}</p>}
      {!description && <div className="mb-4" />}
      {children}
    </div>
  )
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 disabled:opacity-50 ${
        checked ? "bg-violet-600" : "bg-white/10"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )
}

function ProfileSection() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [errors, setErrors] = useState<Partial<Record<"business_name" | "industry" | "country" | "city", string>>>({})
  const [form, setForm] = useState({ business_name: "", industry: "", country: "", city: "" })

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/onboarding")
        if (res.ok) {
          const { profile }: { profile: Profile | null } = await res.json()
          if (profile) {
            setForm({
              business_name: profile.business_name || "",
              industry: profile.industry || "",
              country: profile.country || "",
              city: profile.city || "",
            })
          }
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function validate() {
    const e: Partial<Record<"business_name" | "industry" | "country" | "city", string>> = {}
    if (!form.business_name.trim()) e.business_name = "Requerido"
    if (!form.industry) e.industry = "Requerido"
    if (!form.country) e.country = "Requerido"
    if (!form.city.trim()) e.city = "Requerido"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    setSaved(false)
    setSaveError("")
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSaved(true)
    } catch {
      setSaveError("No se pudieron guardar los cambios. Intenta de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-colors"
  const selectClass =
    "w-full bg-[#0e0e16] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-colors"

  if (loading) return <p className="text-gray-500 text-sm">Cargando...</p>

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-300 text-sm font-medium mb-1.5">Nombre del negocio</label>
        <input
          type="text"
          value={form.business_name}
          onChange={(e) => setForm({ ...form, business_name: e.target.value })}
          className={inputClass}
        />
        {errors.business_name && <p className="text-red-400 text-xs mt-1">{errors.business_name}</p>}
      </div>
      <div>
        <label className="block text-gray-300 text-sm font-medium mb-1.5">Industria</label>
        <select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className={selectClass}>
          <option value="" disabled>Selecciona tu industria</option>
          {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        {errors.industry && <p className="text-red-400 text-xs mt-1">{errors.industry}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-1.5">País</label>
          <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={selectClass}>
            <option value="" disabled>País</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-1.5">Ciudad</label>
          <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
          {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
        {saved && !saving && <span className="text-emerald-400 text-xs">✓ Guardado</span>}
        {saveError && !saving && <span className="text-red-400 text-xs">{saveError}</span>}
      </div>
    </div>
  )
}

function ConnectedAccountsSection() {
  const metaConnect = useMetaConnect()
  const [metaStatus, setMetaStatus] = useState<MetaStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [disconnecting, setDisconnecting] = useState(false)

  async function loadStatus() {
    try {
      const res = await fetch("/api/meta/status")
      if (res.ok) setMetaStatus(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStatus()
  }, [])

  async function handleSelectionConfirmed() {
    await loadStatus()
    metaConnect.reset()
  }

  async function handleDisconnect() {
    const confirmed = window.confirm("¿Seguro que quieres desconectar tu cuenta de Meta Ads? Podrás volver a conectarla cuando quieras.")
    if (!confirmed) return
    setDisconnecting(true)
    await fetch("/api/meta/disconnect", { method: "DELETE" })
    await loadStatus()
    metaConnect.reset()
    setDisconnecting(false)
  }

  if (loading) return <p className="text-gray-500 text-sm">Cargando...</p>

  if (metaConnect.status === "needs_selection") {
    return <MetaAssetSelector onConfirm={handleSelectionConfirmed} />
  }

  if (metaStatus?.connected) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 bg-black/20 border border-white/5 rounded-xl p-4">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1877f2] to-[#0a5dc2] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">f</div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{metaStatus.pageName || "Página conectada"}</p>
            <p className="text-gray-500 text-xs truncate">{metaStatus.adAccountName || "Cuenta publicitaria conectada"}</p>
          </div>
          <span className="ml-auto text-emerald-400 text-xs font-medium flex-shrink-0">🟢 Conectada</span>
        </div>
        {metaConnect.status === "error" && (
          <p className="text-red-400 text-xs">
            {(metaConnect.errorCode && META_ERROR_MESSAGES[metaConnect.errorCode]) || "Ocurrió un error conectando tu cuenta de Meta Ads."}
          </p>
        )}
        <div className="flex items-center gap-3">
          <button
            onClick={metaConnect.connect}
            disabled={metaConnect.status === "connecting" || disconnecting}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 text-gray-300 text-sm font-medium rounded-xl transition-all"
          >
            {metaConnect.status === "connecting" ? "Conectando..." : "Cambiar de página/cuenta"}
          </button>
          <button
            onClick={handleDisconnect}
            disabled={disconnecting || metaConnect.status === "connecting"}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 disabled:opacity-50 text-red-300 text-sm font-medium rounded-xl transition-all"
          >
            {disconnecting ? "Desconectando..." : "Desconectar"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-gray-400 text-sm">No tienes una cuenta de Meta Ads conectada.</p>
      {metaConnect.status === "error" && (
        <p className="text-red-400 text-xs">
          {(metaConnect.errorCode && META_ERROR_MESSAGES[metaConnect.errorCode]) || "Ocurrió un error conectando tu cuenta de Meta Ads."}
        </p>
      )}
      {metaConnect.status === "cancelled" && <p className="text-amber-300 text-xs">Cerraste la ventana antes de terminar. Intenta de nuevo.</p>}
      <button
        onClick={metaConnect.connect}
        disabled={metaConnect.status === "connecting"}
        className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
      >
        {metaConnect.status === "connecting" ? "Conectando..." : "Conectar Meta Ads"}
      </button>
    </div>
  )
}

function BillingSection() {
  return (
    <div className="bg-gradient-to-br from-violet-600/10 to-purple-900/10 border border-violet-500/20 rounded-xl p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-white text-sm font-semibold">Plan Beta</p>
        <p className="text-gray-400 text-xs mt-0.5">Acceso completo mientras estamos en fase beta.</p>
      </div>
      <button disabled className="px-4 py-2 bg-white/5 border border-white/10 text-gray-500 text-sm font-medium rounded-xl cursor-not-allowed flex-shrink-0">
        Próximamente
      </button>
    </div>
  )
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFERENCES)
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [toggleError, setToggleError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/onboarding")
        if (res.ok) {
          const { profile }: { profile: Profile | null } = await res.json()
          if (profile?.notification_preferences) {
            setPrefs({ ...DEFAULT_NOTIFICATION_PREFERENCES, ...profile.notification_preferences })
          }
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleToggle(key: keyof NotificationPreferences) {
    const previous = prefs
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(next)
    setSavingKey(key)
    setToggleError("")
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification_preferences: next }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setPrefs(previous)
      setToggleError("No se pudo guardar el cambio. Intenta de nuevo.")
    } finally {
      setSavingKey(null)
    }
  }

  if (loading) return <p className="text-gray-500 text-sm">Cargando...</p>

  const items: { key: keyof NotificationPreferences; label: string; desc: string }[] = [
    { key: "weeklySummary", label: "Resumen semanal de rendimiento", desc: "Un email cada semana con tus métricas clave" },
    { key: "newLeads", label: "Alertas de leads nuevos", desc: "Te avisamos cuando entra un lead nuevo al CRM" },
    { key: "productUpdates", label: "Actualizaciones de producto", desc: "Novedades y funciones nuevas de PRIME GROWTH OS" },
  ]

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.key} className="flex items-center justify-between gap-4">
          <div>
            <p className="text-white text-sm font-medium">{item.label}</p>
            <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
          </div>
          <Toggle checked={prefs[item.key]} onChange={() => handleToggle(item.key)} disabled={savingKey === item.key} />
        </div>
      ))}
      {toggleError && <p className="text-red-400 text-xs">{toggleError}</p>}
      <p className="text-gray-600 text-xs pt-2 border-t border-white/5">
        Estas preferencias se guardan, pero por ahora la plataforma todavía no envía notificaciones automáticas.
      </p>
    </div>
  )
}

function SignOutSection() {
  const { signOut } = useClerk()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    await signOut()
    router.push("/")
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 disabled:opacity-50 text-red-300 text-sm font-semibold rounded-xl transition-all"
    >
      {loading ? "Cerrando sesión..." : "Cerrar sesión"}
    </button>
  )
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-6 py-4 border-b border-white/10 bg-black/10">
        <h1 className="text-white text-sm font-semibold">Configuración</h1>
        <p className="text-gray-500 text-xs mt-0.5">Tu perfil, cuentas conectadas, plan y preferencias</p>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-5">
          <Section title="Datos del perfil" description="Información de tu negocio usada por la IA para personalizar tu estrategia">
            <ProfileSection />
          </Section>

          <Section title="Cuentas conectadas" description="Estado de tu conexión con Meta Ads">
            <ConnectedAccountsSection />
          </Section>

          <Section title="Plan y facturación">
            <BillingSection />
          </Section>

          <Section title="Notificaciones" description="Preferencias de comunicación">
            <NotificationsSection />
          </Section>

          <Section title="Sesión">
            <SignOutSection />
          </Section>
        </div>
      </div>
    </div>
  )
}
