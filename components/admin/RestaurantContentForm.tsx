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

function restaurantGalleryDraftToSlots(galleryDrafts: GallerySlotDraft[]): GallerySlot[] {
  return Array.from({ length: ADMIN_RESTAURANT_GALLERY_SLOTS }, (_, i) => {
    const slot = galleryDrafts[i]
    return {
      id: `restaurant-gallery-${i}`,
      label: `Gallery tile ${i + 1}`,
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
        description="Edit restaurant hero, editorial description, menu cards, gallery images, hours, and contact details."
      >
        <div className="space-y-3">
          <EditorAccordion title="Hero & main description" description="Top restaurant page content and hero image." defaultOpen>
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
              <TextareaInput
                label="Main description"
                name="hero_description"
                rows={10}
                defaultValue={initial.hero_description}
                helperText="Separate paragraphs with a blank line."
                maxLength={12000}
                showCharacterCount
                error={fieldErrors?.hero_description?.[0]}
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
            title="Menu highlights & food category cards"
            description={`Up to ${ADMIN_RESTAURANT_MENU_SLOTS} cards. Empty rows are skipped.`}
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
            title="Digital menu (Skanom)"
            description="The band with the large image and headline before Experience pillars — same order as the public Restaurant page."
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
            title="Gallery images"
            description={`Manage ${ADMIN_RESTAURANT_GALLERY_SLOTS} ordered atmosphere gallery tiles.`}
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

          <EditorAccordion title="Opening hours & contact info" description="Restaurant desk details shown on the public page.">
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
