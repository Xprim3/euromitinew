/** URL slug segment helpers for careers positions (title + location). */

export function slugifySegment(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
  return slug || "job"
}

/** Base slug: `{location}-{title}` so the same title can exist in each city. */
export function buildJobSlugBase(title: string, locationCity: string): string {
  const locationPart = slugifySegment(locationCity)
  const titlePart = slugifySegment(title)
  return `${locationPart}-${titlePart}`.slice(0, 180)
}
