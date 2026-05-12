export function adminTextFromJsonArray(raw: unknown, separator = "\n\n"): string {
  if (!Array.isArray(raw)) return ""
  return raw.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean).join(separator)
}
