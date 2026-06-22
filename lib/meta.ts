export const META_GRAPH_VERSION = "v21.0"
export const META_GRAPH_BASE = `https://graph.facebook.com/${META_GRAPH_VERSION}`

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
}

function getSupabaseServiceHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return {
    "apikey": key!,
    "Authorization": `Bearer ${key}`,
    "Content-Type": "application/json",
  }
}

export type MetaAccount = {
  id: string
  user_id: string
  access_token: string
  expires_at: string | null
  ad_account_id: string | null
  ad_account_name: string | null
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
}) {
  const url = getSupabaseUrl()
  const headers = getSupabaseServiceHeaders()

  return fetch(`${url}/rest/v1/meta_accounts?on_conflict=user_id`, {
    method: "POST",
    headers: { ...headers, "Prefer": "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ ...account, updated_at: new Date().toISOString() }),
  })
}
