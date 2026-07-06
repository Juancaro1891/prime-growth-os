"use client"

import { useState } from "react"
import { MetaAssetSelector } from "@/components/meta-asset-selector"

const INDUSTRIES = [
  "Restaurante / Alimentos y bebidas",
  "Moda y ropa",
  "Salud y bienestar",
  "Educación y formación",
  "Servicios profesionales",
  "Tecnología y software",
  "Comercio al por menor",
  "Belleza y estética",
  "Inmobiliaria",
  "Entretenimiento y eventos",
  "Viajes y turismo",
  "E-commerce",
  "Construcción",
  "Finanzas y seguros",
  "Otro",
]

const COUNTRIES = [
  "Colombia", "México", "Argentina", "Chile", "Perú", "Ecuador",
  "Venezuela", "Bolivia", "Uruguay", "Paraguay", "Costa Rica",
  "Guatemala", "Honduras", "El Salvador", "Nicaragua", "Panamá",
  "República Dominicana", "Cuba", "Puerto Rico", "España", "Otro",
]

interface BusinessData {
  business_name: string
  industry: string
  country: string
  city: string
}

export type OnboardingStep = 1 | 2 | 3 | "select" | "error" | 4

const META_ERROR_MESSAGES: Record<string, string> = {
  access_denied: "Cancelaste la conexión con Facebook antes de completarla.",
  invalid_state: "Tu sesión de conexión expiró o no es válida. Intenta de nuevo.",
  token_exchange_failed: "Facebook no pudo confirmar la autorización. Intenta de nuevo.",
  no_assets_found: "No encontramos páginas ni cuentas publicitarias en tu cuenta de Facebook.",
  save_failed: "No pudimos guardar tu conexión con Meta. Intenta de nuevo.",
  not_configured: "La conexión con Meta Ads no está disponible en este momento.",
  exception: "Ocurrió un error inesperado conectando con Meta.",
}

interface OnboardingModalProps {
  open: boolean
  initialStep?: OnboardingStep
  metaError?: string | null
  onComplete: () => void
}

