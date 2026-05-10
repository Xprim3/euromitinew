import type { MetadataRoute } from "next"

import { mockNewsArticles } from "@/data/mock"

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://euromiti.com"

const staticRoutes = [
  "",
  "/about",
  "/contact",
  "/locations",
  "/news",
  "/restaurant",
  "/services",
  "/privacy-policy",
  "/terms",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.replace(/\/$/, "")
  const staticEntries = staticRoutes.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.72,
  }))

  const newsEntries = mockNewsArticles.map((a) => ({
    url: `${base}/news/${a.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }))

  return [...staticEntries, ...newsEntries]
}
