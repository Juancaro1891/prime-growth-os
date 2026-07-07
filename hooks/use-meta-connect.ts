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

  const cleanup = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
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

    const popup = window.open(
      "/api/meta/auth",
      "meta-oauth",
      `width=${width},height=${height},left=${left},top=${top}`
    )

    if (!popup) {
      setStatus("error")
      setErrorCode("popup_blocked")
      return
    }

    popupRef.current = popup

    pollRef.current = setInterval(() => {
      if (popupRef.current?.closed) {
        cleanup()
        setStatus((current) => (current === "connecting" ? "cancelled" : current))
      }
    }, 500)
  }, [cleanup])

  const reset = useCallback(() => {
    setStatus("idle")
    setErrorCode(null)
  }, [])

  return { status, errorCode, connect, reset }
}
