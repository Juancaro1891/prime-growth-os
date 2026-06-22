import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getCampaignSuggestion, adjustCampaignSuggestion, updateCampaignSuggestion } from "@/lib/campaign-suggestions"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { suggestionId, instruction } = await req.json()

    if (!suggestionId || !instruction) {
      return NextResponse.json({ error: "Faltan datos", details: "suggestionId e instruction son obligatorios" }, { status: 400 })
    }

    const current = await getCampaignSuggestion(suggestionId, userId)

    if (!current) {
      return NextResponse.json({ error: "No se encontró la campaña sugerida" }, { status: 404 })
    }

    const adjusted = await adjustCampaignSuggestion(current, instruction)

    if (!adjusted) {
      return NextResponse.json({ error: "Error al ajustar la campaña", details: "Claude no devolvió un resultado válido" }, { status: 500 })
    }

    const updated = await updateCampaignSuggestion(suggestionId, userId, {
      name: adjusted.name,
      objective: adjusted.objective,
      daily_budget: adjusted.dailyBudget,
      copy: adjusted.copy,
      audience: adjusted.audience,
      justification: adjusted.justification,
    })

    if (!updated) {
      return NextResponse.json({ error: "Error al guardar el ajuste" }, { status: 500 })
    }

    return NextResponse.json({ suggestion: updated })
  } catch (error) {
    console.error("Error en POST /api/meta/adjust-suggestion (excepción):", error)
    const details = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Error al ajustar la campaña", details }, { status: 500 })
  }
}
