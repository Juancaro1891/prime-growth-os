import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getMetaAccount, updateCampaignStatus, isMetaFullyConnected, isMetaAuthError } from "@/lib/meta"
import { getCampaignSuggestionByMetaCampaignId, updateCampaignSuggestion } from "@/lib/campaign-suggestions"

const VALID_ACTIONS = ["ACTIVE", "PAUSED"]

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { campaignId, action } = await req.json()

    if (!campaignId || !VALID_ACTIONS.includes(action)) {
      return NextResponse.json({ error: "Faltan datos", details: "campaignId es obligatorio y action debe ser ACTIVE o PAUSED" }, { status: 400 })
    }

    // Confirma que esta campaña de Meta le pertenece al usuario autenticado antes de tocarla — Meta
    // también rechazaría la llamada si el access_token no administra ese campaignId, pero esto evita
    // depender solo de eso (defensa en profundidad, igual que el resto de las rutas de campaign_suggestions).
    const suggestion = await getCampaignSuggestionByMetaCampaignId(campaignId, userId)
    if (!suggestion) {
      return NextResponse.json({ error: "No se encontró esa campaña para tu cuenta" }, { status: 404 })
    }

    const account = await getMetaAccount(userId)

    if (!isMetaFullyConnected(account)) {
      return NextResponse.json({ error: "Cuenta de Meta no conectada" }, { status: 404 })
    }

    const { response, result } = await updateCampaignStatus(account.access_token, campaignId, action)

    if (!response.ok) {
      console.error("Error actualizando estado de campaña en Meta:", JSON.stringify(result))

      if (isMetaAuthError(result?.error)) {
        return NextResponse.json(
          { error: "Tu conexión con Meta expiró. Reconéctala para continuar.", code: "meta_auth_expired" },
          { status: 401 }
        )
      }

      return NextResponse.json({ error: "No se pudo actualizar la campaña. Intenta de nuevo." }, { status: 500 })
    }

    await updateCampaignSuggestion(suggestion.id, userId, { meta_status: action })

    return NextResponse.json({ success: true, status: action })
  } catch (error) {
    console.error("Error en POST /api/meta/toggle-campaign (excepción):", error)
    const details = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Error al actualizar la campaña", details }, { status: 500 })
  }
}
