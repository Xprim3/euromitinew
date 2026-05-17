import type { MetadataRoute } from "next"

import { createPublicSupabaseServerClient } from "@/lib/supabase/public-server-client"
import { getSiteUrl } from "@/lib/seo/constants"

export const dynamic = "force-dynamic"

const staticRoutes = [
  "",
  "/about",
  "/services",
  "/locations",
  "/restaurant",
  "/news",
  "/careers",
  "/contact",
  "/privacy-policy",
  "/terms",
] as const

type SitemapSlugRow = {
  slug: string
  updated_at?: string | null
  published_at?: string | null
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl().replace(/\/$/, "")
  const supabase = createPublicSupabaseServerClient()

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" ? "weekly" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }))

  if (!supabase) return staticEntries

  const [newsResult, locationsResult] = await Promise.all([
    supabase.from("news_posts").select("slug, updated_at, published_at, no_index").eq("status", "published"),
    supabase.from("locations").select("slug, updated_at").eq("is_active", true),
  ])

  const dynamicEntries: MetadataRoute.Sitemap = []

  if (newsResult.error) {
    console.warn("[sitemap] news_posts:", newsResult.error.message)
  } else {
    for (const row of (newsResult.data ?? []) as (SitemapSlugRow & { no_index?: boolean })[]) {
      if (row.no_index) continue
      const slug = row.slug?.trim()
      if (!slug) continue
      dynamicEntries.push({
        url: `${base}/news/${slug}`,
        lastModified: row.published_at || row.updated_at || undefined,
        changeFrequency: "monthly",
        priority: 0.6,
      })
    }
  }

  if (locationsResult.error) {
    console.warn("[sitemap] locations:", locationsResult.error.message)
  } else {
    for (const row of locationsResult.data ?? []) {
      const slug = typeof row.slug === "string" ? row.slug.trim() : ""
      if (!slug) continue
      const updated = typeof row.updated_at === "string" ? row.updated_at : undefined
      dynamicEntries.push({
        url: `${base}/locations/${slug}`,
        lastModified: updated,
        changeFrequency: "monthly",
        priority: 0.75,
      })
    }
  }

  return [...staticEntries, ...dynamicEntries]
}
