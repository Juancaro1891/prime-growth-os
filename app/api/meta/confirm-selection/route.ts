import { NextRequest, NextResponse, after } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getMetaAccount, upsertMetaAccount } from "@/lib/meta"
import { generateBusinessAnalysis, saveBusinessAnalysis } from "@/lib/business-analysis"

// Mismo margen que el resto de rutas de Meta: esta función solo dispara el análisis vía
// after(), pero el default de Vercel Pro (Fluid Compute) ya cubre esos 300s de sobra.
export const maxDuration = 300

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => null)
  const pageId = body?.pageId
  const adAccountId = body?.adAccountId

  if (!pageId && !adAccountId) {
    return NextResponse.json({ error: "Falta pageId o adAccountId" }, { status: 400 })
  }

  const account = await getMetaAccount(userId)
  const pending = account?.pending_selection

  if (!account || !pending) {
    return NextResponse.json({ error: "No hay una selección pendiente para este usuario" }, { status: 400 })
  }

  const chosenPage = pageId ? pending.pages.find((p) => p.id === pageId) : undefined
  const chosenAdAccount = adAccountId ? pending.adAccounts.find((a) => a.id === adAccountId) : undefined

  if (pageId && !chosenPage) {
    return NextResponse.json({ error: "pageId no pertenece a la selección pendiente de este usuario" }, { status: 400 })
  }
  if (adAccountId && !chosenAdAccount) {
    return NextResponse.json({ error: "adAccountId no pertenece a la selección pendiente de este usuario" }, { status: 400 })
  }

  const businessName = chosenPage?.name || null
  const businessCategory = chosenPage?.category || null
  const businessDescription = chosenPage?.about || chosenPage?.description || null
  const pageFanCount = typeof chosenPage?.fan_count === "number" ? chosenPage.fan_count : null

  const upsertResponse = await upsertMetaAccount({
    user_id: userId,
    access_token: account.access_token,
    expires_at: account.expires_at,
    ad_account_id: chosenAdAccount?.id || null,
    ad_account_name: chosenAdAccount?.name || null,
    page_id: chosenPage?.id || null,
    business_name: businessName,
    business_category: businessCategory,
    business_description: businessDescription,
    page_fan_count: pageFanCount,
    business_data: { pages: pending.pages, adAccount: chosenAdAccount || null },
    pending_selection: null,
  })

  if (!upsertResponse.ok) {
    console.error("Error guardando la selección confirmada de Meta:", await upsertResponse.text())
    return NextResponse.json({ error: "No se pudo guardar la selección" }, { status: 500 })
  }

  after(async () => {
    try {
      const analysis = await generateBusinessAnalysis({
        businessName,
        businessCategory,
        businessDescription,
        pageFanCount,
        adAccountName: chosenAdAccount?.name || null,
        currency: chosenAdAccount?.currency || null,
        timezoneName: chosenAdAccount?.timezone_name || null,
      })

      if (analysis) {
        await saveBusinessAnalysis(userId, analysis)
      }
    } catch (error) {
      console.error("Error en análisis automático post-selección de Meta:", error)
    }
  })

  return NextResponse.json({ ok: true })
}