export function OnboardingModal({ open, initialStep = 1, metaError = null, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<OnboardingStep>(initialStep)
  const [data, setData] = useState<BusinessData>({ business_name: "", industry: "", country: "", city: "" })
  const [errors, setErrors] = useState<Partial<BusinessData>>({})
  const [saving, setSaving] = useState(false)

  if (!open) return null

  function validate() {
    const e: Partial<BusinessData> = {}
    if (!data.business_name.trim()) e.business_name = "Requerido"
    if (!data.industry) e.industry = "Requerido"
    if (!data.country) e.country = "Requerido"
    if (!data.city.trim()) e.city = "Requerido"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleConnectMeta() {
    setSaving(true)
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, onboarding_completed: false }),
    })
    window.location.href = "/api/meta/auth"
  }

  function handleRetryMeta() {
    window.location.href = "/api/meta/auth"
  }

  async function handleSkip() {
    setSaving(true)
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, onboarding_completed: true }),
    })
    setSaving(false)
    setStep(4)
  }

  async function handleAssetSelectionConfirmed() {
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onboarding_completed: true }),
    })
    setStep(4)
  }

  // No incluye los campos de negocio (a diferencia de handleSkip): este botón es alcanzable
  // directamente desde el paso "error" sin pasar por el formulario del paso 2, así que
  // reenviar `data` vacío pisaría con null un perfil que ya existía.
  async function handleDismissError() {
    setSaving(true)
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onboarding_completed: true }),
    })
    setSaving(false)
    onComplete()
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-colors"
  const selectClass =
    "w-full bg-[#0e0e16] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-colors"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl shadow-black/50">
        {typeof step === "number" && step < 4 && (
          <div className="flex items-center justify-center gap-2 pt-7">
            {([1, 2, 3] as const).map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? "w-8 bg-violet-500" : s < step ? "w-4 bg-violet-400/50" : "w-4 bg-white/10"
                }`}
              />
            ))}
          </div>
        )}

        <div className="p-8">
          {step === 1 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <span className="text-white text-2xl font-bold">P</span>
                </div>
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold mb-2">¡Bienvenido a Prime Growth OS!</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Tu agente de marketing con IA. Vamos a configurar tu cuenta en 3 pasos.
                </p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors"
              >
                Comenzar
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-white text-xl font-bold mb-1">¿Cuál es tu negocio?</h2>
                <p className="text-gray-400 text-sm">Esta información ayuda a la IA a personalizar tu estrategia.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">Nombre del negocio</label>
                  <input
                    type="text"
                    value={data.business_name}
                    onChange={(e) => setData({ ...data, business_name: e.target.value })}
                    placeholder="Ej. Café del Centro"
                    className={inputClass}
                  />
                  {errors.business_name && <p className="text-red-400 text-xs mt-1">{errors.business_name}</p>}
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">Industria</label>
                  <select
                    value={data.industry}
                    onChange={(e) => setData({ ...data, industry: e.target.value })}
                    className={selectClass}
                  >
                    <option value="" disabled>Selecciona tu industria</option>
                    {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                  {errors.industry && <p className="text-red-400 text-xs mt-1">{errors.industry}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">País</label>
                    <select
                      value={data.country}
                      onChange={(e) => setData({ ...data, country: e.target.value })}
                      className={selectClass}
                    >
                      <option value="" disabled>País</option>
                      {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Ciudad</label>
                    <input
                      type="text"
                      value={data.city}
                      onChange={(e) => setData({ ...data, city: e.target.value })}
                      placeholder="Ej. Bogotá"
                      className={inputClass}
                    />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>
                </div>
              </div>
              <button
                onClick={() => { if (validate()) setStep(3) }}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1877f2] to-[#0a5dc2] flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <span className="text-white text-3xl font-bold leading-none">f</span>
                </div>
              </div>
              <div>
                <h2 className="text-white text-xl font-bold mb-2">Conecta tu cuenta de Meta Ads</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Conecta tu Facebook para que la IA analice tu negocio y genere campañas automáticamente.
                </p>
              </div>
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 text-left space-y-2.5">
                {[
                  "Análisis automático de tu negocio con IA",
                  "Campañas personalizadas listas para lanzar",
                  "Optimización continua de tu estrategia",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <span className="text-violet-400 text-sm font-semibold">✓</span>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleConnectMeta}
                  disabled={saving}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
                >
                  {saving ? "Redirigiendo..." : "Conectar Meta Ads"}
                </button>
                <button
                  onClick={handleSkip}
                  disabled={saving}
                  className="w-full py-2 text-gray-400 hover:text-gray-300 text-sm transition-colors"
                >
                  Saltar por ahora
                </button>
              </div>
            </div>
          )}

          {step === "select" && <MetaAssetSelector onConfirm={handleAssetSelectionConfirmed} />}

          {step === "error" && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                  <span className="text-3xl">⚠️</span>
                </div>
              </div>
              <div>
                <h2 className="text-white text-xl font-bold mb-2">No se pudo conectar con Meta</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {(metaError && META_ERROR_MESSAGES[metaError]) || "Ocurrió un error conectando tu cuenta de Meta Ads."}
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleRetryMeta}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors"
                >
                  Reintentar conexión
                </button>
                <button
                  onClick={handleDismissError}
                  disabled={saving}
                  className="w-full py-2 text-gray-400 hover:text-gray-300 text-sm transition-colors"
                >
                  Continuar sin conectar
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-6 py-2">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <span className="text-4xl">✅</span>
                </div>
              </div>
              <div>
                <h2 className="text-white text-2xl font-bold mb-2">¡Todo listo!</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Tu agente de marketing está configurado y listo para ayudarte a crecer.
                </p>
              </div>
              <button
                onClick={onComplete}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors"
              >
                Ir al dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
