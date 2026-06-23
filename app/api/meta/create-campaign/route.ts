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

    console.log("create-campaign: cuenta de Meta encontrada:", {
      hasAccessToken: !!account?.access_token,
      ad_account_id: account?.ad_account_id || null,
    })

    if (!account?.access_token || !account.ad_account_id) {
      console.error("create-campaign: cuenta de Meta no conectada o sin ad_account_id", {
        hasAccessToken: !!account?.access_token,
        ad_account_id: account?.ad_account_id || null,
      })
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

    console.log("create-campaign: ad_account_id usado:", account.ad_account_id, "| body enviado a Meta:", JSON.stringify(body))

    const createUrl = new URL(`${META_GRAPH_BASE}/${account.ad_account_id}/campaigns`)
    createUrl.searchParams.set("access_token", account.access_token)

    const response = await fetch(createUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const rawText = await response.text()

    let result: { id?: string; error?: { message?: string; type?: string; code?: number; error_subcode?: number; error_user_msg?: string; fbtrace_id?: string } } | null = null
    try {
      result = JSON.parse(rawText)
    } catch (parseError) {
      console.error("create-campaign: la respuesta de Meta no es JSON válido:", parseError, "| texto crudo:", rawText)
    }

    // Log completo: ad_account_id usado, status HTTP, y el body de la respuesta de Meta tal cual llegó.
    console.log("create-campaign: Meta respondió", {
      ad_account_id: account.ad_account_id,
      httpStatus: response.status,
      ok: response.ok,
      body: result ?? rawText,
    })

    if (!response.ok) {
      console.error("create-campaign: error creando campaña en Meta", {
        ad_account_id: account.ad_account_id,
        httpStatus: response.status,
        metaError: result?.error ?? null,
        rawText,
      })

      const metaError = result?.error
      const details = metaError
        ? [
            metaError.message,
            metaError.error_user_msg,
            metaError.code != null ? `code: ${metaError.code}` : null,
            metaError.error_subcode != null ? `subcode: ${metaError.error_subcode}` : null,
            metaError.fbtrace_id ? `fbtrace_id: ${metaError.fbtrace_id}` : null,
          ].filter(Boolean).join(" — ")
        : rawText || `Meta devolvió HTTP ${response.status} sin detalle`

      return NextResponse.json({ error: "Error al crear la campaña", details, metaError: metaError ?? null }, { status: 500 })
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
