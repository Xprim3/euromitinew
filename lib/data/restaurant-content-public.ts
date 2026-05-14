import { cache } from "react"

import {
  restaurantAtmosphereGalleryMock,
  restaurantEditorialHeroMock,
  restaurantEditorialIntroMock,
  restaurantExperiencePillarsMock,
  restaurantSeasonalFoodGalleryMock,
  restaurantSkanomSectionMock,
  type RestaurantAtmosphereGalleryMock,
  type RestaurantEditorialHeroMock,
  type RestaurantEditorialIntroMock,
  type RestaurantExperiencePillarsMock,
  type RestaurantSeasonalFoodGalleryMock,
} from "@/data/mock/restaurant-page"
import { homeBeyondDesign } from "@/data/mock/homepage-visual"
import {
  ADMIN_RESTAURANT_GALLERY_SLOTS,
  ADMIN_RESTAURANT_MENU_SLOTS,
  ADMIN_RESTAURANT_PILLAR_SLOTS,
} from "@/lib/validations/restaurant-content"
import { createPublicSupabaseServerClient } from "@/lib/supabase/public-server-client"
import type { RestaurantContentRow } from "@/types/supabase-cms"

type MediaMap = Record<string, { public_url: string; alt_text: string | null }>

export type ResolvedRestaurantSkanomSection = {
  sectionId: string
  headingId: string
  eyebrow: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  ctaLabel: string
  ctaHref: string
  partner: {
    advertisementLabel: string
    headline: string
    body: string
    href: string
    hint: string
  }
}

export type ResolvedRestaurantPage = {
  pageHeroTitle: string
  pageHeroSubtitle: string
  pageHeroImageSrc: string
  pageHeroImageAlt: string
  editorialHero: RestaurantEditorialHeroMock
  editorialIntro: RestaurantEditorialIntroMock
  seasonalGallery: RestaurantSeasonalFoodGalleryMock
  skanom: ResolvedRestaurantSkanomSection
  experiencePillars: RestaurantExperiencePillarsMock
  atmosphereGallery: RestaurantAtmosphereGalleryMock
}

export function normalizeRestaurantContentRow(raw: Record<string, unknown>): RestaurantContentRow {
  const galleryRaw = raw.gallery_media_ids
  let gallery_media_ids: string[] | null = null
  if (Array.isArray(galleryRaw)) {
    gallery_media_ids = galleryRaw.filter((x): x is string => typeof x === "string" && x.length > 0)
  }

  const fk = (k: string): string | null =>
    typeof raw[k] === "string" && (raw[k] as string).length > 0 ? (raw[k] as string) : null

  return {
    id: Number(raw.id) || 1,
    hero_title: typeof raw.hero_title === "string" ? raw.hero_title : "",
    hero_subtitle: typeof raw.hero_subtitle === "string" ? raw.hero_subtitle : "",
    hero_description: typeof raw.hero_description === "string" ? raw.hero_description : "",
    intro_eyebrow: typeof raw.intro_eyebrow === "string" ? raw.intro_eyebrow : "",
    intro_headline_line1: typeof raw.intro_headline_line1 === "string" ? raw.intro_headline_line1 : "",
    intro_headline_line2: typeof raw.intro_headline_line2 === "string" ? raw.intro_headline_line2 : "",
    intro_body: typeof raw.intro_body === "string" ? raw.intro_body : "",
    intro_image_media_id: fk("intro_image_media_id"),
    hero_image_media_id: fk("hero_image_media_id"),
    opening_hours: typeof raw.opening_hours === "string" ? raw.opening_hours : "",
    contact_phone: fk("contact_phone"),
    contact_email: fk("contact_email"),
    contact_notes: raw.contact_notes == null ? null : typeof raw.contact_notes === "string" ? raw.contact_notes : null,
    menu_highlights_json: raw.menu_highlights_json ?? [],
    experience_pillars_json: raw.experience_pillars_json ?? [],
    gallery_media_ids,
    skanom_eyebrow: typeof raw.skanom_eyebrow === "string" ? raw.skanom_eyebrow : "",
    skanom_title: typeof raw.skanom_title === "string" ? raw.skanom_title : "",
    skanom_description: typeof raw.skanom_description === "string" ? raw.skanom_description : "",
    skanom_image_media_id: fk("skanom_image_media_id"),
    skanom_cta_label: typeof raw.skanom_cta_label === "string" ? raw.skanom_cta_label : "",
    skanom_cta_href: typeof raw.skanom_cta_href === "string" ? raw.skanom_cta_href : "",
    editorial_eyebrow: typeof raw.editorial_eyebrow === "string" ? raw.editorial_eyebrow : "",
    editorial_title_line1: typeof raw.editorial_title_line1 === "string" ? raw.editorial_title_line1 : "",
    editorial_title_line2: typeof raw.editorial_title_line2 === "string" ? raw.editorial_title_line2 : "",
    editorial_description: typeof raw.editorial_description === "string" ? raw.editorial_description : "",
    editorial_quote_line: typeof raw.editorial_quote_line === "string" ? raw.editorial_quote_line : "",
    editorial_quote_attribution: typeof raw.editorial_quote_attribution === "string" ? raw.editorial_quote_attribution : "",
    editorial_image_media_id: fk("editorial_image_media_id"),
    updated_at: typeof raw.updated_at === "string" ? raw.updated_at : new Date().toISOString(),
    updated_by: fk("updated_by"),
  }
}

