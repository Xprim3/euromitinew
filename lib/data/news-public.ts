import { cache } from "react"

import {
  getNewsArticleBySlug as getMockNewsArticleBySlug,
  mockNewsArticles,
  mockNewsSummaries,
} from "@/data/mock"
import { createPublicSupabaseServerClient } from "@/lib/supabase/public-server-client"
import type { NewsArticle, NewsSummary } from "@/types/public"
import type { NewsPostRow } from "@/types/supabase-cms"

export function bodyParagraphsFromJson(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw.map((x) => (typeof x === "string" ? x.trim() : "")).filter(Boolean)
}

function fallbackSummaryByIndex(i: number): Pick<NewsSummary, "imageSrc" | "imageAlt"> {
  if (mockNewsSummaries.length) {
    const hit = mockNewsSummaries[i % mockNewsSummaries.length]!
    return { imageSrc: hit.imageSrc, imageAlt: hit.imageAlt }
  }
  const a = mockNewsArticles[i % mockNewsArticles.length]!
  return { imageSrc: a.imageSrc, imageAlt: a.imageAlt }
}

export function normalizeNewsPostRow(raw: Record<string, unknown>): NewsPostRow {
  return {
    id: String(raw.id ?? ""),
    slug: typeof raw.slug === "string" ? raw.slug : "",
    title: typeof raw.title === "string" ? raw.title : "",
    excerpt: typeof raw.excerpt === "string" ? raw.excerpt : "",
    status: typeof raw.status === "string" ? raw.status : "draft",
    category: typeof raw.category === "string" ? raw.category : null,
    teaser_label:
      "teaser_label" in raw && typeof raw.teaser_label === "string" ? raw.teaser_label : null,
    published_at: typeof raw.published_at === "string" ? raw.published_at : null,
    hero_media_id: typeof raw.hero_media_id === "string" && raw.hero_media_id.length > 0 ? raw.hero_media_id : null,
    hero_image_alt: typeof raw.hero_image_alt === "string" ? raw.hero_image_alt : null,
    body: raw.body ?? [],
    created_at: typeof raw.created_at === "string" ? raw.created_at : "",
    updated_at: typeof raw.updated_at === "string" ? raw.updated_at : "",
  }
}

async function resolveMediaUrls(
  supabase: NonNullable<ReturnType<typeof createPublicSupabaseServerClient>>,
  ids: string[]
): Promise<Record<string, { url: string; alt: string | null }>> {
  const uniq = [...new Set(ids.filter(Boolean))]
  if (!uniq.length) return {}

  const { data, error } = await supabase.from("media_uploads").select("id, public_url, alt_text").in("id", uniq)
  if (error || !data?.length) return {}

  return Object.fromEntries(
    data.map((u: { id: string; public_url: string | null; alt_text: string | null }) => [
      u.id,
      { url: (u.public_url ?? "").trim(), alt: u.alt_text },
    ])
  )
}

function rowToSummary(row: NewsPostRow, media: Record<string, { url: string; alt: string | null }>, index: number): NewsSummary {
  const m = row.hero_media_id ? media[row.hero_media_id] : undefined
  const fb = fallbackSummaryByIndex(index)
  const url = m?.url && m.url.length > 0 ? m.url : fb.imageSrc
  const alt = (m?.alt?.trim() || row.hero_image_alt?.trim() || fb.imageAlt).slice(0, 240)

  const publishedAt =
    row.published_at && row.published_at.length > 0 ? row.published_at : row.updated_at || new Date().toISOString()

  const category = row.category?.trim() || "Company Updates"
  const teaserLabel = row.teaser_label?.trim() || undefined

  return {
    id: row.id,
    slug: row.slug,
    title: row.title.trim(),
    excerpt: row.excerpt.trim(),
    publishedAt,
    imageSrc: url,
    imageAlt: alt || "Euromiti news",
    category,
    ...(teaserLabel ? { teaserLabel } : {}),
  }
}

async function fetchPublishedPostsInternal(): Promise<NewsPostRow[] | null> {
  const supabase = createPublicSupabaseServerClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })

  if (error) {
    console.warn("[fetchPublishedPostsInternal]", error.message)
    return null
  }

  return (data ?? []).map((r) => normalizeNewsPostRow(r as Record<string, unknown>))
}

/** All published articles as summary cards (`/news`). Uses mocks when Supabase is missing or requests fail; returns [] only when DB is reachable but empty. */
export const getPublishedNewsSummariesPublic = cache(async (): Promise<NewsSummary[]> => {
  const rows = await fetchPublishedPostsInternal()
  if (rows === null) return mockNewsSummaries
  if (rows.length === 0) return []

  const supabase = createPublicSupabaseServerClient()
  const ids = rows.map((r) => r.hero_media_id).filter((x): x is string => Boolean(x))

  let media: Record<string, { url: string; alt: string | null }> = {}
  if (supabase && ids.length > 0) media = await resolveMediaUrls(supabase, ids)

  return rows.map((row, i) => rowToSummary(row, media, i))
})

export const getLatestNewsForHomePublic = cache(async (limit = 2): Promise<NewsSummary[]> => {
  const all = await getPublishedNewsSummariesPublic()
  return all.slice(0, limit)
})

export const getNewsArticleBySlugPublic = cache(async (slug: string): Promise<NewsArticle | null> => {
  const supabase = createPublicSupabaseServerClient()
  if (!supabase) {
    const mock = getMockNewsArticleBySlug(slug)
    return mock ?? null
  }

  const { data, error } = await supabase.from("news_posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle()

  if (error) {
    console.warn("[getNewsArticleBySlugPublic]", error.message)
    return getMockNewsArticleBySlug(slug) ?? null
  }
  if (!data) return null

  const row = normalizeNewsPostRow(data as Record<string, unknown>)

  let media: Record<string, { url: string; alt: string | null }> = {}
  if (row.hero_media_id) media = await resolveMediaUrls(supabase, [row.hero_media_id])

  const summary = rowToSummary(row, media, 0)
  const paragraphs = bodyParagraphsFromJson(row.body)
  const contentParagraphs = paragraphs.length > 0 ? paragraphs : ["This article body is empty."]

  return {
    ...summary,
    contentParagraphs,
  }
})
