/** Short stamp for admin activity tables (XK locale, Belgrade TZ). */
export function formatAdminStamp(raw: string) {
  try {
    return new Intl.DateTimeFormat("en-XK", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/Belgrade",
    }).format(new Date(raw))
  } catch {
    return raw
  }
}
