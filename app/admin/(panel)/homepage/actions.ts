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
    | "services_intro_media_id"
    | "restaurant_home_main_media_id"
    | "restaurant_home_float_1_media_id"
    | "restaurant_home_float_2_media_id"
    | "carwash_intro_media_id"
    | "mini_market_intro_media_id"
  >
>

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
      about_preview_text: formData.get("about_preview_text"),
      restaurant_highlight_text: formData.get("restaurant_highlight_text"),
      carwash_intro_text: formData.get("carwash_intro_text"),
      mini_market_intro_text: formData.get("mini_market_intro_text"),
      hero_image_alt: formData.get("hero_image_alt") ?? "",
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
      about_preview_text: v.about_preview_text,
      restaurant_highlight_text: v.restaurant_highlight_text,
      carwash_intro_text: v.carwash_intro_text,
      mini_market_intro_text: v.mini_market_intro_text,
      services_intro_title: v.services_intro_title,
      services_intro_body: v.services_intro_body,
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

    const { error: upErr } = await supabase.from("homepage_content").update(patch).eq("id", 1)

    if (upErr) {
      return { ok: false, message: upErr.message }
    }

    revalidatePath("/")
    revalidatePath("/admin/homepage")

    return { ok: true, message: "Homepage saved. The public homepage will refresh on the next request." }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error"
    return { ok: false, message: msg }
  }
}
