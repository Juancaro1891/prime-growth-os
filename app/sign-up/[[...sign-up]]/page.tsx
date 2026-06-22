import type { Metadata } from "next"
import { SignUp } from "@clerk/nextjs"
import { clerkAppearance } from "@/lib/clerk-appearance"

export const metadata: Metadata = {
  title: "Crear cuenta — PRIME GROWTH OS",
  description: "Crea tu cuenta para acceder a tu Director de Marketing con IA.",
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
      <SignUp appearance={clerkAppearance} />
    </div>
  )
}
