import { cache } from "react"

import { aboutPageMock } from "@/data/mock/about"
import {
  homeBeyondDesign,
  homeHeroDesign,
  homeStrategicNetworkDesign,
} from "@/data/mock/homepage-visual"
import { createPublicSupabaseServerClient } from "@/lib/supabase/public-server-client"
import type { AboutContentRow, AboutValueCard } from "@/types/supabase-cms"

/** Marketing defaults when `values_json` is empty or invalid. */
const MOCK_VALUES: AboutValueCard[] = [
  {
    icon_material: "verified",
    title: "Reliability",
    body: "We build predictable quality into fuel, food, and service so customers always know what to expect.",
  },
  {
    icon_material: "favorite",
    title: "Care",
    body: "From forecourt cleanliness to guest support, we treat every visit as a premium hospitality moment.",
  },
  {
    icon_material: "trending_up",
    title: "Progress",
    body: "We continuously refine standards, training, and station experiences to raise the benchmark in Kosovo.",
  },
  {
    icon_material: "handshake",
    title: "Integrity",
    body: "We act transparently and responsibly in how we serve guests, partners, and communities.",
  },
  {
    icon_material: "groups_3",
    title: "Teamwork",
    body: "Our stations perform as one coordinated team to deliver consistent service every day.",
  },
  {
    icon_material: "bolt",
    title: "Efficiency",
    body: "We improve operational flow to save customer time without compromising quality.",
  },
]

export type AboutMediaLookup = Record<string, { public_url: string; alt_text: string | null }>

export type ResolvedAboutPage = {
  heroTitle: string
  heroSubtitle: string
  heroImageSrc: string
  heroImageAlt: string
  storyParagraphs: string[]
  storyImageSrc: string
  storyImageAlt: string
  missionTitle: string
  missionBody: string
  visionTitle: string
  visionBody: string
  missionStripSrc: string
  missionStripAlt: string
  whyUsAsideSrc: string
  whyUsAsideAlt: string
  partnershipAsideSrc: string
  partnershipAsideAlt: string
  values: AboutValueCard[]
}

export function normalizeAboutRow(raw: Record<string, unknown>): AboutContentRow {
  const e = ""
  const g = raw.gallery_media_ids
  let galleryList: string[] | null = null
  if (Array.isArray(g)) {
    galleryList = g.filter((x): x is string => typeof x === "string" && x.length > 0)
    if (galleryList.length === 0) galleryList = null
  }

  const fk = (k: keyof AboutContentRow): string | null =>
    typeof raw[k as string] === "string" && (raw[k as string] as string).length > 0
      ? (raw[k as string] as string)
      : null

  return {
    id: Number(raw.id) || 1,
    hero_title: typeof raw.hero_title === "string" ? raw.hero_title : e,
    hero_subtitle: typeof raw.hero_subtitle === "string" ? raw.hero_subtitle : e,
    company_story: raw.company_story ?? [],
    mission_title: typeof raw.mission_title === "string" ? raw.mission_title : e,
    mission_body: typeof raw.mission_body === "string" ? raw.mission_body : e,
    vision_title: typeof raw.vision_title === "string" ? raw.vision_title : e,
    vision_body: typeof raw.vision_body === "string" ? raw.vision_body : e,
    values_json: raw.values_json ?? [],
    hero_media_id: typeof raw.hero_media_id === "string" ? raw.hero_media_id : null,
    story_media_id: typeof raw.story_media_id === "string" ? raw.story_media_id : null,
    gallery_media_ids: galleryList,
    gallery_strip_media_id: fk("gallery_strip_media_id"),
    gallery_why_us_media_id: fk("gallery_why_us_media_id"),
    gallery_partnerships_media_id: fk("gallery_partnerships_media_id"),
    updated_at: typeof raw.updated_at === "string" ? raw.updated_at : new Date().toISOString(),
    updated_by: typeof raw.updated_by === "string" ? raw.updated_by : null,
  }
}

