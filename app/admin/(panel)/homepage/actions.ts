"use server"

import { revalidatePath } from "next/cache"

import { homepageContentFormSchema } from "@/lib/validations/homepage-content"
import { uploadHomepageAssetRow } from "@/lib/server/upload-homepage-asset"
import type { HomepageContentRow } from "@/types/supabase-cms"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export type HomepageSaveState =
  | { ok: null }
  | { ok: true; message: string }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: Record<string, string[] | undefined> }

function isTruthyCheckbox(value: FormDataEntryValue | null) {
  return value === "on" || value === "true"
}

type MediaCols = Partial<
  Pick<
    HomepageContentRow,
    | "hero_image_media_id"
    | "about_preview_image_media_id"
    | "services_intro_media_id"
    | "restaurant_home_main_media_id"
    | "restaurant_home_float_1_media_id"
    | "restaurant_home_float_2_media_id"
    | "carwash_intro_media_id"
    | "playground_intro_media_id"
    | "mini_market_intro_media_id"
  >
>

const SERVICES_INTRO_CHIP_SLOTS = 4
const HOMEPAGE_LOCATION_CARD_SLOTS = 3

function servicesIntroChipsFromForm(formData: FormData) {
  const chips: { icon: string; label: string }[] = []
  for (let i = 0; i < SERVICES_INTRO_CHIP_SLOTS; i++) {
    const label = String(formData.get(`services_intro_chip_label_${i}`) ?? "").trim()
    if (!label) continue

    let icon = String(formData.get(`services_intro_chip_icon_${i}`) ?? "").trim() || "verified"
    if (!/^[a-z0-9_]+$/.test(icon)) icon = "verified"

    chips.push({ icon, label: label.slice(0, 80) })
  }
  return chips
}

async function updateHomepageLocationCards(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  editorId: string,
  formData: FormData
): Promise<HomepageSaveState | null> {
  for (let i = 0; i < HOMEPAGE_LOCATION_CARD_SLOTS; i++) {
    const id = String(formData.get(`homepage_location_id_${i}`) ?? "").trim()
    if (!id) continue

    const city = String(formData.get(`homepage_location_city_${i}`) ?? "").trim()
    const address = String(formData.get(`homepage_location_address_${i}`) ?? "").trim()
    const alt = String(formData.get(`homepage_location_image_alt_${i}`) ?? "").trim()
    const existingMediaId = String(formData.get(`homepage_location_media_id_${i}`) ?? "").trim()
    const clearImage = isTruthyCheckbox(formData.get(`clear_homepage_location_image_${i}`))
    const file = formData.get(`homepage_location_image_${i}`)

    const patch: Record<string, unknown> = {}
    if (city) patch.city = city
    if (address) patch.address = address

    if (clearImage) {
      patch.main_media_id = null
    } else if (file instanceof File && file.size > 0) {
      const uploaded = await uploadHomepageAssetRow(supabase, editorId, file, {
        altText: alt,
        usageSection: `homepage-location-card-${i + 1}`,
        category: "locations",
      })
      if ("message" in uploaded) return { ok: false, message: uploaded.message }
      patch.main_media_id = uploaded.id
    } else if (existingMediaId && alt) {
      const { error: altErr } = await supabase.from("media_uploads").update({ alt_text: alt }).eq("id", existingMediaId)
      if (altErr) return { ok: false, message: altErr.message }
    }

    if (!Object.keys(patch).length) continue

    const { error } = await supabase.from("locations").update(patch).eq("id", id)
    if (error) return { ok: false, message: error.message }
  }

  return null
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

  if (existingErr) {
    return { ok: false, message: existingErr.message }
  }

  if (existing) {
    return { ok: true }
  }

  const { error: insertErr } = await supabase
    .from("admins")
    .insert({ user_id: user.id, display_name: user.email ?? null })

  if (!insertErr) {
    return { ok: true }
  }

  return {
    ok: false,
    message:
      "Your signed-in user is not in the admins table. Apply the latest RLS repair migration, then save again, or add this user to public.admins.",
  }
}

