import { homeStrategicNetworkDesign } from "@/data/mock/homepage-visual"

/** Rough slug hint for picking default hero images when `main_media_id` is absent. */
export function slugLegacyKey(slug: string): "prishtina" | "ferizaj" | "gjilan" | null {
  const s = slug.toLowerCase()
  if (s.includes("pri") || s === "prishtina" || s === "pristina") return "prishtina"
  if (s.includes("feriz")) return "ferizaj"
  if (s.includes("gjilan") || s.includes("gjil")) return "gjilan"
  return null
}

/** Cycle through strategic placeholders by list index when slug does not match. */
export function strategicFallbackVisual(index: number) {
  const i = ((index % homeStrategicNetworkDesign.length) + homeStrategicNetworkDesign.length) % homeStrategicNetworkDesign.length
  const v = homeStrategicNetworkDesign[i]
  return { imageSrc: v.imageSrc, imageAlt: v.imageAlt }
}

export function fallbackMainVisualForSlug(slug: string, index: number) {
  const key = slugLegacyKey(slug)
  const fromSlug = key ? homeStrategicNetworkDesign.find((x) => x.locationId === key) : undefined
  if (fromSlug) return { imageSrc: fromSlug.imageSrc, imageAlt: fromSlug.imageAlt }
  return strategicFallbackVisual(index)
}
