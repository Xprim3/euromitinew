"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { uploadHomepageAssetRow } from "@/lib/server/upload-homepage-asset"
import {
  ADMIN_LOCATION_GALLERY_SLOTS,
  LOCATION_AMENITY_KEYS,
  locationCoreFieldsSchema,
} from "@/lib/validations/location-admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { LocationAmenity } from "@/types/public"

export type LocationSaveState =
  | { ok: null }
  | { ok: true; message: string }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: Record<string, string[] | undefined> }

export type LocationDeleteState = { ok: null } | { ok: true; message: string } | { ok: false; message: string }

function truthyCheckbox(v: FormDataEntryValue | null) {
  return v === "on" || v === "true"
}

function amenitiesFromForm(formData: FormData): LocationAmenity[] {
  const out: LocationAmenity[] = []
  for (const k of LOCATION_AMENITY_KEYS) {
    if (truthyCheckbox(formData.get(`svc_${k}`))) out.push(k)
  }
  return out
}

async function ensureAdminProfile(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  user: { id: string; email?: string | null }
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { data: existing, error: existingErr } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (existingErr) return { ok: false, message: existingErr.message }
  if (existing) return { ok: true }

  const { error: insertErr } = await supabase
    .from("admins")
    .insert({ user_id: user.id, display_name: user.email ?? null })

  if (!insertErr) return { ok: true }

  return {
    ok: false,
    message:
      "Your signed-in user is not in the admins table. Apply the latest RLS repair migration, then save again, or add this user to public.admins.",
  }
}

function revalidateLocationSurfaces(locationId?: string) {
  revalidatePath("/")
  revalidatePath("/locations")
  revalidatePath("/contact")
  revalidatePath("/admin/locations")
  if (locationId) revalidatePath(`/admin/locations/${locationId}`)
}

type OptionalUuid = string | null | undefined

function dedupeIds(ids: string[]) {
  const seen = new Set<string>()
  return ids.filter((id) => {
    if (!id || seen.has(id)) return false
    seen.add(id)
    return true
  })
}

async function collectGalleryMediaIds(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  editorId: string,
  formData: FormData
): Promise<{ ok: true; ids: string[] } | { ok: false; message: string }> {
  const ordered: string[] = []

  for (let i = 0; i < ADMIN_LOCATION_GALLERY_SLOTS; i++) {
    const clearSlot = truthyCheckbox(formData.get(`gallery_clear_${i}`))
    const file = formData.get(`gallery_file_${i}`)
    const keptRaw = String(formData.get(`gallery_media_id_${i}`) ?? "").trim()

    if (clearSlot) {
      continue
    }

    if (file instanceof File && file.size > 0) {
      const alt = String(formData.get(`gallery_image_alt_${i}`) ?? "").trim()
      const up = await uploadHomepageAssetRow(supabase, editorId, file, {
        altText: alt,
        usageSection: `location-gallery-slot-${i}`,
        category: "locations",
      })
      if ("message" in up) return { ok: false, message: up.message }
      ordered.push(up.id)
      continue
    }

    if (keptRaw.length > 0) {
      ordered.push(keptRaw)
    }
  }

  return { ok: true, ids: dedupeIds(ordered) }
}

async function resolveMainMediaId(opts: {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>
  editorId: string
  formData: FormData
  /** Update flow only */
  allowClear: boolean
}): Promise<{ next: OptionalUuid } | { error: string }> {
  if (opts.allowClear && truthyCheckbox(opts.formData.get("clear_main_media"))) {
    return { next: null }
  }

  const file = opts.formData.get("main_media")
  const alt = String(opts.formData.get("main_image_alt") ?? "").trim()

  if (file instanceof File && file.size > 0) {
    const up = await uploadHomepageAssetRow(opts.supabase, opts.editorId, file, {
      altText: alt,
      usageSection: "location-main",
      category: "locations",
    })
    if ("message" in up) return { error: up.message }
    return { next: up.id }
  }

  return { next: undefined }
}

async function replaceLocationGallery(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  locationId: string,
  mediaIds: string[]
): Promise<{ error: string } | null> {
  const { error: delErr } = await supabase.from("location_images").delete().eq("location_id", locationId)
  if (delErr) return { error: delErr.message }

  if (!mediaIds.length) return null

  const rows = mediaIds.map((media_id, sort_order) => ({
    location_id: locationId,
    media_id,
    sort_order,
  }))

  const { error: insErr } = await supabase.from("location_images").insert(rows)
  if (insErr) return { error: insErr.message }
  return null
}

function pgUniqueMessage(raw: string) {
  if (raw.includes("locations_slug_key") || raw.includes("duplicate key")) {
    return "That slug is already used. Pick a different slug."
  }
  return raw
}

