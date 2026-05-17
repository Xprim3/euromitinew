import { resolveAdminImageMime, validateAdminImageFile, ADMIN_IMAGE_MAX_BYTES } from "@/lib/admin-image-file"

export { ADMIN_IMAGE_MAX_BYTES }

/** Homepage hero / services band video (server action body limit must allow this). */
export const ADMIN_VIDEO_MAX_BYTES = 48 * 1024 * 1024

export const ADMIN_VIDEO_ACCEPT =
  "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v"

export const ADMIN_VIDEO_ACCEPT_LABEL = "MP4, WebM, or MOV"

export const ADMIN_IMAGE_OR_VIDEO_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.gif,.heic,.heif,video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v"

export const ADMIN_IMAGE_OR_VIDEO_LABEL = "Images (JPEG, PNG, WebP, GIF, HEIC) or video (MP4, WebM, MOV)"

const VIDEO_MIMES = new Set(["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"])

const VIDEO_EXT: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".m4v": "video/x-m4v",
}

function extensionFromFilename(name: string): string {
  const i = name.lastIndexOf(".")
  return i >= 0 ? name.slice(i).toLowerCase() : ""
}

export function resolveAdminVideoMime(file: File): string | null {
  const type = file.type.trim().toLowerCase()
  if (type && (VIDEO_MIMES.has(type) || type.startsWith("video/"))) return type
  return VIDEO_EXT[extensionFromFilename(file.name)] ?? null
}

export function validateAdminVideoFile(
  file: File,
  maxBytes = ADMIN_VIDEO_MAX_BYTES
): { ok: true; mime: string } | { ok: false; error: string } {
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose a video file." }
  }
  if (file.size > maxBytes) {
    return {
      ok: false,
      error: `Video must be ${Math.round(maxBytes / (1024 * 1024))} MB or smaller.`,
    }
  }
  const mime = resolveAdminVideoMime(file)
  if (!mime) {
    return { ok: false, error: `${ADMIN_VIDEO_ACCEPT_LABEL} only.` }
  }
  return { ok: true, mime }
}

export type AdminMediaMode = "image" | "video" | "image-or-video"

export function validateAdminMediaFile(
  file: File,
  mode: AdminMediaMode
): { ok: true; mime: string; kind: "image" | "video" } | { ok: false; error: string } {
  if (mode === "image") {
    const r = validateAdminImageFile(file)
    return r.ok ? { ok: true, mime: r.mime, kind: "image" } : r
  }
  if (mode === "video") {
    const r = validateAdminVideoFile(file)
    return r.ok ? { ok: true, mime: r.mime, kind: "video" } : r
  }

  const video = validateAdminVideoFile(file)
  if (video.ok) return { ok: true, mime: video.mime, kind: "video" }

  const image = validateAdminImageFile(file)
  if (image.ok) return { ok: true, mime: image.mime, kind: "image" }

  return { ok: false, error: ADMIN_IMAGE_OR_VIDEO_LABEL }
}

export function resolveAdminMediaMime(file: File, mode: AdminMediaMode): string | null {
  if (mode === "image") return resolveAdminImageMime(file)
  if (mode === "video") return resolveAdminVideoMime(file)
  return resolveAdminVideoMime(file) ?? resolveAdminImageMime(file)
}
