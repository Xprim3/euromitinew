import type { MetadataRoute } from "next"

import { createPublicSupabaseServerClient } from "@/lib/supabase/public-server-client"

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://euromiti.com"

const staticRoutes = [
  "",
  "/about",
  "/careers",
  "/contact",
  "/locations",
  "/news",
  "/restaurant",
  "/services",
  "/privacy-policy",
  "/terms",
] as const

type SitemapSlugRow = {
  slug: string
  updated_at?: string | null
  published_at?: string | null
}

async function loadDynamicEntries(base: string): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicSupabaseServerClient()
  if (!supabase) return []

  const [newsResult, jobsResult] = await Promise.all([
    supabase.from("news_posts").select("slug, updated_at, published_at").eq("status", "published"),
    supabase.from("jobs").select("slug, updated_at").eq("is_active", true),
  ])

  const entries: MetadataRoute.Sitemap = []

  if (newsResult.error) {
    console.warn("[sitemap] news_posts:", newsResult.error.message)
  } else {
    entries.push(
      ...((newsResult.data ?? []) as SitemapSlugRow[])
        .filter((row) => row.slug?.trim())
        .map((row) => ({
          url: `${base}/news/${row.slug.trim()}`,
          lastModified: row.published_at || row.updated_at || undefined,
          changeFrequency: "monthly" as const,
          priority: 0.55,
        }))
    )
  }

  if (jobsResult.error) {
    console.warn("[sitemap] jobs:", jobsResult.error.message)
  } else {
    entries.push(
      ...((jobsResult.data ?? []) as SitemapSlugRow[])
        .filter((row) => row.slug?.trim())
        .map((row) => ({
          url: `${base}/careers/${row.slug.trim()}`,
          lastModified: row.updated_at || undefined,
          changeFrequency: "weekly" as const,
          priority: 0.5,
        }))
    )
  }

  return entries
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.replace(/\/$/, "")
  const staticEntries = staticRoutes.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.72,
  }))

  return [...staticEntries, ...(await loadDynamicEntries(base))]
}
