import type { Metadata } from "next"

import { DEFAULT_OG_IMAGE_PATH, getSiteUrl, SITE_LOCALE, SITE_NAME } from "@/lib/seo/constants"

export type BuildPageMetadataInput = {
  /** Page title (template adds “| Euromiti” unless absoluteTitle). */
  title: string
  description: string
  /** Pathname, e.g. `/about` or `/news/my-slug`. */
  path: string
  ogImage?: string | null
  ogType?: "website" | "article"
  noIndex?: boolean
  publishedTime?: string
  modifiedTime?: string
  absoluteTitle?: boolean
}

export function absoluteUrl(path: string, base = getSiteUrl()): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  const origin = base.replace(/\/$/, "")
  return `${origin}${normalized}`
}

export function resolveOgImageUrl(image?: string | null): string {
  const trimmed = image?.trim()
  if (!trimmed) return absoluteUrl(DEFAULT_OG_IMAGE_PATH)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed
  return absoluteUrl(trimmed.startsWith("/") ? trimmed : `/${trimmed}`)
}

export function buildPageMetadata(input: BuildPageMetadataInput): Metadata {
  const canonical = absoluteUrl(input.path)
  const ogImage = resolveOgImageUrl(input.ogImage)
  const title = input.absoluteTitle ? { absolute: input.title } : input.title

  return {
    title,
    description: input.description,
    alternates: { canonical },
    robots: input.noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: input.ogType ?? "website",
      images: [{ url: ogImage, alt: SITE_NAME }],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [ogImage],
    },
  }
}
