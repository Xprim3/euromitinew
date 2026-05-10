"use server"

import { revalidatePath } from "next/cache"

import { companyStoryJsonFromParagraphs } from "@/lib/data/about-content-public"
import { uploadHomepageAssetRow } from "@/lib/server/upload-homepage-asset"
import { aboutContentTextSchema } from "@/lib/validations/about-content"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { AboutValueCard } from "@/types/supabase-cms"

export type AboutSaveState =
  | { ok: null }
  | { ok: true; message: string }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: Record<string, string[] | undefined> }

const VALUE_SLOTS = 8

function isTruthyCheckbox(v: FormDataEntryValue | null) {
  return v === "on" || v === "true"
}

function paragraphsFromForm(raw: string) {
  return raw
    .trim()
    .split(/\n(?:\s*\n)+/)
    .map((p) => p.trim())
    .filter(Boolean)
}

function collectValues(formData: FormData): AboutValueCard[] {
  const out: AboutValueCard[] = []
  for (let i = 0; i < VALUE_SLOTS; i++) {
    const title = String(formData.get(`value_${i}_title`) ?? "").trim()
    const body = String(formData.get(`value_${i}_body`) ?? "").trim()
    let icon = String(formData.get(`value_${i}_icon`) ?? "").trim()
    if (!title || !body) continue
    if (!icon || !/^[a-z0-9_]+$/.test(icon)) icon = "verified"
    out.push({ title, body, icon_material: icon })
  }
  return out
}

/** undefined = omit patch; null = clear FK */
type OptionalUuid = string | null | undefined

export async function saveAboutContent(_prev: AboutSaveState, formData: FormData): Promise<AboutSaveState> {
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

    const parsed = aboutContentTextSchema.safeParse({
      hero_title: formData.get("hero_title"),
      hero_subtitle: formData.get("hero_subtitle"),
      mission_title: formData.get("mission_title"),
      mission_body: formData.get("mission_body"),
      vision_title: formData.get("vision_title"),
      vision_body: formData.get("vision_body"),
      company_story_paragraphs: formData.get("company_story_paragraphs"),
      hero_image_alt: formData.get("hero_image_alt") ?? "",
      story_image_alt: formData.get("story_image_alt") ?? "",
      gallery_strip_alt: formData.get("gallery_strip_alt") ?? "",
      gallery_why_alt: formData.get("gallery_why_alt") ?? "",
      gallery_partner_alt: formData.get("gallery_partner_alt") ?? "",
    })

    if (!parsed.success) {
      return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }
    }

    const v = parsed.data
    const storyParts = paragraphsFromForm(v.company_story_paragraphs)
    if (storyParts.length === 0) {
      return {
        ok: false,
        message: "Add at least one company story paragraph (separate paragraphs with a blank line).",
      }
    }
    if (storyParts.length > 40) {
      return { ok: false, message: "Too many story paragraphs (max 40)." }
    }

    const valuesJson = collectValues(formData)
    if (valuesJson.length === 0) {
      return { ok: false, message: "Add at least one core value (title + body)." }
    }
    const { data: curRaw, error: loadErr } = await supabase.from("about_content").select("*").eq("id", 1).maybeSingle()
    if (loadErr) return { ok: false, message: loadErr.message }
    if (!curRaw) {
      return { ok: false, message: "No about_content row with id = 1. Run Phase 10 migrations." }
    }

    async function resolveMediaSlot(opts: {
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
          category: "about",
        })
        if ("message" in up) return { error: up.message }
        return { next: up.id }
      }
      return { next: undefined }
    }

    let heroMediaId: OptionalUuid = undefined
    if (isTruthyCheckbox(formData.get("clear_hero_media"))) heroMediaId = null
    else {
      const hf = formData.get("hero_media")
      if (hf instanceof File && hf.size > 0) {
        const up = await uploadHomepageAssetRow(supabase, editorId, hf, {
          altText: v.hero_image_alt ?? "",
          usageSection: "about-hero",
          category: "about",
        })
        if ("message" in up) return { ok: false, message: up.message }
        heroMediaId = up.id
      }
    }

    let storyMediaId: OptionalUuid = undefined
    if (isTruthyCheckbox(formData.get("clear_story_media"))) storyMediaId = null
    else {
      const sf = formData.get("story_media")
      if (sf instanceof File && sf.size > 0) {
        const up = await uploadHomepageAssetRow(supabase, editorId, sf, {
          altText: v.story_image_alt ?? "",
          usageSection: "about-story",
          category: "about",
        })
        if ("message" in up) return { ok: false, message: up.message }
        storyMediaId = up.id
      }
    }

    const stripR = await resolveMediaSlot({
      clearName: "clear_gallery_strip",
      fileField: "gallery_strip_image",
      alt: v.gallery_strip_alt ?? "",
      usageSection: "about-gallery-strip",
    })
    if ("error" in stripR) return { ok: false, message: stripR.error }

    const whyR = await resolveMediaSlot({
      clearName: "clear_gallery_why",
      fileField: "gallery_why_image",
      alt: v.gallery_why_alt ?? "",
      usageSection: "about-gallery-why-us",
    })
    if ("error" in whyR) return { ok: false, message: whyR.error }

    const partnerR = await resolveMediaSlot({
      clearName: "clear_gallery_partner",
      fileField: "gallery_partner_image",
      alt: v.gallery_partner_alt ?? "",
      usageSection: "about-gallery-partnerships",
    })
    if ("error" in partnerR) return { ok: false, message: partnerR.error }

    const patch: Record<string, unknown> = {
      hero_title: v.hero_title,
      hero_subtitle: v.hero_subtitle,
      mission_title: v.mission_title,
      mission_body: v.mission_body,
      vision_title: v.vision_title,
      vision_body: v.vision_body,
      company_story: companyStoryJsonFromParagraphs(storyParts),
      values_json: valuesJson,
      updated_by: editorId,
    }

    if (heroMediaId !== undefined) patch.hero_media_id = heroMediaId
    if (storyMediaId !== undefined) patch.story_media_id = storyMediaId

    if (stripR.next !== undefined) patch.gallery_strip_media_id = stripR.next
    if (whyR.next !== undefined) patch.gallery_why_us_media_id = whyR.next
    if (partnerR.next !== undefined) patch.gallery_partnerships_media_id = partnerR.next

    const { error: upErr } = await supabase.from("about_content").update(patch).eq("id", 1)
    if (upErr) return { ok: false, message: upErr.message }

    revalidatePath("/about")
    revalidatePath("/admin/about")

    return { ok: true, message: "About page saved and public `/about` revalidated." }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error"
    return { ok: false, message: msg }
  }
}
