import type { Metadata } from "next"
import { SignIn } from "@clerk/nextjs"
import { clerkAppearance } from "@/lib/clerk-appearance"

export const metadata: Metadata = {
  title: "Iniciar sesión — PRIME GROWTH OS",
  description: "Inicia sesión para acceder a tu Director de Marketing con IA.",
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
      <SignIn appearance={clerkAppearance} />
    </div>
  )
}
