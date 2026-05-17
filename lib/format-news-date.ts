const TZ = "Europe/Belgrade"

function parseNewsDate(raw: string): Date | null {
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Display date for news cards and article pages. */
export function formatNewsDate(raw: string) {
  const date = parseNewsDate(raw)
  if (!date) return raw
  try {
    return new Intl.DateTimeFormat("sq-AL", { dateStyle: "medium", timeZone: TZ }).format(date)
  } catch {
    return raw
  }
}

/** e.g. 26/03/2024 for list metadata rows. */
export function formatNewsDateNumeric(raw: string) {
  const date = parseNewsDate(raw)
  if (!date) return raw
  try {
    return new Intl.DateTimeFormat("sq-AL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: TZ,
    }).format(date)
  } catch {
    return raw
  }
}

/** Large day + month label for news list rows (reference-style date column). */
export function formatNewsDateStack(raw: string): { day: string; month: string } | null {
  const date = parseNewsDate(raw)
  if (!date) return null
  try {
    const day = new Intl.DateTimeFormat("sq-AL", { day: "numeric", timeZone: TZ }).format(date)
    const month = new Intl.DateTimeFormat("sq-AL", { month: "short", timeZone: TZ })
      .format(date)
      .replace(/\./g, "")
      .toUpperCase()
    return { day, month }
  } catch {
    return null
  }
}
