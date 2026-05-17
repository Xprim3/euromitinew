import type { ResolvedPublicLocation } from "@/lib/data/locations-public"
import type { JobApplicationOption } from "@/lib/data/careers-public"
import { JOB_APPLICATION_LOCATION_LABELS } from "@/lib/data/careers-public"
import { absoluteUrl, resolveOgImageUrl } from "@/lib/seo/metadata"
import { DEFAULT_OG_IMAGE_PATH, getSiteUrl, SITE_NAME } from "@/lib/seo/constants"

type JsonLd = Record<string, unknown>

/** CMS-backed fields only — never invent address, phone, hours, or geo. */
export type OrganizationSchemaInput = {
  description?: string | null
  phone?: string | null
  email?: string | null
  streetAddress?: string | null
  sameAs?: string[]
}

function schemaTypesForLocation(services: ResolvedPublicLocation["services"]): string[] {
  const types = new Set<string>(["LocalBusiness"])
  if (services.includes("petrol")) types.add("GasStation")
  if (services.includes("restaurant")) types.add("Restaurant")
  return [...types]
}

export function buildOrganizationSchema(input?: OrganizationSchemaInput): JsonLd {
  const url = getSiteUrl()
  const payload: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url,
    logo: resolveOgImageUrl(DEFAULT_OG_IMAGE_PATH),
  }

  const description = input?.description?.trim()
  if (description) payload.description = description

  const phone = input?.phone?.trim()
  if (phone) payload.telephone = phone

  const email = input?.email?.trim()
  if (email) payload.email = email

  const street = input?.streetAddress?.trim()
  if (street) {
    payload.address = {
      "@type": "PostalAddress",
      streetAddress: street,
      addressCountry: "XK",
    }
  }

  const sameAs = (input?.sameAs ?? []).map((u) => u.trim()).filter((u) => u.startsWith("http"))
  if (sameAs.length > 0) payload.sameAs = sameAs

  return payload
}

export function buildWebSiteSchema(): JsonLd {
  const url = getSiteUrl()
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url,
    inLanguage: "sq",
    publisher: { "@type": "Organization", name: SITE_NAME, url },
  }
}

export function buildBreadcrumbSchema(items: { name: string; path: string }[]): JsonLd {
  const base = getSiteUrl()
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${base.replace(/\/$/, "")}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  }
}

export function buildLocationSchema(location: ResolvedPublicLocation): JsonLd {
  const types = schemaTypesForLocation(location.services)
  const pageUrl = absoluteUrl(`/locations/${location.slug}`)
  const image = location.mainImageSrc.startsWith("http")
    ? location.mainImageSrc
    : resolveOgImageUrl(location.mainImageSrc)

  const payload: JsonLd = {
    "@context": "https://schema.org",
    "@type": types.length === 1 ? types[0] : types,
    "@id": `${pageUrl}#location`,
    name: location.pageHeading.trim() || `Euromiti ${location.city}`.trim(),
    url: pageUrl,
    image,
  }

  const summary = location.pageSummary.trim()
  if (summary) payload.description = summary

  const street = location.address.trim()
  const city = location.city.trim()
  if (street || city) {
    payload.address = {
      "@type": "PostalAddress",
      ...(street ? { streetAddress: street } : {}),
      ...(city ? { addressLocality: city } : {}),
      addressCountry: "XK",
    }
  }

  if (location.phone.trim()) payload.telephone = location.phone.trim()
  if (location.contactEmail?.trim()) payload.email = location.contactEmail.trim()
  if (location.openingHours.trim()) payload.openingHours = location.openingHours.trim()
  if (location.googleMapsUrl.trim()) payload.hasMap = location.googleMapsUrl.trim()

  return payload
}

export function buildNewsArticleSchema(input: {
  title: string
  description: string
  slug: string
  publishedAt: string
  updatedAt?: string
  imageUrl?: string
}): JsonLd {
  const url = absoluteUrl(`/news/${input.slug}`)
  const payload: JsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: input.title,
    url,
    mainEntityOfPage: url,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: resolveOgImageUrl(DEFAULT_OG_IMAGE_PATH) },
    },
    inLanguage: "sq",
  }

  const description = input.description.trim()
  if (description) payload.description = description

  if (input.imageUrl) payload.image = [input.imageUrl]

  return payload
}

export function buildJobPostingSchema(job: JobApplicationOption): JsonLd {
  const city =
    JOB_APPLICATION_LOCATION_LABELS[job.location_city as keyof typeof JOB_APPLICATION_LOCATION_LABELS] ??
    job.location_city
  const applyUrl = absoluteUrl(`/careers?p=${encodeURIComponent(job.slug)}#apliko`)

  const payload: JsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    identifier: job.slug,
    url: applyUrl,
    directApply: true,
    hiringOrganization: {
      "@type": "Organization",
      name: SITE_NAME,
      sameAs: getSiteUrl(),
    },
  }

  const locality = city.trim()
  if (locality) {
    payload.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: locality,
        addressCountry: "XK",
      },
    }
  }

  return payload
}
