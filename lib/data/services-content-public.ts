import { cache } from "react"

import { SERVICES_PANEL_DEFAULTS, SERVICES_PAGE_DEFAULT_HERO, type ServicesSectionId } from "@/lib/data/services-page-defaults"
import { createPublicSupabaseServerClient } from "@/lib/supabase/public-server-client"
import type { ServicesContentRow } from "@/types/supabase-cms"

export type ServicesMediaLookup = Record<string, { public_url: string; alt_text: string | null }>

export type ResolvedServicesSection = {
  id: ServicesSectionId
  title: string
  description: string
  highlights: string[]
  ctaLabel: string
  ctaHref: string
  imageSrc: string
  imageAlt: string
  icon: string
}

export type ResolvedServicesPage = {
  heroTitle: string
  heroSubtitle: string
  heroImageSrc: string
  heroImageAlt: string
  sections: ResolvedServicesSection[]
}

export function normalizeServicesRow(raw: Record<string, unknown>): ServicesContentRow {
  const empty = ""

  const highlights = (key: string): unknown => {
    const rawValue = typeof raw === "object" && raw !== null && key in raw ? raw[key] : []
    return Array.isArray(rawValue) ? rawValue : []
  }

  const fk = (k: string): string | null =>
    typeof raw[k] === "string" && (raw[k] as string).length > 0 ? (raw[k] as string) : null

  return {
    id: Number(raw.id) || 1,
    petrol_section_title: typeof raw.petrol_section_title === "string" ? raw.petrol_section_title : empty,
    petrol_description: typeof raw.petrol_description === "string" ? raw.petrol_description : empty,
    petrol_image_media_id: fk("petrol_image_media_id"),
    petrol_highlights_json: highlights("petrol_highlights_json"),
    restaurant_section_title:
      typeof raw.restaurant_section_title === "string" ? raw.restaurant_section_title : empty,
    restaurant_description: typeof raw.restaurant_description === "string" ? raw.restaurant_description : empty,
    restaurant_image_media_id: fk("restaurant_image_media_id"),
    restaurant_highlights_json: highlights("restaurant_highlights_json"),
    carwash_section_title: typeof raw.carwash_section_title === "string" ? raw.carwash_section_title : empty,
    carwash_description: typeof raw.carwash_description === "string" ? raw.carwash_description : empty,
    carwash_image_media_id: fk("carwash_image_media_id"),
    carwash_highlights_json: highlights("carwash_highlights_json"),
    mini_market_section_title:
      typeof raw.mini_market_section_title === "string" ? raw.mini_market_section_title : empty,
    mini_market_description: typeof raw.mini_market_description === "string" ? raw.mini_market_description : empty,
    mini_market_image_media_id: fk("mini_market_image_media_id"),
    mini_market_highlights_json: highlights("mini_market_highlights_json"),
    hero_page_title:
      typeof raw.hero_page_title === "string" ? raw.hero_page_title : SERVICES_PAGE_DEFAULT_HERO.title,
    hero_page_subtitle:
      typeof raw.hero_page_subtitle === "string" ? raw.hero_page_subtitle : empty,
    why_sections_json: raw.why_sections_json ?? [],
    updated_at: typeof raw.updated_at === "string" ? raw.updated_at : new Date().toISOString(),
    updated_by: fk("updated_by"),
  }
}

/** Default textarea value when loading the admin Services form. */
export function highlightsTextFromDb(raw: unknown): string {
  if (!Array.isArray(raw)) return ""
  const lines = raw
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
  return lines.join("\n")
}

export const petrolHighlightsTextFromDb = highlightsTextFromDb

function bulletsFromDb(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  const bullets = raw
    .map((item) => {
      if (typeof item === "string") return item.trim()
      return null
    })
    .filter((x): x is string => Boolean(x?.length))
  return bullets
}

function mediaSrc(
  media: ServicesMediaLookup,
  mediaId: string | null | undefined,
  fallbackSrc: string,
  fallbackAlt: string
): { src: string; alt: string } {
  const m = mediaId ? media[mediaId] : undefined
  const url = (m?.public_url ?? "").trim()
  if (!url) return { src: fallbackSrc, alt: fallbackAlt }
  return {
    src: url,
    alt: m?.alt_text?.trim() || fallbackAlt,
  }
}

