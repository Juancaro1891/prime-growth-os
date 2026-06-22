import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import crypto from "crypto"
import { META_GRAPH_VERSION } from "@/lib/meta"

const META_SCOPES = "ads_management,ads_read,business_management,pages_show_list,pages_read_engagement"

export async function GET(req: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  const appId = process.env.META_APP_ID
  const redirectUri = process.env.META_REDIRECT_URI

  if (!appId || !redirectUri) {
    console.error("META_APP_ID o META_REDIRECT_URI no están configurados en este entorno")
    return NextResponse.json(
      { error: "Meta Ads no está configurado", details: "Falta META_APP_ID o META_REDIRECT_URI en el servidor" },
      { status: 500 }
    )
  }

  const state = crypto.randomBytes(24).toString("hex")

  const authUrl = new URL(`https://www.facebook.com/${META_GRAPH_VERSION}/dialog/oauth`)
  authUrl.searchParams.set("client_id", appId)
  authUrl.searchParams.set("redirect_uri", redirectUri)
  authUrl.searchParams.set("state", state)
  authUrl.searchParams.set("scope", META_SCOPES)
  authUrl.searchParams.set("response_type", "code")

  const response = NextResponse.redirect(authUrl)
  response.cookies.set("meta_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  })

  return response
}
