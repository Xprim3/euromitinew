import { cache } from "react"

import { homeBeyondDesign, homeHeroDesign } from "@/data/mock/homepage-visual"
import { createPublicSupabaseServerClient } from "@/lib/supabase/public-server-client"
import type { HomepageContentRow, HomepageHeroSlide } from "@/types/supabase-cms"

/** Media rows keyed by UUID for resolving homepage_image fields. */
export type HomepageMediaLookup = Record<string, { public_url: string; alt_text: string | null }>
export type ServicesIntroChip = { icon: string; label: string }

/** Coerce partially-known `homepage_content` JSON (e.g. before optional migration columns exist) into a full row shape. */
export function homepageContentRowFromUnknown(raw: Record<string, unknown>): HomepageContentRow {
  return hydrateRow(raw as Partial<HomepageContentRow> & Pick<HomepageContentRow, "id" | "updated_at">)
}

function hydrateRow(raw: Partial<HomepageContentRow> & Pick<HomepageContentRow, "id" | "updated_at">): HomepageContentRow {
  const e = ""
  return {
    id: raw.id,
    hero_headline_line1: raw.hero_headline_line1 ?? e,
    hero_headline_line2: raw.hero_headline_line2 ?? e,
    hero_subtitle: raw.hero_subtitle ?? e,
    hero_image_media_id: raw.hero_image_media_id ?? null,
    hero_slides_json: raw.hero_slides_json ?? null,
    hero_cta_primary_label: raw.hero_cta_primary_label ?? e,
    hero_cta_primary_href: raw.hero_cta_primary_href ?? "/services",
    hero_cta_secondary_label: raw.hero_cta_secondary_label ?? e,
    hero_cta_secondary_href: raw.hero_cta_secondary_href ?? "/locations",
    about_preview_kicker: raw.about_preview_kicker ?? e,
    about_preview_headline: raw.about_preview_headline ?? e,
    about_preview_eyebrow: raw.about_preview_eyebrow ?? e,
    about_preview_text: raw.about_preview_text ?? e,
    about_preview_why_title: raw.about_preview_why_title ?? e,
    about_preview_why_text: raw.about_preview_why_text ?? e,
    about_preview_button_label: raw.about_preview_button_label ?? e,
    about_preview_button_href: raw.about_preview_button_href ?? "/about",
    about_preview_image_media_id: raw.about_preview_image_media_id ?? null,
    restaurant_highlight_text: raw.restaurant_highlight_text ?? e,
    carwash_intro_text: raw.carwash_intro_text ?? e,
    playground_intro_text: raw.playground_intro_text ?? e,
    mini_market_intro_text: raw.mini_market_intro_text ?? e,
    services_intro_title: raw.services_intro_title ?? e,
    services_intro_body: raw.services_intro_body ?? e,
    services_intro_chips_json: raw.services_intro_chips_json ?? null,
    services_intro_media_id: raw.services_intro_media_id ?? null,
    restaurant_home_headline_primary: raw.restaurant_home_headline_primary ?? e,
    restaurant_home_headline_accent: raw.restaurant_home_headline_accent ?? e,
    restaurant_home_main_media_id: raw.restaurant_home_main_media_id ?? null,
    restaurant_home_float_1_media_id: raw.restaurant_home_float_1_media_id ?? null,
    restaurant_home_float_2_media_id: raw.restaurant_home_float_2_media_id ?? null,
    carwash_intro_media_id: raw.carwash_intro_media_id ?? null,
    playground_intro_media_id: raw.playground_intro_media_id ?? null,
    mini_market_intro_media_id: raw.mini_market_intro_media_id ?? null,
    locations_band_kicker: raw.locations_band_kicker ?? e,
    locations_band_heading: raw.locations_band_heading ?? e,
    locations_band_subtitle: raw.locations_band_subtitle ?? e,
    updated_at: raw.updated_at,
    updated_by: raw.updated_by ?? null,
  }
}

function textOrFallback(value: string | null | undefined, fallback: string) {
  return value?.trim() || fallback
}

function joinedHeadline(line1: string | null | undefined, line2: string | null | undefined, fallbackLine1: string, fallbackLine2: string) {
  const title = [line1, line2].map((part) => part?.trim()).filter(Boolean).join(" ")
  return title || [fallbackLine1, fallbackLine2].join(" ")
}

