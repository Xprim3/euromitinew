/** Location amenity badges (shown on LocationCard chips). */
export type LocationAmenity =
  | "petrol"
  | "restaurant"
  | "carwash"
  | "mini_market"
  | "ev"

export interface FuelPrice {
  id: string
  fuelType: string
  price: number
  currency: string
  lastUpdated: string
  /** e.g. "Live" vs "updated 10 minutes ago"; drives badge tone */
  labelStatus: FuelPriceStatus
}

export type FuelPriceStatus = "active" | "updated"

export interface LocationSummary {
  id: string
  city: string
  address: string
  phone: string
  openingHours: string
  services: LocationAmenity[]
  googleMapsUrl: string
}

export interface ServiceHighlight {
  id: string
  name: string
  shortDescription: string
  /** Pass a Lucide icon component from the caller */
  iconKey: "fuel" | "utensils" | "car" | "shopping" | "playground"
  ctaLabel: string
  ctaHref: string
  /** Stronger CTA treatment (e.g. restaurant with its own page) */
  ctaVariant?: "default" | "outlinePrimary"
}

export interface NewsSummary {
  id: string
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  imageSrc: string
  imageAlt: string
  /** Editorial category for archive filters (defaults in UI when absent). */
  category?: string
  /** Homepage / archive badge text from `news_posts.teaser_label`. */
  teaserLabel?: string
}

/** Full article for `/news/[slug]` (mock/CMS later). */
export interface NewsArticle extends NewsSummary {
  contentParagraphs: readonly string[]
}

/** Titled paragraphs for legal pages and similar long-form blocks. */
export type DocumentSectionBlock = {
  title: string
  paragraphs: readonly string[]
}
