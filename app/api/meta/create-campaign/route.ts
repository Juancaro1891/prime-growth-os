import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { META_GRAPH_BASE, getMetaAccount } from "@/lib/meta"
import { getCampaignSuggestion, updateCampaignSuggestion } from "@/lib/campaign-suggestions"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { name, objective, status, specialAdCategories, dailyBudget, suggestionId } = await req.json()

    if (suggestionId) {
      const suggestion = await getCampaignSuggestion(suggestionId, userId)
      if (!suggestion) {
        return NextResponse.json({ error: "No se encontró la campaña sugerida" }, { status: 404 })
      }
    }

    if (!name || !objective) {
      return NextResponse.json({ error: "Faltan datos", details: "name y objective son obligatorios" }, { status: 400 })
    }

    const account = await getMetaAccount(userId)

    if (!account?.access_token || !account.ad_account_id) {
      return NextResponse.json(
        { error: "Cuenta de Meta no conectada", details: "Conecta tu cuenta de Meta Ads en /api/meta/auth antes de crear campañas" },
        { status: 404 }
      )
    }

    // status por defecto PAUSED: crear la campaña no debe arrancar gasto real sin que alguien lo decida explícitamente.
    const body: Record<string, unknown> = {
      name,
      objective,
      status: status || "PAUSED",
      special_ad_categories: specialAdCategories || [],
    }

    if (dailyBudget) {
      body.daily_budget = dailyBudget
    }

    const createUrl = new URL(`${META_GRAPH_BASE}/${account.ad_account_id}/campaigns`)
    createUrl.searchParams.set("access_token", account.access_token)

    const response = await fetch(createUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      console.error("Error creando campaña en Meta:", JSON.stringify(result))
      const details = result?.error?.message || `Meta devolvió HTTP ${response.status} sin detalle`
      return NextResponse.json({ error: "Error al crear la campaña", details }, { status: 500 })
    }

    if (suggestionId) {
      await updateCampaignSuggestion(suggestionId, userId, { status: "launched", meta_campaign_id: result?.id, meta_status: body.status })
    }

    return NextResponse.json({ id: result?.id })
  } catch (error) {
    console.error("Error en POST /api/meta/create-campaign (excepción):", error)
    const details = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Error al crear la campaña", details }, { status: 500 })
  }
}
