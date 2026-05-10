import type { Metadata } from "next"

import { AboutContentForm, type AboutMediaPreviews } from "@/components/admin/AboutContentForm"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import {
  normalizeAboutRow,
  valueCardsFromDb,
  valueSlotsForAdmin,
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
    row.gallery_strip_media_id,
    row.gallery_why_us_media_id,
    row.gallery_partnerships_media_id,
  ].filter((x): x is string => typeof x === "string" && x.length > 0)

  const previews: AboutMediaPreviews = {
    hero: null,
    story: null,
    galleryStrip: null,
    galleryWhy: null,
    galleryPartner: null,
  }

  let mediaRows: { id: string; public_url: string | null }[] | null = null
  if (mediaIds.length > 0) {
    const { data: uploads } = await supabase.from("media_uploads").select("id, public_url").in("id", [...new Set(mediaIds)])
    mediaRows = uploads ?? null
    previews.hero = urlFromRows(mediaRows, row.hero_media_id)
    previews.story = urlFromRows(mediaRows, row.story_media_id)
    previews.galleryStrip = urlFromRows(mediaRows, row.gallery_strip_media_id)
    previews.galleryWhy = urlFromRows(mediaRows, row.gallery_why_us_media_id)
    previews.galleryPartner = urlFromRows(mediaRows, row.gallery_partnerships_media_id)
  }

  const valueSlots = valueSlotsForAdmin(valueCardsFromDb(row.values_json))

  return { ok: true, row, previews, valueSlots }
}

export default async function AdminAboutPage() {
  const result = await loadAbout()

  return (
    <>
      <AdminPageHeader
        title="About Us page"
        description="Marketing copy & images at `/about` — singleton `about_content` (id = 1)."
      />
      <div className="flex-1 space-y-6 px-6 py-8 md:px-8 lg:px-10">
        {!result.ok ? (
          <p
            role="alert"
            className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-100 text-sm"
          >
            {result.message}
          </p>
        ) : (
          <>
            <p className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-emerald-100/95 text-sm">
              Saves revalidate{" "}
              <code className="rounded bg-zinc-900/80 px-1 py-0.5 text-xs">/about</code> automatically.
            </p>
            <p className="text-sm text-zinc-500">
              Last updated{" "}
              <span className="text-zinc-400">{formatNewsDate(result.row.updated_at)}</span>
            </p>
            <AboutContentForm
              key={result.row.updated_at}
              initial={result.row}
              previews={result.previews}
              valueSlots={result.valueSlots}
            />
          </>
        )}
      </div>
    </>
  )
}
