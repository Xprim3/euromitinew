import { cache } from "react"

import { homeBeyondDesign } from "@/data/mock/homepage-visual"
import { fallbackMainVisualForSlug } from "@/lib/data/location-visual-fallback"
import { createPublicSupabaseServerClient } from "@/lib/supabase/public-server-client"
import type { LocationAmenity } from "@/types/public"

const FALLBACK_SUMMARY =
  "Full-service Euromiti forecourt with fuel, hospitality, and everyday convenience for drivers and travellers."

/** Labels match the legacy `/locations` marketing chips. */
export const LOCATION_PAGE_SERVICE_LABELS: Record<LocationAmenity, string> = {
  petrol: "Petrol station",
  restaurant: "Restaurant",
  carwash: "Carwash",
  mini_market: "Mini market",
  ev: "EV",
}

export type ResolvedPublicLocation = {
  id: string
  slug: string
  city: string
  pageHeading: string
  pageSummary: string
  address: string
  phone: string
  contactEmailDisplay: string
  openingHours: string
  googleMapsUrl: string
  services: LocationAmenity[]
  /** Ordered gallery tiles (subset of CMS gallery). */
  gallery: { src: string; alt: string }[]
  mainImageSrc: string
  mainImageAlt: string
}

const AMENITIES = new Set<LocationAmenity>(["petrol", "restaurant", "carwash", "mini_market", "ev"])

function normalizeServices(raw: unknown): LocationAmenity[] {
  if (!Array.isArray(raw)) return []
  const out: LocationAmenity[] = []
  for (const item of raw) {
    if (typeof item !== "string") continue
    const k = item as LocationAmenity
    if (AMENITIES.has(k)) out.push(k)
  }
  return out
}

/** Extra gallery placeholders when DB has fewer than two tiles (matches original grid). */
function galleryFallbackForIndex(sectionIndex: number, tileIndex: number): { src: string; alt: string } {
  const imgs: { src: string; alt: string }[] = [
    {
      src: homeBeyondDesign.secondaryServices[2].imageSrc,
      alt: homeBeyondDesign.secondaryServices[2].imageAlt,
    },
    {
      src: homeBeyondDesign.restaurant.mainImage,
      alt: homeBeyondDesign.restaurant.mainImageAlt,
    },
    {
      src: homeBeyondDesign.secondaryServices[0].imageSrc,
      alt: homeBeyondDesign.secondaryServices[0].imageAlt,
    },
    {
      src: homeBeyondDesign.secondaryServices[1].imageSrc,
      alt: homeBeyondDesign.secondaryServices[1].imageAlt,
    },
  ]
  const pick = imgs[(sectionIndex * 2 + tileIndex + imgs.length) % imgs.length]
  return {
    src: pick.src,
    alt: `${pick.alt}${tileIndex === 0 ? "" : " — gallery view"}`.slice(0, 180),
  }
}

function padGalleryToDesign(
  sectionIndex: number,
  urls: { src: string; alt: string }[]
): { src: string; alt: string }[] {
  const out = [...urls]
  while (out.length < 2) {
    const i = out.length
    out.push(galleryFallbackForIndex(sectionIndex, i))
  }
  return out
}

export async function fetchLocationsPublicPageRows(): Promise<
  | { ok: true; rows: ResolvedPublicLocation[] }
  | { ok: false; message: string }
