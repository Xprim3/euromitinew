"use server"

import { revalidatePath } from "next/cache"

import { uploadHomepageAssetRow } from "@/lib/server/upload-homepage-asset"
import {
  ADMIN_RESTAURANT_GALLERY_SLOTS,
  ADMIN_RESTAURANT_MENU_SLOTS,
  ADMIN_RESTAURANT_PILLAR_SLOTS,
  restaurantContentFormSchema,
} from "@/lib/validations/restaurant-content"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export type RestaurantSaveState =
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

type OptionalUuid = string | null | undefined

function dedupeIds(ids: string[]) {
  const seen = new Set<string>()
  return ids.filter((id) => {
    if (!id || seen.has(id)) return false
    seen.add(id)
    return true
  })
}

async function resolveHeroMedia(opts: {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>
  editorId: string
  formData: FormData
}): Promise<{ next: OptionalUuid } | { error: string }> {
  if (truthyCheckbox(opts.formData.get("clear_hero_image"))) {
    return { next: null }
  }
  const file = opts.formData.get("hero_image")
  const alt = String(opts.formData.get("hero_image_alt") ?? "").trim()
  if (file instanceof File && file.size > 0) {
    const up = await uploadHomepageAssetRow(opts.supabase, opts.editorId, file, {
      altText: alt,
      usageSection: "restaurant-hero",
      category: "restaurant",
    })
    if ("message" in up) return { error: up.message }
    return { next: up.id }
  }
  return { next: undefined }
}

async function collectMenuHighlights(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  editorId: string,
  formData: FormData
): Promise<{ ok: true; value: { title: string; body: string; image_media_id: string | null }[] } | { ok: false; message: string }> {
  const out: { title: string; body: string; image_media_id: string | null }[] = []

  for (let i = 0; i < ADMIN_RESTAURANT_MENU_SLOTS; i++) {
    const title = String(formData.get(`menu_title_${i}`) ?? "").trim()
    const body = String(formData.get(`menu_body_${i}`) ?? "").trim()
    if (!title || !body) continue

    const clear = truthyCheckbox(formData.get(`menu_clear_image_${i}`))
    const file = formData.get(`menu_image_${i}`)
    const keep = String(formData.get(`menu_media_id_${i}`) ?? "").trim()

    let image_media_id: string | null = null

    if (clear) {
      image_media_id = null
    } else if (file instanceof File && file.size > 0) {
      const alt = String(formData.get(`menu_image_alt_${i}`) ?? "").trim()
      const up = await uploadHomepageAssetRow(supabase, editorId, file, {
        altText: alt,
        usageSection: `restaurant-menu-${i}`,
        category: "restaurant",
      })
      if ("message" in up) return { ok: false, message: up.message }
      image_media_id = up.id
    } else if (keep.length > 0) {
      image_media_id = keep
    }

    out.push({ title, body, image_media_id })
  }

  return { ok: true, value: out }
}

async function collectGalleryIds(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  editorId: string,
  formData: FormData
): Promise<{ ok: true; ids: string[] } | { ok: false; message: string }> {
  const ordered: string[] = []

  for (let i = 0; i < ADMIN_RESTAURANT_GALLERY_SLOTS; i++) {
    const clear = truthyCheckbox(formData.get(`gallery_clear_${i}`))
    const file = formData.get(`gallery_image_${i}`)
    const keep = String(formData.get(`gallery_media_id_${i}`) ?? "").trim()

    if (clear) continue

    if (file instanceof File && file.size > 0) {
      const alt = String(formData.get(`gallery_image_alt_${i}`) ?? "").trim()
      const up = await uploadHomepageAssetRow(supabase, editorId, file, {
        altText: alt,
        usageSection: `restaurant-gallery-${i}`,
        category: "restaurant",
      })
      if ("message" in up) return { ok: false, message: up.message }
      ordered.push(up.id)
      continue
    }

    if (keep.length > 0) ordered.push(keep)
  }

  return { ok: true, ids: dedupeIds(ordered).slice(0, ADMIN_RESTAURANT_GALLERY_SLOTS) }
}