function headlineParts(title: string, accentWordCount = 2) {
  const words = title.trim().split(/\s+/).filter(Boolean)
  if (words.length <= accentWordCount) return { main: title.trim(), accent: "" }
  return {
    main: words.slice(0, -accentWordCount).join(" "),
    accent: words.slice(-accentWordCount).join(" "),
  }
}

function servicesIntroChipsFromCMS(raw: unknown, fallback: readonly ServicesIntroChip[]) {
  if (raw == null) return [...fallback]
  if (!Array.isArray(raw)) return []

  return raw
    .map((chip) => {
      if (!chip || typeof chip !== "object") return null
      const c = chip as { icon?: unknown; label?: unknown }
      const label = typeof c.label === "string" ? c.label.trim() : ""
      let icon = typeof c.icon === "string" ? c.icon.trim() : "verified"
      if (!/^[a-z0-9_]+$/.test(icon)) icon = "verified"
      if (!label) return null
      return { icon, label }
    })
    .filter((chip): chip is ServicesIntroChip => Boolean(chip))
}

/**
 * Loads `homepage_content` + related `media_uploads` URLs for anon RLS-approved reads.
 * One React request caches to a single fetch (called from multiple Suspense shells).
 */
export const getPublicHomepageSingleton = cache(async (): Promise<{ row: HomepageContentRow | null; media: HomepageMediaLookup }> => {
  const supabase = createPublicSupabaseServerClient()
  if (!supabase) {
    return { row: null, media: {} }
  }

  const { data: rawRow, error } = await supabase.from("homepage_content").select("*").eq("id", 1).maybeSingle()
  if (error) {
    console.warn("[getPublicHomepageSingleton] Falling back:", error.message)
    return { row: null, media: {} }
  }
  if (!rawRow) {
    return { row: null, media: {} }
  }

  const base = homepageContentRowFromUnknown(rawRow as Record<string, unknown>)
  const idList = [
    base.hero_image_media_id,
    ...heroSlidesFromCMS(base).map((slide) => slide.mediaId),
    base.about_preview_image_media_id,
    base.services_intro_media_id,
    base.restaurant_home_main_media_id,
    base.restaurant_home_float_1_media_id,
    base.restaurant_home_float_2_media_id,
    base.carwash_intro_media_id,
    base.playground_intro_media_id,
    base.mini_market_intro_media_id,
  ].filter((x): x is string => typeof x === "string" && x.length > 0)

  let media: HomepageMediaLookup = {}
  if (idList.length > 0) {
    const { data: uploads, error: mErr } = await supabase
      .from("media_uploads")
      .select("id, public_url, alt_text")
      .in("id", idList)
    if (mErr) {
      console.warn("[getPublicHomepageSingleton] Media lookup failed:", mErr.message)
    } else {
      media = Object.fromEntries(
        (uploads ?? []).map((u: { id: string; public_url: string | null; alt_text: string | null }) => [
          u.id,
          { public_url: u.public_url ?? "", alt_text: u.alt_text },
        ])
      )
    }
  }

  return { row: base, media }
})

/** Merged hero props for `HomeHeroView` (URLs from CMS can be any public string). */
export type HomeHeroResolved = {
  imageSrc: string
  imageAlt: string
  title: string
  subtitle: string
}

export type HomeHeroSlideResolved = HomeHeroResolved

const fallbackHeroSlides: HomeHeroSlideResolved[] = [
  {
    imageSrc: homeHeroDesign.imageSrc,
    imageAlt: homeHeroDesign.imageAlt,
    title: joinedHeadline(null, null, homeHeroDesign.titleLine1, homeHeroDesign.titleLine2),
    subtitle: homeHeroDesign.subtitle,
  },
  {
    imageSrc: homeBeyondDesign.elite.imageSrc,
    imageAlt: homeBeyondDesign.elite.imageAlt,
    title: homeBeyondDesign.elite.title,
    subtitle: homeBeyondDesign.elite.body,
  },
  {
    imageSrc: homeBeyondDesign.restaurant.mainImage,
    imageAlt: homeBeyondDesign.restaurant.mainImageAlt,
    title: homeBeyondDesign.restaurant.title,
    subtitle: homeBeyondDesign.restaurant.body,
  },
]

