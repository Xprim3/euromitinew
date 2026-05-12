import { cache } from "react"

import { aboutPageMock } from "@/data/mock/about"
import {
  homeBeyondDesign,
  homeHeroDesign,
  homeStrategicNetworkDesign,
} from "@/data/mock/homepage-visual"
import { createPublicSupabaseServerClient } from "@/lib/supabase/public-server-client"
import type { AboutContentRow, AboutValueCard, AboutWhyReason } from "@/types/supabase-cms"

/** Marketing defaults when `values_json` is empty or invalid. */
const MOCK_VALUES: AboutValueCard[] = [
  {
    icon_material: "verified",
    title: "Besueshmëri",
    body: "Ndërtojmë cilësi të qëndrueshme në karburant, ushqim dhe shërbim, që klientët ta dinë gjithmonë çfarë të presin.",
  },
  {
    icon_material: "favorite",
    title: "Kujdes",
    body: "Nga pastërtia e stacionit te mbështetja e klientit, çdo vizitë trajtohet si moment mikpritjeje premium.",
  },
  {
    icon_material: "trending_up",
    title: "Përparim",
    body: "Përmirësojmë vazhdimisht standardet, trajnimin dhe përvojën në stacione për të ngritur standardin në Kosovë.",
  },
  {
    icon_material: "handshake",
    title: "Integritet",
    body: "Veprojmë me transparencë dhe përgjegjësi ndaj klientëve, partnerëve dhe komuniteteve.",
  },
  {
    icon_material: "groups_3",
    title: "Punë ekipore",
    body: "Stacionet tona funksionojnë si një ekip i koordinuar për të ofruar shërbim të qëndrueshëm çdo ditë.",
  },
  {
    icon_material: "bolt",
    title: "Efikasitet",
    body: "Përmirësojmë rrjedhën e punës për të kursyer kohën e klientëve pa cenuar cilësinë.",
  },
]

