"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { newsPostAdminFieldsSchema, paragraphsFromAdminBodyText } from "@/lib/validations/news-admin"
import { uploadHomepageAssetRow } from "@/lib/server/upload-homepage-asset"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { NewsPostRow } from "@/types/supabase-cms"

export type NewsPostSaveState =
  | { ok: null }
  | { ok: true; message: string }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: Record<string, string[] | undefined> }

export type NewsPostDeleteState = { ok: null } | { ok: true; message: string } | { ok: false; message: string }

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

function pgUniqueMessage(raw: string) {
  if (
    raw.includes("news_posts_slug_key") ||
    raw.includes("duplicate key") ||
    raw.includes("idx_news_posts")
  ) {
    return "That slug is already used. Pick a different slug."
  }
  return raw
}

function revalidateNewsPublic(slugs: string[]) {
  revalidatePath("/")
  revalidatePath("/news")
  for (const s of slugs) {
    const t = s.trim()
    if (t) revalidatePath(`/news/${t}`)
  }
  revalidatePath("/admin/news")
}

function resolvePublishedAt(status: string, input: string | undefined, existing?: string | null) {
  if (status !== "published") return null
  if (input) {
    const parsed = new Date(input)
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString()
  }
  return existing?.trim() || new Date().toISOString()
}

export async function createNewsPostAction(_prev: NewsPostSaveState, formData: FormData): Promise<NewsPostSaveState> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) return { ok: false, message: "You must be signed in as an admin." }

  const editorId = user.id
  const adminReady = await ensureAdminProfile(supabase, user)
  if (!adminReady.ok) return { ok: false, message: adminReady.message }

  const teaserRaw = formData.get("teaser_label")
  const teaserVal = teaserRaw instanceof File ? "" : typeof teaserRaw === "string" ? teaserRaw.trim() : ""

  const parsed = newsPostAdminFieldsSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    category: formData.get("category"),
    teaser_label: teaserVal.length ? teaserVal : undefined,
    status: formData.get("status"),
    published_at: formData.get("published_at"),
    hero_image_alt: formData.get("hero_image_alt") ?? "",
    body_paragraphs: formData.get("body_paragraphs"),
  })

  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const v = parsed.data
  const paragraphs = paragraphsFromAdminBodyText(v.body_paragraphs)
  if (!paragraphs.length) {
    return { ok: false, message: "Add at least one paragraph in the body (separate paragraphs with a blank line)." }
  }

  let heroMediaId: string | null = null
  const clearHero = truthyCheckbox(formData.get("clear_hero_image"))
  const heroFile = formData.get("hero_image")

  if (clearHero) {
    heroMediaId = null
  }
  if (!clearHero && heroFile instanceof File && heroFile.size > 0) {
    const uploaded = await uploadHomepageAssetRow(supabase, editorId, heroFile, {
      altText: v.hero_image_alt ?? "",
      usageSection: `news-${v.slug}`,
      category: "news",
    })
    if ("message" in uploaded) return { ok: false, message: uploaded.message }
    heroMediaId = uploaded.id
  }

  const published_at = resolvePublishedAt(v.status, v.published_at)

  const { data: inserted, error: insErr } = await supabase
    .from("news_posts")
    .insert({
      slug: v.slug,
      status: v.status,
      title: v.title,
      excerpt: v.excerpt,
      category: v.category,
      teaser_label: v.teaser_label ?? null,
      published_at,
      hero_media_id: heroMediaId,
      hero_image_alt: v.hero_image_alt ?? null,
      body: paragraphs,
    })
    .select("id")
    .single()

  if (insErr || !inserted) {
    return { ok: false, message: pgUniqueMessage(insErr?.message ?? "Could not create the post.") }
  }

  revalidateNewsPublic([v.slug])

  redirect(`/admin/news/${inserted.id}`)
}

export async function updateNewsPostAction(_prev: NewsPostSaveState, formData: FormData): Promise<NewsPostSaveState> {
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

    const id = String(formData.get("id") ?? "").trim()
    if (!id) return { ok: false, message: "Missing post id." }

    const teaserRaw = formData.get("teaser_label")
    const teaserVal = teaserRaw instanceof File ? "" : typeof teaserRaw === "string" ? teaserRaw.trim() : ""

    const parsed = newsPostAdminFieldsSchema.safeParse({
      slug: formData.get("slug"),
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      category: formData.get("category"),
      teaser_label: teaserVal.length ? teaserVal : undefined,
      status: formData.get("status"),
      published_at: formData.get("published_at"),
      hero_image_alt: formData.get("hero_image_alt") ?? "",
      body_paragraphs: formData.get("body_paragraphs"),
    })

    if (!parsed.success) {
      return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }
    }

    const v = parsed.data
    const paragraphs = paragraphsFromAdminBodyText(v.body_paragraphs)
    if (!paragraphs.length) {
      return { ok: false, message: "Add at least one paragraph in the body (separate paragraphs with a blank line)." }
    }

    const { data: existingRow, error: fetchErr } = await supabase.from("news_posts").select("*").eq("id", id).maybeSingle()

    if (fetchErr || !existingRow) return { ok: false, message: "Post not found or could not be loaded." }

    const existing = existingRow as NewsPostRow
    const prevSlug = existing.slug

    const existingPublishedAt =
      typeof existing.published_at === "string" && existing.published_at.trim() ? existing.published_at : null
    const published_at = resolvePublishedAt(v.status, v.published_at, existingPublishedAt)

    const patch: Record<string, unknown> = {
      slug: v.slug,
      status: v.status,
      title: v.title,
      excerpt: v.excerpt,
      category: v.category,
      teaser_label: v.teaser_label ?? null,
      published_at,
      hero_image_alt: v.hero_image_alt ?? null,
      body: paragraphs,
    }

    const clearHero = truthyCheckbox(formData.get("clear_hero_image"))
    const heroFile = formData.get("hero_image")

    if (clearHero) {
      patch.hero_media_id = null
    } else if (heroFile instanceof File && heroFile.size > 0) {
      const uploaded = await uploadHomepageAssetRow(supabase, editorId, heroFile, {
        altText: v.hero_image_alt ?? "",
        usageSection: `news-${v.slug}`,
        category: "news",
      })
      if ("message" in uploaded) return { ok: false, message: uploaded.message }
      patch.hero_media_id = uploaded.id
    }

    const { error: upErr } = await supabase.from("news_posts").update(patch).eq("id", id)
    if (upErr) return { ok: false, message: pgUniqueMessage(upErr.message) }

    const slugsToRevalidate = [...new Set([prevSlug, v.slug].filter(Boolean))]
    revalidateNewsPublic(slugsToRevalidate)
    revalidatePath(`/admin/news/${id}`)

    return { ok: true, message: "Post saved." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}

export async function deleteNewsPostAction(
  _prev: NewsPostDeleteState,
  formData: FormData
): Promise<NewsPostDeleteState> {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()
    if (authErr || !user) return { ok: false, message: "You must be signed in as an admin." }

    const adminReady = await ensureAdminProfile(supabase, user)
    if (!adminReady.ok) return { ok: false, message: adminReady.message }

    const id = String(formData.get("id") ?? "").trim()
    const slug = String(formData.get("slug") ?? "").trim()
    if (!id) return { ok: false, message: "Missing post id." }

    const { error } = await supabase.from("news_posts").delete().eq("id", id)
    if (error) return { ok: false, message: error.message }

    revalidateNewsPublic(slug ? [slug] : [])

    return { ok: true, message: "Post deleted." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}
