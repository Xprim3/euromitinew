"use client"

import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { Copy, ExternalLink } from "lucide-react"

import {
  deleteMediaImage,
  type MediaAltState,
  type MediaDeleteState,
  type MediaUploadState,
  updateMediaAltText,
  uploadMediaLibraryImage,
} from "@/app/admin/(panel)/media/actions"
import {
  AdminContentGrid,
  AdminSectionCard,
  ConfirmDeleteModal,
  ErrorMessage,
  FileUploadInput,
  ImagePreview,
  SelectInput,
  StatusBadge,
  SuccessMessage,
  TextInput,
  cnDs,
  dsBtnDanger,
  dsBtnGhost,
  dsBtnTertiary,
} from "@/components/admin/design-system"
import { formatAdminBytes } from "@/lib/admin-format"
import { MEDIA_LIBRARY_CATEGORIES } from "@/lib/constants/media-library"
import { formatNewsDate } from "@/lib/format-news-date"
import type { MediaUploadRow } from "@/types/supabase-cms"

type MediaLibraryClientProps = {
  media: MediaUploadRow[]
}

const uploadInitial: MediaUploadState = { ok: null }
const altInitial: MediaAltState = { ok: null }
const deleteInitial: MediaDeleteState = { ok: null }

const categoryOptions = [
  { value: "all", label: "All categories" },
  ...MEDIA_LIBRARY_CATEGORIES.map((category) => ({ value: category, label: category })),
]

function UploadSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className={cnDs(dsBtnTertiary)} disabled={pending}>
      {pending ? "Uploading..." : "Upload image"}
    </button>
  )
}

function AltSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className={cnDs(dsBtnTertiary, "min-h-9 px-3 text-xs")} disabled={pending}>
      {pending ? "Saving..." : "Save alt"}
    </button>
  )
}

function DeleteTriggerButton({ onClick }: { onClick: () => void }) {
  const { pending } = useFormStatus()
  return (
    <button type="button" className={cnDs(dsBtnDanger, "min-h-9 px-3 text-xs")} disabled={pending} onClick={onClick}>
      {pending ? "Deleting..." : "Delete"}
    </button>
  )
}

function MediaAltForm({ item }: { item: MediaUploadRow }) {
  const router = useRouter()
  const [state, formAction] = useActionState(updateMediaAltText, altInitial)

  useEffect(() => {
    if (state.ok === true) router.refresh()
  }, [router, state.ok])

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="id" value={item.id} />
      <TextInput label="Alt text" name="alt_text" defaultValue={item.alt_text ?? ""} placeholder="Describe this image" />
      <div className="flex items-center justify-between gap-2">
        <AltSubmitButton />
        {state.ok === true ? <span className="text-emerald-700 text-xs">{state.message}</span> : null}
      </div>
      {state.ok === false ? <p className="text-red-700 text-xs">{state.message}</p> : null}
    </form>
  )
}

function MediaDeleteForm({ item }: { item: MediaUploadRow }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [open, setOpen] = useState(false)
  const [state, formAction] = useActionState(deleteMediaImage, deleteInitial)

  useEffect(() => {
    if (state.ok === true) router.refresh()
  }, [router, state.ok])

  return (
    <>
      <form ref={formRef} action={formAction}>
        <input type="hidden" name="id" value={item.id} />
        <DeleteTriggerButton onClick={() => setOpen(true)} />
        {state.ok === false ? <p className="mt-2 text-red-700 text-xs">{state.message}</p> : null}
      </form>
      <ConfirmDeleteModal
        open={open}
        title="Delete image?"
        description={`Delete "${item.original_filename ?? item.object_path}" from the media library and storage?`}
        confirmLabel="Delete image"
        onCancel={() => setOpen(false)}
        onConfirm={() => formRef.current?.requestSubmit()}
      />
    </>
  )
}

