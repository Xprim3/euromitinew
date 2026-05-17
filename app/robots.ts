import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/lib/seo/constants"

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl()
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", site).toString(),
    host: new URL(site).host,
  }
}
