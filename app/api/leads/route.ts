import { NextRequest, NextResponse } from "next/server"

function getSupabaseHeaders() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  return {
    "apikey": key!,
    "Authorization": `Bearer ${key}`,
    "Content-Type": "application/json",
  }
}

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
}

export async function GET() {
  try {
    const url = getSupabaseUrl()
    const headers = getSupabaseHeaders()

    if (!url || !headers.apikey) {
      return NextResponse.json({ error: "Supabase not configured", url: !!url, key: !!headers.apikey }, { status: 500 })
    }

    const response = await fetch(
      `${url}/rest/v1/leads?select=*&order=created_at.desc`,
      { headers }
    )

    if (!response.ok) {
      const text = await response.text()
      console.error("Error GET leads (Supabase):", text)
      return NextResponse.json({ error: "No se pudieron cargar los leads." }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error GET leads:", error)
    return NextResponse.json({ error: "No se pudieron cargar los leads." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const url = getSupabaseUrl()
    const headers = getSupabaseHeaders()

    const response = await fetch(
      `${url}/rest/v1/leads`,
      {
        method: "POST",
        headers: { ...headers, "Prefer": "return=representation" },
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) {
      const text = await response.text()
      console.error("Error POST leads (Supabase):", text)
      return NextResponse.json({ error: "No se pudo guardar el lead." }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error POST leads:", error)
    return NextResponse.json({ error: "No se pudo guardar el lead." }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json()
    const url = getSupabaseUrl()
    const headers = getSupabaseHeaders()

    const response = await fetch(
      `${url}/rest/v1/leads?id=eq.${id}`,
      {
        method: "PATCH",
        headers: { ...headers, "Prefer": "return=representation" },
        body: JSON.stringify(updates),
      }
    )

    if (!response.ok) {
      const text = await response.text()
      console.error("Error PATCH leads (Supabase):", text)
      return NextResponse.json({ error: "No se pudo actualizar el lead." }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error PATCH leads:", error)
    return NextResponse.json({ error: "No se pudo actualizar el lead." }, { status: 500 })
  }
}
