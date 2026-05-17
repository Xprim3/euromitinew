"use server"

import { revalidatePath } from "next/cache"

import { uploadHomepageAssetRow } from "@/lib/server/upload-homepage-asset"
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
  revalidatePath("/careers")
  revalidatePath("/news")
  revalidatePath("/contact")
  revalidatePath("/admin/site")
}

function isTruthyCheckbox(v: FormDataEntryValue | null) {
  return v === "on" || v === "true"
}

type OptionalUuid = string | null | undefined

async function resolvePageHeroSlot(opts: {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>
  editorId: string
  formData: FormData
  clearName: string
  fileField: string
  alt: string
  usageSection: string
}): Promise<{ next: OptionalUuid } | { error: string }> {
  if (isTruthyCheckbox(opts.formData.get(opts.clearName))) {
    return { next: null }
  }
  const file = opts.formData.get(opts.fileField)
  if (file instanceof File && file.size > 0) {
    const up = await uploadHomepageAssetRow(opts.supabase, opts.editorId, file, {
      altText: opts.alt,
      usageSection: opts.usageSection,
      category: "site",
    })
    if ("message" in up) return { error: up.message }
    return { next: up.id }
  }
  return { next: undefined }
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

    const contactHero = await resolvePageHeroSlot({
      supabase,
      editorId,
      formData,
      clearName: "clear_contact_page_hero_image",
      fileField: "contact_page_hero_image",
      alt: String(formData.get("contact_page_hero_image_alt") ?? "").trim(),
      usageSection: "page-hero-contact",
    })
    if ("error" in contactHero) return { ok: false, message: contactHero.error }

    const locationsHero = await resolvePageHeroSlot({
      supabase,
      editorId,
      formData,
      clearName: "clear_locations_page_hero_image",
      fileField: "locations_page_hero_image",
      alt: String(formData.get("locations_page_hero_image_alt") ?? "").trim(),
      usageSection: "page-hero-locations",
    })
    if ("error" in locationsHero) return { ok: false, message: locationsHero.error }

    const careersHero = await resolvePageHeroSlot({
      supabase,
      editorId,
      formData,
      clearName: "clear_careers_page_hero_image",
      fileField: "careers_page_hero_image",
      alt: String(formData.get("careers_page_hero_image_alt") ?? "").trim(),
      usageSection: "page-hero-careers",
    })
    if ("error" in careersHero) return { ok: false, message: careersHero.error }

    const newsHero = await resolvePageHeroSlot({
      supabase,
      editorId,
      formData,
      clearName: "clear_news_page_hero_image",
      fileField: "news_page_hero_image",
      alt: String(formData.get("news_page_hero_image_alt") ?? "").trim(),
      usageSection: "page-hero-news",
    })
    if ("error" in newsHero) return { ok: false, message: newsHero.error }

    const sitePatch: Record<string, unknown> = {
      social_links: socialJson,
      contact_page_hero_image_alt: String(formData.get("contact_page_hero_image_alt") ?? "").trim(),
      locations_page_hero_image_alt: String(formData.get("locations_page_hero_image_alt") ?? "").trim(),
      careers_page_hero_image_alt: String(formData.get("careers_page_hero_image_alt") ?? "").trim(),
      news_page_hero_image_alt: String(formData.get("news_page_hero_image_alt") ?? "").trim(),
      updated_by: editorId,
    }

    if (contactHero.next !== undefined) sitePatch.contact_page_hero_media_id = contactHero.next
    if (locationsHero.next !== undefined) sitePatch.locations_page_hero_media_id = locationsHero.next
    if (careersHero.next !== undefined) sitePatch.careers_page_hero_media_id = careersHero.next
    if (newsHero.next !== undefined) sitePatch.news_page_hero_media_id = newsHero.next

    const { error: siteErr } = await supabase.from("site_settings").update(sitePatch).eq("id", 1)
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

    return { ok: true, message: "Contact, page headers, and social links saved." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}
