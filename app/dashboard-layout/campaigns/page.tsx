"use client"

import { useEffect, useRef, useState } from "react"
import { formatCurrency } from "@/lib/utils"

type Suggestion = {
  id: string
  name: string
  objective: string
  daily_budget: number | null
  copy: string
  audience: string
  justification: string
  status: string
  meta_campaign_id: string | null
}

type StatusResponse = {
  connected: boolean
  businessName: string | null
  hasAnalysis: boolean
  suggestions: Suggestion[]
}

type UploadSlotKey = "feed" | "stories" | "banner"
type UploadValue = { file: File; previewUrl: string } | null

const objectiveLabels: Record<string, { label: string; color: string }> = {
  OUTCOME_TRAFFIC: { label: "Tráfico", color: "bg-blue-500/20 text-blue-300" },
  OUTCOME_LEADS: { label: "Leads", color: "bg-emerald-500/20 text-emerald-300" },
  OUTCOME_AWARENESS: { label: "Reconocimiento", color: "bg-amber-500/20 text-amber-300" },
}

const uploadSlots: { key: UploadSlotKey; label: string; dims: string; icon: string; desc: string }[] = [
  { key: "feed", label: "Feed", dims: "1080×1080px", icon: "🖼️", desc: "La imagen principal que aparece en el feed de Facebook e Instagram" },
  { key: "stories", label: "Stories", dims: "1080×1920px", icon: "📱", desc: "Imagen vertical para Stories, ocupa toda la pantalla" },
  { key: "banner", label: "Banner", dims: "1200×628px", icon: "🖥️", desc: "Imagen horizontal para anuncios en Facebook" },
]

const referenceSlots: { key: number; label: string; icon: string; desc: string }[] = [
  { key: 0, label: "Producto", icon: "📦", desc: "Una foto de tu producto o servicio" },
  { key: 1, label: "Tu local", icon: "🏪", desc: "El espacio físico de tu negocio, si aplica" },
  { key: 2, label: "En acción", icon: "✨", desc: "Tu equipo o servicio en uso" },
]

function buildImagePrompt(suggestion: Suggestion, hasLogo: boolean) {
  let prompt = `Fotografía publicitaria profesional para una campaña de marketing en redes sociales. Mensaje del anuncio: "${suggestion.copy}". Audiencia objetivo: ${suggestion.audience || "público general"}. Sin texto superpuesto, sin logos, estética atractiva y realista.`
  if (hasLogo) {
    prompt += " Mantén coherencia con una marca que tiene este logo."
  }
  return prompt
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function Spinner({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function ConnectCard() {
  return (
    <div className="max-w-lg mx-auto bg-gradient-to-br from-violet-600/20 to-purple-900/20 border border-violet-500/20 rounded-2xl p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold mx-auto mb-4">M</div>
      <h2 className="text-white font-semibold text-lg mb-2">Conecta tu cuenta de Meta Ads</h2>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
        Conecta tu página de Facebook y tu cuenta publicitaria para que la IA analice tu negocio y te proponga campañas listas para lanzar.
      </p>
      <button
        onClick={() => { window.location.href = "/api/meta/auth" }}
        className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all active:scale-95"
      >
        Conectar Meta Ads
      </button>
    </div>
  )
}

function GenerateCard({
  businessName,
  hasAnalysis,
  generating,
  error,
  onGenerate,
}: {
  businessName: string | null
  hasAnalysis: boolean
  generating: boolean
  error: string
  onGenerate: () => void
}) {
  return (
    <div className="max-w-lg mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 text-lg font-bold mx-auto mb-4">✓</div>
      <h2 className="text-white font-semibold text-lg mb-2">
        {businessName ? `${businessName} está conectado` : "Meta Ads conectado"}
      </h2>
      <p className="text-gray-400 text-sm mb-2 leading-relaxed">
        Todavía no tienes campañas sugeridas. Deja que la IA analice tu negocio y te proponga 3 campañas listas para lanzar.
      </p>
      {!hasAnalysis && (
        <p className="text-amber-300/80 text-xs mb-2">
          Tu análisis de negocio detallado todavía se está generando — puedes generar campañas ya mismo, la IA usará lo que tenga disponible.
        </p>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-300 text-sm mt-4 mb-2">{error}</div>
      )}
      <button
        onClick={onGenerate}
        disabled={generating}
        className="px-6 py-3 mt-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all active:scale-95 inline-flex items-center gap-2"
      >
        {generating ? (
          <>
            <Spinner /> Generando estrategia...
          </>
        ) : (
          "Generar mi estrategia de campañas con IA"
        )}
      </button>
    </div>
  )
}

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              n === step ? "bg-violet-600 text-white" : n < step ? "bg-violet-600/30 text-violet-300" : "bg-white/10 text-gray-500"
            }`}
          >
            {n}
          </div>
          {n < 3 && <span className="text-gray-600 text-xs">→</span>}
        </div>
      ))}
    </div>
  )
}

function UploadSlotCard({
  icon,
  label,
  dims,
  desc,
  value,
  onChange,
}: {
  icon: string
  label: string
  dims?: string
  desc: string
  value: UploadValue
  onChange: (file: File) => void
}) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const acceptFile = (file: File | undefined) => {
    if (!file) return
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Solo se aceptan JPG o PNG")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Máximo 5MB")
      return
    }
    setError("")
    onChange(file)
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); acceptFile(e.dataTransfer.files?.[0]) }}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer bg-white/5 border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
        dragOver ? "border-violet-500 bg-violet-500/10" : "border-white/10 hover:border-white/20"
      }`}
    >
      <input ref={inputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => acceptFile(e.target.files?.[0])} />
      {value ? (
        <img src={value.previewUrl} alt={label} className="w-full h-28 object-cover rounded-lg mb-2" />
      ) : (
        <div className="text-2xl mb-2">{icon}</div>
      )}
      <p className="text-white text-sm font-medium">{label}</p>
      {dims && <p className="text-gray-500 text-xs">{dims}</p>}
      <p className="text-gray-500 text-xs mt-1 leading-snug">{desc}</p>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      {value && !error && <p className="text-emerald-400 text-xs mt-1">✓ Imagen lista</p>}
    </div>
  )
}

