export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
}

export function getSupabaseServiceHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return {
    "apikey": key!,
    "Authorization": `Bearer ${key}`,
    "Content-Type": "application/json",
  }
}
