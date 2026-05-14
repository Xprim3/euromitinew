"use client"

import { useActionState, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

import type { RestaurantSaveState } from "@/app/admin/(panel)/restaurant/actions"
import {
  AdminContentGrid,
  AdminSectionCard,
  ErrorMessage,
  FileUploadInput,
  type GallerySlot,
  ImageGalleryManager,
  SaveBar,
  SuccessMessage,
  TextareaInput,
  TextInput,
} from "@/components/admin/design-system"
import type { MenuSlotDraft, GallerySlotDraft } from "@/lib/data/restaurant-admin-slots"
import {
  ADMIN_RESTAURANT_GALLERY_SLOTS,
  ADMIN_RESTAURANT_MENU_SLOTS,
} from "@/lib/validations/restaurant-content"
import type { RestaurantContentRow } from "@/types/supabase-cms"

type RestaurantContentFormProps = {
  submitAction: (prev: RestaurantSaveState, fd: FormData) => Promise<RestaurantSaveState>
  initial: RestaurantContentRow
  heroPreviewUrl: string | null
  editorialPreviewUrl: string | null
  editorialImageAltFromMedia: string | null
  introPreviewUrl: string | null
  introImageAltFromMedia: string | null
  skanomPreviewUrl: string | null
  skanomImageAltFromMedia: string | null
  menuDrafts: MenuSlotDraft[]
  galleryDrafts: GallerySlotDraft[]
}

const initialState: RestaurantSaveState = { ok: null }

function EditorAccordion({
  title,
  description,
  children,
  defaultOpen = false,
}: {
  title: string
  description?: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow-card)]"
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 marker:hidden sm:px-6">
        <span>
          <span className="block font-[family-name:var(--font-montserrat)] text-base font-semibold text-[var(--admin-text)] sm:text-lg">
            {title}
          </span>
          {description ? <span className="mt-1 block text-sm text-[var(--admin-text-muted)]">{description}</span> : null}
        </span>
        <span className="mt-1 rounded-full border border-[var(--admin-border)] px-2 py-0.5 text-xs font-semibold text-[var(--admin-text-muted)] group-open:hidden">
          Open
        </span>
        <span className="mt-1 hidden rounded-full border border-[var(--admin-border)] px-2 py-0.5 text-xs font-semibold text-[var(--admin-text-muted)] group-open:inline-flex">
          Close
        </span>
      </summary>
      <div className="border-[var(--admin-border)] border-t px-5 py-5 sm:px-6">{children}</div>
    </details>
  )
}

const RESTAURANT_ATMOSPHERE_GALLERY_SLOT_LABELS = [
  "1 · Hero — tall left panel",
  "2 · Upper — right column stack",
  "3 · Lower — right column stack",
  "4 · Bottom — narrow strip (4 cols)",
  "5 · Bottom — wide strip (8 cols)",
] as const

function restaurantGalleryDraftToSlots(galleryDrafts: GallerySlotDraft[]): GallerySlot[] {
  return Array.from({ length: ADMIN_RESTAURANT_GALLERY_SLOTS }, (_, i) => {
    const slot = galleryDrafts[i]
    return {
      id: `restaurant-gallery-${i}`,
      label: RESTAURANT_ATMOSPHERE_GALLERY_SLOT_LABELS[i] ?? `Gallery slot ${i + 1}`,
      previewUrl: slot?.previewUrl || null,
      existingMediaId: slot?.mediaId ?? "",
      altText: "",
      clear: false,
    }
  })
}

