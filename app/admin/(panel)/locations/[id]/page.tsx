import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { updateLocationAction } from "@/app/admin/(panel)/locations/actions"
import { LocationEditorForm } from "@/components/admin/LocationEditorForm"
import { AdminSectionCard, ErrorMessage } from "@/components/admin/design-system"
import { dsBtnTertiary } from "@/components/admin/design-system/ds-button-classes"
import {
  ADMIN_LOCATION_GALLERY_SLOTS,
} from "@/lib/validations/location-admin"
import { emptyGalleryDraft, normalizeLocationRow, type GallerySlotDraft } from "@/lib/data/locations-admin-shared"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Edit location",
}

type PageProps = { params: Promise<{ id: string }> }

async function galleryDraftFromDb(locationId: string): Promise<{ draft: GallerySlotDraft[] } | { error: string }> {
  const supabase = await createSupabaseServerClient()
  const { data: li, error: liErr } = await supabase
    .from("location_images")
    .select("sort_order, media_id")
    .eq("location_id", locationId)
    .order("sort_order", { ascending: true })

  if (liErr) return { error: liErr.message }

  const draft = emptyGalleryDraft()
  const mediaIds =
    li?.map((r: { media_id: string }) => r.media_id).filter((x): x is string => typeof x === "string") ?? []

  if (!mediaIds.length) return { draft }

  const uniq = [...new Set(mediaIds)]
  const { data: uploads } = await supabase.from("media_uploads").select("id, public_url, alt_text").in("id", uniq)

  const byId = Object.fromEntries(
    (uploads ?? []).map((u: { id: string; public_url: string | null; alt_text: string | null }) => [
      u.id,
      { public_url: u.public_url ?? "", alt_text: u.alt_text },
    ])
  )

  for (const row of li ?? []) {
    const r = row as { sort_order: number; media_id: string }
    if (
      typeof r.sort_order !== "number" ||
      r.sort_order < 0 ||
      r.sort_order >= ADMIN_LOCATION_GALLERY_SLOTS
    )
      continue
    const meta = byId[r.media_id]
    draft[r.sort_order] = {
      mediaId: r.media_id,
      publicUrl: meta?.public_url?.trim() ?? "",
      alt: typeof meta?.alt_text === "string" ? meta.alt_text : "",
    }
  }

  return { draft }
}

async function mainPreviewFromDb(mediaId: string | null): Promise<{ publicUrl: string | null; alt: string }> {
  if (!mediaId) return { publicUrl: null, alt: "" }
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from("media_uploads").select("public_url, alt_text").eq("id", mediaId).maybeSingle()
  const row = data as { public_url?: string | null; alt_text?: string | null } | null
  return {
    publicUrl: row?.public_url?.trim() || null,
    alt: row?.alt_text?.trim() || "",
  }
}

async function loadLocationEditor(id: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: raw, error } = await supabase.from("locations").select("*").eq("id", id).maybeSingle()

    if (error) return { ok: false as const, message: error.message }
    if (!raw) return { ok: true as const, row: null }

    const row = normalizeLocationRow(raw as Record<string, unknown>)
    const [g, mainPreview] = await Promise.all([
      galleryDraftFromDb(row.id),
      mainPreviewFromDb(row.main_media_id),
    ])

    return {
      ok: true as const,
      row,
      gallerySlots: "error" in g ? emptyGalleryDraft() : g.draft,
      galleryError: "error" in g ? g.error : null,
      mainPreviewUrl: mainPreview.publicUrl,
      mainImageAlt: mainPreview.alt,
    }
  } catch {
    return {
      ok: false as const,
      message: "Supabase is not configured in this environment.",
    }
  }
}

export default async function AdminEditLocationPage({ params }: PageProps) {
  const { id } = await params
  const result = await loadLocationEditor(id)
  if (!result.ok) {
    return <ErrorMessage title="Location could not load">{result.message}</ErrorMessage>
  }
  if (!result.row) notFound()

  return (
    <div className="space-y-6">
      <AdminSectionCard>
        <Link href="/admin/locations" className={dsBtnTertiary}>
          Back to list
        </Link>
      </AdminSectionCard>
      {result.galleryError ? (
        <ErrorMessage title="Gallery thumbnails could not load">
          {result.galleryError}. Slots are empty; you can re-upload images.
        </ErrorMessage>
      ) : null}
      <LocationEditorForm
        key={result.row.updated_at}
        mode="edit"
        submitAction={updateLocationAction}
        initial={result.row}
        gallerySlots={result.gallerySlots}
        mainPreviewUrl={result.mainPreviewUrl}
        mainImageAlt={result.mainImageAlt}
      />
    </div>
  )
}
