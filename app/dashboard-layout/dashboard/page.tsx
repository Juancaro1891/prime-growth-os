"use client"

import { ChatInput } from "@/components/chat-input"
import { ChatMessages } from "@/components/chat-message"
import { OnboardingModal, type OnboardingStep } from "@/components/onboarding-modal"
import { useState, useEffect } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content: `¡Hola! 👋 Soy tu Growth Copilot de PRIME GROWTH OS.

Estoy aquí para ayudarte a hacer crecer tu negocio con inteligencia artificial. Puedo crear campañas publicitarias, generar contenido, analizar tu competencia, construir embudos de ventas y mucho más.

Para empezar, cuéntame: **¿cuál es tu negocio y qué vendes?**

Puedes ser tan detallado como quieras — entre más me cuentes, mejor puedo ayudarte.`,
}

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingInitialStep, setOnboardingInitialStep] = useState<OnboardingStep>(1)
  const [onboardingMetaError, setOnboardingMetaError] = useState<string | null>(null)

  useEffect(() => {
    async function checkOnboarding() {
      try {
        // Returning from the Meta OAuth round-trip — the callback always redirects here with
        // one of these two query params, which reflect the real outcome of the connection.
        const params = new URLSearchParams(window.location.search)
        const metaConnected = params.get("meta_connected")
        const metaError = params.get("meta_error")

        if (metaConnected === "true" || metaError) {
          const url = new URL(window.location.href)
          url.searchParams.delete("meta_connected")
          url.searchParams.delete("meta_error")
          window.history.replaceState({}, "", url.toString())

          if (metaError) {
            setOnboardingMetaError(metaError)
            setOnboardingInitialStep("error")
          } else {
            setOnboardingInitialStep("select")
          }
          setShowOnboarding(true)
          return
        }

        const res = await fetch("/api/onboarding")
        if (!res.ok) return
        const { profile } = await res.json()
        if (!profile || !profile.onboarding_completed) {
          setShowOnboarding(true)
        }
      } catch {
        // Don't block the user if the check fails
      }
    }
    checkOnboarding()
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return
    const userMessage: Message = { role: "user", content: input.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)
    setStreamingContent("")
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      })
      if (!response.ok) throw new Error("Error")
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ""
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          fullContent += decoder.decode(value)
          setStreamingContent(fullContent)
        }
      }
      setMessages((prev) => [...prev, { role: "assistant", content: fullContent }])
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Hubo un error. Por favor intenta de nuevo." }])
    } finally {
      setIsLoading(false)
      setStreamingContent("")
    }
  }

  return (
    <div className="flex flex-col h-full">
      <OnboardingModal
        open={showOnboarding}
        initialStep={onboardingInitialStep}
        metaError={onboardingMetaError}
        onComplete={() => setShowOnboarding(false)}
      />
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/10">
        <div>
          <h1 className="text-white text-sm font-semibold">Growth Copilot</h1>
          <p className="text-gray-500 text-xs mt-0.5">Tu director de marketing con IA</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-gray-500 text-xs">IA activa</span>
        </div>
      </div>
      <ChatMessages messages={messages} streamingContent={streamingContent} isLoading={isLoading} />
      <ChatInput value={input} onChange={setInput} onSend={sendMessage} isLoading={isLoading} />
    </div>
  )
}
