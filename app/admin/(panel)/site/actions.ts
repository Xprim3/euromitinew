"use server"

import { revalidatePath } from "next/cache"

import {
  siteContactFormSchema,
  socialLinksFromFormData,
  validateSocialUrls,
} from "@/lib/validations/site-contact-admin"
import { uploadHomepageAssetRow } from "@/lib/server/upload-homepage-asset"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export type SiteContactSaveState =
  | { ok: null }
  | { ok: true; message: string }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: Record<string, string[] | undefined> }

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
      careers_email: formData.get("careers_email"),
      careers_apply_instructions: formData.get("careers_apply_instructions"),
      company_name: formData.get("company_name"),
      footer_body: formData.get("footer_body"),
      footer_copyright_line: formData.get("footer_copyright_line"),
    })

    if (!parsed.success) {
      return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }
    }

    const v = parsed.data
    const social = socialLinksFromFormData(formData, 6)
    const socialErr = validateSocialUrls(social)
    if (socialErr) return { ok: false, message: socialErr }

    const socialJson = social

    let logo_media_id: string | null | undefined = undefined
    const clearLogo = truthyCheckbox(formData.get("clear_logo"))
    const logoFile = formData.get("logo_image")

    if (clearLogo) {
      logo_media_id = null
    } else if (logoFile instanceof File && logoFile.size > 0) {
      const uploaded = await uploadHomepageAssetRow(supabase, editorId, logoFile, {
        altText: v.company_name,
        usageSection: "footer-logo",
        category: "site",
      })
      if ("message" in uploaded) return { ok: false, message: uploaded.message }
      logo_media_id = uploaded.id
    }

    const sitePatch: Record<string, unknown> = {
      id: 1,
      company_name: v.company_name,
      footer_body: v.footer_body,
      footer_copyright_line: v.footer_copyright_line,
      social_links: socialJson,
      updated_by: editorId,
    }
    if (logo_media_id !== undefined) sitePatch.logo_media_id = logo_media_id

    const { error: siteErr } = await supabase.from("site_settings").upsert(sitePatch, { onConflict: "id" })
    if (siteErr) return { ok: false, message: siteErr.message }

    const contactPatch = {
      id: 1,
      phone: v.phone,
      email: v.email,
      hq_address: v.hq_address,
      map_link: v.map_link.trim(),
      weekday_hours: v.weekday_hours?.trim() || null,
      weekend_hours: v.weekend_hours?.trim() || null,
      careers_email: v.careers_email.trim() ? v.careers_email.trim() : null,
      careers_apply_instructions: v.careers_apply_instructions?.trim() || null,
      social_links: socialJson,
      updated_by: editorId,
    }

    const { error: contactErr } = await supabase.from("contact_info").upsert(contactPatch, { onConflict: "id" })
    if (contactErr) return { ok: false, message: contactErr.message }

    revalidateContactSurfaces()

    return { ok: true, message: "Site contact and footer saved." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}
