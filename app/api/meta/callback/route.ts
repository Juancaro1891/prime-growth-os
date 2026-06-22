import { NextRequest, NextResponse, after } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { META_GRAPH_BASE, upsertMetaAccount, getAdAccounts, getFacebookPages, type MetaAdAccount } from "@/lib/meta"
import { generateBusinessAnalysis, saveBusinessAnalysis } from "@/lib/business-analysis"

// Vercel Pro's platform default (Fluid Compute) is already 300s when unset — this just makes that explicit.
// after() callbacks (enrichAndAnalyze below) run within this same function's duration budget, and that job
// does Graph API calls + a Claude call (generateBusinessAnalysis) + Supabase writes, so 60s was tight.
export const maxDuration = 300

function redirectWithStatus(req: NextRequest, key: "meta_connected" | "meta_error", value: string) {
  const dashboardUrl = new URL("/dashboard-layout/dashboard", req.url)
  dashboardUrl.searchParams.set(key, value)
  const response = NextResponse.redirect(dashboardUrl)
  response.cookies.delete("meta_oauth_state")
  return response
}

// Paso 1 del agente autónomo: lee Páginas + cuenta publicitaria y dispara el análisis con Claude.
// Corre después de responder el redirect del OAuth (vía after()) para no añadirle latencia ni
// poder romper una conexión que, en lo que a Meta respecta, ya quedó establecida correctamente.
async function enrichAndAnalyze(params: {
  userId: string
  accessToken: string
  expiresAt: string | null
  adAccount: MetaAdAccount | undefined
}) {
  const { userId, accessToken, expiresAt, adAccount } = params

  try {
    const pages = await getFacebookPages(accessToken)
    const firstPage = pages?.[0]

    const businessName = firstPage?.name || null
    const businessCategory = firstPage?.category || null
    const businessDescription = firstPage?.about || firstPage?.description || null
    const pageFanCount = typeof firstPage?.fan_count === "number" ? firstPage.fan_count : null

    await upsertMetaAccount({
      user_id: userId,
      access_token: accessToken,
      expires_at: expiresAt,
      ad_account_id: adAccount?.id || null,
      ad_account_name: adAccount?.name || null,
      business_name: businessName,
      business_category: businessCategory,
      business_description: businessDescription,
      page_id: firstPage?.id || null,
      page_fan_count: pageFanCount,
      business_data: { pages, adAccount: adAccount || null },
    })

    const analysis = await generateBusinessAnalysis({
      businessName,
      businessCategory,
      businessDescription,
      pageFanCount,
      adAccountName: adAccount?.name || null,
      currency: adAccount?.currency || null,
      timezoneName: adAccount?.timezone_name || null,
    })

    if (analysis) {
      await saveBusinessAnalysis(userId, analysis)
    }
  } catch (error) {
    console.error("Error en enriquecimiento/análisis automático post-OAuth de Meta:", error)
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const oauthError = searchParams.get("error")

  if (oauthError) {
    console.error("Meta OAuth devolvió un error:", oauthError, searchParams.get("error_description"))
    return redirectWithStatus(req, "meta_error", "access_denied")
  }

  const { userId } = await auth()

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const storedState = req.cookies.get("meta_oauth_state")?.value

  if (!code || !state || !storedState || state !== storedState) {
    console.error("Meta OAuth: state ausente o no coincide (posible CSRF)")
    return redirectWithStatus(req, "meta_error", "invalid_state")
  }

  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET
  const redirectUri = process.env.META_REDIRECT_URI

  if (!appId || !appSecret || !redirectUri) {
    console.error("Faltan META_APP_ID, META_APP_SECRET o META_REDIRECT_URI en este entorno")
    return redirectWithStatus(req, "meta_error", "not_configured")
  }

  try {
    const tokenUrl = new URL(`${META_GRAPH_BASE}/oauth/access_token`)
    tokenUrl.searchParams.set("client_id", appId)
    tokenUrl.searchParams.set("redirect_uri", redirectUri)
    tokenUrl.searchParams.set("client_secret", appSecret)
    tokenUrl.searchParams.set("code", code)

    const tokenResponse = await fetch(tokenUrl)
    const tokenResult = await tokenResponse.json().catch(() => null)

    if (!tokenResponse.ok || !tokenResult?.access_token) {
      console.error("Error intercambiando code por access_token de Meta:", JSON.stringify(tokenResult))
      return redirectWithStatus(req, "meta_error", "token_exchange_failed")
    }

    // Intercambiamos el token de corta duración por uno de larga duración (~60 días).
    const longLivedUrl = new URL(`${META_GRAPH_BASE}/oauth/access_token`)
    longLivedUrl.searchParams.set("grant_type", "fb_exchange_token")
    longLivedUrl.searchParams.set("client_id", appId)
    longLivedUrl.searchParams.set("client_secret", appSecret)
    longLivedUrl.searchParams.set("fb_exchange_token", tokenResult.access_token)

    const longLivedResponse = await fetch(longLivedUrl)
    const longLivedResult = await longLivedResponse.json().catch(() => null)

    const accessToken = longLivedResponse.ok && longLivedResult?.access_token ? longLivedResult.access_token : tokenResult.access_token
    const expiresIn = longLivedResponse.ok && longLivedResult?.expires_in ? longLivedResult.expires_in : tokenResult.expires_in
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : null

    const adAccounts = await getAdAccounts(accessToken)
    const firstAdAccount = adAccounts?.[0]

    const upsertResponse = await upsertMetaAccount({
      user_id: userId,
      access_token: accessToken,
      expires_at: expiresAt,
      ad_account_id: firstAdAccount?.id || null,
      ad_account_name: firstAdAccount?.name || null,
    })

    if (!upsertResponse.ok) {
      console.error("Error guardando la cuenta de Meta en Supabase:", await upsertResponse.text())
      return redirectWithStatus(req, "meta_error", "save_failed")
    }

    after(() => enrichAndAnalyze({ userId, accessToken, expiresAt, adAccount: firstAdAccount }))

    return redirectWithStatus(req, "meta_connected", "true")
  } catch (error) {
    console.error("Error en callback de Meta (excepción):", error)
    return redirectWithStatus(req, "meta_error", "exception")
  }
}