function ImageLightbox({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[60] p-6"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-lg flex items-center justify-center transition-colors"
      >
        ✕
      </button>
      <img
        src={url}
        alt="Imagen generada en tamaño completo"
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full object-contain rounded-lg"
      />
    </div>
  )
}

function LaunchWizardModal({
  suggestion,
  onClose,
  onLaunched,
}: {
  suggestion: Suggestion
  onClose: () => void
  onLaunched: (updated: Suggestion) => void
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [imagePath, setImagePath] = useState<"ai" | "upload" | null>(null)
  const [aiPhase, setAiPhase] = useState<"customize" | "generate">("customize")

  const [referencePhotos, setReferencePhotos] = useState<UploadValue[]>([null, null, null])
  const [logo, setLogo] = useState<UploadValue>(null)

  const [aiImages, setAiImages] = useState<string[]>([])
  const [selectedAiImage, setSelectedAiImage] = useState<string | null>(null)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiError, setAiError] = useState("")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const [uploads, setUploads] = useState<Record<UploadSlotKey, UploadValue>>({ feed: null, stories: null, banner: null })
  const uploadsRef = useRef(uploads)
  uploadsRef.current = uploads
  const referencePhotosRef = useRef(referencePhotos)
  referencePhotosRef.current = referencePhotos
  const logoRef = useRef(logo)
  logoRef.current = logo

  const [launching, setLaunching] = useState(false)
  const [launchError, setLaunchError] = useState("")
  const [launchedDone, setLaunchedDone] = useState(false)
  const [launchedMetaId, setLaunchedMetaId] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      Object.values(uploadsRef.current).forEach((u) => { if (u) URL.revokeObjectURL(u.previewUrl) })
      referencePhotosRef.current.forEach((u) => { if (u) URL.revokeObjectURL(u.previewUrl) })
      if (logoRef.current) URL.revokeObjectURL(logoRef.current.previewUrl)
    }
  }, [])

  const objectiveInfo = objectiveLabels[suggestion.objective] || { label: suggestion.objective, color: "bg-gray-500/20 text-gray-300" }

  const referencePhoto = referencePhotos.find((p) => p != null) || null

  const handleGenerateImages = async () => {
    setAiGenerating(true)
    setAiError("")
    setAiImages([])
    setSelectedAiImage(null)
    try {
      const prompt = buildImagePrompt(suggestion, !!logo)
      const imagePrompt = referencePhoto ? await fileToDataUrl(referencePhoto.file) : undefined
      const results = await Promise.all(
        [0, 1].map(() =>
          fetch("/api/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, size: "1024x1024", style: "Fotorrealista", imagePrompt }),
          }).then(async (r) => ({ ok: r.ok, data: await r.json().catch(() => null) }))
        )
      )

      const urls: string[] = []
      let firstError = ""
      for (const r of results) {
        if (r.ok && r.data?.url) urls.push(r.data.url)
        else firstError = r.data?.details || r.data?.error || firstError
      }

      if (urls.length === 0) throw new Error(firstError || "No se pudo generar ninguna imagen")

      setAiImages(urls)
      setSelectedAiImage(urls[0])
      if (firstError) setAiError(`Una de las imágenes falló: ${firstError}`)
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Hubo un error generando las imágenes.")
    } finally {
      setAiGenerating(false)
    }
  }

  const handleUploadChange = (key: UploadSlotKey, file: File) => {
    setUploads((prev) => {
      const old = prev[key]
      if (old) URL.revokeObjectURL(old.previewUrl)
      return { ...prev, [key]: { file, previewUrl: URL.createObjectURL(file) } }
    })
  }

  const handleReferenceChange = (index: number, file: File) => {
    setReferencePhotos((prev) => {
      const old = prev[index]
      if (old) URL.revokeObjectURL(old.previewUrl)
      const next = [...prev]
      next[index] = { file, previewUrl: URL.createObjectURL(file) }
      return next
    })
  }

  const handleLogoChange = (file: File) => {
    setLogo((prev) => {
      if (prev) URL.revokeObjectURL(prev.previewUrl)
      return { file, previewUrl: URL.createObjectURL(file) }
    })
  }

  const firstUpload = uploadSlots.map((s) => uploads[s.key]).find((u) => u != null) || null
  const hasAnyUpload = firstUpload != null
  const thumbnail = imagePath === "ai" ? selectedAiImage : firstUpload?.previewUrl || null

  const handleConfirmLaunch = async () => {
    setLaunching(true)
    setLaunchError("")
    try {
      const response = await fetch("/api/meta/create-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suggestionId: suggestion.id,
          name: suggestion.name,
          objective: suggestion.objective,
          dailyBudget: suggestion.daily_budget,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.details || data.error || "Error al lanzar la campaña")
      setLaunchedMetaId(data.id || null)
      setLaunchedDone(true)
    } catch (err) {
      setLaunchError(err instanceof Error ? err.message : "Hubo un error lanzando la campaña.")
    } finally {
      setLaunching(false)
    }
  }

  const title = launchedDone
    ? null
    : step === 1
    ? "¿Tienes imágenes para esta campaña?"
    : step === 2 && imagePath === "ai" && aiPhase === "customize"
    ? "Personaliza tus creativos"
    : step === 2 && imagePath === "ai"
    ? "Generemos tus imágenes con IA"
    : step === 2
    ? "Sube tus imágenes"
    : "Todo listo para lanzar"

  return (
    <>
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111118] border border-white/10 rounded-2xl w-full max-w-2xl p-6 max-h-[85vh] overflow-y-auto">
        {!launchedDone && (
          <>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-white font-semibold text-lg">{title}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
            </div>
            <p className="text-gray-500 text-xs mb-4">{suggestion.name}</p>
            <StepIndicator step={step} />
          </>
        )}

        {launchedDone ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-white text-lg font-semibold mb-2">¡Tu campaña se creó en Meta Ads!</p>
            <p className="text-gray-400 text-sm mb-1 max-w-sm mx-auto leading-relaxed">
              &ldquo;{suggestion.name}&rdquo; quedó creada y pausada en tu cuenta de Meta Ads, lista para que la actives cuando quieras desde Meta Ads Manager.
            </p>
            {launchedMetaId && <p className="text-gray-600 text-xs mb-6">ID de campaña: {launchedMetaId}</p>}
            <button
              onClick={() => onLaunched({ ...suggestion, status: "launched", meta_campaign_id: launchedMetaId })}
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all active:scale-95 mt-4"
            >
              Listo
            </button>
          </div>
        ) : step === 1 ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setImagePath("ai"); setAiPhase("customize"); setStep(2) }}
              className="flex flex-col items-center text-center gap-2 p-6 bg-white/5 hover:bg-violet-600/10 border border-white/10 hover:border-violet-500/40 rounded-2xl transition-all active:scale-95"
            >
              <span className="text-4xl">🎨</span>
              <p className="text-white font-medium">Crear con IA</p>
              <p className="text-gray-400 text-xs leading-relaxed">Generamos imágenes profesionales automáticamente basadas en tu campaña</p>
            </button>
            <button
              onClick={() => { setImagePath("upload"); setStep(2) }}
              className="flex flex-col items-center text-center gap-2 p-6 bg-white/5 hover:bg-violet-600/10 border border-white/10 hover:border-violet-500/40 rounded-2xl transition-all active:scale-95"
            >
              <span className="text-4xl">📁</span>
              <p className="text-white font-medium">Subir mis imágenes</p>
              <p className="text-gray-400 text-xs leading-relaxed">Ya tengo fotos o diseños listos para usar</p>
            </button>
          </div>
        ) : step === 2 && imagePath === "ai" && aiPhase === "customize" ? (
          <div>
            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white text-xs mb-3 transition-colors">← Cambiar método</button>

            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              Sube fotos de tu negocio para que las imágenes generadas se parezcan más a tu marca. Si no tienes, las generamos igualmente.
            </p>

            <p className="text-gray-500 text-xs mb-2">Fotos de referencia (opcional, hasta 3)</p>
            <div className="grid grid-cols-3 gap-3">
              {referenceSlots.map((slot) => (
                <UploadSlotCard
                  key={slot.key}
                  icon={slot.icon}
                  label={slot.label}
                  desc={slot.desc}
                  value={referencePhotos[slot.key]}
                  onChange={(file) => handleReferenceChange(slot.key, file)}
                />
              ))}
            </div>

            <p className="text-gray-500 text-xs mb-2 mt-4">Logo de tu marca (opcional)</p>
            <div className="grid grid-cols-3 gap-3">
              <UploadSlotCard
                icon="🔖"
                label="Logo"
                desc="Preferiblemente en PNG, fondo transparente"
                value={logo}
                onChange={handleLogoChange}
              />
            </div>

            <p className="text-gray-500 text-xs mt-3">Formatos: JPG, PNG. Máximo 5MB cada una.</p>

            <button
              onClick={() => setAiPhase("generate")}
              className="w-full py-3 mt-4 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all active:scale-95"
            >
              {referencePhoto || logo ? "Continuar con estas fotos" : "Continuar sin fotos"}
            </button>
          </div>
        ) : step === 2 && imagePath === "ai" ? (
          <div>
            <button onClick={() => setAiPhase("customize")} className="text-gray-500 hover:text-white text-xs mb-3 transition-colors">← Volver a personalizar</button>

            <p className="text-gray-500 text-xs mb-1">Prompt que usaremos</p>
            <div className="bg-black/20 border border-white/10 rounded-xl p-3 text-gray-300 text-sm mb-4 leading-relaxed">
              {buildImagePrompt(suggestion, !!logo)}
            </div>
            {referencePhoto && (
              <div className="flex items-center gap-2 mb-4">
                <img src={referencePhoto.previewUrl} alt="Foto de referencia" className="w-10 h-10 object-cover rounded-lg" />
                <p className="text-gray-500 text-xs">También usaremos esta foto como guía visual del estilo.</p>
              </div>
            )}

            {aiImages.length === 0 && (
              <button
                onClick={handleGenerateImages}
                disabled={aiGenerating}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {aiGenerating ? (
                  <>
                    <Spinner /> Generando imágenes...
                  </>
                ) : (
                  "Generar imágenes"
                )}
              </button>
            )}

            {aiError && <p className="text-red-400 text-xs mt-2">{aiError}</p>}

            {aiImages.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {aiImages.map((url) => (
                    <div
                      key={url}
                      className={`relative rounded-xl overflow-hidden transition-all ${
                        selectedAiImage === url
                          ? "border-4 border-violet-500 shadow-lg shadow-violet-500/30"
                          : "border-2 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <button onClick={() => setLightboxImage(url)} className="block w-full">
                        <img src={url} alt="Imagen generada" className="w-full h-80 object-cover" />
                      </button>
                      <button
                        onClick={() => setSelectedAiImage(url)}
                        className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedAiImage === url ? "bg-violet-600 text-white" : "bg-black/60 hover:bg-black/80 text-gray-200"
                        }`}
                      >
                        {selectedAiImage === url ? "✓ Elegida" : "Elegir"}
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mt-2">Click en una imagen para verla en tamaño completo.</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setStep(3)}
                    disabled={!selectedAiImage}
                    className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
                  >
                    Me gustan, lanzar campaña
                  </button>
                  <button
                    onClick={handleGenerateImages}
                    disabled={aiGenerating}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 text-gray-300 text-sm font-medium rounded-xl transition-all"
                  >
                    Regenerar
                  </button>
                </div>
              </>
            )}
          </div>
        ) : step === 2 && imagePath === "upload" ? (
          <div>
            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white text-xs mb-3 transition-colors">← Cambiar método</button>

            <div className="grid grid-cols-3 gap-3">
              {uploadSlots.map((slot) => (
                <UploadSlotCard
                  key={slot.key}
                  icon={slot.icon}
                  label={slot.label}
                  dims={slot.dims}
                  desc={slot.desc}
                  value={uploads[slot.key]}
                  onChange={(file) => handleUploadChange(slot.key, file)}
                />
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-3">Mínimo 1 imagen requerida. Formatos: JPG, PNG. Máximo 5MB cada una.</p>
            <button
              onClick={() => setStep(3)}
              disabled={!hasAnyUpload}
              className="w-full py-3 mt-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all active:scale-95"
            >
              Continuar con estas imágenes
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4 items-center">
              {thumbnail ? (
                <img src={thumbnail} alt="Miniatura" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-white/10 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{suggestion.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${objectiveInfo.color}`}>{objectiveInfo.label}</span>
                  {suggestion.daily_budget != null && (
                    <span className="text-violet-300 text-xs font-medium">{formatCurrency(suggestion.daily_budget)}/día</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-black/20 border border-white/5 rounded-xl p-3">
              <p className="text-gray-500 text-xs mb-1">Copy del anuncio</p>
              <p className="text-gray-200 text-sm leading-relaxed">&ldquo;{suggestion.copy}&rdquo;</p>
            </div>

            {launchError && <p className="text-red-400 text-xs">{launchError}</p>}

            <button
              onClick={handleConfirmLaunch}
              disabled={launching}
              className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {launching ? (
                <>
                  <Spinner /> Lanzando...
                </>
              ) : (
                "🚀 Lanzar campaña ahora"
              )}
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={launching}
              className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 text-gray-300 text-sm font-medium rounded-xl transition-all"
            >
              Volver y editar
            </button>
          </div>
        )}
      </div>
    </div>
    {lightboxImage && <ImageLightbox url={lightboxImage} onClose={() => setLightboxImage(null)} />}
    </>
  )
}

function SuggestionCard({ suggestion, onUpdate, onLaunchClick }: { suggestion: Suggestion; onUpdate: (s: Suggestion) => void; onLaunchClick: (s: Suggestion) => void }) {
  const [adjustOpen, setAdjustOpen] = useState(false)
  const [instruction, setInstruction] = useState("")
  const [adjusting, setAdjusting] = useState(false)
  const [adjustError, setAdjustError] = useState("")

  const objectiveInfo = objectiveLabels[suggestion.objective] || { label: suggestion.objective, color: "bg-gray-500/20 text-gray-300" }
  const launched = suggestion.status === "launched"

  const handleAdjust = async () => {
    if (!instruction.trim()) return
    setAdjusting(true)
    setAdjustError("")
    try {
      const response = await fetch("/api/meta/adjust-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestionId: suggestion.id, instruction }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.details || data.error || "Error al ajustar la campaña")
      onUpdate(data.suggestion)
      setInstruction("")
      setAdjustOpen(false)
    } catch (err) {
      setAdjustError(err instanceof Error ? err.message : "Hubo un error ajustando la campaña.")
    } finally {
      setAdjusting(false)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-white font-medium text-sm leading-snug">{suggestion.name}</h3>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${objectiveInfo.color}`}>
          {objectiveInfo.label}
        </span>
      </div>

      {suggestion.daily_budget != null && (
        <p className="text-violet-300 text-sm font-medium">{formatCurrency(suggestion.daily_budget)}/día</p>
      )}

      <div className="bg-black/20 border border-white/5 rounded-xl p-3">
        <p className="text-gray-500 text-xs mb-1">Copy del anuncio</p>
        <p className="text-gray-200 text-sm leading-relaxed">&ldquo;{suggestion.copy}&rdquo;</p>
      </div>

      <div>
        <p className="text-gray-500 text-xs mb-1">Audiencia</p>
        <p className="text-gray-300 text-sm">{suggestion.audience}</p>
      </div>

      <div>
        <p className="text-gray-500 text-xs mb-1">Por qué esta campaña</p>
        <p className="text-gray-400 text-sm">{suggestion.justification}</p>
      </div>

      <div className="flex gap-2 mt-auto pt-2">
        <button
          onClick={() => onLaunchClick(suggestion)}
          disabled={launched}
          className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all active:scale-95"
        >
          {launched ? "Lanzada ✅" : "Aprobar y lanzar"}
        </button>
        <button
          onClick={() => setAdjustOpen((v) => !v)}
          disabled={launched}
          className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 text-gray-300 text-sm font-medium rounded-lg transition-all"
        >
          Ajustar con IA
        </button>
      </div>

      {adjustOpen && !launched && (
        <div className="bg-black/20 border border-white/10 rounded-xl p-3 space-y-2">
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Ej: sube el presupuesto a 80.000 y hazlo más agresivo"
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors resize-none"
          />
          {adjustError && <p className="text-red-400 text-xs">{adjustError}</p>}
          <button
            onClick={handleAdjust}
            disabled={adjusting || !instruction.trim()}
            className="w-full py-2 bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/30 disabled:opacity-50 text-violet-200 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {adjusting ? (
              <>
                <Spinner /> Ajustando...
              </>
            ) : (
              "Enviar a la IA"
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default function CampaignsPage() {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [error, setError] = useState("")
  const [generating, setGenerating] = useState(false)
  const [launchTarget, setLaunchTarget] = useState<Suggestion | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadStatus = async () => {
      try {
        const response = await fetch("/api/meta/generate-campaigns")
        const data = await response.json()
        if (!response.ok) throw new Error(data.details || data.error || "Error al cargar el estado")
        if (!cancelled) setStatus(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Hubo un error cargando tus campañas.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadStatus()
    return () => { cancelled = true }
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    setError("")
    try {
      const response = await fetch("/api/meta/generate-campaigns", { method: "POST" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.details || data.error || "Error al generar campañas")
      setStatus((prev) => (prev ? { ...prev, suggestions: data.suggestions } : prev))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hubo un error generando las campañas. Intenta de nuevo.")
    } finally {
      setGenerating(false)
    }
  }

  const updateSuggestion = (updated: Suggestion) => {
    setStatus((prev) => (prev ? { ...prev, suggestions: prev.suggestions.map((s) => (s.id === updated.id ? updated : s)) } : prev))
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/10">
        <div>
          <h1 className="text-white text-sm font-semibold">Campañas</h1>
          <p className="text-gray-500 text-xs mt-0.5">Estrategia de Meta Ads generada por IA a partir de tu negocio</p>
        </div>
        {status?.connected && status.suggestions.length > 0 && (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 text-gray-300 text-sm font-medium rounded-xl transition-all"
          >
            {generating ? <Spinner /> : "↻"} Regenerar todo
          </button>
        )}
      </div>

      <div className="flex-1 p-6">
        {loading && (
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-20">
            <Spinner /> Cargando...
          </div>
        )}

        {!loading && error && !status && (
          <div className="max-w-lg mx-auto bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300 text-sm">{error}</div>
        )}

        {!loading && status && !status.connected && <ConnectCard />}

        {!loading && status && status.connected && status.suggestions.length === 0 && (
          <GenerateCard
            businessName={status.businessName}
            hasAnalysis={status.hasAnalysis}
            generating={generating}
            error={error}
            onGenerate={handleGenerate}
          />
        )}

        {!loading && status && status.connected && status.suggestions.length > 0 && (
          <div className="grid md:grid-cols-3 gap-5">
            {status.suggestions.map((s) => (
              <SuggestionCard key={s.id} suggestion={s} onUpdate={updateSuggestion} onLaunchClick={setLaunchTarget} />
            ))}
          </div>
        )}
      </div>

      {launchTarget && (
        <LaunchWizardModal
          suggestion={launchTarget}
          onClose={() => setLaunchTarget(null)}
          onLaunched={(updated) => { updateSuggestion(updated); setLaunchTarget(null) }}
        />
      )}
    </div>
  )
}
