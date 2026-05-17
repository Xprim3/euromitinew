"use server"

import { revalidatePath } from "next/cache"

import { uploadHomepageAssetRow } from "@/lib/server/upload-homepage-asset"
import {
  parsePetrolHighlightsLines,
  parseServiceHighlightsLines,
  servicesContentFormSchema,
} from "@/lib/validations/services-content"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { ResolvedServicesWhyCard } from "@/lib/data/services-content-public"

export type ServicesSaveState =
  | { ok: null }
  | { ok: true; message: string }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: Record<string, string[] | undefined> }

function isTruthyCheckbox(v: FormDataEntryValue | null) {
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

type OptionalUuid = string | null | undefined
const WHY_CARD_SLOTS = 4

function collectWhyCards(formData: FormData): ResolvedServicesWhyCard[] {
  const out: ResolvedServicesWhyCard[] = []
  for (let i = 0; i < WHY_CARD_SLOTS; i++) {
    const title = String(formData.get(`why_card_${i}_title`) ?? "").trim()
    const body = String(formData.get(`why_card_${i}_body`) ?? "").trim()
    let icon = String(formData.get(`why_card_${i}_icon`) ?? "").trim()
    if (!title || !body) continue
    if (!icon || !/^[a-z0-9_]+$/.test(icon)) icon = "verified"
    out.push({ icon, title, body })
  }
  return out
}

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
    const adminReady = await ensureAdminProfile(supabase, user)
    if (!adminReady.ok) return { ok: false, message: adminReady.message }

    const parsedText = servicesContentFormSchema.safeParse({
      hero_page_title: formData.get("hero_page_title"),
      hero_page_subtitle: formData.get("hero_page_subtitle"),
      hero_page_image_alt: formData.get("hero_page_image_alt") ?? "",
      why_choose_kicker: formData.get("why_choose_kicker"),
      why_choose_title: formData.get("why_choose_title"),
      why_choose_body: formData.get("why_choose_body"),
      why_choose_featured_title: formData.get("why_choose_featured_title"),
      why_choose_featured_body: formData.get("why_choose_featured_body"),
      petrol_section_title: formData.get("petrol_section_title"),
      petrol_description: formData.get("petrol_description"),
      petrol_highlights: formData.get("petrol_highlights"),
      restaurant_highlights: formData.get("restaurant_highlights"),
      carwash_highlights: formData.get("carwash_highlights"),
      mini_market_highlights: formData.get("mini_market_highlights"),
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
    const restaurantBulletsR = parseServiceHighlightsLines(v.restaurant_highlights, "Restaurant bullets")
    if (!restaurantBulletsR.ok) {
      return { ok: false, message: restaurantBulletsR.message }
    }
    const carwashBulletsR = parseServiceHighlightsLines(v.carwash_highlights, "Carwash bullets")
    if (!carwashBulletsR.ok) {
      return { ok: false, message: carwashBulletsR.message }
    }
    const miniMarketBulletsR = parseServiceHighlightsLines(v.mini_market_highlights, "Mini Market bullets")
    if (!miniMarketBulletsR.ok) {
      return { ok: false, message: miniMarketBulletsR.message }
    }
    const whyCards = collectWhyCards(formData)
    if (whyCards.length === 0) {
      return { ok: false, message: "Add at least one Why Choose Euromiti card (title + description)." }
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

    const pageHeroImg = await resolveImageSlot({
      clearName: "clear_hero_page_image",
      fileField: "hero_page_image",
      alt: v.hero_page_image_alt ?? "",
      usageSection: "services-page-hero",
    })
    if ("error" in pageHeroImg) return { ok: false, message: pageHeroImg.error }

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
      id: 1,
      hero_page_title: v.hero_page_title,
      hero_page_subtitle: v.hero_page_subtitle,
      why_choose_kicker: v.why_choose_kicker,
      why_choose_title: v.why_choose_title,
      why_choose_body: v.why_choose_body,
      why_choose_featured_title: v.why_choose_featured_title,
      why_choose_featured_body: v.why_choose_featured_body,
      why_sections_json: whyCards,
      petrol_section_title: v.petrol_section_title,
      petrol_description: v.petrol_description,
      petrol_highlights_json: bulletsR.value,
      restaurant_section_title: v.restaurant_section_title,
      restaurant_description: v.restaurant_description,
      restaurant_highlights_json: restaurantBulletsR.value,
      carwash_section_title: v.carwash_section_title,
      carwash_description: v.carwash_description,
      carwash_highlights_json: carwashBulletsR.value,
      mini_market_section_title: v.mini_market_section_title,
      mini_market_description: v.mini_market_description,
      mini_market_highlights_json: miniMarketBulletsR.value,
      hero_page_image_alt: v.hero_page_image_alt ?? "",
      updated_by: editorId,
    }

    if (pageHeroImg.next !== undefined) patch.hero_page_image_media_id = pageHeroImg.next
    if (petrolImg.next !== undefined) patch.petrol_image_media_id = petrolImg.next
    if (restImg.next !== undefined) patch.restaurant_image_media_id = restImg.next
    if (carwashImg.next !== undefined) patch.carwash_image_media_id = carwashImg.next
    if (miniImg.next !== undefined) patch.mini_market_image_media_id = miniImg.next

    const { error: upErr } = await supabase.from("services_content").upsert(patch, { onConflict: "id" })
    if (upErr) return { ok: false, message: upErr.message }

    revalidatePath("/services")
    revalidatePath("/admin/services")

    return { ok: true, message: "Services page saved and `/services` revalidated." }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error"
    return { ok: false, message: msg }
  }
}
