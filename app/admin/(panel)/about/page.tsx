import type { Metadata } from "next"

import { AboutContentForm, type AboutMediaPreviews } from "@/components/admin/AboutContentForm"
import { AdminSectionCard, ErrorMessage, SuccessMessage } from "@/components/admin/design-system"
import {
  normalizeAboutRow,
  valueCardsFromDb,
  valueSlotsForAdmin,
  whyReasonsFromDb,
  whyReasonSlotsForAdmin,
} from "@/lib/data/about-content-public"
import { formatNewsDate } from "@/lib/format-news-date"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { AboutContentRow } from "@/types/supabase-cms"

export const metadata: Metadata = {
  title: "About Us",
}

function urlFromRows(
  mediaRows: { id: string; public_url: string | null }[] | null | undefined,
  id: string | null | undefined
): string | null {
  if (!id || !mediaRows?.length) return null
  const hit = mediaRows.find((r) => r.id === id)
  return hit?.public_url ?? null
}

async function loadAbout(): Promise<
  | {
      ok: true
      row: AboutContentRow
      previews: AboutMediaPreviews
      valueSlots: ReturnType<typeof valueSlotsForAdmin>
      whyReasonSlots: ReturnType<typeof whyReasonSlotsForAdmin>
    }
  | { ok: false; message: string }
> {
  let supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>
  try {
    supabase = await createSupabaseServerClient()
  } catch {
    return {
      ok: false,
      message:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    }
  }

  const { data: raw, error } = await supabase.from("about_content").select("*").eq("id", 1).maybeSingle()
  if (error) return { ok: false, message: error.message }
  if (!raw) return { ok: false, message: "No about_content row — run Phase 10 migrations." }

  const row = normalizeAboutRow(raw as Record<string, unknown>)

  const mediaIds = [
    row.hero_media_id,
    row.story_media_id,
    row.offer_fuel_media_id,
    row.offer_restaurant_media_id,
    row.offer_playground_media_id,
    row.offer_carwash_media_id,
    row.offer_mini_market_media_id,
    row.gallery_strip_media_id,
    row.gallery_why_us_media_id,
    row.gallery_partnerships_media_id,
    row.owner_media_id,
  ].filter((x): x is string => typeof x === "string" && x.length > 0)

  const previews: AboutMediaPreviews = {
    hero: null,
    story: null,
    offerFuel: null,
    offerRestaurant: null,
    offerPlayground: null,
    offerCarwash: null,
    offerMiniMarket: null,
    galleryStrip: null,
    galleryWhy: null,
    galleryPartner: null,
    owner: null,
  }

  let mediaRows: { id: string; public_url: string | null }[] | null = null
  if (mediaIds.length > 0) {
    const { data: uploads } = await supabase.from("media_uploads").select("id, public_url").in("id", [...new Set(mediaIds)])
    mediaRows = uploads ?? null
    previews.hero = urlFromRows(mediaRows, row.hero_media_id)
    previews.story = urlFromRows(mediaRows, row.story_media_id)
    previews.offerFuel = urlFromRows(mediaRows, row.offer_fuel_media_id)
    previews.offerRestaurant = urlFromRows(mediaRows, row.offer_restaurant_media_id)
    previews.offerPlayground = urlFromRows(mediaRows, row.offer_playground_media_id)
    previews.offerCarwash = urlFromRows(mediaRows, row.offer_carwash_media_id)
    previews.offerMiniMarket = urlFromRows(mediaRows, row.offer_mini_market_media_id)
    previews.galleryStrip = urlFromRows(mediaRows, row.gallery_strip_media_id)
    previews.galleryWhy = urlFromRows(mediaRows, row.gallery_why_us_media_id)
    previews.galleryPartner = urlFromRows(mediaRows, row.gallery_partnerships_media_id)
    previews.owner = urlFromRows(mediaRows, row.owner_media_id)
  }

  const valueSlots = valueSlotsForAdmin(valueCardsFromDb(row.values_json))
  const whyReasonSlots = whyReasonSlotsForAdmin(whyReasonsFromDb(row.why_choose_reasons_json))

  return { ok: true, row, previews, valueSlots, whyReasonSlots }
}

export default async function AdminAboutPage() {
  const result = await loadAbout()

  return (
    <div className="space-y-6">
      {!result.ok ? (
        <ErrorMessage title="About content could not load">
          {result.message}
        </ErrorMessage>
      ) : (
        <>
          <SuccessMessage title="CMS connection">
            Saves revalidate <code className="rounded bg-zinc-900/80 px-1 py-0.5 text-xs">/about</code> automatically.
          </SuccessMessage>
          <AdminSectionCard>
            <p className="text-sm text-[var(--admin-text-muted)]">
              Last updated in CMS{" "}
              <span className="font-medium text-[var(--admin-text)]">{formatNewsDate(result.row.updated_at)}</span>
            </p>
          </AdminSectionCard>
          <AboutContentForm
            key={result.row.updated_at}
            initial={result.row}
            previews={result.previews}
            valueSlots={result.valueSlots}
            whyReasonSlots={result.whyReasonSlots}
          />
        </>
      )}
    </div>
  )
}
