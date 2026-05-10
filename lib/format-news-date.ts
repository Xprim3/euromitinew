/** Display date for news cards and article pages (Kosovo-related locale). */
export function formatNewsDate(raw: string) {
  try {
    return new Intl.DateTimeFormat("en-XK", {
      dateStyle: "medium",
      timeZone: "Europe/Belgrade",
    }).format(new Date(raw))
  } catch {
    return raw
  }
}
