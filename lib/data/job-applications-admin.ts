import type { SupabaseClient } from "@supabase/supabase-js"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { JobApplicationRow } from "@/types/supabase-cms"

function normalizeApplicationRow(raw: Record<string, unknown>): JobApplicationRow {
  return {
    id: String(raw.id ?? ""),
    job_id: String(raw.job_id ?? ""),
    full_name: typeof raw.full_name === "string" ? raw.full_name : "",
    email: typeof raw.email === "string" ? raw.email : "",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    cover_letter: typeof raw.cover_letter === "string" ? raw.cover_letter : "",
    cv_bucket: typeof raw.cv_bucket === "string" ? raw.cv_bucket : "euromiti-career-cvs",
    cv_object_path: typeof raw.cv_object_path === "string" ? raw.cv_object_path : "",
    cv_original_filename: typeof raw.cv_original_filename === "string" ? raw.cv_original_filename : null,
    cv_mime_type: typeof raw.cv_mime_type === "string" ? raw.cv_mime_type : "",
    cv_byte_size: typeof raw.cv_byte_size === "number" ? raw.cv_byte_size : Number(raw.cv_byte_size) || 0,
    created_at: typeof raw.created_at === "string" ? raw.created_at : "",
  }
}

export type JobApplicationWithJob = JobApplicationRow & {
  job_title: string
  job_slug: string
}

type JobTitleRow = { id: string; title: string; slug: string }

async function attachJobMeta(supabase: SupabaseClient, rows: JobApplicationRow[]): Promise<JobApplicationWithJob[]> {
  if (!rows.length) return []
  const jobIds = [...new Set(rows.map((r) => r.job_id).filter(Boolean))]
  if (!jobIds.length) {
    return rows.map((base) => ({ ...base, job_title: "—", job_slug: "" }))
  }

  const { data: jobs, error } = await supabase.from("jobs").select("id, title, slug").in("id", jobIds)
  if (error) {
    console.warn("[attachJobMeta]", error.message)
    return rows.map((base) => ({ ...base, job_title: "—", job_slug: "" }))
  }

  const map = new Map<string, JobTitleRow>()
  for (const j of jobs ?? []) {
    const o = j as Record<string, unknown>
    const id = String(o.id ?? "")
    if (!id) continue
    map.set(id, {
      id,
      title: typeof o.title === "string" ? o.title : "",
      slug: typeof o.slug === "string" ? o.slug : "",
    })
  }

  return rows.map((base) => {
    const j = map.get(base.job_id)
    return {
      ...base,
      job_title: j?.title?.trim() ? j.title : "—",
      job_slug: j?.slug ?? "",
    }
  })
}

export async function listJobApplicationsAdmin(): Promise<JobApplicationWithJob[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.from("job_applications").select("*").order("created_at", { ascending: false })

  if (error) {
    console.warn("[listJobApplicationsAdmin]", error.message)
    return []
  }

  const rows = (data ?? []).map((row) => normalizeApplicationRow(row as Record<string, unknown>))
  return attachJobMeta(supabase, rows)
}

export async function getJobApplicationByIdAdmin(id: string): Promise<JobApplicationWithJob | null> {
  if (!id) return null
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.from("job_applications").select("*").eq("id", id).maybeSingle()

  if (error || !data) {
    if (error) console.warn("[getJobApplicationByIdAdmin]", error.message)
    return null
  }

  const base = normalizeApplicationRow(data as Record<string, unknown>)
  const [withJob] = await attachJobMeta(supabase, [base])
  return withJob ?? null
}
