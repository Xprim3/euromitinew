const TZ = "Europe/Belgrade"

const SQ_MONTH_LONG = [
  "janar",
  "shkurt",
  "mars",
  "prill",
  "maj",
  "qershor",
  "korrik",
  "gusht",
  "shtator",
  "tetor",
  "nëntor",
  "dhjetor",
] as const

function parseNewsDate(raw: string): Date | null {
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date
}

type BelgradeParts = { day: number; month: number; year: number; hour: number; minute: number }

/** Calendar + clock in Belgrade — numeric only so server and client always match. */
function belgradeParts(date: Date, withTime = false): BelgradeParts | null {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ,
      day: "numeric",
      month: "numeric",
      year: "numeric",
      ...(withTime ? { hour: "2-digit", minute: "2-digit", hour12: false } : {}),
    }).formatToParts(date)

    const day = Number(parts.find((p) => p.type === "day")?.value)
    const month = Number(parts.find((p) => p.type === "month")?.value)
    const year = Number(parts.find((p) => p.type === "year")?.value)
    const hour = withTime ? Number(parts.find((p) => p.type === "hour")?.value) : 0
    const minute = withTime ? Number(parts.find((p) => p.type === "minute")?.value) : 0

    if (!day || !month || !year) return null
    if (withTime && (Number.isNaN(hour) || Number.isNaN(minute))) return null
    return { day, month, year, hour, minute }
  } catch {
    return null
  }
}

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

/** Display date for news cards and article pages. */
export function formatNewsDate(raw: string) {
  const date = parseNewsDate(raw)
  if (!date) return raw
  const parts = belgradeParts(date)
  if (!parts) return raw
  const monthLabel = SQ_MONTH_LONG[parts.month - 1] ?? ""
  return `${parts.day} ${monthLabel} ${parts.year}`
}

/** e.g. 17/05/2026 for list metadata rows. */
export function formatNewsDateNumeric(raw: string) {
  const date = parseNewsDate(raw)
  if (!date) return raw
  const parts = belgradeParts(date)
  if (!parts) return raw
  return `${pad2(parts.day)}/${pad2(parts.month)}/${parts.year}`
}

/** e.g. 17/05/2026, 14:30 — publish date and time (Europe/Belgrade). */
export function formatNewsDateTime(raw: string) {
  const date = parseNewsDate(raw)
  if (!date) return raw
  const parts = belgradeParts(date, true)
  if (!parts) return raw
  return `${pad2(parts.day)}/${pad2(parts.month)}/${parts.year}, ${pad2(parts.hour)}:${pad2(parts.minute)}`
}
