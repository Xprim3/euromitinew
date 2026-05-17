"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { buildJobSlugBase } from "@/lib/careers-job-slug"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { jobAdminFieldsSchema } from "@/lib/validations/careers-admin"

export type JobSaveState =
  | { ok: null }
  | { ok: true; message: string }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: Record<string, string[] | undefined> }

export type JobDeleteState = { ok: null } | { ok: true; message: string } | { ok: false; message: string }

export type JobToggleState = { ok: null } | { ok: true; message: string } | { ok: false; message: string }

function truthyCheckbox(v: FormDataEntryValue | null) {
  return v === "on" || v === "true"
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

async function uniqueJobSlug(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  title: string,
  locationCity: string,
  excludeId?: string
) {
  const base = buildJobSlugBase(title, locationCity)
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`
    const { data } = await supabase.from("jobs").select("id").eq("slug", candidate).maybeSingle()
    if (!data || (excludeId && data.id === excludeId)) return candidate
  }
  return `${base}-${Date.now().toString(36)}`
}

async function findDuplicatePosition(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  title: string,
  locationCity: string,
  excludeId?: string
) {
  const { data, error } = await supabase
    .from("jobs")
    .select("id, title")
    .eq("location_city", locationCity)
    .ilike("title", title.trim())

  if (error) {
    console.warn("[findDuplicatePosition]", error.message)
    return null
  }

  return (data ?? []).find((row) => {
    const id = String((row as { id?: string }).id ?? "")
    const rowTitle = typeof (row as { title?: string }).title === "string" ? (row as { title: string }).title : ""
    if (excludeId && id === excludeId) return false
    return rowTitle.trim().toLowerCase() === title.trim().toLowerCase()
  })
}

function revalidateCareersSurfaces(slugs: string[] = []) {
  revalidatePath("/admin/careers")
  revalidatePath("/careers")
  revalidatePath("/contact")
  for (const slug of slugs) {
    const trimmed = slug.trim()
    if (trimmed) revalidatePath(`/careers/${trimmed}`)
  }
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

/** Jobs use the public site application form only; legacy DB columns stay defaulted. */
const JOB_APPLY_DEFAULTS = {
  apply_channel: "instructions" as const,
  apply_email: null as string | null,
  apply_phone: null as string | null,
  apply_url: null as string | null,
  apply_instructions: null as string | null,
}

export async function createJobAction(_prev: JobSaveState, formData: FormData): Promise<JobSaveState> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) return { ok: false, message: "You must be signed in as an admin." }

  const adminReady = await ensureAdminProfile(supabase, user)
  if (!adminReady.ok) return { ok: false, message: adminReady.message }

  const parsed = jobAdminFieldsSchema.safeParse({
    title: formData.get("title"),
    location_city: formData.get("location_city"),
    summary: formData.get("summary") ?? "",
  })

  if (!parsed.success) return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }

  const v = parsed.data
  const description: string[] = []
  const requirements: string[] = []

  const isActive = truthyCheckbox(formData.get("is_active"))

  const duplicate = await findDuplicatePosition(supabase, v.title, v.location_city)
  if (duplicate) {
    return {
      ok: false,
      message: `“${v.title}” already exists for ${v.location_city}. Edit that row or choose a different title.`,
    }
  }

  const slug = await uniqueJobSlug(supabase, v.title, v.location_city)

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      title: v.title,
      slug,
      location_city: v.location_city,
      summary: v.summary?.trim() || "",
      description,
      requirements,
      is_active: isActive,
      apply_channel: JOB_APPLY_DEFAULTS.apply_channel,
      apply_email: JOB_APPLY_DEFAULTS.apply_email,
      apply_phone: JOB_APPLY_DEFAULTS.apply_phone,
      apply_url: JOB_APPLY_DEFAULTS.apply_url,
      apply_instructions: JOB_APPLY_DEFAULTS.apply_instructions,
      posted_at: isActive ? todayIsoDate() : null,
    })
    .select("id")
    .single()

  if (error || !data) return { ok: false, message: error?.message ?? "Could not create job." }

  revalidateCareersSurfaces([slug])
  redirect(`/admin/careers/${data.id}`)
}

export async function updateJobAction(_prev: JobSaveState, formData: FormData): Promise<JobSaveState> {
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
    if (!id) return { ok: false, message: "Missing job id." }

    const parsed = jobAdminFieldsSchema.safeParse({
      title: formData.get("title"),
      location_city: formData.get("location_city"),
      summary: formData.get("summary") ?? "",
    })

    if (!parsed.success) return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }

    const { data: existing, error: fetchErr } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle()
    if (fetchErr || !existing) return { ok: false, message: "Job not found or could not be loaded." }

    const v = parsed.data
    const description = Array.isArray(existing.description) ? existing.description : []
    const requirements = Array.isArray(existing.requirements) ? existing.requirements : []

    const isActive = truthyCheckbox(formData.get("is_active"))
    const existingTitle = typeof existing.title === "string" ? existing.title : ""
    const existingSlug = typeof existing.slug === "string" ? existing.slug : ""
    const existingLocation =
      typeof existing.location_city === "string" ? existing.location_city : ""

    const duplicate = await findDuplicatePosition(supabase, v.title, v.location_city, id)
    if (duplicate) {
      return {
        ok: false,
        message: `“${v.title}” already exists for ${v.location_city}.`,
      }
    }

    const slugUnchanged = existingTitle === v.title && existingLocation === v.location_city && existingSlug
    const slug = slugUnchanged ? existingSlug : await uniqueJobSlug(supabase, v.title, v.location_city, id)
    const existingPostedAt = typeof existing.posted_at === "string" && existing.posted_at ? existing.posted_at : null

    const { error } = await supabase
      .from("jobs")
      .update({
        title: v.title,
        slug,
        location_city: v.location_city,
        summary: v.summary?.trim() || "",
        description,
        requirements,
        is_active: isActive,
        apply_channel: JOB_APPLY_DEFAULTS.apply_channel,
        apply_email: JOB_APPLY_DEFAULTS.apply_email,
        apply_phone: JOB_APPLY_DEFAULTS.apply_phone,
        apply_url: JOB_APPLY_DEFAULTS.apply_url,
        apply_instructions: JOB_APPLY_DEFAULTS.apply_instructions,
        posted_at: isActive ? existingPostedAt ?? todayIsoDate() : null,
      })
      .eq("id", id)

    if (error) return { ok: false, message: error.message }

    revalidateCareersSurfaces([...new Set([existingSlug, slug].filter(Boolean))])
    revalidatePath(`/admin/careers/${id}`)

    return { ok: true, message: "Position saved." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}

export async function setJobApplicationsOpenAction(
  _prev: JobToggleState,
  formData: FormData
): Promise<JobToggleState> {
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
    if (!id) return { ok: false, message: "Missing position id." }

    const openRaw = String(formData.get("is_active") ?? "").trim().toLowerCase()
    const isActive = openRaw === "true" || openRaw === "1" || openRaw === "on"

    const { data: existing, error: fetchErr } = await supabase.from("jobs").select("slug, posted_at").eq("id", id).maybeSingle()
    if (fetchErr || !existing) return { ok: false, message: "Position not found." }

    const slug = typeof existing.slug === "string" ? existing.slug : ""
    const existingPostedAt = typeof existing.posted_at === "string" && existing.posted_at ? existing.posted_at : null

    const { error } = await supabase
      .from("jobs")
      .update({
        is_active: isActive,
        posted_at: isActive ? existingPostedAt ?? todayIsoDate() : null,
      })
      .eq("id", id)

    if (error) return { ok: false, message: error.message }

    revalidateCareersSurfaces(slug ? [slug] : [])
    return { ok: true, message: isActive ? "Applications enabled for this position." : "Applications paused for this position." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}

export async function deleteJobAction(_prev: JobDeleteState, formData: FormData): Promise<JobDeleteState> {
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
    if (!id) return { ok: false, message: "Missing job id." }

    const { data: existing } = await supabase.from("jobs").select("slug").eq("id", id).maybeSingle()
    const slug = typeof existing?.slug === "string" ? existing.slug : ""

    const { error } = await supabase.from("jobs").delete().eq("id", id)
    if (error) return { ok: false, message: error.message }

    revalidateCareersSurfaces(slug ? [slug] : [])
    return { ok: true, message: "Job deleted." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}

export async function deleteJobApplicationAction(
  _prev: JobDeleteState,
  formData: FormData
): Promise<JobDeleteState> {
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
    if (!id) return { ok: false, message: "Missing application id." }

    const { data: row, error: fetchErr } = await supabase
      .from("job_applications")
      .select("cv_bucket, cv_object_path")
      .eq("id", id)
      .maybeSingle()

    if (fetchErr) return { ok: false, message: fetchErr.message }
    if (!row) return { ok: false, message: "Application not found." }

    const bucket = typeof row.cv_bucket === "string" ? row.cv_bucket.trim() : ""
    const objectPath = typeof row.cv_object_path === "string" ? row.cv_object_path.trim() : ""

    const { error: delErr } = await supabase.from("job_applications").delete().eq("id", id)
    if (delErr) return { ok: false, message: delErr.message }

    if (bucket && objectPath) {
      const { error: storageErr } = await supabase.storage.from(bucket).remove([objectPath])
      if (storageErr) console.warn("[deleteJobApplicationAction] storage remove:", storageErr.message)
    }

    revalidatePath("/admin/careers")
    revalidatePath(`/admin/careers/applications/${id}`)
    return { ok: true, message: "Application removed." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}
