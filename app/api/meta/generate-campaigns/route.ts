import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getMetaAccount } from "@/lib/meta"
import {
  getLatestBusinessAnalysis,
  getCampaignSuggestions,
  generateCampaignSuggestions,
  replacePendingSuggestions,
} from "@/lib/campaign-suggestions"

// Vercel Pro's platform default (Fluid Compute) is already 300s when unset — this just makes that explicit,
// since the POST handler calls Claude (generateCampaignSuggestions) and 60s is tighter than the default.
export const maxDuration = 300

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const account = await getMetaAccount(userId)
    const connected = !!account?.access_token

    if (!connected) {
      return NextResponse.json({ connected: false, businessName: null, hasAnalysis: false, suggestions: [] })
    }

    const analysis = await getLatestBusinessAnalysis(userId)
    // Sin filtro de status: las "launched" deben seguir visibles después de un refresh para poder
    // activarlas/pausarlas desde aquí — solo "Regenerar todo" (POST) sigue tocando únicamente las pending.
    const suggestions = await getCampaignSuggestions(userId)

    return NextResponse.json({
      connected: true,
      businessName: account?.business_name || account?.ad_account_name || null,
      hasAnalysis: !!analysis,
      suggestions,
    })
  } catch (error) {
    console.error("Error en GET /api/meta/generate-campaigns (excepción):", error)
    const details = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Error al consultar el estado de campañas", details }, { status: 500 })
  }
}

export async function POST() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const account = await getMetaAccount(userId)

    if (!account?.access_token) {
      return NextResponse.json(
        { error: "Cuenta de Meta no conectada", details: "Conecta tu cuenta de Meta Ads en /api/meta/auth antes de generar campañas" },
        { status: 404 }
      )
    }

    const analysis = await getLatestBusinessAnalysis(userId)

    const adAccount = (account.business_data as { adAccount?: { currency?: string; timezone_name?: string } } | null)?.adAccount

    const generated = await generateCampaignSuggestions(
      {
        businessName: account.business_name,
        businessCategory: account.business_category,
        businessDescription: account.business_description,
        currency: adAccount?.currency || null,
        timezoneName: adAccount?.timezone_name || null,
      },
      analysis
    )

    if (!generated) {
      return NextResponse.json({ error: "Error al generar las campañas", details: "Claude no devolvió un resultado válido" }, { status: 500 })
    }

    const saved = await replacePendingSuggestions(userId, generated)

    if (!saved) {
      return NextResponse.json({ error: "Error al guardar las campañas generadas" }, { status: 500 })
    }

    return NextResponse.json({ suggestions: saved })
  } catch (error) {
    console.error("Error en POST /api/meta/generate-campaigns (excepción):", error)
    const details = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Error al generar las campañas", details }, { status: 500 })
  }
}
