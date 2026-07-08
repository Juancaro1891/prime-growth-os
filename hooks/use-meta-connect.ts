"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const POPUP_MESSAGE_SOURCE = "prime-meta-oauth"

export type MetaConnectStatus = "idle" | "connecting" | "needs_selection" | "error" | "cancelled"

interface MetaConnectMessage {
  source: string
  status: "connected" | "error"
  error?: string
}

function isMetaConnectMessage(data: unknown): data is MetaConnectMessage {
  return typeof data === "object" && data !== null && (data as { source?: unknown }).source === POPUP_MESSAGE_SOURCE
}

// Encapsula el flujo de conexión con Meta Ads vía ventana popup: la pestaña principal (y su sesión de
// Clerk) nunca navega fuera del sitio mientras el usuario está en el diálogo de Facebook, evitando que
// la sesión se enfríe durante ese tiempo (ver app/api/meta/callback/route.ts).
export function useMetaConnect() {
  const [status, setStatus] = useState<MetaConnectStatus>("idle")
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const popupRef = useRef<Window | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cleanup = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    popupRef.current = null
  }, [])

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      if (!isMetaConnectMessage(event.data)) return

      cleanup()

      if (event.data.status === "connected") {
        setStatus("needs_selection")
      } else {
        setErrorCode(event.data.error || "exception")
        setStatus("error")
      }
    }

    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
      cleanup()
    }
  }, [cleanup])

  const connect = useCallback(() => {
    setErrorCode(null)
    setStatus("connecting")

    const width = 600
    const height = 700
    const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2)
    const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2)

    let popup: Window | null = null
    try {
      popup = window.open(
        "/api/meta/auth",
        "meta-oauth",
        `width=${width},height=${height},left=${left},top=${top}`
      )
    } catch (error) {
      console.error("window.open lanzó una excepción al abrir el popup de Meta:", error)
      setStatus("error")
      setErrorCode("popup_blocked")
      return
    }

    if (!popup) {
      setStatus("error")
      setErrorCode("popup_blocked")
      return
    }

    popupRef.current = popup
    const openedAt = Date.now()

    pollRef.current = setInterval(() => {
      if (popupRef.current?.closed) {
        cleanup()
        // Algunos bloqueadores de popups abren y cierran la ventana casi de inmediato en vez de
        // hacer que window.open() devuelva null — si se cerró en menos de 1.5s es más probable
        // que haya sido bloqueado que que el usuario alcanzara a cancelar manualmente tan rápido.
        const closedQuickly = Date.now() - openedAt < 1500
        if (closedQuickly) setErrorCode("popup_blocked")
        setStatus((current) => {
          if (current !== "connecting") return current
          return closedQuickly ? "error" : "cancelled"
        })
      }
    }, 500)

    // Si el popup nunca cierra ni manda postMessage (usuario lo deja abierto sin terminar, o
    // Facebook falla de forma silenciosa), no dejar "Conectando..." para siempre. cleanup() ya
    // cancela este timeout apenas llega un mensaje real o se detecta el cierre del popup, así
    // que si este callback llega a ejecutarse es porque seguíamos genuinamente en "connecting".
    timeoutRef.current = setTimeout(() => {
      cleanup()
      setErrorCode("timeout")
      setStatus("error")
    }, 4 * 60 * 1000)
  }, [cleanup])

  const reset = useCallback(() => {
    setStatus("idle")
    setErrorCode(null)
  }, [])

  return { status, errorCode, connect, reset }
}
