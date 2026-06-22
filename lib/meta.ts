import { getSupabaseUrl, getSupabaseServiceHeaders } from "@/lib/supabase-admin"

export const META_GRAPH_VERSION = "v21.0"
export const META_GRAPH_BASE = `https://graph.facebook.com/${META_GRAPH_VERSION}`

export type MetaAccount = {
  id: string
  user_id: string
  access_token: string
  expires_at: string | null
  ad_account_id: string | null
  ad_account_name: string | null
  business_name: string | null
  business_category: string | null
  business_description: string | null
  page_id: string | null
  page_fan_count: number | null
  business_data: unknown
}

export async function getMetaAccount(userId: string): Promise<MetaAccount | null> {
  const url = getSupabaseUrl()
  const headers = getSupabaseServiceHeaders()

  if (!url || !headers.apikey) {
    console.error("Supabase no está configurado (falta SUPABASE_SERVICE_ROLE_KEY o la URL)")
    return null
  }

  const response = await fetch(
    `${url}/rest/v1/meta_accounts?user_id=eq.${encodeURIComponent(userId)}&select=*&limit=1`,
    { headers }
  )

  if (!response.ok) {
    console.error("Error consultando meta_accounts en Supabase:", await response.text())
    return null
  }

  const rows = await response.json()
  return rows?.[0] || null
}

export async function upsertMetaAccount(account: {
  user_id: string
  access_token: string
  expires_at: string | null
  ad_account_id: string | null
  ad_account_name: string | null
  business_name?: string | null
  business_category?: string | null
  business_description?: string | null
  page_id?: string | null
  page_fan_count?: number | null
  business_data?: unknown
}) {
  const url = getSupabaseUrl()
  const headers = getSupabaseServiceHeaders()

  return fetch(`${url}/rest/v1/meta_accounts?on_conflict=user_id`, {
    method: "POST",
    headers: { ...headers, "Prefer": "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ ...account, updated_at: new Date().toISOString() }),
  })
}

export type MetaAdAccount = {
  id: string
  name?: string
  currency?: string
  timezone_name?: string
}

export async function getAdAccounts(accessToken: string): Promise<MetaAdAccount[]> {
  const url = new URL(`${META_GRAPH_BASE}/me/adaccounts`)
  url.searchParams.set("fields", "id,name,currency,timezone_name")
  url.searchParams.set("access_token", accessToken)

  const response = await fetch(url)
  const result = await response.json().catch(() => null)

  if (!response.ok) {
    console.error("Error obteniendo ad accounts de Meta:", JSON.stringify(result))
    return []
  }

  return result?.data || []
}

export type MetaPage = {
  id: string
  name?: string
  category?: string
  description?: string
  about?: string
  fan_count?: number
  website?: string
}

export async function getFacebookPages(accessToken: string): Promise<MetaPage[]> {
  const url = new URL(`${META_GRAPH_BASE}/me/accounts`)
  url.searchParams.set("fields", "id,name,category,description,about,fan_count,website")
  url.searchParams.set("access_token", accessToken)

  const response = await fetch(url)
  const result = await response.json().catch(() => null)

  if (!response.ok) {
    console.error("Error obteniendo páginas de Facebook (revisa que el token tenga scope pages_show_list/pages_read_engagement):", JSON.stringify(result))
    return []
  }

  return result?.data || []
}