export function MediaLibraryClient({ media }: MediaLibraryClientProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [filter, setFilter] = useState("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [uploadState, uploadAction] = useActionState(uploadMediaLibraryImage, uploadInitial)

  useEffect(() => {
    if (uploadState.ok === true) {
      formRef.current?.reset()
      router.refresh()
    }
  }, [router, uploadState.ok])

  const filtered = useMemo(() => {
    if (filter === "all") return media
    return media.filter((item) => (item.category ?? "misc") === filter)
  }, [filter, media])

  async function copyUrl(item: MediaUploadRow) {
    const url = item.public_url ?? ""
    if (!url) return
    try {
      if (!document.hasFocus()) {
        window.focus()
      }
      await navigator.clipboard.writeText(url)
      setCopiedId(item.id)
      window.setTimeout(() => setCopiedId((current) => (current === item.id ? null : current)), 1600)
    } catch {
      /* clipboard blocked when tab is not focused */
    }
  }

  return (
    <div className="space-y-6">
      <AdminSectionCard title="Upload image" description="Add reusable images to the Euromiti media library.">
        <form ref={formRef} action={uploadAction} className="space-y-5">
          {uploadState.ok === true ? <SuccessMessage title="Upload complete">{uploadState.message}</SuccessMessage> : null}
          {uploadState.ok === false && "message" in uploadState ? (
            <ErrorMessage title="Upload failed">{uploadState.message}</ErrorMessage>
          ) : null}
          <FileUploadInput
            label="Upload image"
            name="media_image"
            error={uploadState.ok === false && "fieldErrors" in uploadState ? uploadState.fieldErrors.media_image?.[0] : undefined}
            helperText="Drag and drop an image or choose a file. JPEG, PNG, WebP, or GIF up to 5 MB."
          />
          <AdminContentGrid columns={3}>
            <SelectInput label="Category" name="category" defaultValue="misc" options={categoryOptions.slice(1)} />
            <TextInput label="Usage hint" name="usage_section" placeholder="home-hero, footer-logo, news-card..." />
            <TextInput label="Alt text" name="alt_text" placeholder="Describe this image" />
          </AdminContentGrid>
          <UploadSubmitButton />
        </form>
      </AdminSectionCard>

      <AdminSectionCard title="Image grid" description="Filter, preview, copy URLs, edit alt text, or delete media.">
        <div className="space-y-5">
          <SelectInput
            label="Filter by category"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            options={categoryOptions}
          />

          {filtered.length === 0 ? (
            <p className="rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-slate-50 px-4 py-8 text-center text-sm text-[var(--admin-text-muted)]">
              No images match this category.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <article
                  key={item.id}
                  className="space-y-4 rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-white p-4 shadow-sm"
                >
                  <ImagePreview
                    src={item.public_url}
                    alt={item.alt_text ?? item.original_filename ?? "Media image"}
                    className="max-w-full"
                  />
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone="neutral">{item.category ?? "misc"}</StatusBadge>
                      <span className="text-xs text-[var(--admin-text-muted)]">{formatAdminBytes(item.byte_size)}</span>
                    </div>
                    <p className="truncate font-medium text-sm text-[var(--admin-text)]">
                      {item.original_filename ?? item.object_path}
                    </p>
                    <p className="break-all font-mono text-[0.7rem] text-[var(--admin-text-muted)]">{item.object_path}</p>
                    <p className="text-xs text-[var(--admin-text-muted)]">
                      Uploaded {item.created_at ? formatNewsDate(item.created_at) : "—"}
                    </p>
                  </div>
                  <MediaAltForm item={item} />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className={cnDs(dsBtnGhost, "min-h-9 px-3 text-xs")}
                      onClick={() => void copyUrl(item)}
                      disabled={!item.public_url}
                    >
                      <Copy className="size-4" aria-hidden />
                      {copiedId === item.id ? "Copied" : "Copy URL"}
                    </button>
                    {item.public_url ? (
                      <a
                        href={item.public_url}
                        target="_blank"
                        rel="noreferrer"
                        className={cnDs(dsBtnGhost, "min-h-9 px-3 text-xs")}
                      >
                        <ExternalLink className="size-4" aria-hidden />
                        Preview
                      </a>
                    ) : null}
                    <MediaDeleteForm item={item} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </AdminSectionCard>
    </div>
  )
}
