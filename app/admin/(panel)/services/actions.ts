"use server"

import { revalidatePath } from "next/cache"

import { uploadHomepageAssetRow } from "@/lib/server/upload-homepage-asset"
import {
  parsePetrolHighlightsLines,
  servicesContentFormSchema,
} from "@/lib/validations/services-content"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export type ServicesSaveState =
  | { ok: null }
  | { ok: true; message: string }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: Record<string, string[] | undefined> }

function isTruthyCheckbox(v: FormDataEntryValue | null) {
  return v === "on" || v === "true"
}

type OptionalUuid = string | null | undefined

export async function saveServicesContent(
  _prev: ServicesSaveState,
  formData: FormData
): Promise<ServicesSaveState> {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()
    if (authErr || !user) {
      return { ok: false, message: "You must be signed in as an admin." }
    }

    const editorId = user.id

    const parsedText = servicesContentFormSchema.safeParse({
      hero_page_title: formData.get("hero_page_title"),
      hero_page_subtitle: formData.get("hero_page_subtitle"),
      petrol_section_title: formData.get("petrol_section_title"),
      petrol_description: formData.get("petrol_description"),
      petrol_highlights: formData.get("petrol_highlights"),
      restaurant_section_title: formData.get("restaurant_section_title"),
      restaurant_description: formData.get("restaurant_description"),
      carwash_section_title: formData.get("carwash_section_title"),
      carwash_description: formData.get("carwash_description"),
      mini_market_section_title: formData.get("mini_market_section_title"),
      mini_market_description: formData.get("mini_market_description"),
      petrol_image_alt: formData.get("petrol_image_alt") ?? "",
      restaurant_image_alt: formData.get("restaurant_image_alt") ?? "",
      carwash_image_alt: formData.get("carwash_image_alt") ?? "",
      mini_market_image_alt: formData.get("mini_market_image_alt") ?? "",
    })

    if (!parsedText.success) {
      return { ok: false, fieldErrors: parsedText.error.flatten().fieldErrors }
    }

    const v = parsedText.data
    const bulletsR = parsePetrolHighlightsLines(v.petrol_highlights)
    if (!bulletsR.ok) {
      return { ok: false, message: bulletsR.message }
    }

    async function resolveImageSlot(opts: {
      clearName: string
      fileField: string
      alt: string
      usageSection: string
    }): Promise<{ next: OptionalUuid } | { error: string }> {
      if (isTruthyCheckbox(formData.get(opts.clearName))) {
        return { next: null }
      }
      const file = formData.get(opts.fileField)
      if (file instanceof File && file.size > 0) {
        const up = await uploadHomepageAssetRow(supabase, editorId, file, {
          altText: opts.alt ?? "",
          usageSection: opts.usageSection,
          category: "services",
        })
        if ("message" in up) return { error: up.message }
        return { next: up.id }
      }
      return { next: undefined }
    }

    const petrolImg = await resolveImageSlot({
      clearName: "clear_petrol_image",
      fileField: "petrol_image",
      alt: v.petrol_image_alt ?? "",
      usageSection: "services-petrol",
    })
    if ("error" in petrolImg) return { ok: false, message: petrolImg.error }

    const restImg = await resolveImageSlot({
      clearName: "clear_restaurant_image",
      fileField: "restaurant_image",
      alt: v.restaurant_image_alt ?? "",
      usageSection: "services-restaurant",
    })
    if ("error" in restImg) return { ok: false, message: restImg.error }

    const carwashImg = await resolveImageSlot({
      clearName: "clear_carwash_image",
      fileField: "carwash_image",
      alt: v.carwash_image_alt ?? "",
      usageSection: "services-carwash",
    })
    if ("error" in carwashImg) return { ok: false, message: carwashImg.error }

    const miniImg = await resolveImageSlot({
      clearName: "clear_mini_market_image",
      fileField: "mini_market_image",
      alt: v.mini_market_image_alt ?? "",
      usageSection: "services-mini-market",
    })
    if ("error" in miniImg) return { ok: false, message: miniImg.error }

    const patch: Record<string, unknown> = {
      hero_page_title: v.hero_page_title,
      hero_page_subtitle: v.hero_page_subtitle,
      petrol_section_title: v.petrol_section_title,
      petrol_description: v.petrol_description,
      petrol_highlights_json: bulletsR.value,
      restaurant_section_title: v.restaurant_section_title,
      restaurant_description: v.restaurant_description,
      carwash_section_title: v.carwash_section_title,
      carwash_description: v.carwash_description,
      mini_market_section_title: v.mini_market_section_title,
      mini_market_description: v.mini_market_description,
      updated_by: editorId,
    }

    if (petrolImg.next !== undefined) patch.petrol_image_media_id = petrolImg.next
    if (restImg.next !== undefined) patch.restaurant_image_media_id = restImg.next
    if (carwashImg.next !== undefined) patch.carwash_image_media_id = carwashImg.next
    if (miniImg.next !== undefined) patch.mini_market_image_media_id = miniImg.next

    const { error: upErr } = await supabase.from("services_content").update(patch).eq("id", 1)
    if (upErr) return { ok: false, message: upErr.message }

    revalidatePath("/services")
    revalidatePath("/admin/services")

    return { ok: true, message: "Services page saved and `/services` revalidated." }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error"
    return { ok: false, message: msg }
  }
}
