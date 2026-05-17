/** Detect CMS media kind from MIME or URL (public + admin). */

const VIDEO_MIMES = new Set(["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"])

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?|#|$)/i

export function isVideoMimeType(mime: string | null | undefined): boolean {
  const t = mime?.trim().toLowerCase()
  return Boolean(t && (VIDEO_MIMES.has(t) || t.startsWith("video/")))
}

export function isVideoMediaUrl(url: string | null | undefined): boolean {
  const u = url?.trim()
  if (!u) return false
  return VIDEO_EXT.test(u)
}

export function mediaKindFromMimeAndUrl(
  mime: string | null | undefined,
  url: string | null | undefined
): "video" | "image" {
  if (isVideoMimeType(mime) || isVideoMediaUrl(url)) return "video"
  return "image"
}
