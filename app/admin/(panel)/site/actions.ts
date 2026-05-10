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
      company_name: v.company_name,
      footer_body: v.footer_body,
      footer_copyright_line: v.footer_copyright_line,
      social_links: socialJson,
      updated_by: editorId,
    }
    if (logo_media_id !== undefined) sitePatch.logo_media_id = logo_media_id

    const { error: siteErr } = await supabase.from("site_settings").update(sitePatch).eq("id", 1)
    if (siteErr) return { ok: false, message: siteErr.message }

    const contactPatch = {
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

    const { error: contactErr } = await supabase.from("contact_info").update(contactPatch).eq("id", 1)
    if (contactErr) return { ok: false, message: contactErr.message }

    revalidatePath("/")
    revalidatePath("/contact")
    revalidatePath("/admin/site")

    return { ok: true, message: "Site contact and footer saved." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}
