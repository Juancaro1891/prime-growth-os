import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { deleteMetaAccount } from "@/lib/meta"

export async function DELETE() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const response = await deleteMetaAccount(userId)

  if (!response.ok) {
    console.error("Error desconectando la cuenta de Meta:", await response.text())
    return NextResponse.json({ error: "No se pudo desconectar la cuenta de Meta" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
