import type { MetadataRoute } from "next"

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://euromiti.com"

/** Production search crawlers — keep `/admin/*` indexable=no via layout robots and disallow here too. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", site).toString(),
  }
}
