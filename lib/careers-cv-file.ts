/** Resume uploads: allowed extensions and canonical Content-Types for Storage + DB. */

const EXTENSION_TO_MIME: Readonly<Record<string, string>> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".rtf": "application/rtf",
  ".odt": "application/vnd.oasis.opendocument.text",
}

const ALLOWED_MIMES = new Set(Object.values(EXTENSION_TO_MIME))

/** Aliases some browsers send for RTF. */
const MIME_ALIASES: Readonly<Record<string, string>> = {
  "text/rtf": "application/rtf",
}

function extensionFromFilename(name: string): string {
  const i = name.lastIndexOf(".")
  return i >= 0 ? name.slice(i).toLowerCase() : ""
}

export function normalizeResumeCvFile(
  file: File,
  maxBytes: number
): { ok: true; contentType: string } | { ok: false; error: string } {
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Ngarkoni një dokument (CV). Lejohen PDF, Word, RTF ose ODT." }
  }
  if (file.size > maxBytes) {
    return { ok: false, error: `Skedari duhet të jetë më i vogël se ${Math.round(maxBytes / (1024 * 1024))} MB.` }
  }

  const ext = extensionFromFilename(file.name)
  const mimeFromExt = ext ? EXTENSION_TO_MIME[ext] : undefined

  const rawType = file.type.trim().toLowerCase()
  const declared = rawType ? (MIME_ALIASES[rawType] ?? rawType) : ""

  let contentType: string | undefined
  if (declared && ALLOWED_MIMES.has(declared)) {
    contentType = declared
  } else if (mimeFromExt) {
    contentType = mimeFromExt
  }

  if (!contentType) {
    return {
      ok: false,
      error: "Formati i skedarit nuk mbështetet. Përdorni PDF, Word (.doc / .docx), RTF ose ODT.",
    }
  }

  return { ok: true, contentType }
}

export function sanitizeCvStorageFilename(original: string, contentType: string): string {
  let ext = ".pdf"
  for (const [e, mime] of Object.entries(EXTENSION_TO_MIME)) {
    if (mime === contentType) {
      ext = e
      break
    }
  }
  const base = original.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "cv"
  const lower = base.toLowerCase()
  if (lower.endsWith(ext)) return base
  const trimmed = base.replace(/\.+$/, "")
  return `${trimmed}${ext}`
}
