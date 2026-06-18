"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatMessageProps {
  message: Message
  isStreaming?: boolean
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "flex gap-3 max-w-4xl mx-auto px-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mt-1">
          P
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-violet-600 text-white rounded-tr-sm"
            : "bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-violet-400 animate-pulse ml-0.5 rounded-full" />
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs font-bold mt-1">
          T
        </div>
      )}
    </div>
  )
}

interface ChatMessagesProps {
  messages: Message[]
  streamingContent: string
  isLoading: boolean
}

export function ChatMessages({
  messages,
  streamingContent,
  isLoading,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingContent])

  return (
    <div className="flex-1 overflow-y-auto py-6 space-y-6">
      {messages.map((message, i) => (
        <ChatMessage key={i} message={message} />
      ))}

      {isLoading && streamingContent && (
        <ChatMessage
          message={{ role: "assistant", content: streamingContent }}
          isStreaming={true}
        />
      )}

      {isLoading && !streamingContent && (
        <div className="flex gap-3 max-w-4xl mx-auto px-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mt-1">
            P
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
            <div className="flex gap-1 items-center h-5">
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
