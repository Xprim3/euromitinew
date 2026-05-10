import type { Metadata } from "next"

import { saveRestaurantContent } from "@/app/admin/(panel)/restaurant/actions"
import { RestaurantContentForm } from "@/components/admin/RestaurantContentForm"
import { galleryDraftsFromRow, menuDraftsFromRow } from "@/lib/data/restaurant-admin-slots"
import { normalizeRestaurantContentRow } from "@/lib/data/restaurant-content-public"
import { formatNewsDate } from "@/lib/format-news-date"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Restaurant",
}

export default async function AdminRestaurantPage() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: raw, error } = await supabase.from("restaurant_content").select("*").eq("id", 1).maybeSingle()

    if (error) {
      return (
        <div className="space-y-6">
          <p role="alert" className="text-red-300 text-sm">
            {error.message}
          </p>
        </div>
      )
    }

    if (!raw) {
      return (
        <div className="space-y-6">
          <p role="alert" className="text-amber-100 text-sm">
            No <code className="rounded bg-zinc-800 px-1">restaurant_content</code> row — run Phase 10 migrations.
          </p>
        </div>
      )
    }

    const row = normalizeRestaurantContentRow(raw as Record<string, unknown>)

    const ids: string[] = []
    if (row.hero_image_media_id) ids.push(row.hero_image_media_id)

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

    if (uniq.length > 0) {
      const { data: uploads } = await supabase.from("media_uploads").select("id, public_url").in("id", uniq)
      for (const u of uploads ?? []) {
        const r = u as { id: string; public_url: string | null }
        if (r.public_url?.trim()) urlMap[r.id] = r.public_url.trim()
      }
    }

    const heroPreviewUrl =
      row.hero_image_media_id && urlMap[row.hero_image_media_id] ? urlMap[row.hero_image_media_id]! : null

    const menuDrafts = menuDraftsFromRow(row, urlMap)
    const galleryDrafts = galleryDraftsFromRow(row, urlMap)

    return (
      <div className="space-y-6">
        <p className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-emerald-100/95 text-sm">
          Saves revalidate <code className="rounded bg-zinc-900/80 px-1 py-0.5 text-xs">/restaurant</code>. Digital menu
          (Skanom), experience pillars, and per-city cards stay static; the “Restaurant desk” band uses hours, phone,
          email, and notes below.
        </p>
        <p className="text-sm text-zinc-500">
          Last updated <span className="text-zinc-400">{formatNewsDate(row.updated_at)}</span>
        </p>
        <RestaurantContentForm
          key={row.updated_at}
          submitAction={saveRestaurantContent}
          initial={row}
          heroPreviewUrl={heroPreviewUrl}
          menuDrafts={menuDrafts}
          galleryDrafts={galleryDrafts}
        />
      </div>
    )
  } catch {
    return (
      <div className="space-y-6">
        <p role="alert" className="text-amber-100 text-sm">
          Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to{" "}
          <code className="rounded bg-zinc-800 px-1">.env.local</code>.
        </p>
      </div>
    )
  }
}