export const getAboutContentPublic = cache(async (): Promise<{
  row: AboutContentRow | null
  media: AboutMediaLookup
}> => {
  const supabase = createPublicSupabaseServerClient()
  if (!supabase) return { row: null, media: {} }

  const { data: rawRow, error } = await supabase.from("about_content").select("*").eq("id", 1).maybeSingle()

  if (error) {
    console.warn("[getAboutContentPublic] Falling back:", error.message)
    return { row: null, media: {} }
  }
  if (!rawRow) return { row: null, media: {} }

  const row = normalizeAboutRow(rawRow as Record<string, unknown>)

  const ids = [
    row.hero_media_id,
    row.story_media_id,
    row.gallery_strip_media_id,
    row.gallery_why_us_media_id,
    row.gallery_partnerships_media_id,
    ...(row.gallery_media_ids ?? []),
  ].filter((x): x is string => typeof x === "string" && x.length > 0)

  let media: AboutMediaLookup = {}
  if (ids.length > 0) {
    const { data: uploads, error: me } = await supabase
      .from("media_uploads")
      .select("id, public_url, alt_text")
      .in("id", [...new Set(ids)])

    if (me) console.warn("[getAboutContentPublic] Media:", me.message)
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

function paragraphTextFromStoryItem(item: unknown): string | null {
  if (typeof item === "string") return item.trim() || null
  if (!item || typeof item !== "object") return null
  const rec = item as Record<string, unknown>
  if (typeof rec.paragraph === "string") return rec.paragraph.trim() || null
  if (typeof rec.text === "string") return rec.text.trim() || null
  if (typeof rec.body === "string") return rec.body.trim() || null
  return null
}

/** Parse `company_story` JSON — array of strings or objects with paragraph/text/body keys. */
export function storyParagraphsFromDb(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  const out = raw.map(paragraphTextFromStoryItem).filter((x): x is string => !!x && x.length > 0)
  return out
}

export function valueCardsFromDb(raw: unknown): AboutValueCard[] {
  if (!Array.isArray(raw) || raw.length === 0) return []
  const out: AboutValueCard[] = []
  for (const item of raw) {
    if (!item || typeof item !== "object") continue
    const r = item as Record<string, unknown>
    const title = typeof r.title === "string" ? r.title.trim() : ""
    const body = typeof r.body === "string" ? r.body.trim() : ""
    let icon_material =
      typeof r.icon_material === "string"
        ? r.icon_material.trim()
        : typeof r.icon === "string"
          ? r.icon.trim()
          : "verified"
    if (!/^[a-z0-9_]+$/.test(icon_material)) icon_material = "verified"
    if (!title || !body) continue
    out.push({ title, body, icon_material })
  }
  return out
}

function lookup(media: AboutMediaLookup, id: string | null, fallbackSrc: string, fallbackAlt: string) {
  if (!id || !media[id]?.public_url) {
    return { src: fallbackSrc, alt: fallbackAlt }
  }
  return {
    src: media[id].public_url,
    alt: media[id].alt_text?.trim() || fallbackAlt,
  }
}

export function resolveAboutPage(row: AboutContentRow | null, media: AboutMediaLookup): ResolvedAboutPage {
  if (!row) {
    return {
      heroTitle: "About Euromiti",
      heroSubtitle:
        "A disciplined roadside network anchored in Prishtina, Ferizaj, and Gjilan - blending premium fuels with dining, convenience, and car care.",
      heroImageSrc: homeHeroDesign.imageSrc,
      heroImageAlt: homeHeroDesign.imageAlt,
      storyParagraphs: [...aboutPageMock.introParagraphs],
      storyImageSrc: homeStrategicNetworkDesign[0].imageSrc,
      storyImageAlt: homeStrategicNetworkDesign[0].imageAlt,
      missionTitle: aboutPageMock.mission.title,
      missionBody: aboutPageMock.mission.body,
      visionTitle: aboutPageMock.vision.title,
      visionBody: aboutPageMock.vision.body,
      missionStripSrc: homeStrategicNetworkDesign[1].imageSrc,
      missionStripAlt: homeStrategicNetworkDesign[1].imageAlt,
      whyUsAsideSrc: homeHeroDesign.imageSrc,
      whyUsAsideAlt: "Euromiti forecourt experience",
      partnershipAsideSrc: homeBeyondDesign.restaurant.float2,
      partnershipAsideAlt: "Euromiti hospitality and partnership support",
      values: MOCK_VALUES,
    }
  }

  const fallbackStrip = row?.gallery_media_ids?.[0] ?? null
  const fallbackWhy = row?.gallery_media_ids?.[1] ?? null
  const fallbackPartner = row?.gallery_media_ids?.[2] ?? null

  const g0 = row?.gallery_strip_media_id ?? fallbackStrip
  const g1 = row?.gallery_why_us_media_id ?? fallbackWhy
  const g2 = row?.gallery_partnerships_media_id ?? fallbackPartner

  return {
    heroTitle: row.hero_title.trim(),
    heroSubtitle: row.hero_subtitle.trim(),
    ...(() => {
      const h = lookup(media, row.hero_media_id, homeHeroDesign.imageSrc, homeHeroDesign.imageAlt)
      return {
        heroImageSrc: h.src,
        heroImageAlt: h.alt,
      }
    })(),
    storyParagraphs: storyParagraphsFromDb(row.company_story),
    ...(() => {
      const m = lookup(
        media,
        row.story_media_id,
        homeStrategicNetworkDesign[0].imageSrc,
        homeStrategicNetworkDesign[0].imageAlt
      )
      return { storyImageSrc: m.src, storyImageAlt: m.alt }
    })(),
    missionTitle: row.mission_title.trim(),
    missionBody: row.mission_body.trim(),
    visionTitle: row.vision_title.trim(),
    visionBody: row.vision_body.trim(),
    ...(() => {
      const s = lookup(
        media,
        g0,
        homeStrategicNetworkDesign[1].imageSrc,
        homeStrategicNetworkDesign[1].imageAlt
      )
      return { missionStripSrc: s.src, missionStripAlt: s.alt }
    })(),
    ...(() => {
      const s = lookup(media, g1, homeHeroDesign.imageSrc, "Euromiti forecourt experience")
      return { whyUsAsideSrc: s.src, whyUsAsideAlt: s.alt }
    })(),
    ...(() => {
      const s = lookup(
        media,
        g2,
        homeBeyondDesign.restaurant.float2,
        "Euromiti hospitality and partnership support"
      )
      return { partnershipAsideSrc: s.src, partnershipAsideAlt: s.alt }
    })(),
    values: valueCardsFromDb(row.values_json),
  }
}

/** Serialize company story paragraphs to JSON payload for Postgres `company_story`. */
export function companyStoryJsonFromParagraphs(paragraphs: string[]) {
  return paragraphs.map((p) => p.trim()).filter(Boolean)
}

/** Up to eight editable value rows on `/admin/about` (extras in DB hidden). */
export function valueSlotsForAdmin(cards: AboutValueCard[]): AboutValueCard[] {
  const out = [...cards].slice(0, 8)
  while (out.length < 8) {
    out.push({ title: "", body: "", icon_material: "" })
  }
  return out
}