export const DEFAULT_WHY_CHOOSE_REASONS: AboutWhyReason[] = [
  {
    icon_material: "verified",
    title: "Standarde të qëndrueshme cilësie",
    body: "Standarde të unifikuara për karburantin, pastërtinë dhe gatishmërinë e shërbimit.",
  },
  {
    icon_material: "groups",
    title: "Ekipe me kulturë mikpritjeje",
    body: "Shërbim i respektueshëm dhe efikas, i ndërtuar rreth kujdesit real për klientin.",
  },
  {
    icon_material: "bolt",
    title: "Përvojë e shpejtë dhe e besueshme",
    body: "Qarkullim i optimizuar në stacion dhe shërbime të shpejta për ndalesa më të lehta.",
  },
  {
    icon_material: "workspace_premium",
    title: "Ekosistem premium në rrugë",
    body: "Karburant, restaurant, market, autolarje dhe shërbime familjare në një vend.",
  },
  {
    icon_material: "construction",
    title: "Stacione të pastra dhe të mirëmbajtura",
    body: "Mirëmbajtja e rregullt i mban stacionet të ndriçuara, të sigurta dhe funksionale.",
  },
  {
    icon_material: "support_agent",
    title: "Mbështetje lokale e shpejtë",
    body: "Ekipet në lokacion i zgjidhin kërkesat shpejt, me përgjegjësi praktike dhe lokale.",
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
  ownerKicker: string
  ownerTitle: string
  ownerName: string
  ownerRole: string
  ownerBody: string
  ownerImageSrc: string
  ownerImageAlt: string
  whyUsAsideSrc: string
  whyUsAsideAlt: string
  partnershipAsideSrc: string
  partnershipAsideAlt: string
  values: AboutValueCard[]
  whyChooseHeading: string
  whyChooseReasons: AboutWhyReason[]
  offerLabel: string
  offerTitle: string
  offerDescription: string
  offerCards: AboutOfferCard[]
}

export type AboutOfferCard = {
  key: "fuel" | "restaurant" | "playground" | "carwash" | "mini_market"
  icon: string
  title: string
  body: string
  imageSrc: string
  imageAlt: string
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
    why_choose_heading: typeof raw.why_choose_heading === "string" ? raw.why_choose_heading : e,
    why_choose_reasons_json: raw.why_choose_reasons_json ?? [],
    offer_label: typeof raw.offer_label === "string" ? raw.offer_label : e,
    offer_title: typeof raw.offer_title === "string" ? raw.offer_title : e,
    offer_description: typeof raw.offer_description === "string" ? raw.offer_description : e,
    offer_fuel_title: typeof raw.offer_fuel_title === "string" ? raw.offer_fuel_title : e,
    offer_fuel_body: typeof raw.offer_fuel_body === "string" ? raw.offer_fuel_body : e,
    offer_fuel_media_id: fk("offer_fuel_media_id"),
    offer_restaurant_title: typeof raw.offer_restaurant_title === "string" ? raw.offer_restaurant_title : e,
    offer_restaurant_body: typeof raw.offer_restaurant_body === "string" ? raw.offer_restaurant_body : e,
    offer_restaurant_media_id: fk("offer_restaurant_media_id"),
    offer_playground_title: typeof raw.offer_playground_title === "string" ? raw.offer_playground_title : e,
    offer_playground_body: typeof raw.offer_playground_body === "string" ? raw.offer_playground_body : e,
    offer_playground_media_id: fk("offer_playground_media_id"),
    offer_carwash_title: typeof raw.offer_carwash_title === "string" ? raw.offer_carwash_title : e,
    offer_carwash_body: typeof raw.offer_carwash_body === "string" ? raw.offer_carwash_body : e,
    offer_carwash_media_id: fk("offer_carwash_media_id"),
    offer_mini_market_title: typeof raw.offer_mini_market_title === "string" ? raw.offer_mini_market_title : e,
    offer_mini_market_body: typeof raw.offer_mini_market_body === "string" ? raw.offer_mini_market_body : e,
    offer_mini_market_media_id: fk("offer_mini_market_media_id"),
    owner_section_kicker: typeof raw.owner_section_kicker === "string" ? raw.owner_section_kicker : e,
    owner_section_title: typeof raw.owner_section_title === "string" ? raw.owner_section_title : e,
    owner_name: typeof raw.owner_name === "string" ? raw.owner_name : e,
    owner_role: typeof raw.owner_role === "string" ? raw.owner_role : e,
    owner_body: typeof raw.owner_body === "string" ? raw.owner_body : e,
    owner_media_id: fk("owner_media_id"),
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
    row.owner_media_id,
    row.offer_fuel_media_id,
    row.offer_restaurant_media_id,
    row.offer_playground_media_id,
    row.offer_carwash_media_id,
    row.offer_mini_market_media_id,
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

export function whyReasonsFromDb(raw: unknown): AboutWhyReason[] {
  if (!Array.isArray(raw) || raw.length === 0) return []
  const out: AboutWhyReason[] = []
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

function textOrFallback(value: string | null | undefined, fallback: string) {
  return value?.trim() || fallback
}

function offerCard(
  media: AboutMediaLookup,
  key: AboutOfferCard["key"],
  icon: string,
  title: string,
  body: string,
  imageId: string | null,
  fallbackSrc: string,
  fallbackAlt: string
): AboutOfferCard {
  const image = lookup(media, imageId, fallbackSrc, fallbackAlt)
  return {
    key,
    icon,
    title,
    body,
    imageSrc: image.src,
    imageAlt: image.alt,
  }
}

export function resolveAboutPage(row: AboutContentRow | null, media: AboutMediaLookup): ResolvedAboutPage {
  if (!row) {
    return {
      heroTitle: "Rreth Euromitit",
      heroSubtitle:
        "Një rrjet i organizuar shërbimesh në Prishtinë, Ferizaj dhe Gjilan, që bashkon karburante cilësore, restaurant, komoditet dhe kujdes për veturën.",
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
      ownerKicker: "Pronari",
      ownerTitle: "Njerëzit pas standardit Euromiti",
      ownerName: "Pronari i Euromitit",
      ownerRole: "Themelues dhe drejtues i kompanisë",
      ownerBody:
        "Euromiti është ndërtuar me vizion vendor: të krijojë ndalesa të besueshme ku karburanti, ushqimi, marketi dhe shërbimi funksionojnë me kujdes të njëjtë.",
      ownerImageSrc: homeStrategicNetworkDesign[0].imageSrc,
      ownerImageAlt: "Pronari i Euromitit",
      whyUsAsideSrc: homeHeroDesign.imageSrc,
      whyUsAsideAlt: "Përvoja në stacionet Euromiti",
      partnershipAsideSrc: homeBeyondDesign.restaurant.float2,
      partnershipAsideAlt: "Mikpritje dhe partneritet në Euromiti",
      values: MOCK_VALUES,
      whyChooseHeading: "Pse të na zgjidhni",
      whyChooseReasons: DEFAULT_WHY_CHOOSE_REASONS,
      offerLabel: "Çfarë ofrojmë",
      offerTitle: "Shërbime të integruara në një ekosistem premium",
      offerDescription:
        "Nga furnizimi me karburant deri te pushimi për kafe, çdo shërbim funksionon me standardet e Euromitit.",
      offerCards: [
        offerCard(
          media,
          "fuel",
          "local_gas_station",
          "Karburant cilësor",
          "Standarde cilësore të karburantit, operim i kujdesshëm në stacion dhe qëndrueshmëri në çdo lokacion të Euromitit.",
          null,
          homeStrategicNetworkDesign[0].imageSrc,
          "Karburant cilësor në Euromiti"
        ),
        offerCard(media, "restaurant", "restaurant", "Restaurant", "Ushqim i freskët, kafe e përzgjedhur dhe ndalesë e qetë për familje dhe udhëtarë.", null, homeBeyondDesign.restaurant.mainImage, "Restaurant në Euromiti"),
        offerCard(media, "playground", "toys", "Këndi i lojërave", "Hapësira familjare në stacione të përzgjedhura ku fëmijët pushojnë dhe luajnë të sigurt.", null, homeBeyondDesign.secondaryServices[0].imageSrc, "Këndi i lojërave në Euromiti"),
        offerCard(media, "carwash", "local_car_wash", "Autolarje", "Larje e shpejtë dhe e kujdesshme për udhëtime të përditshme dhe rrugë të gjata.", null, homeBeyondDesign.secondaryServices[2].imageSrc, "Autolarje në Euromiti"),
        offerCard(media, "mini_market", "shopping_bag", "Mini Market", "Produkte për rrugë, ushqime, pije dhe artikuj praktikë në një ndalesë të lehtë.", null, homeBeyondDesign.secondaryServices[1].imageSrc, "Mini Market në Euromiti"),
      ],
    }
  }

  const fallbackStrip = row?.gallery_media_ids?.[0] ?? null
  const fallbackWhy = row?.gallery_media_ids?.[1] ?? null
  const fallbackPartner = row?.gallery_media_ids?.[2] ?? null

  const g0 = row?.gallery_strip_media_id ?? fallbackStrip
  const g1 = row?.gallery_why_us_media_id ?? fallbackWhy
  const g2 = row?.gallery_partnerships_media_id ?? fallbackPartner
  const whyReasons = whyReasonsFromDb(row.why_choose_reasons_json)

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
      const s = lookup(
        media,
        row.owner_media_id,
        homeStrategicNetworkDesign[0].imageSrc,
        "Pronari i Euromitit"
      )
      return {
        ownerImageSrc: s.src,
        ownerImageAlt: s.alt,
      }
    })(),
    ownerKicker: textOrFallback(row.owner_section_kicker, "Pronari"),
    ownerTitle: textOrFallback(row.owner_section_title, "Njerëzit pas standardit Euromiti"),
    ownerName: textOrFallback(row.owner_name, "Pronari i Euromitit"),
    ownerRole: textOrFallback(row.owner_role, "Themelues dhe drejtues i kompanisë"),
    ownerBody: textOrFallback(
      row.owner_body,
      "Euromiti është ndërtuar me vizion vendor: të krijojë ndalesa të besueshme ku karburanti, ushqimi, marketi dhe shërbimi funksionojnë me kujdes të njëjtë."
    ),
    ...(() => {
      const s = lookup(media, g1, homeHeroDesign.imageSrc, "Përvoja në stacionet Euromiti")
      return { whyUsAsideSrc: s.src, whyUsAsideAlt: s.alt }
    })(),
    ...(() => {
      const s = lookup(
        media,
        g2,
        homeBeyondDesign.restaurant.float2,
        "Mikpritje dhe partneritet në Euromiti"
      )
      return { partnershipAsideSrc: s.src, partnershipAsideAlt: s.alt }
    })(),
    values: valueCardsFromDb(row.values_json),
    whyChooseHeading: textOrFallback(row.why_choose_heading, "Pse të na zgjidhni"),
    whyChooseReasons: whyReasons.length ? whyReasons : DEFAULT_WHY_CHOOSE_REASONS,
    offerLabel: "Çfarë ofrojmë",
    offerTitle: "Shërbime të integruara në një ekosistem premium",
    offerDescription: "Nga furnizimi me karburant deri te pushimi për kafe, çdo shërbim funksionon me standardet e Euromitit.",
    offerCards: [
      offerCard(
        media,
        "fuel",
        "local_gas_station",
        textOrFallback(row.offer_fuel_title, "Karburant cilësor"),
        textOrFallback(
          row.offer_fuel_body,
          "Standarde cilësore të karburantit, operim i kujdesshëm në stacion dhe qëndrueshmëri në çdo lokacion të Euromitit."
        ),
        row.offer_fuel_media_id,
        homeStrategicNetworkDesign[0].imageSrc,
        "Karburant cilësor në Euromiti"
      ),
      offerCard(
        media,
        "restaurant",
        "restaurant",
        textOrFallback(row.offer_restaurant_title, "Restaurant"),
        textOrFallback(row.offer_restaurant_body, "Ushqim i freskët, kafe e përzgjedhur dhe ndalesë e qetë për familje dhe udhëtarë."),
        row.offer_restaurant_media_id,
        homeBeyondDesign.restaurant.mainImage,
        "Restaurant në Euromiti"
      ),
      offerCard(
        media,
        "playground",
        "toys",
        textOrFallback(row.offer_playground_title, "Këndi i lojërave"),
        textOrFallback(row.offer_playground_body, "Hapësira familjare në stacione të përzgjedhura ku fëmijët pushojnë dhe luajnë të sigurt."),
        row.offer_playground_media_id,
        homeBeyondDesign.secondaryServices[0].imageSrc,
        "Këndi i lojërave në Euromiti"
      ),
      offerCard(
        media,
        "carwash",
        "local_car_wash",
        textOrFallback(row.offer_carwash_title, "Autolarje"),
        textOrFallback(row.offer_carwash_body, "Larje e shpejtë dhe e kujdesshme për udhëtime të përditshme dhe rrugë të gjata."),
        row.offer_carwash_media_id,
        homeBeyondDesign.secondaryServices[2].imageSrc,
        "Autolarje në Euromiti"
      ),
      offerCard(
        media,
        "mini_market",
        "shopping_bag",
        textOrFallback(row.offer_mini_market_title, "Mini Market"),
        textOrFallback(row.offer_mini_market_body, "Produkte për rrugë, ushqime, pije dhe artikuj praktikë në një ndalesë të lehtë."),
        row.offer_mini_market_media_id,
        homeBeyondDesign.secondaryServices[1].imageSrc,
        "Mini Market në Euromiti"
      ),
    ],
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

/** Six editable rows matching the current public "Why Choose Us" layout. */
export function whyReasonSlotsForAdmin(reasons: AboutWhyReason[]): AboutWhyReason[] {
  const source = reasons.length ? reasons : DEFAULT_WHY_CHOOSE_REASONS
  const out = [...source].slice(0, 6)
  while (out.length < 6) {
    out.push({ title: "", body: "", icon_material: "verified" })
  }
  return out
}