function isUuidLike(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export function heroSlidesFromCMS(row: HomepageContentRow | null): HomepageHeroSlide[] {
  const fallback: HomepageHeroSlide[] = row
    ? [
        {
          title: joinedHeadline(
            row.hero_headline_line1,
            row.hero_headline_line2,
            homeHeroDesign.titleLine1,
            homeHeroDesign.titleLine2
          ),
          body: textOrFallback(row.hero_subtitle, homeHeroDesign.subtitle),
          mediaId: row.hero_image_media_id,
        },
      ]
    : []

  if (!row || !Array.isArray(row.hero_slides_json)) return fallback

  const slides = row.hero_slides_json
    .map((slide) => {
      if (!slide || typeof slide !== "object") return null
      const s = slide as { title?: unknown; body?: unknown; mediaId?: unknown }
      const title = typeof s.title === "string" ? s.title.trim() : ""
      const body = typeof s.body === "string" ? s.body.trim() : ""
      const rawMediaId = typeof s.mediaId === "string" ? s.mediaId.trim() : ""
      const mediaId = rawMediaId && isUuidLike(rawMediaId) ? rawMediaId : null
      if (!title && !body && !mediaId) return null
      return {
        title: title || homeHeroDesign.titleLine1,
        body: body || homeHeroDesign.subtitle,
        mediaId,
      }
    })
    .filter((slide): slide is HomepageHeroSlide => Boolean(slide))

  return slides.length ? slides : fallback
}

export function heroSliderFromHomepageCMS(row: HomepageContentRow | null, media: HomepageMediaLookup): HomeHeroSlideResolved[] {
  const fallbackSlide = fallbackHeroSlides[0]

  if (!row) return fallbackHeroSlides

  const slides = heroSlidesFromCMS(row).map((slide) => {
    const dm = slide.mediaId ? media[slide.mediaId] : undefined
    return {
      imageSrc: dm?.public_url?.trim() || homeHeroDesign.imageSrc,
      imageAlt: dm?.alt_text?.trim() || homeHeroDesign.imageAlt,
      title: textOrFallback(slide.title, fallbackSlide.title),
      subtitle: textOrFallback(slide.body, fallbackSlide.subtitle),
    }
  })

  if (slides.length >= 2) return slides
  if (slides.length === 1) {
    const uniqueFallbacks = fallbackHeroSlides.filter((slide) => slide.title !== slides[0]?.title)
    return [slides[0], ...uniqueFallbacks].slice(0, 3)
  }

  return fallbackHeroSlides
}

export function heroFromHomepageCMS(row: HomepageContentRow | null, media: HomepageMediaLookup): HomeHeroResolved {
  if (!row) {
    return {
      imageSrc: homeHeroDesign.imageSrc,
      imageAlt: homeHeroDesign.imageAlt,
      title: joinedHeadline(null, null, homeHeroDesign.titleLine1, homeHeroDesign.titleLine2),
      subtitle: homeHeroDesign.subtitle,
    }
  }

  const heroId = row?.hero_image_media_id
  const dm = heroId ? media[heroId] : undefined
  const img = dm?.public_url?.trim() || homeHeroDesign.imageSrc
  const imgAlt = dm?.alt_text?.trim() || homeHeroDesign.imageAlt

  return {
    imageSrc: img,
    imageAlt: imgAlt,
    title: joinedHeadline(
      row.hero_headline_line1,
      row.hero_headline_line2,
      homeHeroDesign.titleLine1,
      homeHeroDesign.titleLine2
    ),
    subtitle: textOrFallback(row.hero_subtitle, homeHeroDesign.subtitle),
  }
}

/** Dark-band services intro (“Elite fueling”) copy + imagery. */
export function servicesIntroEliteFromCMS(row: HomepageContentRow | null, media: HomepageMediaLookup) {
  const mock = homeBeyondDesign.elite
  if (!row) {
    return {
      title: mock.title,
      body: mock.body,
      imageSrc: mock.imageSrc,
      imageAlt: mock.imageAlt,
      chips: [...mock.chips],
    }
  }

  const mid = row?.services_intro_media_id
  const dm = mid ? media[mid] : undefined
  return {
    title: textOrFallback(row.services_intro_title, mock.title),
    body: textOrFallback(row.services_intro_body, mock.body),
    imageSrc: dm?.public_url?.trim() || mock.imageSrc,
    imageAlt: dm?.alt_text?.trim() || mock.imageAlt,
    chips: servicesIntroChipsFromCMS(row.services_intro_chips_json, mock.chips),
  }
}

/** Service teaser cards beneath the elite band. */
export function secondaryHomeServiceCardsFromCMS(row: HomepageContentRow | null, media: HomepageMediaLookup) {
  const carwashMock = homeBeyondDesign.secondaryServices.find((s) => s.key === "detailing")!
  const playgroundMock = homeBeyondDesign.secondaryServices.find((s) => s.key === "family")!
  const marketMock = homeBeyondDesign.secondaryServices.find((s) => s.key === "market")!

  if (!row) {
    return { carwash: carwashMock, playground: playgroundMock, market: marketMock }
  }

  const cMedia = row?.carwash_intro_media_id ? media[row.carwash_intro_media_id] : undefined
  const pMedia = row?.playground_intro_media_id ? media[row.playground_intro_media_id] : undefined
  const mMedia = row?.mini_market_intro_media_id ? media[row.mini_market_intro_media_id] : undefined

  const carwash = {
    ...carwashMock,
    body: textOrFallback(row.carwash_intro_text, carwashMock.body),
    imageSrc: cMedia?.public_url?.trim() || carwashMock.imageSrc,
    imageAlt: cMedia?.alt_text?.trim() || carwashMock.imageAlt,
  }

  const playground = {
    ...playgroundMock,
    body: textOrFallback(row.playground_intro_text, playgroundMock.body),
    imageSrc: pMedia?.public_url?.trim() || playgroundMock.imageSrc,
    imageAlt: pMedia?.alt_text?.trim() || playgroundMock.imageAlt,
  }

  const market = {
    ...marketMock,
    body: textOrFallback(row.mini_market_intro_text, marketMock.body),
    imageSrc: mMedia?.public_url?.trim() || marketMock.imageSrc,
    imageAlt: mMedia?.alt_text?.trim() || marketMock.imageAlt,
  }

  return { carwash, playground, market }
}

/** Homepage restaurant luxury block merged with singleton + media. */
export function restaurantLuxuryFromCMS(row: HomepageContentRow | null, media: HomepageMediaLookup) {
  const r = homeBeyondDesign.restaurant
  if (!row) {
    const title = joinedHeadline(null, null, "Shije të kuruara.", "Pushim i rafinuar.")
    return {
      headline: title,
      headlineParts: headlineParts(title),
      body: r.body,
      ctaHref: r.ctaHref,
      mainImage: r.mainImage,
      mainImageAlt: r.mainImageAlt,
      float1: r.float1,
      float1Alt: r.float1Alt,
      float2: r.float2,
      float2Alt: r.float2Alt,
    }
  }

  const mm = row?.restaurant_home_main_media_id ? media[row.restaurant_home_main_media_id] : undefined
  const f1 = row?.restaurant_home_float_1_media_id ? media[row.restaurant_home_float_1_media_id] : undefined
  const f2 = row?.restaurant_home_float_2_media_id ? media[row.restaurant_home_float_2_media_id] : undefined
  const headline = joinedHeadline(
    row.restaurant_home_headline_primary,
    row.restaurant_home_headline_accent,
    "Shije të kuruara.",
    "Pushim i rafinuar."
  )

  return {
    headline,
    headlineParts: headlineParts(headline),
    body: textOrFallback(row.restaurant_highlight_text, r.body),
    ctaHref: r.ctaHref,
    mainImage: mm?.public_url?.trim() || r.mainImage,
    mainImageAlt: mm?.alt_text?.trim() || r.mainImageAlt,
    float1: f1?.public_url?.trim() || r.float1,
    float1Alt: f1?.alt_text?.trim() || r.float1Alt,
    float2: f2?.public_url?.trim() || r.float2,
    float2Alt: f2?.alt_text?.trim() || r.float2Alt,
  }
}
