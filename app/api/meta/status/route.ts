import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getMetaAccount } from "@/lib/meta"

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const account = await getMetaAccount(userId)

  const connected = !!(account?.ad_account_id && account?.page_id)

  return NextResponse.json({
    connected,
    pageId: account?.page_id ?? null,
    pageName: account?.business_name ?? null,
    adAccountId: account?.ad_account_id ?? null,
    adAccountName: account?.ad_account_name ?? null,
    businessCategory: account?.business_category ?? null,
  })
}