export async function saveHomepageContent(
  _prev: HomepageSaveState,
  formData: FormData
): Promise<HomepageSaveState> {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()
    if (authErr || !user) {
      return { ok: false, message: "You must be signed in. Use an account that exists in the admins table." }
    }

    const editorId = user.id
    const adminReady = await ensureAdminProfile(supabase, user)
    if (!adminReady.ok) {
      return { ok: false, message: adminReady.message }
    }

    const clearHero = isTruthyCheckbox(formData.get("clear_hero_image"))
    const secondaryLabel = String(formData.get("hero_cta_secondary_label") ?? "").trim()
    const secondaryHrefRaw = String(formData.get("hero_cta_secondary_href") ?? "").trim()

    const parsed = homepageContentFormSchema.safeParse({
      hero_headline_line1: formData.get("hero_headline_line1"),
      hero_headline_line2: formData.get("hero_headline_line2"),
      hero_subtitle: formData.get("hero_subtitle"),
      hero_cta_primary_label: formData.get("hero_cta_primary_label"),
      hero_cta_primary_href: formData.get("hero_cta_primary_href"),
      hero_cta_secondary_label: secondaryLabel,
      hero_cta_secondary_href: secondaryLabel ? secondaryHrefRaw : "/locations",
      about_preview_kicker: formData.get("about_preview_kicker"),
      about_preview_headline: formData.get("about_preview_headline"),
      about_preview_eyebrow: formData.get("about_preview_eyebrow"),
      about_preview_text: formData.get("about_preview_text"),
      about_preview_why_title: formData.get("about_preview_why_title"),
      about_preview_why_text: formData.get("about_preview_why_text"),
      about_preview_button_label: formData.get("about_preview_button_label"),
      about_preview_button_href: formData.get("about_preview_button_href"),
      restaurant_highlight_text: formData.get("restaurant_highlight_text"),
      carwash_intro_text: formData.get("carwash_intro_text"),
      playground_intro_text: formData.get("playground_intro_text"),
      mini_market_intro_text: formData.get("mini_market_intro_text"),
      hero_image_alt: formData.get("hero_image_alt") ?? "",
      about_preview_image_alt: formData.get("about_preview_image_alt") ?? "",
      services_intro_title: formData.get("services_intro_title"),
      services_intro_body: formData.get("services_intro_body"),
      locations_band_kicker: formData.get("locations_band_kicker"),
      locations_band_heading: formData.get("locations_band_heading"),
      locations_band_subtitle: formData.get("locations_band_subtitle"),
      restaurant_home_headline_primary: formData.get("restaurant_home_headline_primary"),
      restaurant_home_headline_accent: formData.get("restaurant_home_headline_accent"),
      services_intro_image_alt: formData.get("services_intro_image_alt") ?? "",
      restaurant_main_alt: formData.get("restaurant_main_alt") ?? "",
      restaurant_float_1_alt: formData.get("restaurant_float_1_alt") ?? "",
      restaurant_float_2_alt: formData.get("restaurant_float_2_alt") ?? "",
      carwash_image_alt: formData.get("carwash_image_alt") ?? "",
      playground_image_alt: formData.get("playground_image_alt") ?? "",
      mini_market_image_alt: formData.get("mini_market_image_alt") ?? "",
    })

    if (!parsed.success) {
      return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }
    }

    const v = parsed.data
    const patch: Record<string, unknown> = {
      hero_headline_line1: v.hero_headline_line1,
      hero_headline_line2: v.hero_headline_line2,
      hero_subtitle: v.hero_subtitle,
      hero_cta_primary_label: v.hero_cta_primary_label,
      hero_cta_primary_href: v.hero_cta_primary_href,
      hero_cta_secondary_label: v.hero_cta_secondary_label,
      hero_cta_secondary_href: v.hero_cta_secondary_href,
      about_preview_kicker: v.about_preview_kicker,
      about_preview_headline: v.about_preview_headline,
      about_preview_eyebrow: v.about_preview_eyebrow,
      about_preview_text: v.about_preview_text,
      about_preview_why_title: v.about_preview_why_title,
      about_preview_why_text: v.about_preview_why_text,
      about_preview_button_label: v.about_preview_button_label,
      about_preview_button_href: v.about_preview_button_href,
      restaurant_highlight_text: v.restaurant_highlight_text,
      carwash_intro_text: v.carwash_intro_text,
      playground_intro_text: v.playground_intro_text,
      mini_market_intro_text: v.mini_market_intro_text,
      services_intro_title: v.services_intro_title,
      services_intro_body: v.services_intro_body,
      services_intro_chips_json: servicesIntroChipsFromForm(formData),
      locations_band_kicker: v.locations_band_kicker,
      locations_band_heading: v.locations_band_heading,
      locations_band_subtitle: v.locations_band_subtitle,
      restaurant_home_headline_primary: v.restaurant_home_headline_primary,
      restaurant_home_headline_accent: v.restaurant_home_headline_accent,
      updated_by: editorId,
    }

    const mediaPatches: MediaCols = {}

    async function consumeUpload(
      fileKey: string,
      clearKey: string,
      column: keyof MediaCols,
      alt: string,
      usageSection: string
    ): Promise<HomepageSaveState | undefined> {
      if (isTruthyCheckbox(formData.get(clearKey))) {
        mediaPatches[column] = null
      }
      const file = formData.get(fileKey)
      if (!(file instanceof File) || file.size === 0) {
        return undefined
      }
      const uploaded = await uploadHomepageAssetRow(supabase, editorId, file, {
        altText: alt,
        usageSection,
      })
      if ("message" in uploaded) return { ok: false, message: uploaded.message }
      mediaPatches[column] = uploaded.id
      return undefined
    }

    if (clearHero) mediaPatches.hero_image_media_id = null

    const heroFile = formData.get("hero_image")
    if (!clearHero && heroFile instanceof File && heroFile.size > 0) {
      const uploaded = await uploadHomepageAssetRow(supabase, editorId, heroFile, {
        altText: v.hero_image_alt ?? "",
        usageSection: "hero",
      })
      if ("message" in uploaded) return { ok: false, message: uploaded.message }
      mediaPatches.hero_image_media_id = uploaded.id
    }

    const uploadSteps: Promise<HomepageSaveState | undefined>[] = [
      consumeUpload(
        "about_preview_image",
        "clear_about_preview_image",
        "about_preview_image_media_id",
        v.about_preview_image_alt ?? "",
        "about-preview"
      ),
      consumeUpload("services_intro_image", "clear_services_intro_image", "services_intro_media_id", v.services_intro_image_alt ?? "", "services-intro"),
      consumeUpload("restaurant_main_image", "clear_restaurant_main_image", "restaurant_home_main_media_id", v.restaurant_main_alt ?? "", "restaurant-home-main"),
      consumeUpload(
        "restaurant_float_1_image",
        "clear_restaurant_float_1_image",
        "restaurant_home_float_1_media_id",
        v.restaurant_float_1_alt ?? "",
        "restaurant-home-float-1"
      ),
      consumeUpload(
        "restaurant_float_2_image",
        "clear_restaurant_float_2_image",
        "restaurant_home_float_2_media_id",
        v.restaurant_float_2_alt ?? "",
        "restaurant-home-float-2"
      ),
      consumeUpload("carwash_image", "clear_carwash_image", "carwash_intro_media_id", v.carwash_image_alt ?? "", "carwash-card"),
      consumeUpload("playground_image", "clear_playground_image", "playground_intro_media_id", v.playground_image_alt ?? "", "playground-card"),
      consumeUpload(
        "mini_market_image",
        "clear_mini_market_image",
        "mini_market_intro_media_id",
        v.mini_market_image_alt ?? "",
        "minimarket-card"
      ),
    ]

    for (const p of uploadSteps) {
      const err = await p
      if (err) return err
    }

    for (const [key, val] of Object.entries(mediaPatches) as [keyof HomepageContentRow, string | null][]) {
      if (val !== undefined) patch[key] = val
    }

    const { error: upErr } = await supabase.from("homepage_content").upsert({ id: 1, ...patch }, { onConflict: "id" })

    if (upErr) {
      return { ok: false, message: upErr.message }
    }

    const locationUpdateError = await updateHomepageLocationCards(supabase, editorId, formData)
    if (locationUpdateError) return locationUpdateError

    revalidatePath("/")
    revalidatePath("/locations")
    revalidatePath("/contact")
    revalidatePath("/admin/homepage")
    revalidatePath("/admin/locations")

    return { ok: true, message: "Homepage saved. The public homepage will refresh on the next request." }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error"
    return { ok: false, message: msg }
  }
}
