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
  SelectInput,
  SuccessMessage,
  TextareaInput,
  TextInput,
} from "@/components/admin/design-system"
import type { HomepageContentRow } from "@/types/supabase-cms"

export type HomepageLocationPreviewAdmin = {
  id: string
  city: string
  address: string
  mainMediaId: string | null
  imageUrl: string | null
  imageAlt: string
}

export type HomepageMediaPreviews = {
  hero: string | null
  about: string | null
  servicesIntro: string | null
  restaurantMain: string | null
  restaurantFloat1: string | null
  restaurantFloat2: string | null
  carwash: string | null
  playground: string | null
  miniMarket: string | null
}

type HomepageContentFormProps = {
  initial: HomepageContentRow
  mediaPreviews: HomepageMediaPreviews
  locationPreviews: HomepageLocationPreviewAdmin[]
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
const SERVICES_CHIP_ICON_OPTIONS = [
  { value: "verified", label: "Verified / quality" },
  { value: "eco", label: "Eco / low emissions" },
  { value: "local_gas_station", label: "Fuel station" },
  { value: "speed", label: "Speed / performance" },
  { value: "workspace_premium", label: "Premium" },
  { value: "shield", label: "Safety" },
  { value: "support_agent", label: "Service" },
  { value: "restaurant", label: "Restaurant" },
  { value: "local_car_wash", label: "Carwash" },
  { value: "storefront", label: "Market" },
  { value: "family_restroom", label: "Family" },
  { value: "schedule", label: "Fast stop" },
] as const

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

function restaurantHeadlineDefault(initial: HomepageContentRow) {
  return [initial.restaurant_home_headline_primary, initial.restaurant_home_headline_accent]
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

function chipIconOptions(selectedIcon: string) {
  if (!selectedIcon || SERVICES_CHIP_ICON_OPTIONS.some((option) => option.value === selectedIcon)) {
    return SERVICES_CHIP_ICON_OPTIONS
  }
  return [{ value: selectedIcon, label: selectedIcon }, ...SERVICES_CHIP_ICON_OPTIONS]
}

export function HomepageContentForm({ initial, mediaPreviews, locationPreviews }: HomepageContentFormProps) {
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
        description="Edit CMS-backed homepage fields. Hero buttons are fixed website copy and are not editable here."
      >
        <div className="space-y-3">
          <SectionAccordion
            title="1. Hero Section"
            description="Hero headline, description, and image."
            defaultOpen
          >
            <div className="space-y-5">
              <input type="hidden" name="hero_cta_primary_label" value={initial.hero_cta_primary_label || "Our Services"} />
              <input type="hidden" name="hero_cta_primary_href" value={initial.hero_cta_primary_href || "/services"} />
              <input type="hidden" name="hero_cta_secondary_label" value={initial.hero_cta_secondary_label} />
              <input type="hidden" name="hero_cta_secondary_href" value={initial.hero_cta_secondary_href || "/locations"} />
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
                label="Description"
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
            </div>
          </SectionAccordion>

          <SectionAccordion
            title="2. Services Preview"
            description="Homepage services band, service cards, and restaurant highlight."
          >
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
                        <SelectInput
                          label="Icon"
                          name={`services_intro_chip_icon_${index}`}
                          defaultValue={chip.icon}
                          options={chipIconOptions(chip.icon)}
                          placeholder="Choose icon"
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

              <div className="space-y-4 border-[var(--admin-border)] border-t pt-5">
                <div>
                  <p className="text-sm font-semibold text-[var(--admin-text)]">Service cards</p>
                  <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
                    Cards shown below the main services band.
                  </p>
                </div>
                <AdminContentGrid columns={3}>
                  <div className="space-y-4 rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
                      Carwash
                    </p>
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
                      label="Image"
                      name="carwash_image"
                      layout="stacked"
                      previewUrl={mediaPreviews.carwash}
                      previewAlt="Homepage carwash intro"
                      removeInputName="clear_carwash_image"
                    />
                    <TextInput label="Image alt text" name="carwash_image_alt" placeholder="Describe the carwash image" />
                  </div>

                  <div className="space-y-4 rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
                      Playground
                    </p>
                    <TextareaInput
                      label="Description"
                      name="playground_intro_text"
                      defaultValue={initial.playground_intro_text}
                      rows={5}
                      maxLength={4000}
                      showCharacterCount
                      error={fieldErrors?.playground_intro_text?.[0]}
                    />
                    <FileUploadInput
                      label="Image"
                      name="playground_image"
                      layout="stacked"
                      previewUrl={mediaPreviews.playground}
                      previewAlt="Homepage playground intro"
                      removeInputName="clear_playground_image"
                    />
                    <TextInput label="Image alt text" name="playground_image_alt" placeholder="Describe the playground image" />
                  </div>

                  <div className="space-y-4 rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
                      Mini Market
                    </p>
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
                      label="Image"
                      name="mini_market_image"
                      layout="stacked"
                      previewUrl={mediaPreviews.miniMarket}
                      previewAlt="Homepage mini market intro"
                      removeInputName="clear_mini_market_image"
                    />
                    <TextInput label="Image alt text" name="mini_market_image_alt" placeholder="Describe the market image" />
                  </div>
                </AdminContentGrid>
              </div>

              <div className="space-y-4 border-[var(--admin-border)] border-t pt-5">
                <div>
                  <p className="text-sm font-semibold text-[var(--admin-text)]">Restaurant highlight</p>
                  <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
                    Restaurant block shown directly after the services cards.
                  </p>
                </div>
              <input type="hidden" name="restaurant_home_headline_accent" value="" />
              <TextInput
                label="Headline"
                name="restaurant_home_headline_primary"
                defaultValue={restaurantHeadlineDefault(initial)}
                maxLength={320}
                helperText="Use one headline. The final words are accented visually and wrap automatically."
                error={fieldErrors?.restaurant_home_headline_primary?.[0]}
              />
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
              </div>
            </div>
          </SectionAccordion>

          <SectionAccordion
            title="3. Locations Preview"
            description="Homepage locations band and the three preview cards shown on the public homepage."
          >
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-[var(--admin-text-muted)]">
                Edit only the homepage card content here. Full location details such as phone, hours, services, maps, and
                galleries stay in Locations admin.
              </p>
              <div className="grid gap-5 xl:grid-cols-3">
                {locationPreviews.map((location, index) => (
                  <div
                    key={location.id}
                    className="overflow-hidden rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface-muted)]"
                  >
                    <div className="border-[var(--admin-border)] border-b bg-white px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
                        Card {index + 1}
                      </p>
                      <p className="mt-1 truncate font-semibold text-[var(--admin-text)]">{location.city}</p>
                    </div>
                    <div className="space-y-4 p-4">
                      <input type="hidden" name={`homepage_location_id_${index}`} value={location.id} />
                      <input type="hidden" name={`homepage_location_media_id_${index}`} value={location.mainMediaId ?? ""} />
                      <TextInput
                        label="Card title"
                        name={`homepage_location_city_${index}`}
                        defaultValue={location.city}
                        maxLength={120}
                      />
                      <TextareaInput
                        label="Card text"
                        name={`homepage_location_address_${index}`}
                        defaultValue={location.address}
                        rows={3}
                        maxLength={500}
                        showCharacterCount
                      />
                      <FileUploadInput
                        label="Card image"
                        name={`homepage_location_image_${index}`}
                        layout="stacked"
                        previewUrl={location.imageUrl}
                        previewAlt={location.imageAlt || location.city}
                        removeInputName={`clear_homepage_location_image_${index}`}
                        helperText="Used by the homepage preview card."
                      />
                      <TextInput
                        label="Image alt text"
                        name={`homepage_location_image_alt_${index}`}
                        defaultValue={location.imageAlt}
                        placeholder="Describe the location image"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionAccordion>

          <SectionAccordion title="4. About Preview" description="Homepage About headline and text blocks.">
            <div className="space-y-5">
              <input type="hidden" name="about_preview_kicker" value={initial.about_preview_kicker} />
              <input type="hidden" name="about_preview_eyebrow" value={initial.about_preview_eyebrow} />
              <input type="hidden" name="about_preview_why_title" value={initial.about_preview_why_title} />
              <input type="hidden" name="about_preview_button_label" value={initial.about_preview_button_label || "Lexo më shumë për ne"} />
              <input type="hidden" name="about_preview_button_href" value={initial.about_preview_button_href || "/about"} />
              <TextInput
                label="Main headline"
                name="about_preview_headline"
                defaultValue={initial.about_preview_headline}
                maxLength={320}
                placeholder="Të ndërtuar në Kosovë. Të besuar në çdo rrugë."
                error={fieldErrors?.about_preview_headline?.[0]}
              />
              <TextareaInput
                label="Who we are text"
                name="about_preview_text"
                defaultValue={initial.about_preview_text}
                rows={5}
                maxLength={4000}
                showCharacterCount
                error={fieldErrors?.about_preview_text?.[0]}
              />
              <TextareaInput
                label="Why choose us text"
                name="about_preview_why_text"
                defaultValue={initial.about_preview_why_text}
                rows={4}
                maxLength={1200}
                showCharacterCount
                error={fieldErrors?.about_preview_why_text?.[0]}
              />
            </div>
          </SectionAccordion>

          <SectionAccordion title="5. Careers CTA" description="Prepared section. Not saved until homepage schema/public section support is added.">
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

          <SectionAccordion title="6. Contact CTA" description="Prepared section. Contact details are currently managed from Contact Info.">
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
