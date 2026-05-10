import { cache } from "react"

import { homeStrategicNetworkDesign } from "@/data/mock/homepage-visual"
import { createPublicSupabaseServerClient } from "@/lib/supabase/public-server-client"
import type { HomepageContentRow } from "@/types/supabase-cms"

const FALLBACK_BLURBS: Record<string, string> = {
  prishtina: "Capital station with full Euromiti services.",
  ferizaj: "City station for quick stops and daily routes.",
  gjilan: "Eastern city station for reliable refueling and rest.",
}

export type HomeLocationPreviewCard = {
  /** Location UUID from DB when present */
  id: string
  slug: string | null
  title: string
  blurb: string
  imageSrc: string
  imageAlt: string
}

/** Three homepage location teaser cards driven by DB `locations` + `main_media_id`, with mock visuals as fallback. */
export const getHomeLocationPreviewsPublic = cache(async (): Promise<{ cards: HomeLocationPreviewCard[]; source: "db" | "mock" }> => {
  const supabase = createPublicSupabaseServerClient()
  if (!supabase) {
    return { cards: mockFallbackCards(), source: "mock" }
  }

  const { data: locs, error } = await supabase
    .from("locations")
    .select("id, slug, city, address, main_media_id")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(3)

  if (error || !locs?.length) {
    if (error) console.warn("[getHomeLocationPreviewsPublic] Falling back:", error.message)
    return { cards: mockFallbackCards(), source: "mock" }
  }

  const ids = [...new Set(locs.map((l: { main_media_id: string | null }) => l.main_media_id).filter(Boolean))] as string[]

  let urlById: Record<string, { public_url: string; alt_text: string | null }> = {}
  if (ids.length) {
    const { data: media, error: mErr } = await supabase
      .from("media_uploads")
      .select("id, public_url, alt_text")
      .in("id", ids)
    if (!mErr && media?.length) {
      urlById = Object.fromEntries(
        media.map((m: { id: string; public_url: string | null; alt_text: string | null }) => [
          m.id,
          { public_url: m.public_url ?? "", alt_text: m.alt_text },
        ])
      )
    }
  }

  const cards = locs.map((loc: { id: string; slug: string; city: string; address: string; main_media_id: string | null }) => {
    const m = loc.main_media_id ? urlById[loc.main_media_id] : undefined
    const slugKey = slugToLegacy(loc.slug)
    const mockStation = slugKey ? homeStrategicNetworkDesign.find((x) => x.locationId === slugKey) : undefined
    const imageSrc = (m?.public_url || "").trim() || mockStation?.imageSrc || homeStrategicNetworkDesign[0]?.imageSrc
    const imageAlt = m?.alt_text?.trim() || mockStation?.imageAlt || `Euromiti ${loc.city}`

    return {
      id: loc.id,
      slug: loc.slug,
      title: loc.city.trim(),
      blurb:
        shorten(loc.address.trim(), 132) ||
        (slugKey && FALLBACK_BLURBS[slugKey]) ||
        "Euromiti city station with dependable service.",
      imageSrc: imageSrc ?? "",
      imageAlt,
    }
  })

  return { cards, source: "db" }
})

function shorten(s: string, max: number) {
  if (s.length <= max) return s
  return `${s.slice(0, Math.max(0, max - 1))}…`
}

/** Map kosovo slugs to legacy mock IDs when filenames match patterns. */
function slugToLegacy(slug: string): "prishtina" | "ferizaj" | "gjilan" | null {
  const s = slug.toLowerCase()
  if (s.includes("pri") || s === "prishtina" || s === "pristina") return "prishtina"
  if (s.includes("feriz")) return "ferizaj"
  if (s.includes("gjilan") || s.includes("gjil")) return "gjilan"
  return null
}

function mockFallbackCards(): HomeLocationPreviewCard[] {
  return homeStrategicNetworkDesign.map((s) => ({
    id: `mock-${s.locationId}`,
    slug: null,
    title: s.title,
    blurb: FALLBACK_BLURBS[s.locationId] ?? "Euromiti city station with dependable service.",
    imageSrc: s.imageSrc,
    imageAlt: s.imageAlt,
  }))
}

/** Section heading copy sourced from homepage singleton — falls back to built-in marketing defaults. */
export function locationsBandCopyFromCMS(row: HomepageContentRow | null) {
  return {
    kicker: row?.locations_band_kicker?.trim() || "Locations",
    heading: row?.locations_band_heading?.trim() || "Our City Stations",
    subtitle:
      row?.locations_band_subtitle?.trim() ||
      "Prishtina, Ferizaj, and Gjilan - tap any card to view full location details.",
  }
}
