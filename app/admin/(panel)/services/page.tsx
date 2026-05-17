import type { Metadata } from "next"

import { ServicesContentForm, type ServicesMediaPreviews } from "@/components/admin/ServicesContentForm"
import { ErrorMessage } from "@/components/admin/design-system"
import { normalizeServicesRow } from "@/lib/data/services-content-public"
import { formatNewsDate } from "@/lib/format-news-date"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { ServicesContentRow } from "@/types/supabase-cms"

export const metadata: Metadata = {
  title: "Services",
}

function urlFromRows(
  mediaRows: { id: string; public_url: string | null }[] | null | undefined,
  id: string | null | undefined
): string | null {
  if (!id || !mediaRows?.length) return null
  const hit = mediaRows.find((r) => r.id === id)
  return hit?.public_url ?? null
}

async function loadServices(): Promise<
  | { ok: true; row: ServicesContentRow; previews: ServicesMediaPreviews }
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

  const { data: raw, error } = await supabase.from("services_content").select("*").eq("id", 1).maybeSingle()
  if (error) return { ok: false, message: error.message }
  if (!raw) return { ok: false, message: "No services_content row — run Phase 10 migrations." }

  const row = normalizeServicesRow(raw as Record<string, unknown>)

  const mediaIds = [
    row.hero_page_image_media_id,
    row.petrol_image_media_id,
    row.restaurant_image_media_id,
    row.carwash_image_media_id,
    row.mini_market_image_media_id,
  ].filter((x): x is string => typeof x === "string" && x.length > 0)

  const previews: ServicesMediaPreviews = {
    pageHero: null,
    petrol: null,
    restaurant: null,
    carwash: null,
    miniMarket: null,
  }

  if (mediaIds.length > 0) {
    const { data: uploads } = await supabase
      .from("media_uploads")
      .select("id, public_url")
      .in("id", [...new Set(mediaIds)])
    const mediaRows = uploads ?? null
    previews.pageHero = urlFromRows(mediaRows, row.hero_page_image_media_id)
    previews.petrol = urlFromRows(mediaRows, row.petrol_image_media_id)
    previews.restaurant = urlFromRows(mediaRows, row.restaurant_image_media_id)
    previews.carwash = urlFromRows(mediaRows, row.carwash_image_media_id)
    previews.miniMarket = urlFromRows(mediaRows, row.mini_market_image_media_id)
  }

  return { ok: true, row, previews }
}

export default async function AdminServicesPage() {
  const result = await loadServices()

  return (
    <div className="space-y-6">
      {!result.ok ? (
        <ErrorMessage title="Services content could not load">
          {result.message}
        </ErrorMessage>
      ) : (
        <ServicesContentForm key={result.row.updated_at} initial={result.row} previews={result.previews} />
      )}
    </div>
  )
}
