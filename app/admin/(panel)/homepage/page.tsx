import type { Metadata } from "next"

import type { HomepageLocationPreviewAdmin, HomepageMediaPreviews } from "@/components/admin/HomepageContentForm"
import { HomepageContentForm } from "@/components/admin/HomepageContentForm"
import { AdminSectionCard, ErrorMessage, SuccessMessage } from "@/components/admin/design-system"
import { homepageContentRowFromUnknown } from "@/lib/data/homepage-singleton-public"
import { normalizeLocationRow } from "@/lib/data/locations-admin-shared"
import { formatNewsDate } from "@/lib/format-news-date"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { HomepageContentRow } from "@/types/supabase-cms"

export const metadata: Metadata = {
  title: "Homepage",
}

async function loadHomepage(): Promise<
  | { ok: true; row: HomepageContentRow; previews: HomepageMediaPreviews; locationPreviews: HomepageLocationPreviewAdmin[] }
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

  const { data: row, error } = await supabase.from("homepage_content").select("*").eq("id", 1).maybeSingle()

  if (error) {
    return { ok: false, message: error.message }
  }
  if (!row) {
    return {
      ok: false,
      message: "No homepage_content row with id = 1. Apply Supabase migrations (Phase 10 editorial tables).",
    }
  }

  const typed = homepageContentRowFromUnknown(row as Record<string, unknown>)
  const { data: locationRows } = await supabase
    .from("locations")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(3)

  const locations = (locationRows ?? []).map((loc) => normalizeLocationRow(loc as Record<string, unknown>))

  const mediaIds = [
    typed.hero_image_media_id,
    typed.about_preview_image_media_id,
    typed.services_intro_media_id,
    typed.restaurant_home_main_media_id,
    typed.restaurant_home_float_1_media_id,
    typed.restaurant_home_float_2_media_id,
    typed.carwash_intro_media_id,
    typed.playground_intro_media_id,
    typed.mini_market_intro_media_id,
    ...locations.map((loc) => loc.main_media_id),
  ].filter((x): x is string => typeof x === "string" && x.length > 0)

  const previews: HomepageMediaPreviews = {
    hero: null,
    about: null,
    servicesIntro: null,
    restaurantMain: null,
    restaurantFloat1: null,
    restaurantFloat2: null,
    carwash: null,
    playground: null,
    miniMarket: null,
  }

  if (mediaIds.length > 0) {
    const { data: mediaRows } = await supabase.from("media_uploads").select("id, public_url, alt_text").in("id", mediaIds)

    const urlOf = (id: string | null) => {
      if (!id) return null
      const hit = mediaRows?.find((m: { id: string }) => m.id === id) as { public_url: string } | undefined
      return hit?.public_url ?? null
    }
    const altOf = (id: string | null) => {
      if (!id) return ""
      const hit = mediaRows?.find((m: { id: string }) => m.id === id) as { alt_text: string | null } | undefined
      return hit?.alt_text ?? ""
    }

    previews.hero = urlOf(typed.hero_image_media_id)
    previews.about = urlOf(typed.about_preview_image_media_id)
    previews.servicesIntro = urlOf(typed.services_intro_media_id)
    previews.restaurantMain = urlOf(typed.restaurant_home_main_media_id)
    previews.restaurantFloat1 = urlOf(typed.restaurant_home_float_1_media_id)
    previews.restaurantFloat2 = urlOf(typed.restaurant_home_float_2_media_id)
    previews.carwash = urlOf(typed.carwash_intro_media_id)
    previews.playground = urlOf(typed.playground_intro_media_id)
    previews.miniMarket = urlOf(typed.mini_market_intro_media_id)

    const locationPreviews = locations.map((loc) => ({
      id: loc.id,
      city: loc.city,
      address: loc.address,
      mainMediaId: loc.main_media_id,
      imageUrl: urlOf(loc.main_media_id),
      imageAlt: altOf(loc.main_media_id),
    }))

    return { ok: true, row: typed, previews, locationPreviews }
  }

  const locationPreviews = locations.map((loc) => ({
    id: loc.id,
    city: loc.city,
    address: loc.address,
    mainMediaId: loc.main_media_id,
    imageUrl: null,
    imageAlt: "",
  }))

  return { ok: true, row: typed, previews, locationPreviews }
}

export default async function AdminHomepagePage() {
  const result = await loadHomepage()

  return (
    <div className="space-y-6">
        <SuccessMessage title="CMS connection">
          The public homepage reads from <code className="rounded bg-zinc-900/80 px-1 py-0.5 text-xs">homepage_content</code>,{" "}
          <code className="rounded bg-zinc-900/80 px-1 py-0.5 text-xs">fuel_prices</code>, and{" "}
          <code className="rounded bg-zinc-900/80 px-1 py-0.5 text-xs">locations</code> (preview cards). Saving here
          revalidates the home route.
        </SuccessMessage>

        {!result.ok ? (
          <ErrorMessage title="Homepage content could not load">
            {result.message}
          </ErrorMessage>
        ) : (
          <>
            <AdminSectionCard>
              <p className="text-sm text-[var(--admin-text-muted)]">
                Last updated in CMS <span className="font-medium text-[var(--admin-text)]">{formatNewsDate(result.row.updated_at)}</span>
              </p>
            </AdminSectionCard>
            <HomepageContentForm
              key={result.row.updated_at}
              initial={result.row}
              mediaPreviews={result.previews}
              locationPreviews={result.locationPreviews}
            />
          </>
        )}
    </div>
  )
}
