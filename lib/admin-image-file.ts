/** Shared admin image validation (client + server). */

export const ADMIN_IMAGE_MAX_BYTES = 5 * 1024 * 1024

export const ADMIN_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.gif,.heic,.heif"

export const ADMIN_IMAGE_ACCEPT_LABEL = "JPEG, PNG, WebP, GIF, or HEIC"

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
])

const EXT_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".heic": "image/heic",
  ".heif": "image/heif",
}

function extensionFromFilename(name: string): string {
  const i = name.lastIndexOf(".")
  return i >= 0 ? name.slice(i).toLowerCase() : ""
}

/** Resolve MIME for storage upload (iOS often sends empty `file.type`). */
export function resolveAdminImageMime(file: File): string | null {
  const type = file.type.trim().toLowerCase()
  if (type && ALLOWED_MIMES.has(type)) return type

  const fromExt = EXT_TO_MIME[extensionFromFilename(file.name)]
  if (fromExt) return fromExt

  return null
}

export function validateAdminImageFile(
  file: File,
  maxBytes = ADMIN_IMAGE_MAX_BYTES
): { ok: true; mime: string } | { ok: false; error: string } {
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose an image file." }
  }
  if (file.size > maxBytes) {
    return {
      ok: false,
      error: `Image must be ${Math.round(maxBytes / (1024 * 1024))} MB or smaller.`,
    }
  }
  const mime = resolveAdminImageMime(file)
  if (!mime) {
    return {
      ok: false,
      error: `${ADMIN_IMAGE_ACCEPT_LABEL} only.`,
    }
  }
  return { ok: true, mime }
}
