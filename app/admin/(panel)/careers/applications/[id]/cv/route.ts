import { NextResponse } from "next/server"

import { createSupabaseServerClient } from "@/lib/supabase/server"

type RouteContext = { params: Promise<{ id: string }> }

/**
 * Signed redirect to the applicant CV in the private bucket (admin session + admins row required).
 */
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: admin, error: adminErr } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle()
  if (adminErr || !admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { data: app, error: appErr } = await supabase
    .from("job_applications")
    .select("cv_bucket, cv_object_path")
    .eq("id", id)
    .maybeSingle()

  if (appErr || !app?.cv_bucket || !app?.cv_object_path) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const bucket = app.cv_bucket as string
  const objectPath = app.cv_object_path as string

  const { data: signed, error: signErr } = await supabase.storage.from(bucket).createSignedUrl(objectPath, 120)
  if (signErr || !signed?.signedUrl) {
    return NextResponse.json({ error: signErr?.message ?? "Could not create download link." }, { status: 500 })
  }

  return NextResponse.redirect(signed.signedUrl)
}
