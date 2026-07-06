import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getMetaAccount } from "@/lib/meta"

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const account = await getMetaAccount(userId)
  const pending = account?.pending_selection

  return NextResponse.json({
    pages: pending?.pages || [],
    adAccounts: pending?.adAccounts || [],
  })
}