export function RestaurantContentForm({
  submitAction,
  initial,
  heroPreviewUrl,
  editorialPreviewUrl,
  editorialImageAltFromMedia,
  introPreviewUrl,
  introImageAltFromMedia,
  skanomPreviewUrl,
  skanomImageAltFromMedia,
  menuDrafts,
  galleryDrafts,
}: RestaurantContentFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(submitAction, initialState)
  const initialGallerySlots = useMemo(() => restaurantGalleryDraftToSlots(galleryDrafts), [galleryDrafts])
  const [managedGallerySlots, setManagedGallerySlots] = useState<GallerySlot[]>(initialGallerySlots)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined
  const hasFieldErrors = Boolean(fieldErrors && Object.values(fieldErrors).some((v) => v?.length))

  useEffect(() => {
    if (state.ok === true) router.refresh()
  }, [router, state.ok])

  return (
    <form ref={formRef} action={formAction} className="space-y-6 pb-24">
      {state.ok === true ? (
        <SuccessMessage title="Restaurant saved">
          {state.message}
        </SuccessMessage>
      ) : null}
      {state.ok === false && "message" in state ? (
        <ErrorMessage title="Could not save restaurant">
          {state.message}
        </ErrorMessage>
      ) : null}
      {hasFieldErrors ? (
        <ErrorMessage title="Check the highlighted fields">
          Fix the highlighted fields and try again.
        </ErrorMessage>
      ) : null}

      <AdminSectionCard
        title="Restaurant content"
        description="Sections follow the public /restaurant page top to bottom: page hero, Playfair band, dining-room intro (headlines + copy + image), food gallery, Skanom, atmosphere gallery, then desk details. Experience pillars stay code-only."
      >
        <div className="space-y-3">
          <EditorAccordion
            title="1 · Page hero (top banner)"
            description="Full-width image header on /restaurant — H1 title, optional hero subtitle, and hero image."
            defaultOpen
          >
            <div className="space-y-5">
              <TextInput
                label="Hero title"
                name="hero_title"
                defaultValue={initial.hero_title}
                error={fieldErrors?.hero_title?.[0]}
              />
              <TextareaInput
                label="Hero subtitle"
                name="hero_subtitle"
                rows={4}
                defaultValue={initial.hero_subtitle}
                maxLength={1200}
                showCharacterCount
                error={fieldErrors?.hero_subtitle?.[0]}
              />
              <FileUploadInput
                label="Hero image"
                name="hero_image"
                previewUrl={heroPreviewUrl}
                previewAlt="Restaurant hero image"
                removeInputName="clear_hero_image"
              />
              <TextInput label="Hero image alt text" name="hero_image_alt" placeholder="Describe the restaurant hero image" />
            </div>
          </EditorAccordion>

          <EditorAccordion
            title="2 · Editorial hero (Playfair band)"
            description="Large headline block directly under the page hero — eyebrow, two-line title, body, quote slab, optional right image (falls back to hero image if empty)."
          >
            <div className="space-y-5">
              <TextInput
                label="Eyebrow / kicker"
                name="editorial_eyebrow"
                defaultValue={initial.editorial_eyebrow}
                maxLength={160}
                error={fieldErrors?.editorial_eyebrow?.[0]}
              />
              <AdminContentGrid columns={2}>
                <TextInput
                  label="Title line 1"
                  name="editorial_title_line1"
                  defaultValue={initial.editorial_title_line1}
                  maxLength={240}
                  error={fieldErrors?.editorial_title_line1?.[0]}
                />
                <TextInput
                  label="Title line 2"
                  name="editorial_title_line2"
                  defaultValue={initial.editorial_title_line2}
                  maxLength={240}
                  error={fieldErrors?.editorial_title_line2?.[0]}
                />
              </AdminContentGrid>
              <TextareaInput
                label="Description"
                name="editorial_description"
                rows={5}
                defaultValue={initial.editorial_description}
                maxLength={2400}
                showCharacterCount
                error={fieldErrors?.editorial_description?.[0]}
              />
              <TextareaInput
                label="Quote (floating slab, desktop)"
                name="editorial_quote_line"
                rows={2}
                defaultValue={initial.editorial_quote_line}
                maxLength={500}
                showCharacterCount
                error={fieldErrors?.editorial_quote_line?.[0]}
              />
              <TextInput
                label="Quote attribution"
                name="editorial_quote_attribution"
                defaultValue={initial.editorial_quote_attribution}
                maxLength={320}
                error={fieldErrors?.editorial_quote_attribution?.[0]}
              />
              <FileUploadInput
                label="Editorial hero image"
                name="editorial_image"
                previewUrl={editorialPreviewUrl}
                previewAlt="Editorial hero image"
                removeInputName="clear_editorial_image"
                replaceLabel="Replace image"
                acceptedFileTypesLabel="JPG, PNG, WebP, or GIF"
                helperText="Large image on the right of this section. Leave empty to reuse the main page hero image."
              />
              <TextInput
                label="Editorial image alt text"
                name="editorial_image_alt"
                placeholder="Describe the editorial hero image"
                maxLength={500}
                defaultValue={editorialImageAltFromMedia ?? ""}
              />
            </div>
          </EditorAccordion>

          <EditorAccordion
            title="3 · Dining room intro (headline + copy + image)"
            description="Muted band after the Playfair hero — eyebrow, two-line Playfair headline, body copy, and optional image (falls back to page hero image when empty)."
          >
            <div className="space-y-5">
              <TextInput
                label="Eyebrow / kicker"
                name="intro_eyebrow"
                defaultValue={initial.intro_eyebrow}
                maxLength={160}
                error={fieldErrors?.intro_eyebrow?.[0]}
              />
              <AdminContentGrid columns={2}>
                <TextInput
                  label="Headline line 1 (roman)"
                  name="intro_headline_line1"
                  defaultValue={initial.intro_headline_line1}
                  maxLength={240}
                  error={fieldErrors?.intro_headline_line1?.[0]}
                />
                <TextInput
                  label="Headline line 2 (italic)"
                  name="intro_headline_line2"
                  defaultValue={initial.intro_headline_line2}
                  maxLength={240}
                  error={fieldErrors?.intro_headline_line2?.[0]}
                />
              </AdminContentGrid>
              <TextareaInput
                label="Body copy"
                name="intro_body"
                rows={10}
                defaultValue={initial.intro_body.trim() ? initial.intro_body : initial.hero_description}
                helperText="Separate paragraphs with a blank line."
                maxLength={12000}
                showCharacterCount
                error={fieldErrors?.intro_body?.[0]}
              />
              <FileUploadInput
                label="Section image"
                name="intro_image"
                previewUrl={introPreviewUrl}
                previewAlt="Dining room intro image"
                removeInputName="clear_intro_image"
                replaceLabel="Replace image"
                acceptedFileTypesLabel="JPG, PNG, WebP, or GIF"
                helperText="Shown beside the copy on desktop. Leave empty to reuse the page hero image."
              />
              <TextInput
                label="Image alt text"
                name="intro_image_alt"
                placeholder="Describe the intro section image"
                maxLength={500}
                defaultValue={introImageAltFromMedia ?? ""}
              />
            </div>
          </EditorAccordion>

          <EditorAccordion
            title="4 · Seasonal food gallery (menu cards)"
            description={`Mosaic food cards in the banded gallery section on the public page. Up to ${ADMIN_RESTAURANT_MENU_SLOTS} cards; empty rows are skipped.`}
          >
            <div className="grid gap-5 lg:grid-cols-2">
              {menuDrafts.map((slot, i) => (
                <div key={i} className="space-y-4 rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-slate-50 p-4">
                  <p className="font-medium text-sm text-[var(--admin-text)]">Card {i + 1}</p>
                  <TextInput label="Title" name={`menu_title_${i}`} defaultValue={slot.title} />
                  <TextareaInput label="Description" name={`menu_body_${i}`} rows={4} defaultValue={slot.body} />
                  <input type="hidden" name={`menu_media_id_${i}`} value={slot.mediaId} />
                  <FileUploadInput
                    label="Card image"
                    name={`menu_image_${i}`}
                    previewUrl={slot.previewUrl}
                    previewAlt={`Menu card ${i + 1}`}
                    removeInputName={`menu_clear_image_${i}`}
                  />
                  <TextInput label="Image alt text" name={`menu_image_alt_${i}`} placeholder="Describe this food image" />
                </div>
              ))}
            </div>
          </EditorAccordion>

          <EditorAccordion
            title="5 · Digital menu (Skanom)"
            description="Section before Experience pillars — large image, headline, CTA. Static pillars are not editable here."
          >
            <div className="space-y-5">
              <TextInput
                label="Eyebrow / kicker"
                name="skanom_eyebrow"
                defaultValue={initial.skanom_eyebrow}
                maxLength={120}
                error={fieldErrors?.skanom_eyebrow?.[0]}
              />
              <TextInput
                label="Title"
                name="skanom_title"
                defaultValue={initial.skanom_title}
                maxLength={240}
                error={fieldErrors?.skanom_title?.[0]}
              />
              <TextareaInput
                label="Description"
                name="skanom_description"
                rows={6}
                defaultValue={initial.skanom_description}
                maxLength={2400}
                showCharacterCount
                error={fieldErrors?.skanom_description?.[0]}
              />
              <FileUploadInput
                label="Section image"
                name="skanom_image"
                previewUrl={skanomPreviewUrl}
                previewAlt="Skanom digital menu section image"
                removeInputName="clear_skanom_image"
                replaceLabel="Replace image"
                acceptedFileTypesLabel="JPG, PNG, WebP, or GIF"
                helperText="Shown on the left of this section on the public page."
              />
              <TextInput
                label="Image alt text"
                name="skanom_image_alt"
                placeholder="Describe the section image"
                maxLength={500}
                defaultValue={skanomImageAltFromMedia ?? ""}
              />
              <AdminContentGrid columns={2}>
                <TextInput
                  label="CTA button label"
                  name="skanom_cta_label"
                  defaultValue={initial.skanom_cta_label}
                  maxLength={120}
                  error={fieldErrors?.skanom_cta_label?.[0]}
                />
                <TextInput
                  label="CTA link (URL)"
                  name="skanom_cta_href"
                  defaultValue={initial.skanom_cta_href}
                  maxLength={500}
                  error={fieldErrors?.skanom_cta_href?.[0]}
                />
              </AdminContentGrid>
            </div>
          </EditorAccordion>

          <EditorAccordion
            title="6 · Atmosphere gallery"
            description={`Same dark mosaic as on /restaurant after Experience pillars: ${ADMIN_RESTAURANT_GALLERY_SLOTS} images in fixed order (hero left, two stacked right, then bottom narrow + wide).`}
          >
            <ImageGalleryManager
              label="Atmosphere gallery"
              name="restaurant_gallery"
              slots={managedGallerySlots}
              onSlotsChange={setManagedGallerySlots}
              maxSlots={ADMIN_RESTAURANT_GALLERY_SLOTS}
              fixedSlots
              fileInputName={(_slot, index) => `gallery_image_${index}`}
              altInputName={(_slot, index) => `gallery_image_alt_${index}`}
              existingMediaIdInputName={(_slot, index) => `gallery_media_id_${index}`}
              clearInputName={(_slot, index) => `gallery_clear_${index}`}
            />
          </EditorAccordion>

          <EditorAccordion
            title="7 · Reservations / desk (hours & contact)"
            description="Shown in the reservation band at the bottom of the restaurant page."
          >
            <div className="space-y-5">
              <TextareaInput
                label="Opening hours"
                name="opening_hours"
                rows={4}
                defaultValue={initial.opening_hours}
                error={fieldErrors?.opening_hours?.[0]}
              />
              <AdminContentGrid columns={2}>
                <TextInput label="Phone" name="contact_phone" defaultValue={initial.contact_phone ?? ""} />
                <TextInput
                  label="Email"
                  name="contact_email"
                  type="email"
                  defaultValue={initial.contact_email ?? ""}
                  error={fieldErrors?.contact_email?.[0]}
                />
              </AdminContentGrid>
              <TextareaInput
                label="Contact notes"
                name="contact_notes"
                rows={4}
                defaultValue={initial.contact_notes ?? ""}
                maxLength={2400}
                showCharacterCount
              />
            </div>
          </EditorAccordion>
        </div>
      </AdminSectionCard>

      <SaveBar
        hasUnsavedChanges
        unsavedLabel="Review restaurant changes"
        cancelLabel="Reset changes"
        onCancel={() => {
          formRef.current?.reset()
          setManagedGallerySlots(initialGallerySlots)
        }}
        submitLabel="Save restaurant page"
        submitPendingLabel="Saving…"
      />
    </form>
  )
}
