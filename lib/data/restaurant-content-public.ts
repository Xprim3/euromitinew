import { cache } from "react"

import {
  restaurantAtmosphereGalleryMock,
  restaurantEditorialHeroMock,
  restaurantEditorialIntroMock,
  restaurantSeasonalFoodGalleryMock,
  type RestaurantAtmosphereGalleryMock,
  type RestaurantEditorialHeroMock,
  type RestaurantEditorialIntroMock,
  type RestaurantSeasonalFoodGalleryMock,
} from "@/data/mock/restaurant-page"
import { homeBeyondDesign } from "@/data/mock/homepage-visual"
import { createPublicSupabaseServerClient } from "@/lib/supabase/public-server-client"
import type { RestaurantDeskInfo } from "@/types/public"
import type { RestaurantContentRow } from "@/types/supabase-cms"

type MediaMap = Record<string, { public_url: string; alt_text: string | null }>

export type ResolvedRestaurantPage = {
  pageHeroTitle: string
  pageHeroSubtitle: string
  pageHeroImageSrc: string
  pageHeroImageAlt: string
  editorialHero: RestaurantEditorialHeroMock
  editorialIntro: RestaurantEditorialIntroMock
  seasonalGallery: RestaurantSeasonalFoodGalleryMock
  atmosphereGallery: RestaurantAtmosphereGalleryMock
  deskInfo: RestaurantDeskInfo | null
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
    hero_image_media_id: fk("hero_image_media_id"),
    opening_hours: typeof raw.opening_hours === "string" ? raw.opening_hours : "",
    contact_phone: fk("contact_phone"),
    contact_email: fk("contact_email"),
    contact_notes: raw.contact_notes == null ? null : typeof raw.contact_notes === "string" ? raw.contact_notes : null,
    menu_highlights_json: raw.menu_highlights_json ?? [],
    gallery_media_ids,
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
    if (out.length >= 12) break
  }
  return out
}

function defaultMenuItems() {
  return restaurantSeasonalFoodGalleryMock.items.map((it) => ({
    title: it.title,
    description: it.description,
    src: it.src,
    alt: it.alt,
  }))
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
  for (let i = 0; i < 5; i++) {
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

  const allIds = [...new Set([row.hero_image_media_id, ...menuIds, ...galleryIds].filter((x): x is string => Boolean(x)))]

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

export function resolveRestaurantPage(row: RestaurantContentRow | null, media: MediaMap): ResolvedRestaurantPage {
  const defaultHeroSrc = homeBeyondDesign.restaurant.mainImage
  const defaultHeroAlt = homeBeyondDesign.restaurant.mainImageAlt

  const heroId = row?.hero_image_media_id ?? null
  const heroM = heroId ? media[heroId] : undefined
  const heroUrl = heroM?.public_url?.trim()
  const pageHeroImageSrc = heroUrl && heroUrl.length > 0 ? heroUrl : defaultHeroSrc
  const pageHeroImageAlt = heroM?.alt_text?.trim() || defaultHeroAlt

  const pageHeroTitle = row?.hero_title?.trim() || "Restaurant"
  const pageHeroSubtitle =
    row?.hero_subtitle?.trim() ||
    "Chef-led dining, curated menus, and hospitality standards designed to elevate every Euromiti stop."

  const editorialHero = {
    ...restaurantEditorialHeroMock,
    imageSrc: pageHeroImageSrc,
    imageAlt: pageHeroImageAlt,
  } as RestaurantEditorialHeroMock

  const desc = row?.hero_description?.trim() ?? ""
  const cmsParas = paragraphsFromDescription(desc)
  const introParagraphs =
    cmsParas.length > 0 ? cmsParas : [...restaurantEditorialIntroMock.paragraphs]

  const editorialIntro = {
    ...restaurantEditorialIntroMock,
    paragraphs: introParagraphs as readonly string[],
    imageSrc: pageHeroImageSrc,
    imageAlt: pageHeroImageAlt,
  } as RestaurantEditorialIntroMock

  const menuResolved = menuCardsFromDb(row?.menu_highlights_json, media)
  const menuItems = menuResolved.length > 0 ? menuResolved : defaultMenuItems()

  const seasonalGallery = {
    ...restaurantSeasonalFoodGalleryMock,
    items: menuItems,
  } as unknown as RestaurantSeasonalFoodGalleryMock

  const slots = atmosphereSlotsFromGallery(row?.gallery_media_ids ?? null, media)
  const atmosphereGallery = {
    ...restaurantAtmosphereGalleryMock,
    slots,
  } as unknown as RestaurantAtmosphereGalleryMock

  const phone = row?.contact_phone?.trim() ?? ""
  const email = row?.contact_email?.trim() ?? ""
  const notes = row?.contact_notes?.trim() ?? ""
  const hours = row?.opening_hours?.trim() ?? ""

  const deskInfo: RestaurantDeskInfo | null =
    hours || phone || email || notes
      ? {
          openingHours: hours || "—",
          phone: phone || "—",
          email: email || "—",
          notes: notes || "",
        }
      : null

  return {
    pageHeroTitle,
    pageHeroSubtitle,
    pageHeroImageSrc,
    pageHeroImageAlt,
    editorialHero,
    editorialIntro,
    seasonalGallery,
    atmosphereGallery,
    deskInfo,
  }
}
