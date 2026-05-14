import type { Metadata } from "next"

import { saveRestaurantContent } from "@/app/admin/(panel)/restaurant/actions"
import { RestaurantContentForm } from "@/components/admin/RestaurantContentForm"
import { AdminSectionCard, ErrorMessage, SuccessMessage } from "@/components/admin/design-system"
import { galleryDraftsFromRow, menuDraftsFromRow, pillarDraftsFromRow } from "@/lib/data/restaurant-admin-slots"
import { normalizeRestaurantContentRow } from "@/lib/data/restaurant-content-public"
import { formatNewsDate } from "@/lib/format-news-date"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { RestaurantContentRow } from "@/types/supabase-cms"

export const metadata: Metadata = {
  title: "Restaurant",
}

async function loadRestaurantContent(): Promise<
  | {
      ok: true
      row: RestaurantContentRow
      heroPreviewUrl: string | null
      editorialPreviewUrl: string | null
      editorialImageAltFromMedia: string | null
      introPreviewUrl: string | null
      introImageAltFromMedia: string | null
      skanomPreviewUrl: string | null
      skanomImageAltFromMedia: string | null
      menuDrafts: ReturnType<typeof menuDraftsFromRow>
      pillarDrafts: ReturnType<typeof pillarDraftsFromRow>
      galleryDrafts: ReturnType<typeof galleryDraftsFromRow>
    }
  | { ok: false; message: string }
> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: raw, error } = await supabase.from("restaurant_content").select("*").eq("id", 1).maybeSingle()

    if (error) return { ok: false, message: error.message }

    if (!raw) {
      return { ok: false, message: "No restaurant_content row — run Phase 10 migrations." }
    }

    const row = normalizeRestaurantContentRow(raw as Record<string, unknown>)

    const ids: string[] = []
    if (row.hero_image_media_id) ids.push(row.hero_image_media_id)
    if (row.editorial_image_media_id) ids.push(row.editorial_image_media_id)
    if (row.intro_image_media_id) ids.push(row.intro_image_media_id)
    if (row.skanom_image_media_id) ids.push(row.skanom_image_media_id)

    const menuHl = Array.isArray(row.menu_highlights_json) ? row.menu_highlights_json : []
    for (const it of menuHl) {
      if (it && typeof it === "object" && "image_media_id" in it) {
        const v = (it as { image_media_id?: unknown }).image_media_id
        if (typeof v === "string" && v.length > 0) ids.push(v)
      }
    }
    if (row.gallery_media_ids?.length) ids.push(...row.gallery_media_ids)

    const uniq = [...new Set(ids)]
    const urlMap: Record<string, string | undefined> = {}
    const altById: Record<string, string | undefined> = {}

    if (uniq.length > 0) {
      const { data: uploads } = await supabase.from("media_uploads").select("id, public_url, alt_text").in("id", uniq)
      for (const u of uploads ?? []) {
        const r = u as { id: string; public_url: string | null; alt_text: string | null }
        const url = r.public_url?.trim()
        if (url) urlMap[r.id] = url
        const alt = r.alt_text?.trim()
        if (alt) altById[r.id] = alt
      }
    }

    const heroPreviewUrl =
      row.hero_image_media_id && urlMap[row.hero_image_media_id] ? urlMap[row.hero_image_media_id]! : null

    const editorialPreviewUrl =
      row.editorial_image_media_id && urlMap[row.editorial_image_media_id]
        ? urlMap[row.editorial_image_media_id]!
        : null
    const editorialImageAltFromMedia = row.editorial_image_media_id
      ? altById[row.editorial_image_media_id] ?? null
      : null

    const introPreviewUrl =
      row.intro_image_media_id && urlMap[row.intro_image_media_id] ? urlMap[row.intro_image_media_id]! : null
    const introImageAltFromMedia = row.intro_image_media_id
      ? altById[row.intro_image_media_id] ?? null
      : null

    const skanomPreviewUrl =
      row.skanom_image_media_id && urlMap[row.skanom_image_media_id] ? urlMap[row.skanom_image_media_id]! : null
    const skanomImageAltFromMedia = row.skanom_image_media_id
      ? altById[row.skanom_image_media_id] ?? null
      : null

    return {
      ok: true,
      row,
      heroPreviewUrl,
      editorialPreviewUrl,
      editorialImageAltFromMedia,
      introPreviewUrl,
      introImageAltFromMedia,
      skanomPreviewUrl,
      skanomImageAltFromMedia,
      menuDrafts: menuDraftsFromRow(row, urlMap),
      pillarDrafts: pillarDraftsFromRow(row),
      galleryDrafts: galleryDraftsFromRow(row, urlMap),
    }
  } catch {
    return {
      ok: false,
      message: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    }
  }
}

export default async function AdminRestaurantPage() {
  const result = await loadRestaurantContent()

  return (
    <div className="space-y-6">
      {!result.ok ? (
        <ErrorMessage title="Restaurant content could not load">{result.message}</ErrorMessage>
      ) : (
        <>
          <SuccessMessage title="Public revalidation">
            Saves revalidate <code className="rounded bg-zinc-900/80 px-1 py-0.5 text-xs">/restaurant</code> automatically.
            Accordion order matches the page top to bottom. Reservation city cards stay mock-only; hero through experience pillars, atmosphere gallery, and desk details are editable below.
          </SuccessMessage>
          <AdminSectionCard>
            <p className="text-sm text-[var(--admin-text-muted)]">
              Last updated <span className="font-medium text-[var(--admin-text)]">{formatNewsDate(result.row.updated_at)}</span>
            </p>
          </AdminSectionCard>
          <RestaurantContentForm
            key={result.row.updated_at}
            submitAction={saveRestaurantContent}
            initial={result.row}
            heroPreviewUrl={result.heroPreviewUrl}
            editorialPreviewUrl={result.editorialPreviewUrl}
            editorialImageAltFromMedia={result.editorialImageAltFromMedia}
            introPreviewUrl={result.introPreviewUrl}
            introImageAltFromMedia={result.introImageAltFromMedia}
            skanomPreviewUrl={result.skanomPreviewUrl}
            skanomImageAltFromMedia={result.skanomImageAltFromMedia}
            menuDrafts={result.menuDrafts}
            pillarDrafts={result.pillarDrafts}
            galleryDrafts={result.galleryDrafts}
          />
        </>
      )}
    </div>
  )
}
