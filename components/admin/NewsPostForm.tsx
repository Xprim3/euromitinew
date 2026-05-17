"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import type { NewsPostSaveState } from "@/app/admin/(panel)/news/actions"
import {
  AdminContentGrid,
  AdminCollapsibleSection,
  AdminSectionCard,
  ErrorMessage,
  FileUploadInput,
  SaveBar,
  SelectInput,
  SuccessMessage,
  TextareaInput,
  TextInput,
  ToggleInput,
} from "@/components/admin/design-system"
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

function toDatetimeLocal(value: string | null | undefined) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  const offsetMs = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

export function NewsPostForm({ mode, submitAction, initial, heroPreviewUrl }: NewsPostFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
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
  const [published, setPublished] = useState(statusDefault === "published")

  const cats = NEWS_ADMIN_CATEGORIES as readonly string[]
  const categoryDefault =
    initial?.category && cats.includes(initial.category) ? initial.category : NEWS_ADMIN_CATEGORIES[0]
  const categoryOptions = NEWS_ADMIN_CATEGORIES.map((category) => ({ value: category, label: category }))
  const seoFieldError = Boolean(fieldErrors?.seo_title?.length || fieldErrors?.seo_description?.length)

  return (
    <form ref={formRef} action={formAction} className="space-y-6 pb-24">
      {mode === "edit" && initial ? <input type="hidden" name="id" value={initial.id} /> : null}
      <input type="hidden" name="status" value={published ? "published" : "draft"} />

      {state.ok === true ? (
        <SuccessMessage title="Post saved">{state.message}</SuccessMessage>
      ) : null}
      {state.ok === false && "message" in state ? (
        <ErrorMessage title="Could not save post">{state.message}</ErrorMessage>
      ) : null}
      {hasFieldErrors ? (
        <ErrorMessage title="Check the highlighted fields">Fix the highlighted fields and try again.</ErrorMessage>
      ) : null}

      <AdminSectionCard title="Publishing" description="Draft posts stay hidden from the public News page.">
        <AdminContentGrid columns={2}>
          <ToggleInput
            label="Publish article"
            checkedLabel="Published"
            uncheckedLabel="Draft"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
            helperText="Published posts appear on /news and their article page."
          />
          <TextInput
            label="Publish date"
            name="published_at"
            type="datetime-local"
            defaultValue={toDatetimeLocal(initial?.published_at)}
            disabled={!published}
            helperText={published ? "Leave empty to publish with the current time." : "Enable publishing to set a date."}
          />
        </AdminContentGrid>
      </AdminSectionCard>

      <AdminSectionCard
        title="Article"
        description="The list and homepage preview the start of the body. The full article opens on Lexo më shumë."
      >
        <div className="space-y-4">
          <TextInput
            label="Title"
            name="title"
            required
            defaultValue={initial?.title ?? ""}
            error={fieldErrors?.title?.[0]}
          />
          <AdminContentGrid columns={2}>
            <TextInput
              label="Slug"
              name="slug"
              required
              defaultValue={initial?.slug ?? ""}
              placeholder="my-announcement"
              helperText="Used for /news/[slug]. Lowercase letters, numbers, and hyphens only."
              error={fieldErrors?.slug?.[0]}
            />
            <SelectInput
              label="Category"
              name="category"
              required
              options={categoryOptions}
              defaultValue={categoryDefault}
              error={fieldErrors?.category?.[0]}
            />
          </AdminContentGrid>
          <TextareaInput
            label="Article body"
            name="body_paragraphs"
            required
            rows={14}
            defaultValue={bodyDefault}
            placeholder="First paragraph...\n\nSecond paragraph..."
            helperText="Separate paragraphs with a blank line."
            error={fieldErrors?.body_paragraphs?.[0]}
          />
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Featured image" description="Used on the news archive card and article hero.">
        <div className="space-y-4">
          <FileUploadInput
            label="Image upload"
            name="hero_image"
            previewUrl={heroPreviewUrl}
            previewAlt={initial?.hero_image_alt ?? initial?.title ?? "News featured image"}
            removeInputName="clear_hero_image"
          />
          <TextInput
            label="Image alt text"
            name="hero_image_alt"
            defaultValue={initial?.hero_image_alt ?? ""}
            placeholder="Describe the featured image"
          />
        </div>
      </AdminSectionCard>

      <AdminCollapsibleSection
        key={seoFieldError ? "seo-errors" : "seo"}
        title="SEO (opsionale)"
        description="Lini bosh për të përdorur titullin dhe përshkrimin e artikullit. Përdorni vetëm kur duhet diçka e veçantë për Google dhe rrjetet sociale."
        defaultOpen={seoFieldError}
      >
        <div className="space-y-4">
          <TextInput
            label="SEO title"
            name="seo_title"
            defaultValue={initial?.seo_title ?? ""}
            maxLength={120}
            placeholder={initial?.title ?? "Titulli i artikullit"}
            error={fieldErrors?.seo_title?.[0]}
          />
          <TextareaInput
            label="SEO description"
            name="seo_description"
            rows={3}
            defaultValue={initial?.seo_description ?? ""}
            maxLength={320}
            showCharacterCount
            placeholder="Përshkrim i shkurtër për motorët e kërkimit…"
            error={fieldErrors?.seo_description?.[0]}
          />
          <ToggleInput
            label="Hide from search engines"
            name="no_index"
            defaultChecked={Boolean(initial?.no_index)}
            checkedLabel="No index"
            uncheckedLabel="Indexable"
            helperText="Kur aktivizohet, artikulli nuk indeksohet në Google (robots noindex)."
          />
        </div>
      </AdminCollapsibleSection>

      <SaveBar
        cancelLabel="Reset changes"
        onCancel={() => {
          formRef.current?.reset()
          setPublished(statusDefault === "published")
        }}
        submitLabel={saveLabel}
        submitPendingLabel="Saving…"
      />
    </form>
  )
}
