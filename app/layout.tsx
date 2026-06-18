import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "PRIME GROWTH OS",
  description: "El Director de Marketing con IA para tu empresa",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