export function paragraphsFromDescription(raw: string): string[] {
  return raw
    .trim()
    .split(/\n(?:\s*\n)+/)
    .map((p) => p.trim())
    .filter(Boolean)
}

type MenuHlDb = { title?: unknown; body?: unknown; image_media_id?: unknown }

function menuCardsFromDb(json: unknown, media: MediaMap): { title: string; description: string; src: string; alt: string }[] {
  if (!Array.isArray(json)) return []
  const out: { title: string; description: string; src: string; alt: string }[] = []
  for (const raw of json) {
    if (!raw || typeof raw !== "object") continue
    const o = raw as MenuHlDb
    const title = typeof o.title === "string" ? o.title.trim() : ""
    const body = typeof o.body === "string" ? o.body.trim() : ""
    const mid = typeof o.image_media_id === "string" && o.image_media_id.length > 0 ? o.image_media_id : null
    if (!title || !body) continue
    const m = mid ? media[mid] : undefined
    const url = m?.public_url?.trim()
    const fallback = restaurantSeasonalFoodGalleryMock.items[out.length % restaurantSeasonalFoodGalleryMock.items.length]
    out.push({
      title,
      description: body,
      src: url && url.length > 0 ? url : fallback.src,
      alt: m?.alt_text?.trim() || fallback.alt,
    })
    if (out.length >= ADMIN_RESTAURANT_MENU_SLOTS) break
  }
  return out
}

function atmosphereSlotsFromGallery(ids: string[] | null | undefined, media: MediaMap) {
  const mockSlots = [...restaurantAtmosphereGalleryMock.slots].map((s) => ({ src: s.src, alt: s.alt }))
  const fromDb: { src: string; alt: string }[] = []
  if (ids?.length) {
    for (const id of ids) {
      const m = media[id]
      const u = m?.public_url?.trim()
      if (u && u.length > 0) {
        fromDb.push({
          src: u,
          alt: m?.alt_text?.trim() || "Euromiti restaurant atmosphere",
        })
      }
    }
  }
  const merged: { src: string; alt: string }[] = []
  for (let i = 0; i < ADMIN_RESTAURANT_GALLERY_SLOTS; i++) {
    merged.push(fromDb[i] ?? mockSlots[i]!)
  }
  return merged as [
    { src: string; alt: string },
    { src: string; alt: string },
    { src: string; alt: string },
    { src: string; alt: string },
    { src: string; alt: string },
  ]
}