function collectExperiencePillars(formData: FormData): { title: string; body: string }[] {
  const out: { title: string; body: string }[] = []
  for (let i = 0; i < ADMIN_RESTAURANT_PILLAR_SLOTS; i++) {
    const title = String(formData.get(`pillar_title_${i}`) ?? "").trim()
    const body = String(formData.get(`pillar_body_${i}`) ?? "").trim()
    out.push({ title, body })
  }
  return out
}

async function resolveSkanomMedia(opts: {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>
  editorId: string
  formData: FormData
}): Promise<{ next: OptionalUuid } | { error: string }> {
  if (truthyCheckbox(opts.formData.get("clear_skanom_image"))) {
    return { next: null }
  }
  const file = opts.formData.get("skanom_image")
  const alt = String(opts.formData.get("skanom_image_alt") ?? "").trim()
  if (file instanceof File && file.size > 0) {
    const up = await uploadHomepageAssetRow(opts.supabase, opts.editorId, file, {
      altText: alt,
      usageSection: "restaurant-skanom",
      category: "restaurant",
    })
    if ("message" in up) return { error: up.message }
    return { next: up.id }
  }
  return { next: undefined }
}

async function resolveEditorialHeroMedia(opts: {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>
  editorId: string
  formData: FormData
}): Promise<{ next: OptionalUuid } | { error: string }> {
  if (truthyCheckbox(opts.formData.get("clear_editorial_image"))) {
    return { next: null }
  }
  const file = opts.formData.get("editorial_image")
  const alt = String(opts.formData.get("editorial_image_alt") ?? "").trim()
  if (file instanceof File && file.size > 0) {
    const up = await uploadHomepageAssetRow(opts.supabase, opts.editorId, file, {
      altText: alt,
      usageSection: "restaurant-editorial-hero",
      category: "restaurant",
    })
    if ("message" in up) return { error: up.message }
    return { next: up.id }
  }
  return { next: undefined }
}

async function resolveIntroSectionMedia(opts: {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>
  editorId: string
  formData: FormData
}): Promise<{ next: OptionalUuid } | { error: string }> {
  if (truthyCheckbox(opts.formData.get("clear_intro_image"))) {
    return { next: null }
  }
  const file = opts.formData.get("intro_image")
  const alt = String(opts.formData.get("intro_image_alt") ?? "").trim()
  if (file instanceof File && file.size > 0) {
    const up = await uploadHomepageAssetRow(opts.supabase, opts.editorId, file, {
      altText: alt,
      usageSection: "restaurant-intro",
      category: "restaurant",
    })
    if ("message" in up) return { error: up.message }
    return { next: up.id }
  }
  return { next: undefined }
}