export async function deleteLocationAction(
  _prev: LocationDeleteState,
  formData: FormData
): Promise<LocationDeleteState> {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()
    if (authErr || !user) return { ok: false, message: "You must be signed in as an admin." }

    const adminReady = await ensureAdminProfile(supabase, user)
    if (!adminReady.ok) return { ok: false, message: adminReady.message }

    const id = String(formData.get("id") ?? "").trim()
    if (!id) return { ok: false, message: "Missing location id." }

    const { error } = await supabase.from("locations").delete().eq("id", id)
    if (error) return { ok: false, message: pgUniqueMessage(error.message) }

    revalidateLocationSurfaces()

    return { ok: true, message: "Location deleted." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}

export async function createLocationAction(_prev: LocationSaveState, formData: FormData): Promise<LocationSaveState> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) {
    return { ok: false, message: "You must be signed in as an admin." }
  }

  const editorId = user.id
  const adminReady = await ensureAdminProfile(supabase, user)
  if (!adminReady.ok) return { ok: false, message: adminReady.message }

  const parsed = locationCoreFieldsSchema.safeParse({
    slug: formData.get("slug"),
    city: formData.get("city"),
    page_heading: formData.get("page_heading"),
    page_summary: formData.get("page_summary"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    contact_email: formData.get("contact_email"),
    opening_hours: formData.get("opening_hours"),
    google_maps_url: formData.get("google_maps_url"),
    sort_order: formData.get("sort_order"),
  })

  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const v = parsed.data
  const services = amenitiesFromForm(formData)
  if (!services.length) {
    return { ok: false, message: "Select at least one on-site service." }
  }

  const contact_email = v.contact_email.length === 0 ? null : v.contact_email

  const { data: inserted, error: insErr } = await supabase
    .from("locations")
    .insert({
      slug: v.slug,
      city: v.city,
      page_heading: v.page_heading,
      page_summary: v.page_summary,
      address: v.address,
      phone: v.phone,
      contact_email,
      opening_hours: v.opening_hours,
      services,
      google_maps_url: v.google_maps_url,
      sort_order: v.sort_order,
      is_active: truthyCheckbox(formData.get("is_active")),
      main_media_id: null,
    })
    .select("id")
    .single()

  if (insErr || !inserted) {
    return { ok: false, message: pgUniqueMessage(insErr?.message ?? "Insert failed.") }
  }

  const locationId = inserted.id as string

  const mainR = await resolveMainMediaId({ supabase, editorId, formData, allowClear: false })
  if ("error" in mainR) {
    await supabase.from("locations").delete().eq("id", locationId)
    return { ok: false, message: mainR.error }
  }
  if (mainR.next !== undefined) {
    const { error: uMain } = await supabase.from("locations").update({ main_media_id: mainR.next }).eq("id", locationId)
    if (uMain) return { ok: false, message: uMain.message }
  }

  const gal = await collectGalleryMediaIds(supabase, editorId, formData)
  if (!gal.ok) return { ok: false, message: gal.message }

  const gErr = await replaceLocationGallery(supabase, locationId, gal.ids)
  if (gErr) {
    await supabase.from("locations").delete().eq("id", locationId)
    return { ok: false, message: gErr.error }
  }

  revalidateLocationSurfaces(locationId)
  redirect(`/admin/locations/${locationId}`)
}

export async function updateLocationAction(_prev: LocationSaveState, formData: FormData): Promise<LocationSaveState> {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()
    if (authErr || !user) {
      return { ok: false, message: "You must be signed in as an admin." }
    }

    const editorId = user.id
    const adminReady = await ensureAdminProfile(supabase, user)
    if (!adminReady.ok) return { ok: false, message: adminReady.message }

    const locationId = String(formData.get("id") ?? "").trim()
    if (!locationId) return { ok: false, message: "Missing location id." }

    const parsed = locationCoreFieldsSchema.safeParse({
      slug: formData.get("slug"),
      city: formData.get("city"),
      page_heading: formData.get("page_heading"),
      page_summary: formData.get("page_summary"),
      address: formData.get("address"),
      phone: formData.get("phone"),
      contact_email: formData.get("contact_email"),
      opening_hours: formData.get("opening_hours"),
      google_maps_url: formData.get("google_maps_url"),
      sort_order: formData.get("sort_order"),
    })

    if (!parsed.success) {
      return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }
    }

    const v = parsed.data
    const services = amenitiesFromForm(formData)
    if (!services.length) {
      return { ok: false, message: "Select at least one on-site service." }
    }

    const contact_email = v.contact_email.length === 0 ? null : v.contact_email

    const patch: Record<string, unknown> = {
      slug: v.slug,
      city: v.city,
      page_heading: v.page_heading,
      page_summary: v.page_summary,
      address: v.address,
      phone: v.phone,
      contact_email,
      opening_hours: v.opening_hours,
      services,
      google_maps_url: v.google_maps_url,
      sort_order: v.sort_order,
      is_active: truthyCheckbox(formData.get("is_active")),
    }

    const mainR = await resolveMainMediaId({ supabase, editorId, formData, allowClear: true })
    if ("error" in mainR) return { ok: false, message: mainR.error }
    if (mainR.next !== undefined) patch.main_media_id = mainR.next

    const { error: upErr } = await supabase.from("locations").update(patch).eq("id", locationId)
    if (upErr) return { ok: false, message: pgUniqueMessage(upErr.message) }

    const gal = await collectGalleryMediaIds(supabase, editorId, formData)
    if (!gal.ok) return { ok: false, message: gal.message }

    const gErr = await replaceLocationGallery(supabase, locationId, gal.ids)
    if (gErr) return { ok: false, message: gErr.error }

    revalidateLocationSurfaces(locationId)

    return { ok: true, message: "Location saved. Public homepage and `/locations` were revalidated." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}