export const getRestaurantContentPublic = cache(async (): Promise<{ row: RestaurantContentRow | null; media: MediaMap }> => {
  const supabase = createPublicSupabaseServerClient()
  if (!supabase) return { row: null, media: {} }

  const { data: rawRow, error } = await supabase.from("restaurant_content").select("*").eq("id", 1).maybeSingle()
  if (error) {
    console.warn("[getRestaurantContentPublic]", error.message)
    return { row: null, media: {} }
  }
  if (!rawRow) return { row: null, media: {} }

  const row = normalizeRestaurantContentRow(rawRow as Record<string, unknown>)

  const menuIds: string[] = []
  if (Array.isArray(row.menu_highlights_json)) {
    for (const item of row.menu_highlights_json) {
      if (item && typeof item === "object" && "image_media_id" in item) {
        const v = (item as { image_media_id?: unknown }).image_media_id
        if (typeof v === "string" && v.length > 0) menuIds.push(v)
      }
    }
  }

  const galleryIds = row.gallery_media_ids ?? []

  const allIds = [
    ...new Set(
      [
        row.hero_image_media_id,
        row.skanom_image_media_id,
        row.editorial_image_media_id,
        row.intro_image_media_id,
        ...menuIds,
        ...galleryIds,
      ].filter((x): x is string => Boolean(x))
    ),
  ]

  let media: MediaMap = {}
  if (allIds.length) {
    const { data: uploads, error: uErr } = await supabase
      .from("media_uploads")
      .select("id, public_url, alt_text")
      .in("id", allIds)
    if (!uErr && uploads?.length) {
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

type ExperiencePillarDb = { title?: unknown; body?: unknown }

function resolveExperiencePillars(json: unknown): RestaurantExperiencePillarsMock {
  const arr = Array.isArray(json) ? json : []
  const pillars = Array.from({ length: ADMIN_RESTAURANT_PILLAR_SLOTS }, (_, i) => {
    const mockP = restaurantExperiencePillarsMock.pillars[i]!
    const raw = arr[i]
    if (!raw || typeof raw !== "object") {
      return { title: mockP.title, body: mockP.body }
    }
    const o = raw as ExperiencePillarDb
    const title = typeof o.title === "string" ? o.title.trim() : ""
    const body = typeof o.body === "string" ? o.body.trim() : ""
    return {
      title: title || mockP.title,
      body: body || mockP.body,
    }
  })
  return {
    ...restaurantExperiencePillarsMock,
    pillars: pillars as unknown as typeof restaurantExperiencePillarsMock.pillars,
  }
}

function resolveSkanomSection(row: RestaurantContentRow | null, media: MediaMap): ResolvedRestaurantSkanomSection {
  const mock0 = restaurantSkanomSectionMock.collageImages[0]
  const partner = { ...restaurantSkanomSectionMock.partner }
  if (!row) {
    return {
      sectionId: restaurantSkanomSectionMock.sectionId,
      headingId: restaurantSkanomSectionMock.headingId,
      eyebrow: restaurantSkanomSectionMock.eyebrow,
      title: restaurantSkanomSectionMock.title,
      description: restaurantSkanomSectionMock.description,
      imageSrc: mock0.src,
      imageAlt: mock0.alt,
      ctaLabel: restaurantSkanomSectionMock.ctaLabel,
      ctaHref: restaurantSkanomSectionMock.ctaHref,
      partner,
    }
  }
  const sid = row.skanom_image_media_id
  const sm = sid ? media[sid] : undefined
  const url = sm?.public_url?.trim()
  return {
    sectionId: restaurantSkanomSectionMock.sectionId,
    headingId: restaurantSkanomSectionMock.headingId,
    eyebrow: row.skanom_eyebrow.trim() || restaurantSkanomSectionMock.eyebrow,
    title: row.skanom_title.trim() || restaurantSkanomSectionMock.title,
    description: row.skanom_description.trim() || restaurantSkanomSectionMock.description,
    imageSrc: url && url.length > 0 ? url : mock0.src,
    imageAlt: sm?.alt_text?.trim() || mock0.alt,
    ctaLabel: row.skanom_cta_label.trim() || restaurantSkanomSectionMock.ctaLabel,
    ctaHref: row.skanom_cta_href.trim() || restaurantSkanomSectionMock.ctaHref,
    partner,
  }
}

export function resolveRestaurantPage(row: RestaurantContentRow | null, media: MediaMap): ResolvedRestaurantPage {
  const defaultHeroSrc = homeBeyondDesign.restaurant.mainImage
  const defaultHeroAlt = homeBeyondDesign.restaurant.mainImageAlt

  if (!row) {
    return {
      pageHeroTitle: "Restaurant",
      pageHeroSubtitle:
        "Chef-led dining, curated menus, and hospitality standards designed to elevate every Euromiti stop.",
      pageHeroImageSrc: defaultHeroSrc,
      pageHeroImageAlt: defaultHeroAlt,
      editorialHero: restaurantEditorialHeroMock,
      editorialIntro: restaurantEditorialIntroMock,
      seasonalGallery: restaurantSeasonalFoodGalleryMock,
      skanom: resolveSkanomSection(null, media),
      experiencePillars: restaurantExperiencePillarsMock,
      atmosphereGallery: restaurantAtmosphereGalleryMock,
    }
  }

  const heroId = row.hero_image_media_id
  const heroM = heroId ? media[heroId] : undefined
  const heroUrl = heroM?.public_url?.trim()
  const pageHeroImageSrc = heroUrl && heroUrl.length > 0 ? heroUrl : defaultHeroSrc
  const pageHeroImageAlt = heroM?.alt_text?.trim() || defaultHeroAlt

  const pageHeroTitle = row.hero_title
  const pageHeroSubtitle = row.hero_subtitle

  const edImgId = row.editorial_image_media_id
  const edM = edImgId ? media[edImgId] : undefined
  const editorialUrl = edM?.public_url?.trim()
  const editorialHeroImageSrc =
    editorialUrl && editorialUrl.length > 0
      ? editorialUrl
      : pageHeroImageSrc
  const editorialHeroImageAlt = edM?.alt_text?.trim() || pageHeroImageAlt

  const editorialHero = {
    eyebrow: row.editorial_eyebrow.trim() || restaurantEditorialHeroMock.eyebrow,
    titleLine1: row.editorial_title_line1.trim() || restaurantEditorialHeroMock.titleLine1,
    titleLine2: row.editorial_title_line2.trim() || restaurantEditorialHeroMock.titleLine2,
    description:
      row.editorial_description.trim() || restaurantEditorialHeroMock.description,
    quote: {
      line: row.editorial_quote_line.trim() || restaurantEditorialHeroMock.quote.line,
      attribution:
        row.editorial_quote_attribution.trim() || restaurantEditorialHeroMock.quote.attribution,
    },
    imageSrc: editorialHeroImageSrc,
    imageAlt: editorialHeroImageAlt,
  } as RestaurantEditorialHeroMock

  const introBodyRaw = row.intro_body.trim() || row.hero_description.trim()
  const cmsParas = paragraphsFromDescription(introBodyRaw)
  const introParagraphs =
    cmsParas.length > 0 ? cmsParas : [...restaurantEditorialIntroMock.paragraphs]

  const introImgId = row.intro_image_media_id
  const introM = introImgId ? media[introImgId] : undefined
  const introUrl = introM?.public_url?.trim()
  const introImageSrc = introUrl && introUrl.length > 0 ? introUrl : pageHeroImageSrc
  const introImageAlt = introM?.alt_text?.trim() || pageHeroImageAlt

  const editorialIntro = {
    ...restaurantEditorialIntroMock,
    eyebrow: row.intro_eyebrow.trim() || restaurantEditorialIntroMock.eyebrow,
    headlineLine1: row.intro_headline_line1.trim() || restaurantEditorialIntroMock.headlineLine1,
    headlineLine2: row.intro_headline_line2.trim() || restaurantEditorialIntroMock.headlineLine2,
    paragraphs: introParagraphs as readonly string[],
    imageSrc: introImageSrc,
    imageAlt: introImageAlt,
  } as RestaurantEditorialIntroMock

  const menuItems = menuCardsFromDb(row.menu_highlights_json, media)

  const seasonalGallery = {
    ...restaurantSeasonalFoodGalleryMock,
    items: menuItems,
  } as unknown as RestaurantSeasonalFoodGalleryMock

  const slots = atmosphereSlotsFromGallery(row.gallery_media_ids, media)
  const atmosphereGallery = {
    ...restaurantAtmosphereGalleryMock,
    slots,
  } as unknown as RestaurantAtmosphereGalleryMock

  return {
    pageHeroTitle,
    pageHeroSubtitle,
    pageHeroImageSrc,
    pageHeroImageAlt,
    editorialHero,
    editorialIntro,
    seasonalGallery,
    skanom: resolveSkanomSection(row, media),
    experiencePillars: resolveExperiencePillars(row.experience_pillars_json),
    atmosphereGallery,
  }
}
