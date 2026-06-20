import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Déjanos tus datos — te contactamos",
  description: "Formulario de contacto para que un asesor te contacte por WhatsApp.",
}

export default function LeadCaptureLayout({ children }: { children: React.ReactNode }) {
  return children
}