export async function saveRestaurantContent(
  _prev: RestaurantSaveState,
  formData: FormData
): Promise<RestaurantSaveState> {
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

    const parsed = restaurantContentFormSchema.safeParse({
      hero_title: formData.get("hero_title"),
      hero_subtitle: formData.get("hero_subtitle"),
      intro_eyebrow: formData.get("intro_eyebrow"),
      intro_headline_line1: formData.get("intro_headline_line1"),
      intro_headline_line2: formData.get("intro_headline_line2"),
      intro_body: formData.get("intro_body"),
      opening_hours: formData.get("opening_hours"),
      contact_phone: formData.get("contact_phone") ?? "",
      contact_email: formData.get("contact_email") ?? "",
      contact_notes: formData.get("contact_notes") ?? "",
      hero_image_alt: formData.get("hero_image_alt") ?? "",
      skanom_eyebrow: formData.get("skanom_eyebrow"),
      skanom_title: formData.get("skanom_title"),
      skanom_description: formData.get("skanom_description"),
      skanom_cta_label: formData.get("skanom_cta_label"),
      skanom_cta_href: formData.get("skanom_cta_href"),
      skanom_image_alt: formData.get("skanom_image_alt") ?? "",
      editorial_eyebrow: formData.get("editorial_eyebrow"),
      editorial_title_line1: formData.get("editorial_title_line1"),
      editorial_title_line2: formData.get("editorial_title_line2"),
      editorial_description: formData.get("editorial_description"),
      editorial_quote_line: formData.get("editorial_quote_line"),
      editorial_quote_attribution: formData.get("editorial_quote_attribution"),
      editorial_image_alt: formData.get("editorial_image_alt") ?? "",
      intro_image_alt: formData.get("intro_image_alt") ?? "",
    })

    if (!parsed.success) {
      return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }
    }

    const v = parsed.data

    const heroR = await resolveHeroMedia({ supabase, editorId, formData })
    if ("error" in heroR) return { ok: false, message: heroR.error }

    const skanomR = await resolveSkanomMedia({ supabase, editorId, formData })
    if ("error" in skanomR) return { ok: false, message: skanomR.error }

    const editorialR = await resolveEditorialHeroMedia({ supabase, editorId, formData })
    if ("error" in editorialR) return { ok: false, message: editorialR.error }

    const introR = await resolveIntroSectionMedia({ supabase, editorId, formData })
    if ("error" in introR) return { ok: false, message: introR.error }

    const menuR = await collectMenuHighlights(supabase, editorId, formData)
    if (!menuR.ok) return { ok: false, message: menuR.message }

    const galR = await collectGalleryIds(supabase, editorId, formData)
    if (!galR.ok) return { ok: false, message: galR.message }

    const experiencePillarsJson = collectExperiencePillars(formData)

    const phoneTrim = v.contact_phone?.trim() ?? ""
    const emailTrim = v.contact_email?.trim() ?? ""
    const notesTrim = v.contact_notes?.trim() ?? ""

    const patch: Record<string, unknown> = {
      id: 1,
      hero_title: v.hero_title,
      hero_subtitle: v.hero_subtitle,
      hero_description: v.intro_body,
      intro_eyebrow: v.intro_eyebrow,
      intro_headline_line1: v.intro_headline_line1,
      intro_headline_line2: v.intro_headline_line2,
      intro_body: v.intro_body,
      opening_hours: v.opening_hours,
      contact_phone: phoneTrim.length ? phoneTrim : null,
      contact_email: emailTrim.length ? emailTrim : null,
      contact_notes: notesTrim.length ? notesTrim : null,
      menu_highlights_json: menuR.value,
      experience_pillars_json: experiencePillarsJson,
      gallery_media_ids: galR.ids,
      skanom_eyebrow: v.skanom_eyebrow,
      skanom_title: v.skanom_title,
      skanom_description: v.skanom_description,
      skanom_cta_label: v.skanom_cta_label,
      skanom_cta_href: v.skanom_cta_href,
      editorial_eyebrow: v.editorial_eyebrow,
      editorial_title_line1: v.editorial_title_line1,
      editorial_title_line2: v.editorial_title_line2,
      editorial_description: v.editorial_description,
      editorial_quote_line: v.editorial_quote_line,
      editorial_quote_attribution: v.editorial_quote_attribution,
      updated_by: editorId,
    }

    if (heroR.next !== undefined) patch.hero_image_media_id = heroR.next
    if (skanomR.next !== undefined) patch.skanom_image_media_id = skanomR.next
    if (editorialR.next !== undefined) patch.editorial_image_media_id = editorialR.next
    if (introR.next !== undefined) patch.intro_image_media_id = introR.next

    const { error: upErr } = await supabase.from("restaurant_content").upsert(patch, { onConflict: "id" })
    if (upErr) return { ok: false, message: upErr.message }

    revalidatePath("/restaurant")
    revalidatePath("/admin/restaurant")

    return { ok: true, message: "Restaurant page saved and `/restaurant` revalidated." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error." }
  }
}
