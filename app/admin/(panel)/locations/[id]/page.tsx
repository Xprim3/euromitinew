import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { updateLocationAction } from "@/app/admin/(panel)/locations/actions"
import { LocationEditorForm } from "@/components/admin/LocationEditorForm"
import { AdminSectionCard, ErrorMessage } from "@/components/admin/design-system"
import { dsBtnTertiary } from "@/components/admin/design-system/ds-button-classes"
import { normalizeLocationRow } from "@/lib/data/locations-admin-shared"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Edit location",
}

type PageProps = { params: Promise<{ id: string }> }

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
    const mainPreview = await mainPreviewFromDb(row.main_media_id)

    return {
      ok: true as const,
      row,
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
      <LocationEditorForm
        key={result.row.updated_at}
        mode="edit"
        submitAction={updateLocationAction}
        initial={result.row}
        mainPreviewUrl={result.mainPreviewUrl}
        mainImageAlt={result.mainImageAlt}
      />
    </div>
  )
}
