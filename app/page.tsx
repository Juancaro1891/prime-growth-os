import type { Metadata } from "next"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import LandingPage from "@/app/landing/page"

export const metadata: Metadata = {
  title: "PRIME GROWTH OS — El Director de Marketing con IA para tu negocio",
  description:
    "Crea campañas, atiende leads por WhatsApp y mide tu ROI con inteligencia artificial. PRIME GROWTH OS es el sistema operativo de crecimiento para pymes latinoamericanas.",
}

export default async function Home() {
  const { userId } = await auth()
  if (userId) redirect("/dashboard")
  return <LandingPage />
}
