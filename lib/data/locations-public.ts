import { cache } from "react"

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
  /** Raw contact email when set; use for `mailto:` and programmatic fallbacks. */
  contactEmail: string | null
  contactEmailDisplay: string
  openingHours: string
  googleMapsUrl: string
  services: LocationAmenity[]
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

    const address = typeof loc.address === "string" ? loc.address : ""
    const phone = typeof loc.phone === "string" ? loc.phone : ""
    const opening_hours = typeof loc.opening_hours === "string" ? loc.opening_hours : ""
    const google_maps_url = typeof loc.google_maps_url === "string" ? loc.google_maps_url : ""
    const contact_email = typeof loc.contact_email === "string" ? loc.contact_email : null

    const emailTrim = contact_email?.trim() ?? null

    return {
      id: locId,
      slug,
      city: cityTrim,
      pageHeading: heading,
      pageSummary: summary,
      address: address.trim(),
      phone: phone.trim(),
      contactEmail: emailTrim && emailTrim.length > 0 ? emailTrim : null,
      contactEmailDisplay: emailTrim && emailTrim.length > 0 ? emailTrim : "—",
      openingHours: opening_hours.trim(),
      googleMapsUrl: google_maps_url.trim(),
      services: normalizeServices(loc.services),
      mainImageSrc,
      mainImageAlt,
    }
  })

  return { ok: true, rows: resolved }
}

export const getLocationsPublicCached = cache(fetchLocationsPublicPageRows)