export const getServicesContentPublic = cache(async (): Promise<{
  row: ServicesContentRow | null
  media: ServicesMediaLookup
}> => {
  const supabase = createPublicSupabaseServerClient()
  if (!supabase) return { row: null, media: {} }

  const { data: rawRow, error } = await supabase.from("services_content").select("*").eq("id", 1).maybeSingle()
  if (error) {
    console.warn("[getServicesContentPublic] Falling back:", error.message)
    return { row: null, media: {} }
  }
  if (!rawRow) return { row: null, media: {} }

  const row = normalizeServicesRow(rawRow as Record<string, unknown>)

  const ids = [
    row.petrol_image_media_id,
    row.restaurant_image_media_id,
    row.carwash_image_media_id,
    row.mini_market_image_media_id,
  ].filter((x): x is string => typeof x === "string" && x.length > 0)

  let media: ServicesMediaLookup = {}
  if (ids.length > 0) {
    const { data: uploads, error: ue } = await supabase
      .from("media_uploads")
      .select("id, public_url, alt_text")
      .in("id", [...new Set(ids)])
    if (ue) console.warn("[getServicesContentPublic] Media:", ue.message)
    else if (uploads?.length) {
      media = Object.fromEntries(
        uploads.map((u: { id: string; public_url: string | null; alt_text: string | null }) => [
          u.id,
          { public_url: u.public_url ?? "", alt_text: u.alt_text },
        ])
      )
    }
  }

  return { row, media }
})

export function resolveServicesPage(row: ServicesContentRow | null, media: ServicesMediaLookup): ResolvedServicesPage {
  const petrolDef = SERVICES_PANEL_DEFAULTS[0]
  const restDef = SERVICES_PANEL_DEFAULTS[1]
  const carwashDef = SERVICES_PANEL_DEFAULTS[2]
  const miniDef = SERVICES_PANEL_DEFAULTS[3]

  if (!row) {
    return {
      heroTitle: SERVICES_PAGE_DEFAULT_HERO.title,
      heroSubtitle: SERVICES_PAGE_DEFAULT_HERO.description,
      heroImageSrc: SERVICES_PAGE_DEFAULT_HERO.imageSrc,
      heroImageAlt: SERVICES_PAGE_DEFAULT_HERO.imageAlt,
      sections: SERVICES_PANEL_DEFAULTS.map((service) => ({
        id: service.id,
        title: service.title,
        description: service.description,
        highlights: [...service.highlights],
        ctaLabel: service.ctaLabel,
        ctaHref: service.ctaHref,
        imageSrc: service.imageSrc,
        imageAlt: service.imageAlt,
        icon: service.icon,
      })),
    }
  }

  const petrolImg = mediaSrc(media, row.petrol_image_media_id, petrolDef.imageSrc, petrolDef.imageAlt)
  const restImg = mediaSrc(media, row.restaurant_image_media_id, restDef.imageSrc, restDef.imageAlt)
  const carImg = mediaSrc(media, row.carwash_image_media_id, carwashDef.imageSrc, carwashDef.imageAlt)
  const miniImg = mediaSrc(media, row.mini_market_image_media_id, miniDef.imageSrc, miniDef.imageAlt)

  const sections: ResolvedServicesSection[] = [
    {
      id: petrolDef.id,
      title: row.petrol_section_title,
      description: row.petrol_description,
      highlights: bulletsFromDb(row.petrol_highlights_json),
      ctaLabel: petrolDef.ctaLabel,
      ctaHref: petrolDef.ctaHref,
      imageSrc: petrolImg.src,
      imageAlt: petrolImg.alt,
      icon: petrolDef.icon,
    },
    {
      id: restDef.id,
      title: row.restaurant_section_title,
      description: row.restaurant_description,
      highlights: bulletsFromDb(row.restaurant_highlights_json),
      ctaLabel: restDef.ctaLabel,
      ctaHref: restDef.ctaHref,
      imageSrc: restImg.src,
      imageAlt: restImg.alt,
      icon: restDef.icon,
    },
    {
      id: carwashDef.id,
      title: row.carwash_section_title,
      description: row.carwash_description,
      highlights: bulletsFromDb(row.carwash_highlights_json),
      ctaLabel: carwashDef.ctaLabel,
      ctaHref: carwashDef.ctaHref,
      imageSrc: carImg.src,
      imageAlt: carImg.alt,
      icon: carwashDef.icon,
    },
    {
      id: miniDef.id,
      title: row.mini_market_section_title,
      description: row.mini_market_description,
      highlights: bulletsFromDb(row.mini_market_highlights_json),
      ctaLabel: miniDef.ctaLabel,
      ctaHref: miniDef.ctaHref,
      imageSrc: miniImg.src,
      imageAlt: miniImg.alt,
      icon: miniDef.icon,
    },
  ]

  return {
    heroTitle: row.hero_page_title,
    heroSubtitle: row.hero_page_subtitle,
    heroImageSrc: SERVICES_PAGE_DEFAULT_HERO.imageSrc,
    heroImageAlt: SERVICES_PAGE_DEFAULT_HERO.imageAlt,
    sections,
  }
}
