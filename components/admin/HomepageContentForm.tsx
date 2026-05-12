"use client"

import { useActionState, useEffect, useRef, type ReactNode } from "react"
import { useRouter } from "next/navigation"

import { saveHomepageContent, type HomepageSaveState } from "@/app/admin/(panel)/homepage/actions"
import {
  AdminContentGrid,
  AdminSectionCard,
  ErrorMessage,
  FileUploadInput,
  SaveBar,
  SuccessMessage,
  TextareaInput,
  TextInput,
} from "@/components/admin/design-system"
import type { HomepageContentRow } from "@/types/supabase-cms"

export type HomepageMediaPreviews = {
  hero: string | null
  servicesIntro: string | null
  restaurantMain: string | null
  restaurantFloat1: string | null
  restaurantFloat2: string | null
  carwash: string | null
  miniMarket: string | null
}

type HomepageContentFormProps = {
  initial: HomepageContentRow
  mediaPreviews: HomepageMediaPreviews
}

function SectionAccordion({
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
        <span className="min-w-0">
          <span className="block font-[family-name:var(--font-montserrat)] text-base font-semibold tracking-tight text-[var(--admin-text)] sm:text-lg">
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

const initialActionState: HomepageSaveState = { ok: null }
const SERVICES_INTRO_CHIP_SLOTS = 4

type ServicesIntroChipSlot = {
  icon: string
  label: string
}

function heroHeadlineDefault(initial: HomepageContentRow) {
  return [initial.hero_headline_line1, initial.hero_headline_line2]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ")
}

function servicesIntroChipSlots(raw: unknown): ServicesIntroChipSlot[] {
  const fallback: ServicesIntroChipSlot[] = [
    { icon: "verified", label: "Cilësi e lartë" },
    { icon: "eco", label: "Emetime të ulëta" },
  ]

  const chips = Array.isArray(raw)
    ? raw
        .map((chip) => {
          if (!chip || typeof chip !== "object") return null
          const c = chip as { icon?: unknown; label?: unknown }
          const label = typeof c.label === "string" ? c.label.trim() : ""
          const icon = typeof c.icon === "string" ? c.icon.trim() : "verified"
          if (!label) return null
          return { icon, label }
        })
        .filter((chip): chip is ServicesIntroChipSlot => Boolean(chip))
    : fallback

  const slots = chips.slice(0, SERVICES_INTRO_CHIP_SLOTS)
  while (slots.length < SERVICES_INTRO_CHIP_SLOTS) slots.push({ icon: "", label: "" })
  return slots
}

export function HomepageContentForm({ initial, mediaPreviews }: HomepageContentFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(saveHomepageContent, initialActionState)
  const serviceChipSlots = servicesIntroChipSlots(initial.services_intro_chips_json)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined
  const hasFieldErrors = Boolean(fieldErrors && Object.values(fieldErrors).some((v) => v?.length))

  useEffect(() => {
    if (state.ok === true) router.refresh()
  }, [router, state.ok])

  return (
    <form ref={formRef} action={formAction} className="space-y-6 pb-24">
      <input type="hidden" name="locations_band_kicker" value={initial.locations_band_kicker} />
      <input type="hidden" name="locations_band_heading" value={initial.locations_band_heading} />
      <input type="hidden" name="locations_band_subtitle" value={initial.locations_band_subtitle} />
      <input type="hidden" name="restaurant_float_1_alt" value="" />
      <input type="hidden" name="restaurant_float_2_alt" value="" />

      {state.ok === true ? (
        <SuccessMessage title="Homepage saved">
          {state.message}
        </SuccessMessage>
      ) : null}
      {state.ok === false && "message" in state ? (
        <ErrorMessage title="Could not save homepage">
          {state.message}
        </ErrorMessage>
      ) : null}
      {hasFieldErrors ? (
        <ErrorMessage title="Check the highlighted fields">
          Fix the highlighted fields and try again.
        </ErrorMessage>
      ) : null}

      <AdminSectionCard
        title="Homepage content"
        description="Edit the CMS-backed homepage fields. Sections marked as planned are visible for layout planning but are not saved until the schema supports them."
      >
        <div className="space-y-3">
          <SectionAccordion
            title="1. Hero Section"
            description="Main homepage headline, intro copy, primary/secondary CTA labels, and hero image."
            defaultOpen
          >
            <div className="space-y-5">
              <input type="hidden" name="hero_headline_line2" value="" />
              <TextInput
                label="Headline"
                name="hero_headline_line1"
                defaultValue={heroHeadlineDefault(initial)}
                maxLength={320}
                helperText="Use one headline. It will wrap automatically on desktop and mobile."
                error={fieldErrors?.hero_headline_line1?.[0]}
              />
              <TextareaInput
                label="Subtitle"
                name="hero_subtitle"
                defaultValue={initial.hero_subtitle}
                rows={4}
                maxLength={1200}
                showCharacterCount
                error={fieldErrors?.hero_subtitle?.[0]}
              />
              <FileUploadInput
                label="Hero image upload"
                name="hero_image"
                previewUrl={mediaPreviews.hero}
                previewAlt="Homepage hero image"
                helperText="JPEG, PNG, WebP, or GIF up to the configured Supabase storage limit."
                removeInputName="clear_hero_image"
              />
              <TextInput label="Hero image alt text" name="hero_image_alt" placeholder="Describe the photograph" />
              <AdminContentGrid columns={2}>
                <TextInput
                  label="Primary button text"
                  name="hero_cta_primary_label"
                  defaultValue={initial.hero_cta_primary_label}
                  required
                  error={fieldErrors?.hero_cta_primary_label?.[0]}
                />
                <TextInput
                  label="Secondary button text"
                  name="hero_cta_secondary_label"
                  defaultValue={initial.hero_cta_secondary_label}
                  helperText="Leave empty to hide the second button."
                  error={fieldErrors?.hero_cta_secondary_label?.[0]}
                />
              </AdminContentGrid>
              <AdminContentGrid columns={2}>
                <TextInput
                  label="Primary button link"
                  name="hero_cta_primary_href"
                  defaultValue={initial.hero_cta_primary_href || "/services"}
                  required
                  helperText="Use a site path like /services or a full URL."
                  error={fieldErrors?.hero_cta_primary_href?.[0]}
                />
                <TextInput
                  label="Secondary button link"
                  name="hero_cta_secondary_href"
                  defaultValue={initial.hero_cta_secondary_href || "/locations"}
                  helperText="Used when the secondary button text is not empty."
                  error={fieldErrors?.hero_cta_secondary_href?.[0]}
                />
              </AdminContentGrid>
            </div>
          </SectionAccordion>

          <SectionAccordion title="2. Services Preview" description="Title and description for the homepage services preview band.">
            <div className="space-y-5">
              <TextInput
                label="Title"
                name="services_intro_title"
                defaultValue={initial.services_intro_title}
                maxLength={200}
                error={fieldErrors?.services_intro_title?.[0]}
              />
              <TextareaInput
                label="Description"
                name="services_intro_body"
                defaultValue={initial.services_intro_body}
                rows={5}
                maxLength={4000}
                showCharacterCount
                error={fieldErrors?.services_intro_body?.[0]}
              />
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--admin-text)]">Highlight chips</p>
                  <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
                    Edit labels/icons shown under the services intro. Clear a label to remove that chip.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {serviceChipSlots.map((chip, index) => (
                    <div
                      key={`services-intro-chip-${index}`}
                      className="rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-4"
                    >
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
                        Chip {index + 1}
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <TextInput
                          label="Label"
                          name={`services_intro_chip_label_${index}`}
                          defaultValue={chip.label}
                          maxLength={80}
                          placeholder="Cilësi e lartë"
                        />
                        <TextInput
                          label="Material icon"
                          name={`services_intro_chip_icon_${index}`}
                          defaultValue={chip.icon}
                          maxLength={40}
                          placeholder="verified"
                          helperText="Examples: verified, eco, local_gas_station"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <FileUploadInput
                label="Services preview image"
                name="services_intro_image"
                previewUrl={mediaPreviews.servicesIntro}
                previewAlt="Homepage services preview"
                helperText="Existing backend supports this image slot; it is used by the current services intro band."
                removeInputName="clear_services_intro_image"
              />
              <TextInput label="Services image alt text" name="services_intro_image_alt" placeholder="Describe the image" />
            </div>
          </SectionAccordion>

          <SectionAccordion title="3. About Preview" description="About preview copy. Title and button text are planned fields.">
            <div className="space-y-5">
              <AdminContentGrid columns={2}>
                <TextInput
                  label="Title"
                  value="Built In Kosovo. Trusted On Every Route."
                  helperText="Planned CMS field. Current public title is design-owned."
                  disabled
                  readOnly
                />
                <TextInput
                  label="Button text"
                  value="Read Full About Us"
                  helperText="Planned CMS field. Current public button text is design-owned."
                  disabled
                  readOnly
                />
              </AdminContentGrid>
              <TextareaInput
                label="Description"
                name="about_preview_text"
                defaultValue={initial.about_preview_text}
                rows={5}
                maxLength={4000}
                showCharacterCount
                helperText="Saved to homepage_content and shown in the homepage About preview."
                error={fieldErrors?.about_preview_text?.[0]}
              />
            </div>
          </SectionAccordion>

          <SectionAccordion title="4. Restaurant Highlight" description="Restaurant headline, description, image, and planned button text.">
            <div className="space-y-5">
              <AdminContentGrid columns={2}>
                <TextInput
                  label="Title line 1"
                  name="restaurant_home_headline_primary"
                  defaultValue={initial.restaurant_home_headline_primary}
                  error={fieldErrors?.restaurant_home_headline_primary?.[0]}
                />
                <TextInput
                  label="Title line 2"
                  name="restaurant_home_headline_accent"
                  defaultValue={initial.restaurant_home_headline_accent}
                  error={fieldErrors?.restaurant_home_headline_accent?.[0]}
                />
              </AdminContentGrid>
              <TextareaInput
                label="Description"
                name="restaurant_highlight_text"
                defaultValue={initial.restaurant_highlight_text}
                rows={5}
                maxLength={4000}
                showCharacterCount
                error={fieldErrors?.restaurant_highlight_text?.[0]}
              />
              <FileUploadInput
                label="Restaurant image upload"
                name="restaurant_main_image"
                previewUrl={mediaPreviews.restaurantMain}
                previewAlt="Homepage restaurant highlight"
                removeInputName="clear_restaurant_main_image"
              />
              <TextInput label="Restaurant image alt text" name="restaurant_main_alt" placeholder="Describe the restaurant image" />
              <TextInput
                label="Button text"
                value="Explore restaurant"
                helperText="Planned CMS field. Current public button text/link are design-owned."
                disabled
                readOnly
              />
            </div>
          </SectionAccordion>

          <SectionAccordion title="5. Carwash Intro" description="Carwash card copy and image upload.">
            <div className="space-y-5">
              <TextInput
                label="Title"
                value="Carwash"
                helperText="Planned CMS field. Current public title is design-owned."
                disabled
                readOnly
              />
              <TextareaInput
                label="Description"
                name="carwash_intro_text"
                defaultValue={initial.carwash_intro_text}
                rows={5}
                maxLength={4000}
                showCharacterCount
                error={fieldErrors?.carwash_intro_text?.[0]}
              />
              <FileUploadInput
                label="Carwash image upload"
                name="carwash_image"
                previewUrl={mediaPreviews.carwash}
                previewAlt="Homepage carwash intro"
                removeInputName="clear_carwash_image"
              />
              <TextInput label="Carwash image alt text" name="carwash_image_alt" placeholder="Describe the carwash image" />
            </div>
          </SectionAccordion>

          <SectionAccordion title="6. Mini Market Intro" description="Mini Market card copy and image upload.">
            <div className="space-y-5">
              <TextInput
                label="Title"
                value="Mini Market"
                helperText="Planned CMS field. Current public title is design-owned."
                disabled
                readOnly
              />
              <TextareaInput
                label="Description"
                name="mini_market_intro_text"
                defaultValue={initial.mini_market_intro_text}
                rows={5}
                maxLength={4000}
                showCharacterCount
                error={fieldErrors?.mini_market_intro_text?.[0]}
              />
              <FileUploadInput
                label="Mini Market image upload"
                name="mini_market_image"
                previewUrl={mediaPreviews.miniMarket}
                previewAlt="Homepage mini market intro"
                removeInputName="clear_mini_market_image"
              />
              <TextInput label="Mini Market image alt text" name="mini_market_image_alt" placeholder="Describe the market image" />
            </div>
          </SectionAccordion>

          <SectionAccordion title="7. Careers CTA" description="Prepared section. Not saved until homepage schema/public section support is added.">
            <AdminContentGrid columns={2}>
              <TextInput label="Title" value="Join our team" disabled readOnly />
              <TextInput label="Button text" value="View careers" disabled readOnly />
              <TextareaInput
                label="Description"
                value="Careers CTA copy will be editable after the homepage schema has dedicated careers fields."
                rows={4}
                disabled
                readOnly
                className="sm:col-span-2"
              />
            </AdminContentGrid>
          </SectionAccordion>

          <SectionAccordion title="8. Contact CTA" description="Prepared section. Contact details are currently managed from Contact Info.">
            <AdminContentGrid columns={2}>
              <TextInput label="Title" value="Talk To Euromiti" disabled readOnly />
              <TextInput label="Button text" value="Contact Us" disabled readOnly />
              <TextareaInput
                label="Description"
                value="Contact CTA copy will be editable after the homepage schema has dedicated contact CTA fields."
                rows={4}
                disabled
                readOnly
                className="sm:col-span-2"
              />
            </AdminContentGrid>
          </SectionAccordion>
        </div>
      </AdminSectionCard>

      <SaveBar
        hasUnsavedChanges
        unsavedLabel="Review changes before publishing"
        cancelLabel="Reset changes"
        onCancel={() => formRef.current?.reset()}
        submitLabel="Save changes"
        submitPendingLabel="Saving homepage…"
      />
    </form>
  )
}
