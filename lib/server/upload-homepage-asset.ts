import type { SupabaseClient } from "@supabase/supabase-js"

import { validateAdminImageFile } from "@/lib/admin-image-file"

const BUCKET = "euromiti-media"

export function sanitizeHomepageFilename(name: string) {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120)
  return base || "upload"
}

export async function uploadHomepageAssetRow(
  supabase: SupabaseClient,
  userId: string,
  file: File,
  opts: { altText: string; usageSection: string; category?: string }
): Promise<{ id: string } | { message: string }> {
  const validated = validateAdminImageFile(file)
  if (!validated.ok) {
    return { message: validated.error }
  }
  const contentType = validated.mime

  const objectPath = `homepage/${crypto.randomUUID()}-${sanitizeHomepageFilename(file.name)}`
  const buf = Buffer.from(await file.arrayBuffer())
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(objectPath, buf, {
    contentType,
    upsert: false,
  })
  if (upErr) {
    return { message: `Upload failed: ${upErr.message}` }
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(objectPath)

  const { data: mediaRow, error: insErr } = await supabase
    .from("media_uploads")
    .insert({
      storage_bucket: BUCKET,
      object_path: objectPath,
      public_url: pub.publicUrl,
      mime_type: contentType,
      byte_size: file.size,
      original_filename: file.name,
      alt_text: opts.altText.trim() || null,
      category: opts.category ?? "homepage",
      usage_section: opts.usageSection,
      uploaded_by: userId,
    })
    .select("id")
    .single()

  if (insErr || !mediaRow) {
    return { message: insErr?.message ?? "Could not save media metadata." }
  }

  return { id: mediaRow.id as string }
}
