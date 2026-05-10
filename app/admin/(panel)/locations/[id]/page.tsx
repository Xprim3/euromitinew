import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { updateLocationAction } from "@/app/admin/(panel)/locations/actions"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { LocationEditorForm } from "@/components/admin/LocationEditorForm"
import { Button } from "@/components/ui/button"
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

export default async function AdminEditLocationPage({ params }: PageProps) {
  const { id } = await params
  let supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>
  try {
    supabase = await createSupabaseServerClient()
  } catch {
    return (
      <>
        <AdminPageHeader title="Edit location" />
        <p className="px-10 py-6 text-sm text-red-300">Supabase is not configured in this environment.</p>
      </>
    )
  }

  const { data: raw, error } = await supabase.from("locations").select("*").eq("id", id).maybeSingle()

  if (error) {
    return (
      <>
        <AdminPageHeader title="Edit location" />
        <p className="px-10 py-6 text-sm text-red-300" role="alert">
          {error.message}
        </p>
      </>
    )
  }

  if (!raw) notFound()

  const row = normalizeLocationRow(raw as Record<string, unknown>)

  const g = await galleryDraftFromDb(row.id)
  const gallerySlots = "error" in g ? emptyGalleryDraft() : g.draft

  return (
    <>
      <AdminPageHeader
        title={`Edit · ${row.city}`}
        description="Changes apply immediately after save (RLS + public revalidation)."
        actions={
          <Button type="button" size="sm" variant="outline" render={<Link href="/admin/locations" />}>
            Back to list
          </Button>
        }
      />
      {"error" in g ? (
        <p className="mx-10 mt-6 rounded-lg border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-amber-100 text-sm">
          Gallery thumbnails could not be loaded ({g.error}). Slots are empty—you can re-upload images.
        </p>
      ) : null}
      <div className="flex-1 px-6 py-8 md:px-8 lg:px-10">
        <LocationEditorForm key={row.updated_at} mode="edit" submitAction={updateLocationAction} initial={row} gallerySlots={gallerySlots} />
      </div>
    </>
  )
}
