"use server"

import { revalidatePath } from "next/cache"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { jobApplicationFieldsSchema } from "@/lib/validations/job-application-public"

export type JobApplicationSaveState =
  | { ok: null }
  | { ok: true; message: string }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: Record<string, string[] | undefined> }

const CV_BUCKET = "euromiti-career-cvs"
const MAX_CV_BYTES = 5 * 1024 * 1024

function sanitizeCvFilename(name: string) {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120)
  return base.toLowerCase().endsWith(".pdf") ? base : `${base}.pdf`
}

export async function submitJobApplicationAction(
  _prev: JobApplicationSaveState,
  formData: FormData
): Promise<JobApplicationSaveState> {
  try {
    const parsed = jobApplicationFieldsSchema.safeParse({
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
    if (!(cv instanceof File) || cv.size === 0) {
      return { ok: false, fieldErrors: { cv: ["Ngarkoni një CV në format PDF."] } }
    }
    if (cv.type !== "application/pdf") {
      return { ok: false, fieldErrors: { cv: ["Vetëm skedarë PDF (deri në 5 MB)."] } }
    }
    if (cv.size > MAX_CV_BYTES) {
      return { ok: false, fieldErrors: { cv: ["CV duhet të jetë më e vogël se 5 MB."] } }
    }

    const supabase = await createSupabaseServerClient()
    const { data: job, error: jobErr } = await supabase
      .from("jobs")
      .select("id")
      .eq("slug", v.job_slug)
      .eq("is_active", true)
      .maybeSingle()

    if (jobErr || !job?.id) {
      return { ok: false, message: "Ky pozicion nuk është më i hapur ose nuk ekziston." }
    }

    const jobId = job.id as string
    const objectPath = `applications/${jobId}/${crypto.randomUUID()}-${sanitizeCvFilename(cv.name)}`
    const buf = Buffer.from(await cv.arrayBuffer())

    const { error: upErr } = await supabase.storage.from(CV_BUCKET).upload(objectPath, buf, {
      contentType: "application/pdf",
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
      cv_mime_type: "application/pdf",
      cv_byte_size: cv.size,
    })

    if (insErr) {
      await supabase.storage.from(CV_BUCKET).remove([objectPath])
      if (insErr.message.includes("invalid_job")) {
        return { ok: false, message: "Ky pozicion nuk është më i hapur." }
      }
      return { ok: false, message: insErr.message }
    }

    revalidatePath("/admin/careers/applications")
    revalidatePath("/careers")
    revalidatePath(`/careers/${v.job_slug}`)

    return { ok: true, message: "Aplikimi u dërgua. Do t’ju kontaktojmë nëse profili juaj përputhet me kërkesat." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Gabim i papritur." }
  }
}
