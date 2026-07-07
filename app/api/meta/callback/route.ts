import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { META_GRAPH_BASE, upsertMetaAccount, getAdAccounts, getFacebookPages } from "@/lib/meta"

// Vercel Pro's platform default (Fluid Compute) is already 300s when unset — this just makes that explicit.
// Fetching ad accounts + pages is now done synchronously (needed for the selection screen), so this route
// does a bit more work before responding than it used to.
export const maxDuration = 300

// Este callback corre dentro de la ventana popup abierta por useMetaConnect (ver hooks/use-meta-connect.ts),
// no en la pestaña principal — por eso responde con una página HTML que le avisa el resultado a
// window.opener vía postMessage y se cierra sola, en vez de redirigir a /dashboard-layout/dashboard.
const POPUP_MESSAGE_SOURCE = "prime-meta-oauth"

function popupResponse(payload: { status: "connected" } | { status: "error"; error: string }) {
  const message = JSON.stringify({ source: POPUP_MESSAGE_SOURCE, ...payload })
  const fallbackText =
    payload.status === "error"
      ? "Hubo un problema conectando con Meta. Ya puedes cerrar esta ventana."
      : "Conexión exitosa. Ya puedes cerrar esta ventana."

  const html = `<!doctype html>
<html lang="es">
<head><meta charset="utf-8" /><title>Meta Ads</title></head>
<body style="background:#0a0a0f;color:#fff;font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <p style="opacity:.7;font-size:14px;">${fallbackText}</p>
  <script>
    (function () {
      var payload = ${message};
      if (window.opener) {
        try { window.opener.postMessage(payload, window.location.origin); } catch (e) {}
      }
      window.close();
    })();
  </script>
</body>
</html>`

  const response = new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } })
  response.cookies.delete("meta_oauth_state")
  return response
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const oauthError = searchParams.get("error")

  if (oauthError) {
    console.error("Meta OAuth devolvió un error:", oauthError, searchParams.get("error_description"))
    return popupResponse({ status: "error", error: "access_denied" })
  }

  const { userId } = await auth()

  if (!userId) {
    // No debería dispararse casi nunca con el flujo de popup (la pestaña principal, y su sesión de
    // Clerk, nunca navega fuera del sitio), pero se deja como red de seguridad: si de todas formas
    // Clerk no reconoce la sesión en este request puntual, lo mandamos a /sign-in con un redirect_url
    // de vuelta a esta misma URL — el code/state de Facebook todavía no se ha canjeado en este punto,
    // así que es seguro reintentar este callback una vez Clerk confirme/refresque la sesión.
    const signInUrl = new URL("/sign-in", req.url)
    signInUrl.searchParams.set("redirect_url", req.url)
    return NextResponse.redirect(signInUrl)
  }

  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const storedState = req.cookies.get("meta_oauth_state")?.value

  if (!code || !state || !storedState || state !== storedState) {
    console.error("Meta OAuth: state ausente o no coincide (posible CSRF)")
    return popupResponse({ status: "error", error: "invalid_state" })
  }

  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET
  const redirectUri = process.env.META_REDIRECT_URI

  if (!appId || !appSecret || !redirectUri) {
    console.error("Faltan META_APP_ID, META_APP_SECRET o META_REDIRECT_URI en este entorno")
    return popupResponse({ status: "error", error: "not_configured" })
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
      return popupResponse({ status: "error", error: "token_exchange_failed" })
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

    // Ambas listas se necesitan de una vez para la pantalla de selección, así que se piden
    // síncronamente aquí en vez de en un job en background como antes.
    const [adAccounts, pages] = await Promise.all([getAdAccounts(accessToken), getFacebookPages(accessToken)])

    if (adAccounts.length === 0 && pages.length === 0) {
      console.error("Meta OAuth: la cuenta no tiene páginas ni cuentas publicitarias asociadas")
      return popupResponse({ status: "error", error: "no_assets_found" })
    }

    // Deliberadamente no se envían ad_account_id/page_id/business_* aquí: si el usuario ya tenía una
    // selección confirmada de una conexión anterior, el merge-duplicates de PostgREST la deja intacta
    // hasta que confirm-selection la sobrescriba.
    const upsertResponse = await upsertMetaAccount({
      user_id: userId,
      access_token: accessToken,
      expires_at: expiresAt,
      pending_selection: { pages, adAccounts },
    })

    if (!upsertResponse.ok) {
      console.error("Error guardando la cuenta de Meta en Supabase:", await upsertResponse.text())
      return popupResponse({ status: "error", error: "save_failed" })
    }

    return popupResponse({ status: "connected" })
  } catch (error) {
    console.error("Error en callback de Meta (excepción):", error)
    return popupResponse({ status: "error", error: "exception" })
  }
}
