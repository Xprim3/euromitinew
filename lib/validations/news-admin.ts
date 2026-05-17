import { z } from "zod"

import { excerptFromParagraphs } from "@/lib/news/excerpt-from-body"
import type { NewsFilterTab } from "@/lib/constants/news-archive"
import { NEWS_FILTER_TABS } from "@/lib/constants/news-archive"

/** Categories persisted on `news_posts.category` — matches archive tabs after "All News". */
export const NEWS_ADMIN_CATEGORIES = NEWS_FILTER_TABS.slice(1)

type NewsCategorySlug = Exclude<NewsFilterTab, "All News">
const categorySchema = z.enum(NEWS_ADMIN_CATEGORIES as unknown as [NewsCategorySlug, ...NewsCategorySlug[]])

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens (e.g. my-story).")

export const newsPostAdminFieldsSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1).max(500),
  category: categorySchema,
  teaser_label: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((s) => (s && s.length > 0 ? s : undefined)),
  status: z.enum(["draft", "published", "archived"]),
  published_at: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((s) => (s && s.length > 0 ? s : undefined)),
  hero_image_alt: z.string().trim().max(500).transform((s) => (s.length ? s : undefined)),
  seo_title: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((s) => (s && s.length > 0 ? s : undefined)),
  seo_description: z
    .string()
    .trim()
    .max(320)
    .optional()
    .transform((s) => (s && s.length > 0 ? s : undefined)),
  /** Plain textarea: paragraphs separated by a blank line. */
  body_paragraphs: z.string().max(80000),
})

export type NewsPostAdminParsed = z.infer<typeof newsPostAdminFieldsSchema>

export function paragraphsFromAdminBodyText(raw: string): string[] {
  return raw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

/** Persisted `news_posts.excerpt` — always derived from the body on save. */
export function excerptForNewsPostSave(paragraphs: readonly string[]): string {
  return excerptFromParagraphs(paragraphs)
}
