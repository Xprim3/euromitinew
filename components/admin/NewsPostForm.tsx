"use client"

import Image from "next/image"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

import type { NewsPostSaveState } from "@/app/admin/(panel)/news/actions"
import { adminInputClass, adminLabelClass } from "@/components/admin/cn-admin"
import { ServicesSaveSubmitButton } from "@/components/admin/ServicesSaveSubmitButton"
import { bodyParagraphsFromJson } from "@/lib/data/news-public"
import { NEWS_ADMIN_CATEGORIES } from "@/lib/validations/news-admin"
import type { NewsPostRow } from "@/types/supabase-cms"

const initialSave: NewsPostSaveState = { ok: null }

type NewsPostFormProps = {
  mode: "create" | "edit"
  submitAction: (prev: NewsPostSaveState, formData: FormData) => Promise<NewsPostSaveState>
  initial: NewsPostRow | null
  heroPreviewUrl: string | null
}

export function NewsPostForm({ mode, submitAction, initial, heroPreviewUrl }: NewsPostFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(submitAction, initialSave)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined
  const hasFieldErrors = Boolean(fieldErrors && Object.values(fieldErrors).some((v) => v?.length))

  useEffect(() => {
    if (mode === "edit" && state.ok === true) router.refresh()
  }, [mode, router, state.ok])

  const paragraphs = initial ? bodyParagraphsFromJson(initial.body) : []
  const bodyDefault = paragraphs.join("\n\n")

  const saveLabel = mode === "create" ? "Create post" : "Save post"

  const statusDefault =
    initial?.status === "published" ? "published" : initial?.status === "archived" ? "archived" : "draft"

  const cats = NEWS_ADMIN_CATEGORIES as readonly string[]
  const categoryDefault =
    initial?.category && cats.includes(initial.category) ? initial.category : NEWS_ADMIN_CATEGORIES[0]

  return (
    <form action={formAction} className="max-w-4xl space-y-10 pb-24">
      {mode === "edit" && initial ? <input type="hidden" name="id" value={initial.id} /> : null}

      {state.ok === true ? (
        <p
          role="status"
          className="rounded-lg border border-emerald-500/35 bg-emerald-500/15 px-4 py-3 text-emerald-100 text-sm"
        >
          {state.message}
        </p>
      ) : null}
      {state.ok === false && "message" in state ? (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-100 text-sm"
        >
          {state.message}
        </p>
      ) : null}
      {hasFieldErrors ? (
        <p className="rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-400">
          Fix the highlighted fields and try again.
        </p>
      ) : null}

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Metadata</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={adminLabelClass} htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={initial?.title ?? ""}
              className={adminInputClass}
            />
            {fieldErrors?.title?.[0] ? <p className="mt-1 text-red-400 text-xs">{fieldErrors.title[0]}</p> : null}
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="slug">
              URL slug (for /news/[slug])
            </label>
            <input
              id="slug"
              name="slug"
              required
              defaultValue={initial?.slug ?? ""}
              placeholder="my-announcement"
              className={`${adminInputClass} font-mono text-xs`}
            />
            {fieldErrors?.slug?.[0] ? <p className="mt-1 text-red-400 text-xs">{fieldErrors.slug[0]}</p> : null}
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              className={adminInputClass}
              defaultValue={categoryDefault}
            >
              {NEWS_ADMIN_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {fieldErrors?.category?.[0] ? <p className="mt-1 text-red-400 text-xs">{fieldErrors.category[0]}</p> : null}
          </div>
          <div className="md:col-span-2">
            <label className={adminLabelClass} htmlFor="excerpt">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              required
              rows={3}
              defaultValue={initial?.excerpt ?? ""}
              className={adminInputClass}
            />
            {fieldErrors?.excerpt?.[0] ? <p className="mt-1 text-red-400 text-xs">{fieldErrors.excerpt[0]}</p> : null}
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="teaser_label">
              Homepage / archive badge (optional)
            </label>
            <input
              id="teaser_label"
              name="teaser_label"
              defaultValue={initial?.teaser_label ?? ""}
              placeholder='e.g. "Network update"'
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="status">
              Status
            </label>
            <select id="status" name="status" required className={adminInputClass} defaultValue={statusDefault}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived (hidden)</option>
            </select>
            <p className="mt-1 text-xs text-zinc-500">Only Published posts appear on the public site.</p>
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Featured image</h2>
        {heroPreviewUrl ? (
          <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-lg border border-zinc-700">
            <Image src={heroPreviewUrl} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 36rem" />
          </div>
        ) : null}

        {mode === "edit" && (heroPreviewUrl || initial?.hero_media_id) ? (
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" name="clear_hero_image" className="size-4 rounded border-zinc-600" />
            Remove featured image (after save)
          </label>
        ) : null}

        <div>
          <label className={adminLabelClass} htmlFor="hero_image">
            Upload hero image
          </label>
          <input
            id="hero_image"
            name="hero_image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="block w-full max-w-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-2 file:text-sm file:text-white"
          />
          <p className="mt-1 text-xs text-zinc-500">JPEG / PNG / WebP / GIF, up to 5 MB.</p>
        </div>

        <div>
          <label className={adminLabelClass} htmlFor="hero_image_alt">
            Hero image alt text
          </label>
          <input
            id="hero_image_alt"
            name="hero_image_alt"
            defaultValue={initial?.hero_image_alt ?? ""}
            className={adminInputClass}
          />
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Article body</h2>
        <div>
          <label className={adminLabelClass} htmlFor="body_paragraphs">
            Paragraphs
          </label>
          <textarea
            id="body_paragraphs"
            name="body_paragraphs"
            required
            rows={14}
            defaultValue={bodyDefault}
            placeholder="First paragraph...\n\nSecond paragraph..."
            className={adminInputClass}
          />
          {fieldErrors?.body_paragraphs?.[0] ? (
            <p className="mt-1 text-red-400 text-xs">{fieldErrors.body_paragraphs[0]}</p>
          ) : null}
          <p className="mt-1 text-xs text-zinc-500">Separate paragraphs with a blank line.</p>
        </div>
      </section>

      <ServicesSaveSubmitButton label={saveLabel} pendingLabel="Saving…" />
    </form>
  )
}
