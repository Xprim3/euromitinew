import { unstable_noStore } from "next/cache"
import { cache } from "react"

import { homeHeroDesign } from "@/data/mock/homepage-visual"
import { getPublicHomepageSingleton, heroFromHomepageCMS } from "@/lib/data/homepage-singleton-public"
import { createPublicSupabaseServerClient } from "@/lib/supabase/public-server-client"
import type { SiteSettingsRow } from "@/types/supabase-cms"

export type InteriorPageHeroKey = "contact" | "locations" | "careers" | "news"

export type ResolvedPageHero = {
  imageSrc: string
  imageAlt: string
}

const PAGE_HERO_FIELDS: Record<
  InteriorPageHeroKey,
  { mediaId: keyof SiteSettingsRow; alt: keyof SiteSettingsRow }
> = {
  contact: { mediaId: "contact_page_hero_media_id", alt: "contact_page_hero_image_alt" },
  locations: { mediaId: "locations_page_hero_media_id", alt: "locations_page_hero_image_alt" },
  careers: { mediaId: "careers_page_hero_media_id", alt: "careers_page_hero_image_alt" },
  news: { mediaId: "news_page_hero_media_id", alt: "news_page_hero_image_alt" },
}

function normalizeSiteSettingsForHero(raw: Record<string, unknown>): SiteSettingsRow {
  const fk = (key: string): string | null =>
    typeof raw[key] === "string" && (raw[key] as string).length > 0 ? (raw[key] as string) : null

  return {
    id: Number(raw.id) || 1,
    logo_media_id: fk("logo_media_id"),
    company_name: typeof raw.company_name === "string" ? raw.company_name : "",
    social_links: raw.social_links ?? [],
    footer_body: typeof raw.footer_body === "string" ? raw.footer_body : "",
    footer_copyright_line: typeof raw.footer_copyright_line === "string" ? raw.footer_copyright_line : null,
    contact_page_hero_media_id: fk("contact_page_hero_media_id"),
    contact_page_hero_image_alt: typeof raw.contact_page_hero_image_alt === "string" ? raw.contact_page_hero_image_alt : "",
    locations_page_hero_media_id: fk("locations_page_hero_media_id"),
    locations_page_hero_image_alt:
      typeof raw.locations_page_hero_image_alt === "string" ? raw.locations_page_hero_image_alt : "",
    careers_page_hero_media_id: fk("careers_page_hero_media_id"),
    careers_page_hero_image_alt: typeof raw.careers_page_hero_image_alt === "string" ? raw.careers_page_hero_image_alt : "",
    news_page_hero_media_id: fk("news_page_hero_media_id"),
    news_page_hero_image_alt: typeof raw.news_page_hero_image_alt === "string" ? raw.news_page_hero_image_alt : "",
    updated_at: typeof raw.updated_at === "string" ? raw.updated_at : "",
    updated_by: fk("updated_by"),
  }
}

async function defaultPageHero(): Promise<ResolvedPageHero> {
  try {
    const { row, media } = await getPublicHomepageSingleton()
    const h = heroFromHomepageCMS(row, media)
    return { imageSrc: h.imageSrc, imageAlt: h.imageAlt }
  } catch {
    return { imageSrc: homeHeroDesign.imageSrc, imageAlt: homeHeroDesign.imageAlt }
  }
}

export const getInteriorPageHeroPublic = cache(
  async (page: InteriorPageHeroKey, defaultAlt: string): Promise<ResolvedPageHero> => {
    unstable_noStore()
    const fallback = await defaultPageHero()
    const supabase = createPublicSupabaseServerClient()
    if (!supabase) {
      return { imageSrc: fallback.imageSrc, imageAlt: defaultAlt || fallback.imageAlt }
    }

    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle()
    if (error || !data) {
      return { imageSrc: fallback.imageSrc, imageAlt: defaultAlt || fallback.imageAlt }
    }

    const row = normalizeSiteSettingsForHero(data as Record<string, unknown>)
    const fields = PAGE_HERO_FIELDS[page]
    const mediaId = row[fields.mediaId] as string | null
    const storedAlt = (row[fields.alt] as string).trim()

    if (!mediaId) {
      return { imageSrc: fallback.imageSrc, imageAlt: storedAlt || defaultAlt || fallback.imageAlt }
    }

    const { data: upload } = await supabase
      .from("media_uploads")
      .select("public_url, alt_text")
      .eq("id", mediaId)
      .maybeSingle()

    const url = upload?.public_url?.trim()
    if (!url) {
      return { imageSrc: fallback.imageSrc, imageAlt: storedAlt || defaultAlt || fallback.imageAlt }
    }

    return {
      imageSrc: url,
      imageAlt: upload?.alt_text?.trim() || storedAlt || defaultAlt || fallback.imageAlt,
    }
  }
)
