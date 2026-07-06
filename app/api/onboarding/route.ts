import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getSupabaseUrl, getSupabaseServiceHeaders } from "@/lib/supabase-admin"

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = getSupabaseUrl()
  const headers = getSupabaseServiceHeaders()

  if (!url || !headers.apikey) {
    return NextResponse.json({ profile: null })
  }

  const response = await fetch(
    `${url}/rest/v1/user_profiles?user_id=eq.${encodeURIComponent(userId)}&select=*&limit=1`,
    { headers }
  )

  if (!response.ok) {
    console.error("Error consultando user_profiles:", await response.text())
    return NextResponse.json({ profile: null })
  }

  const rows = await response.json()
  return NextResponse.json({ profile: rows?.[0] ?? null })
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = getSupabaseUrl()
  const headers = getSupabaseServiceHeaders()

  if (!url || !headers.apikey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }

  const body = await req.json()

  // Only include fields that were explicitly provided to avoid overwriting with nulls on partial updates
  const payload: Record<string, unknown> = {
    user_id: userId,
    onboarding_completed: body.onboarding_completed ?? false,
  }
  if ("business_name" in body) payload.business_name = body.business_name || null
  if ("industry" in body) payload.industry = body.industry || null
  if ("country" in body) payload.country = body.country || null
  if ("city" in body) payload.city = body.city || null

  const response = await fetch(`${url}/rest/v1/user_profiles?on_conflict=user_id`, {
    method: "POST",
    headers: { ...headers, "Prefer": "return=representation,resolution=merge-duplicates" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const text = await response.text()
    console.error("Error guardando user_profiles:", text)
    return NextResponse.json({ error: text }, { status: response.status })
  }

  const data = await response.json()
  return NextResponse.json(data?.[0] ?? payload)
}
