import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { META_GRAPH_BASE, getMetaAccount, isMetaFullyConnected, isMetaAuthError } from "@/lib/meta"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const account = await getMetaAccount(userId)

    if (!isMetaFullyConnected(account)) {
      return NextResponse.json(
        { error: "Cuenta de Meta no conectada", details: "Conecta tu cuenta de Meta Ads en /api/meta/auth antes de ver campañas" },
        { status: 404 }
      )
    }

    const campaignsUrl = new URL(`${META_GRAPH_BASE}/${account.ad_account_id}/campaigns`)
    campaignsUrl.searchParams.set("fields", "id,name,status,objective,daily_budget,lifetime_budget,created_time")
    campaignsUrl.searchParams.set("access_token", account.access_token)

    const response = await fetch(campaignsUrl)
    const result = await response.json().catch(() => null)

    if (!response.ok) {
      console.error("Error listando campañas de Meta:", JSON.stringify(result))

      if (isMetaAuthError(result?.error)) {
        return NextResponse.json(
          { error: "Tu conexión con Meta expiró. Reconéctala para continuar.", code: "meta_auth_expired" },
          { status: 401 }
        )
      }

      return NextResponse.json({ error: "No se pudieron cargar tus campañas de Meta Ads. Intenta de nuevo." }, { status: 500 })
    }

    return NextResponse.json({ campaigns: result?.data || [] })
  } catch (error) {
    console.error("Error en GET /api/meta/campaigns (excepción):", error)
    const details = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Error al listar campañas", details }, { status: 500 })
  }
}
