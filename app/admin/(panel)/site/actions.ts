"use server"

import { revalidatePath } from "next/cache"

import {
  siteContactFormSchema,
  socialLinksFromFormData,
  validateSocialUrls,
} from "@/lib/validations/site-contact-admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export type SiteContactSaveState =
  | { ok: null }
  | { ok: true; message: string }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: Record<string, string[] | undefined> }

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

function revalidateContactSurfaces() {
  revalidatePath("/")
  revalidatePath("/about")
  revalidatePath("/services")
  revalidatePath("/restaurant")
  revalidatePath("/locations")
  revalidatePath("/news")
  revalidatePath("/contact")
  revalidatePath("/admin/site")
}

export async function saveSiteContactAction(
  _prev: SiteContactSaveState,
  formData: FormData
): Promise<SiteContactSaveState> {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()
    if (authErr || !user) return { ok: false, message: "You must be signed in as an admin." }

    const editorId = user.id
    const adminReady = await ensureAdminProfile(supabase, user)
    if (!adminReady.ok) return { ok: false, message: adminReady.message }

    const parsed = siteContactFormSchema.safeParse({
      phone: formData.get("phone"),
      email: formData.get("email"),
      hq_address: formData.get("hq_address"),
      map_link: formData.get("map_link"),
      weekday_hours: formData.get("weekday_hours"),
      weekend_hours: formData.get("weekend_hours"),
      hq_eyebrow: formData.get("hq_eyebrow"),
      hq_heading: formData.get("hq_heading"),
      hq_description: formData.get("hq_description"),
    })

    if (!parsed.success) {
      return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }
    }

    const v = parsed.data
    const social = socialLinksFromFormData(formData, 6)
    const socialErr = validateSocialUrls(social)
    if (socialErr) return { ok: false, message: socialErr }

    const socialJson = social

    const { error: siteErr } = await supabase
      .from("site_settings")
      .update({ social_links: socialJson, updated_by: editorId })
      .eq("id", 1)
    if (siteErr) return { ok: false, message: siteErr.message }

    const contactUpdate = {
      phone: v.phone,
      email: v.email,
      hq_address: v.hq_address,
      map_link: v.map_link.trim(),
      weekday_hours: v.weekday_hours?.trim() || null,
      weekend_hours: v.weekend_hours?.trim() || null,
      hq_eyebrow: v.hq_eyebrow?.trim() ?? "",
      hq_heading: v.hq_heading?.trim() ?? "",
      hq_description: v.hq_description?.trim() ?? "",
      social_links: socialJson,
      updated_by: editorId,
    }

    const { error: contactErr } = await supabase.from("contact_info").update(contactUpdate).eq("id", 1)
    if (contactErr) return { ok: false, message: contactErr.message }

    revalidateContactSurfaces()

    return { ok: true, message: "Contact and social links saved." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}
