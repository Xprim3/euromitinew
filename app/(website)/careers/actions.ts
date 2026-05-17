"use server"

import { revalidatePath } from "next/cache"

import { normalizeResumeCvFile, sanitizeCvStorageFilename } from "@/lib/careers-cv-file"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { jobApplicationFieldsSchema } from "@/lib/validations/job-application-public"

export type JobApplicationSaveState =
  | { ok: null }
  | { ok: true; message: string }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: Record<string, string[] | undefined> }

const CV_BUCKET = "euromiti-career-cvs"
const MAX_CV_BYTES = 5 * 1024 * 1024

export async function submitJobApplicationAction(
  _prev: JobApplicationSaveState,
  formData: FormData
): Promise<JobApplicationSaveState> {
  try {
    const parsed = jobApplicationFieldsSchema.safeParse({
      location_city: formData.get("location_city"),
      job_slug: formData.get("job_slug"),
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      phone: formData.get("phone") ?? "",
      cover_letter: formData.get("cover_letter") ?? "",
    })
    if (!parsed.success) {
      return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }
    }
    const v = parsed.data

    const cv = formData.get("cv")
    if (!(cv instanceof File)) {
      return { ok: false, fieldErrors: { cv: ["Ngarkoni një dokument (CV)."] } }
    }
    const normalized = normalizeResumeCvFile(cv, MAX_CV_BYTES)
    if (!normalized.ok) {
      return { ok: false, fieldErrors: { cv: [normalized.error] } }
    }
    const contentType = normalized.contentType

    const supabase = await createSupabaseServerClient()
    const { data: job, error: jobErr } = await supabase
      .from("jobs")
      .select("id")
      .eq("slug", v.job_slug)
      .eq("location_city", v.location_city)
      .eq("is_active", true)
      .maybeSingle()

    if (jobErr || !job?.id) {
      return {
        ok: false,
        message: "Kombinimi i lokacionit dhe pozicionit nuk është i vlefshëm ose nuk pranon aplikime për momentin.",
      }
    }

    const jobId = job.id as string
    const safeName = sanitizeCvStorageFilename(cv.name, contentType)
    const objectPath = `applications/${jobId}/${crypto.randomUUID()}-${safeName}`
    const buf = Buffer.from(await cv.arrayBuffer())

    const { error: upErr } = await supabase.storage.from(CV_BUCKET).upload(objectPath, buf, {
      contentType,
      upsert: false,
    })
    if (upErr) {
      return { ok: false, message: `Ngarkimi dështoi: ${upErr.message}` }
    }

    const { error: insErr } = await supabase.from("job_applications").insert({
      job_id: jobId,
      full_name: v.full_name,
      email: v.email,
      phone: v.phone.trim(),
      cover_letter: v.cover_letter.trim(),
      cv_bucket: CV_BUCKET,
      cv_object_path: objectPath,
      cv_original_filename: cv.name.slice(0, 255),
      cv_mime_type: contentType,
      cv_byte_size: cv.size,
    })

    if (insErr) {
      await supabase.storage.from(CV_BUCKET).remove([objectPath])
      if (insErr.message.includes("job_not_accepting_applications") || insErr.message.includes("invalid_job")) {
        return { ok: false, message: "Ky pozicion nuk pranon aplikime për momentin." }
      }
      return { ok: false, message: insErr.message }
    }

    revalidatePath("/admin/careers")
    revalidatePath("/careers")
    revalidatePath(`/careers/${v.job_slug}`)

    return { ok: true, message: "Aplikimi u dërgua. Do t’ju kontaktojmë nëse profili juaj përputhet me kërkesat." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Gabim i papritur." }
  }
}