> {
  const supabase = createPublicSupabaseServerClient()
  if (!supabase) {
    return { ok: false, message: "Configuration error: Supabase URL or anon key is missing." }
  }

  const { data: locs, error } = await supabase
    .from("locations")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("city", { ascending: true })

  if (error) {
    console.warn("[fetchLocationsPublicPageRows]", error.message)
    return { ok: false, message: error.message || "Could not load locations." }
  }
  if (!locs?.length) return { ok: true, rows: [] }

  const mainIds = [
    ...new Set(
      (locs ?? [])
        .map((l) => (l as Record<string, unknown>).main_media_id)
        .filter((x): x is string => typeof x === "string" && x.length > 0)
    ),
  ]

  const locIds = (locs ?? []).map((l) => String((l as Record<string, unknown>).id ?? ""))

  let mediaLookup: Record<string, { public_url: string; alt_text: string | null }> = {}
  if (mainIds.length) {
    const { data: uploads, error: uErr } = await supabase
      .from("media_uploads")
      .select("id, public_url, alt_text")
      .in("id", mainIds)
    if (!uErr && uploads?.length) {
      mediaLookup = Object.fromEntries(
        uploads.map((u: { id: string; public_url: string | null; alt_text: string | null }) => [
          u.id,
          { public_url: u.public_url ?? "", alt_text: u.alt_text },
        ])
      )
    }
  }

  const { data: galleryRows } = await supabase
    .from("location_images")
    .select("location_id, sort_order, media_id")
    .in("location_id", locIds)
    .order("sort_order", { ascending: true })

  const galMediaIds =
    galleryRows?.map((r: { media_id: string }) => r.media_id).filter(Boolean) ??
    ([] as string[])

  let galleryLookup: Record<string, { public_url: string; alt_text: string | null }> = {}
  const uniqGalIds = [...new Set(galMediaIds)]
  if (uniqGalIds.length) {
    const { data: gUploads } = await supabase.from("media_uploads").select("id, public_url, alt_text").in("id", uniqGalIds)
    if (gUploads?.length) {
      galleryLookup = Object.fromEntries(
        gUploads.map((u: { id: string; public_url: string | null; alt_text: string | null }) => [
          u.id,
          { public_url: u.public_url ?? "", alt_text: u.alt_text },
        ])
      )
    }
  }

  const groupedGallery = new Map<string, { sort_order: number; media_id: string }[]>()
  for (const row of galleryRows ?? []) {
    const r = row as { location_id: string; sort_order: number; media_id: string }
    const bucket = groupedGallery.get(r.location_id) ?? []
    bucket.push({ sort_order: r.sort_order, media_id: r.media_id })
    groupedGallery.set(r.location_id, bucket)
  }
  for (const [, rows] of groupedGallery) rows.sort((a, b) => a.sort_order - b.sort_order)

  const resolved: ResolvedPublicLocation[] = (locs ?? []).map((raw, idx) => {
    const loc = raw as Record<string, unknown>
    const slug = typeof loc.slug === "string" ? loc.slug : ""
    const city = typeof loc.city === "string" ? loc.city : ""
    const mainMediaId = typeof loc.main_media_id === "string" ? loc.main_media_id : null
    const locId = typeof loc.id === "string" ? loc.id : ""

    const fbMain = fallbackMainVisualForSlug(slug, idx)
    const mm = mainMediaId ? mediaLookup[mainMediaId] : undefined
    const mainUrl = mm?.public_url?.trim()
    const mainImageSrc =
      mainUrl && mainUrl.length > 0 ? mainUrl : fbMain.imageSrc
    const mainImageAlt = mm?.alt_text?.trim() || fbMain.imageAlt || `Euromiti ${city}`.slice(0, 180)

    const cityTrim = city.trim()
    const pageHeadingVal = typeof loc.page_heading === "string" ? loc.page_heading : ""
    const pageSummaryVal = typeof loc.page_summary === "string" ? loc.page_summary : ""
    const heading = pageHeadingVal.trim() || `${cityTrim} station`.trim()
    const summary = pageSummaryVal.trim() || FALLBACK_SUMMARY

    const rawGal = groupedGallery.get(locId) ?? []
    const tiles: { src: string; alt: string }[] = []
    for (const gr of rawGal) {
      const g = galleryLookup[gr.media_id]
      const u = g?.public_url?.trim()
      if (!u) continue
      tiles.push({
        src: u,
        alt: g?.alt_text?.trim() || `${cityTrim} gallery image`,
      })
    }

    let gallery = tiles
    if (!gallery.length) {
      gallery = padGalleryToDesign(idx, [])
    } else if (gallery.length === 1) {
      gallery = padGalleryToDesign(idx, [gallery[0]])
    }

    const address = typeof loc.address === "string" ? loc.address : ""
    const phone = typeof loc.phone === "string" ? loc.phone : ""
    const opening_hours = typeof loc.opening_hours === "string" ? loc.opening_hours : ""
    const google_maps_url = typeof loc.google_maps_url === "string" ? loc.google_maps_url : ""
    const contact_email = typeof loc.contact_email === "string" ? loc.contact_email : null

    return {
      id: locId,
      slug,
      city: cityTrim,
      pageHeading: heading,
      pageSummary: summary,
      address: address.trim(),
      phone: phone.trim(),
      contactEmailDisplay: contact_email?.trim() ? contact_email.trim() : "—",
      openingHours: opening_hours.trim(),
      googleMapsUrl: google_maps_url.trim(),
      services: normalizeServices(loc.services),
      gallery,
      mainImageSrc,
      mainImageAlt,
    }
  })

  return { ok: true, rows: resolved }
}

export const getLocationsPublicCached = cache(fetchLocationsPublicPageRows)
