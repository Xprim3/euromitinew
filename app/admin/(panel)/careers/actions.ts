"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  jobAdminFieldsSchema,
  linesFromAdminText,
  paragraphsFromAdminText,
} from "@/lib/validations/careers-admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export type JobSaveState =
  | { ok: null }
  | { ok: true; message: string }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: Record<string, string[] | undefined> }

export type JobDeleteState = { ok: null } | { ok: true; message: string } | { ok: false; message: string }

function truthyCheckbox(v: FormDataEntryValue | null) {
  return v === "on" || v === "true"
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
  return slug || "job"
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
  excludeId?: string
) {
  const base = slugify(title).slice(0, 180)
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`
    const { data } = await supabase.from("jobs").select("id").eq("slug", candidate).maybeSingle()
    if (!data || (excludeId && data.id === excludeId)) return candidate
  }
  return `${base}-${Date.now().toString(36)}`
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
    description: formData.get("description"),
    requirements: formData.get("requirements"),
    apply_channel: formData.get("apply_channel"),
    apply_email: formData.get("apply_email") ?? "",
    apply_phone: formData.get("apply_phone") ?? "",
    apply_url: formData.get("apply_url") ?? "",
    apply_instructions: formData.get("apply_instructions") ?? "",
  })

  if (!parsed.success) return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }

  const v = parsed.data
  const description = paragraphsFromAdminText(v.description)
  const requirements = linesFromAdminText(v.requirements)
  if (!description.length) return { ok: false, message: "Add at least one description paragraph." }
  if (!requirements.length) return { ok: false, message: "Add at least one requirement." }

  const isActive = truthyCheckbox(formData.get("is_active"))
  const slug = await uniqueJobSlug(supabase, v.title)

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
      description: formData.get("description"),
      requirements: formData.get("requirements"),
    })

    if (!parsed.success) return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }

    const { data: existing, error: fetchErr } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle()
    if (fetchErr || !existing) return { ok: false, message: "Job not found or could not be loaded." }

    const v = parsed.data
    const description = paragraphsFromAdminText(v.description)
    const requirements = linesFromAdminText(v.requirements)
    if (!description.length) return { ok: false, message: "Add at least one description paragraph." }
    if (!requirements.length) return { ok: false, message: "Add at least one requirement." }

    const isActive = truthyCheckbox(formData.get("is_active"))
    const existingTitle = typeof existing.title === "string" ? existing.title : ""
    const existingSlug = typeof existing.slug === "string" ? existing.slug : ""
    const slug = existingTitle === v.title && existingSlug ? existingSlug : await uniqueJobSlug(supabase, v.title, id)
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

    return { ok: true, message: "Job saved." }
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

    revalidatePath("/admin/careers/applications")
    revalidatePath(`/admin/careers/applications/${id}`)
    return { ok: true, message: "Application removed." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}
