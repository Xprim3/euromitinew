"use client"

import { useActionState, useEffect, useRef, type ReactNode } from "react"
import { useRouter } from "next/navigation"

import { saveServicesContent, type ServicesSaveState } from "@/app/admin/(panel)/services/actions"
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
import { SERVICES_PANEL_DEFAULTS } from "@/lib/data/services-page-defaults"
import {
  DEFAULT_SERVICES_WHY_CARDS,
  highlightsTextFromDb,
  servicesWhyCardsFromDb,
} from "@/lib/data/services-content-public"
import type { ServicesContentRow } from "@/types/supabase-cms"

export type ServicesMediaPreviews = {
  petrol: string | null
  restaurant: string | null
  carwash: string | null
  miniMarket: string | null
}

type ServicesContentFormProps = {
  initial: ServicesContentRow
  previews: ServicesMediaPreviews
}

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

const initialActionState: ServicesSaveState = { ok: null }

const serviceDefaultsById = Object.fromEntries(SERVICES_PANEL_DEFAULTS.map((service) => [service.id, service]))

export function ServicesContentForm({ initial, previews }: ServicesContentFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(saveServicesContent, initialActionState)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined
  const hasFieldErrors = Boolean(fieldErrors && Object.values(fieldErrors).some((x) => x?.length))

  useEffect(() => {
    if (state.ok === true) router.refresh()
  }, [router, state.ok])

  const petrolBulletsDefault = highlightsTextFromDb(initial.petrol_highlights_json)
  const restaurantBulletsDefault = highlightsTextFromDb(initial.restaurant_highlights_json)
  const carwashBulletsDefault = highlightsTextFromDb(initial.carwash_highlights_json)
  const miniMarketBulletsDefault = highlightsTextFromDb(initial.mini_market_highlights_json)
  const whyCardsFromCms = servicesWhyCardsFromDb(initial.why_sections_json)
  const whyCardSlots = [...(whyCardsFromCms.length ? whyCardsFromCms : DEFAULT_SERVICES_WHY_CARDS)].slice(0, 4)
  while (whyCardSlots.length < 4) {
    whyCardSlots.push(DEFAULT_SERVICES_WHY_CARDS[whyCardSlots.length] ?? { icon: "verified", title: "", body: "" })
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-6 pb-24">
      {state.ok === true ? (
        <SuccessMessage title="Services saved">
          {state.message}
        </SuccessMessage>
      ) : null}
      {state.ok === false && "message" in state ? (
        <ErrorMessage title="Could not save services">
          {state.message}
        </ErrorMessage>
      ) : null}
      {hasFieldErrors ? (
        <ErrorMessage title="Check the highlighted fields">
          Fix the highlighted fields and try again.
        </ErrorMessage>
      ) : null}

      <AdminSectionCard
        title="Services content"
        description="Edit the Services page copy and media. CTA fields are shown as read-only until the public schema supports editable CTAs."
      >
        <div className="space-y-3">
          <EditorAccordion title="Page hero" description="Editable text above all service sections." defaultOpen>
            <div className="space-y-5">
              <TextInput label="Title" name="hero_page_title" defaultValue={initial.hero_page_title} />
              <TextareaInput
                label="Subtitle"
                name="hero_page_subtitle"
                rows={4}
                defaultValue={initial.hero_page_subtitle}
                maxLength={1600}
                showCharacterCount
              />
            </div>
          </EditorAccordion>

          <EditorAccordion
            title="Why Choose Euromiti"
            description="Editable Albanian text and cards for the dark premium section on the public Services page."
            defaultOpen
          >
            <div className="space-y-5">
              <AdminContentGrid columns={2}>
                <TextInput
                  label="Small label"
                  name="why_choose_kicker"
                  defaultValue={initial.why_choose_kicker}
                  maxLength={120}
                  error={fieldErrors?.why_choose_kicker?.[0]}
                />
                <TextInput
                  label="Section title"
                  name="why_choose_title"
                  defaultValue={initial.why_choose_title}
                  maxLength={240}
                  error={fieldErrors?.why_choose_title?.[0]}
                />
              </AdminContentGrid>
              <TextareaInput
                label="Section description"
                name="why_choose_body"
                rows={4}
                defaultValue={initial.why_choose_body}
                maxLength={1600}
                showCharacterCount
                error={fieldErrors?.why_choose_body?.[0]}
              />
              <TextInput
                label="Featured statement title"
                name="why_choose_featured_title"
                defaultValue={initial.why_choose_featured_title}
                maxLength={240}
                error={fieldErrors?.why_choose_featured_title?.[0]}
              />
              <TextareaInput
                label="Featured statement body"
                name="why_choose_featured_body"
                rows={4}
                defaultValue={initial.why_choose_featured_body}
                maxLength={1600}
                showCharacterCount
                error={fieldErrors?.why_choose_featured_body?.[0]}
              />

              <div className="space-y-4">
                {whyCardSlots.map((card, i) => (
                  <div
                    key={`why-card-${i}`}
                    className="rounded-(--admin-radius-card) border border-(--admin-border) bg-(--admin-surface-muted) p-4"
                  >
                    <input type="hidden" name={`why_card_${i}_icon`} value={card.icon} />
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-(--admin-text-muted)">
                      Card {i + 1}
                    </p>
                    <AdminContentGrid columns="12">
                      <TextInput
                        label="Title"
                        name={`why_card_${i}_title`}
                        defaultValue={card.title}
                        maxLength={180}
                        className="md:col-span-4"
                      />
                      <TextareaInput
                        label="Description"
                        name={`why_card_${i}_body`}
                        defaultValue={card.body}
                        rows={3}
                        maxLength={800}
                        showCharacterCount
                        className="md:col-span-8"
                      />
                    </AdminContentGrid>
                  </div>
                ))}
              </div>
            </div>
          </EditorAccordion>

          <EditorAccordion title="Petrol Station" description="Fuel service title, description, bullet highlights, and image." defaultOpen>
            <div className="space-y-5">
              <TextInput
                label="Title"
                name="petrol_section_title"
                defaultValue={initial.petrol_section_title}
                error={fieldErrors?.petrol_section_title?.[0]}
              />
              <TextareaInput
                label="Description"
                name="petrol_description"
                rows={6}
                defaultValue={initial.petrol_description}
                maxLength={5000}
                showCharacterCount
                error={fieldErrors?.petrol_description?.[0]}
              />
              <TextareaInput
                label="Bullet highlights"
                name="petrol_highlights"
                rows={7}
                defaultValue={petrolBulletsDefault}
                helperText="One bullet per line."
                error={fieldErrors?.petrol_highlights?.[0]}
              />
              <FileUploadInput
                label="Image upload"
                name="petrol_image"
                previewUrl={previews.petrol}
                previewAlt="Petrol station service"
                removeInputName="clear_petrol_image"
              />
              <TextInput label="Image alt text" name="petrol_image_alt" placeholder="Describe the petrol image" />
              <AdminContentGrid columns={2}>
                <TextInput label="CTA text" value={serviceDefaultsById.petrol?.ctaLabel ?? "Learn more"} disabled readOnly />
                <TextInput label="CTA link" value={serviceDefaultsById.petrol?.ctaHref ?? "/services"} disabled readOnly />
              </AdminContentGrid>
            </div>
          </EditorAccordion>

          <EditorAccordion title="Premium Restaurant" description="Restaurant service title, description, image, and current CTA defaults.">
            <div className="space-y-5">
              <TextInput label="Title" name="restaurant_section_title" defaultValue={initial.restaurant_section_title} />
              <TextareaInput
                label="Description"
                name="restaurant_description"
                rows={6}
                defaultValue={initial.restaurant_description}
                maxLength={5000}
                showCharacterCount
              />
              <TextareaInput
                label="Bullet highlights"
                name="restaurant_highlights"
                rows={7}
                defaultValue={restaurantBulletsDefault}
                helperText="One bullet per line."
                error={fieldErrors?.restaurant_highlights?.[0]}
              />
              <FileUploadInput
                label="Image upload"
                name="restaurant_image"
                previewUrl={previews.restaurant}
                previewAlt="Restaurant service"
                removeInputName="clear_restaurant_image"
              />
              <TextInput label="Image alt text" name="restaurant_image_alt" placeholder="Describe the restaurant image" />
              <AdminContentGrid columns={2}>
                <TextInput label="CTA text" value={serviceDefaultsById.restaurant?.ctaLabel ?? "Learn more"} disabled readOnly />
                <TextInput label="CTA link" value={serviceDefaultsById.restaurant?.ctaHref ?? "/restaurant"} disabled readOnly />
              </AdminContentGrid>
            </div>
          </EditorAccordion>

          <EditorAccordion title="Carwash" description="Carwash service title, description, image, and current CTA defaults.">
            <div className="space-y-5">
              <TextInput label="Title" name="carwash_section_title" defaultValue={initial.carwash_section_title} />
              <TextareaInput
                label="Description"
                name="carwash_description"
                rows={6}
                defaultValue={initial.carwash_description}
                maxLength={5000}
                showCharacterCount
              />
              <TextareaInput
                label="Bullet highlights"
                name="carwash_highlights"
                rows={7}
                defaultValue={carwashBulletsDefault}
                helperText="One bullet per line."
                error={fieldErrors?.carwash_highlights?.[0]}
              />
              <FileUploadInput
                label="Image upload"
                name="carwash_image"
                previewUrl={previews.carwash}
                previewAlt="Carwash service"
                removeInputName="clear_carwash_image"
              />
              <TextInput label="Image alt text" name="carwash_image_alt" placeholder="Describe the carwash image" />
              <AdminContentGrid columns={2}>
                <TextInput label="CTA text" value={serviceDefaultsById.carwash?.ctaLabel ?? "Learn more"} disabled readOnly />
                <TextInput label="CTA link" value={serviceDefaultsById.carwash?.ctaHref ?? "/services"} disabled readOnly />
              </AdminContentGrid>
            </div>
          </EditorAccordion>

          <EditorAccordion title="Mini Market" description="Mini Market service title, description, image, and current CTA defaults.">
            <div className="space-y-5">
              <TextInput label="Title" name="mini_market_section_title" defaultValue={initial.mini_market_section_title} />
              <TextareaInput
                label="Description"
                name="mini_market_description"
                rows={6}
                defaultValue={initial.mini_market_description}
                maxLength={5000}
                showCharacterCount
              />
              <TextareaInput
                label="Bullet highlights"
                name="mini_market_highlights"
                rows={7}
                defaultValue={miniMarketBulletsDefault}
                helperText="One bullet per line."
                error={fieldErrors?.mini_market_highlights?.[0]}
              />
              <FileUploadInput
                label="Image upload"
                name="mini_market_image"
                previewUrl={previews.miniMarket}
                previewAlt="Mini Market service"
                removeInputName="clear_mini_market_image"
              />
              <TextInput label="Image alt text" name="mini_market_image_alt" placeholder="Describe the Mini Market image" />
              <AdminContentGrid columns={2}>
                <TextInput label="CTA text" value={serviceDefaultsById["mini-market"]?.ctaLabel ?? "Learn more"} disabled readOnly />
                <TextInput label="CTA link" value={serviceDefaultsById["mini-market"]?.ctaHref ?? "/services"} disabled readOnly />
              </AdminContentGrid>
            </div>
          </EditorAccordion>
        </div>
      </AdminSectionCard>

      <SaveBar
        hasUnsavedChanges
        unsavedLabel="Review services changes"
        cancelLabel="Reset changes"
        onCancel={() => formRef.current?.reset()}
        submitLabel="Save services page"
        submitPendingLabel="Saving…"
      />
    </form>
  )
}
