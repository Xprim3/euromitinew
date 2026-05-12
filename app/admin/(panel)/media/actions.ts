"use server"

import { revalidatePath } from "next/cache"

import { uploadHomepageAssetRow } from "@/lib/server/upload-homepage-asset"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { MEDIA_LIBRARY_CATEGORIES } from "@/lib/constants/media-library"

export type MediaUploadState =
  | { ok: null }
  | { ok: true; message: string }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: Record<string, string[] | undefined> }

export type MediaDeleteState = { ok: null } | { ok: true; message: string } | { ok: false; message: string }
export type MediaAltState = { ok: null } | { ok: true; message: string } | { ok: false; message: string }

function isAllowedCategory(value: string): value is (typeof MEDIA_LIBRARY_CATEGORIES)[number] {
  return MEDIA_LIBRARY_CATEGORIES.includes(value as (typeof MEDIA_LIBRARY_CATEGORIES)[number])
}

function revalidateMediaSurfaces() {
  revalidatePath("/")
  revalidatePath("/about")
  revalidatePath("/services")
  revalidatePath("/restaurant")
  revalidatePath("/locations")
  revalidatePath("/news")
  revalidatePath("/contact")
  revalidatePath("/admin/media")
}

export async function uploadMediaLibraryImage(
  _prev: MediaUploadState,
  formData: FormData
): Promise<MediaUploadState> {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()
    if (authErr || !user) return { ok: false, message: "You must be signed in as an admin." }

    const file = formData.get("media_image")
    const altText = String(formData.get("alt_text") ?? "").trim()
    const usageSection = String(formData.get("usage_section") ?? "").trim()
    const categoryRaw = String(formData.get("category") ?? "misc").trim()
    const category = isAllowedCategory(categoryRaw) ? categoryRaw : "misc"

    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, fieldErrors: { media_image: ["Choose an image to upload."] } }
    }

    const uploaded = await uploadHomepageAssetRow(supabase, user.id, file, {
      altText,
      usageSection: usageSection || `media-library-${category}`,
      category,
    })
    if ("message" in uploaded) return { ok: false, message: uploaded.message }

    revalidateMediaSurfaces()
    return { ok: true, message: "Image uploaded." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}

export async function updateMediaAltText(_prev: MediaAltState, formData: FormData): Promise<MediaAltState> {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()
    if (authErr || !user) return { ok: false, message: "You must be signed in as an admin." }

    const id = String(formData.get("id") ?? "").trim()
    const altText = String(formData.get("alt_text") ?? "").trim()
    if (!id) return { ok: false, message: "Missing image id." }

    const { error } = await supabase
      .from("media_uploads")
      .update({ alt_text: altText || null })
      .eq("id", id)
    if (error) return { ok: false, message: error.message }

    revalidateMediaSurfaces()
    return { ok: true, message: "Alt text saved." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}

export async function deleteMediaImage(_prev: MediaDeleteState, formData: FormData): Promise<MediaDeleteState> {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()
    if (authErr || !user) return { ok: false, message: "You must be signed in as an admin." }

    const id = String(formData.get("id") ?? "").trim()
    if (!id) return { ok: false, message: "Missing image id." }

    const { data: row, error: fetchErr } = await supabase
      .from("media_uploads")
      .select("storage_bucket, object_path")
      .eq("id", id)
      .maybeSingle()
    if (fetchErr || !row) return { ok: false, message: fetchErr?.message ?? "Image not found." }

    const { error: dbErr } = await supabase.from("media_uploads").delete().eq("id", id)
    if (dbErr) return { ok: false, message: dbErr.message }

    const bucket = typeof row.storage_bucket === "string" ? row.storage_bucket : "euromiti-media"
    const objectPath = typeof row.object_path === "string" ? row.object_path : ""
    if (objectPath) {
      const { error: storageErr } = await supabase.storage.from(bucket).remove([objectPath])
      if (storageErr) return { ok: false, message: `Metadata deleted, but storage delete failed: ${storageErr.message}` }
    }

    revalidateMediaSurfaces()
    return { ok: true, message: "Image deleted." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}
