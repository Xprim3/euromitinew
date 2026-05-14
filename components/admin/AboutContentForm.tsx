"use client"

import { useActionState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import { saveAboutContent, type AboutSaveState } from "@/app/admin/(panel)/about/actions"
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
import { storyParagraphsFromDb } from "@/lib/data/about-content-public"
import type { AboutContentRow, AboutValueCard, AboutWhyReason } from "@/types/supabase-cms"

export type AboutMediaPreviews = {
  hero: string | null
  story: string | null
  offerFuel: string | null
  offerRestaurant: string | null
  offerPlayground: string | null
  offerCarwash: string | null
  offerMiniMarket: string | null
  galleryStrip: string | null
  galleryWhy: string | null
  galleryPartner: string | null
  owner: string | null
  /** `media_uploads.alt_text` for resolved strip id (explicit column or legacy gallery index 0). */
  galleryStripAltFromMedia: string | null
  galleryWhyAltFromMedia: string | null
  galleryPartnerAltFromMedia: string | null
}

type AboutContentFormProps = {
  initial: AboutContentRow
  previews: AboutMediaPreviews
  /** Eight slots for editable value cards (extras in DB capped in admin UI). */
  valueSlots: AboutValueCard[]
  /** Six slots matching the public Why Choose Us grid. */
  whyReasonSlots: AboutWhyReason[]
}

const initialActionState: AboutSaveState = { ok: null }

const materialIconOptions = [
  { value: "verified", label: "Verified" },
  { value: "groups", label: "Groups" },
  { value: "bolt", label: "Bolt" },
  { value: "workspace_premium", label: "Workspace premium" },
  { value: "construction", label: "Construction" },
  { value: "support_agent", label: "Support agent" },
  { value: "favorite", label: "Favorite" },
  { value: "shield", label: "Shield" },
  { value: "local_gas_station", label: "Fuel station" },
  { value: "restaurant", label: "Restaurant" },
  { value: "local_car_wash", label: "Car wash" },
  { value: "shopping_bag", label: "Shopping bag" },
] as const

export function AboutContentForm({ initial, previews, valueSlots, whyReasonSlots }: AboutContentFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(saveAboutContent, initialActionState)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined
  const hasFieldErrors = Boolean(fieldErrors && Object.values(fieldErrors).some((v) => v?.length))
  const offerCards = [
    {
      key: "fuel",
      title: "Fuel / petrol card",
      titleName: "offer_fuel_title",
      bodyName: "offer_fuel_body",
      fileName: "offer_fuel_image",
      clearName: "clear_offer_fuel",
      titleValue: initial.offer_fuel_title,
      bodyValue: initial.offer_fuel_body,
      preview: previews.offerFuel,
    },
    {
      key: "restaurant",
      title: "Restaurant card",
      titleName: "offer_restaurant_title",
      bodyName: "offer_restaurant_body",
      fileName: "offer_restaurant_image",
      clearName: "clear_offer_restaurant",
      titleValue: initial.offer_restaurant_title,
      bodyValue: initial.offer_restaurant_body,
      preview: previews.offerRestaurant,
    },
    {
      key: "playground",
      title: "Playground card",
      titleName: "offer_playground_title",
      bodyName: "offer_playground_body",
      fileName: "offer_playground_image",
      clearName: "clear_offer_playground",
      titleValue: initial.offer_playground_title,
      bodyValue: initial.offer_playground_body,
      preview: previews.offerPlayground,
    },
    {
      key: "carwash",
      title: "Carwash card",
      titleName: "offer_carwash_title",
      bodyName: "offer_carwash_body",
      fileName: "offer_carwash_image",
      clearName: "clear_offer_carwash",
      titleValue: initial.offer_carwash_title,
      bodyValue: initial.offer_carwash_body,
      preview: previews.offerCarwash,
    },
    {
      key: "mini-market",
      title: "Mini Market card",
      titleName: "offer_mini_market_title",
      bodyName: "offer_mini_market_body",
      fileName: "offer_mini_market_image",
      clearName: "clear_offer_mini_market",
      titleValue: initial.offer_mini_market_title,
      bodyValue: initial.offer_mini_market_body,
      preview: previews.offerMiniMarket,
    },
  ] as const

  useEffect(() => {
    if (state.ok === true) router.refresh()
  }, [router, state.ok])

  const storyText = storyParagraphsFromDb(initial.company_story).join("\n\n")

  return (
    <form ref={formRef} action={formAction} className="space-y-6 pb-24">
      {state.ok === true ? (
        <SuccessMessage title="About page saved">
          {state.message}
        </SuccessMessage>
      ) : null}
      {state.ok === false && "message" in state ? (
        <ErrorMessage title="Could not save About page">
          {state.message}
        </ErrorMessage>
      ) : null}
      {hasFieldErrors ? (
        <ErrorMessage title="Check the highlighted fields">
          Fix the highlighted fields and try again.
        </ErrorMessage>
      ) : null}

      <AdminSectionCard title="Hero" description="Main public About page headline, intro copy, and hero image.">
        <div className="space-y-5">
          <TextInput
            label="Title"
            name="hero_title"
            defaultValue={initial.hero_title}
            maxLength={240}
            error={fieldErrors?.hero_title?.[0]}
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
            label="Hero image"
            name="hero_media"
            previewUrl={previews.hero}
            previewAlt="About page hero image"
            removeInputName="clear_hero_media"
            helperText="Shown at the top of the public About page."
          />
          <TextInput
            label="Hero image alt text"
            name="hero_image_alt"
            placeholder="Describe the hero image"
            maxLength={500}
            error={fieldErrors?.hero_image_alt?.[0]}
          />
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        title="Company story"
        description="The “Who We Are” narrative. Separate paragraphs with one blank line."
      >
        <div className="space-y-5">
          <TextareaInput
            label="Story paragraphs"
            name="company_story_paragraphs"
            defaultValue={storyText}
            rows={10}
            maxLength={30000}
            showCharacterCount
            helperText="Use a blank line between paragraphs."
            error={fieldErrors?.company_story_paragraphs?.[0]}
          />
          <FileUploadInput
            label="Story image"
            name="story_media"
            previewUrl={previews.story}
            previewAlt="About page story image"
            removeInputName="clear_story_media"
            helperText="Image shown beside or near the company story section."
          />
          <TextInput
            label="Story image alt text"
            name="story_image_alt"
            placeholder="Describe the story image"
            maxLength={500}
            error={fieldErrors?.story_image_alt?.[0]}
          />
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        title="Owner section"
        description="Owner/founder story shown under the first About section."
      >
        <div className="space-y-5">
          <input type="hidden" name="owner_section_kicker" value={initial.owner_section_kicker} />
          <TextInput
            label="Owner name"
            name="owner_name"
            defaultValue={initial.owner_name}
            maxLength={160}
            error={fieldErrors?.owner_name?.[0]}
          />
          <TextInput
            label="Section title"
            name="owner_section_title"
            defaultValue={initial.owner_section_title}
            maxLength={240}
            error={fieldErrors?.owner_section_title?.[0]}
          />
          <TextInput
            label="Owner role"
            name="owner_role"
            defaultValue={initial.owner_role}
            maxLength={200}
            error={fieldErrors?.owner_role?.[0]}
          />
          <TextareaInput
            label="Owner / company message"
            name="owner_body"
            defaultValue={initial.owner_body}
            rows={6}
            maxLength={4000}
            showCharacterCount
            error={fieldErrors?.owner_body?.[0]}
          />
          <FileUploadInput
            label="Owner image"
            name="owner_image"
            previewUrl={previews.owner}
            previewAlt="Owner image"
            removeInputName="clear_owner_image"
            helperText="Portrait or owner/company leadership image shown on the public About page."
          />
          <TextInput
            label="Owner image alt text"
            name="owner_image_alt"
            placeholder="Describe the owner image"
            maxLength={500}
            error={fieldErrors?.owner_image_alt?.[0]}
          />
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Mission & Vision" description="Public About page mission and vision cards.">
        <div className="space-y-5">
          <AdminContentGrid columns={2}>
            <TextInput
              label="Mission label"
              name="mission_title"
              defaultValue={initial.mission_title}
              maxLength={160}
              error={fieldErrors?.mission_title?.[0]}
            />
            <TextInput
              label="Vision label"
              name="vision_title"
              defaultValue={initial.vision_title}
              maxLength={160}
              error={fieldErrors?.vision_title?.[0]}
            />
          </AdminContentGrid>
          <TextareaInput
            label="Mission body"
            name="mission_body"
            defaultValue={initial.mission_body}
            rows={5}
            maxLength={8000}
            showCharacterCount
            error={fieldErrors?.mission_body?.[0]}
          />
          <TextareaInput
            label="Vision body"
            name="vision_body"
            defaultValue={initial.vision_body}
            rows={5}
            maxLength={8000}
            showCharacterCount
            error={fieldErrors?.vision_body?.[0]}
          />
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        title="What we offer"
        description="Edit only the offer card titles, text, and images shown on the public About page."
      >
        <input type="hidden" name="offer_label" value={initial.offer_label} />
        <input type="hidden" name="offer_title" value={initial.offer_title} />
        <input type="hidden" name="offer_description" value={initial.offer_description} />
        <div className="space-y-5">
          <div className="space-y-4">
            {offerCards.map((card) => (
              <div
                key={card.key}
                className="rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-4"
              >
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
                  {card.title}
                </p>
                <div className="space-y-4">
                  <TextInput
                    label="Card title"
                    name={card.titleName}
                    defaultValue={card.titleValue}
                    maxLength={160}
                    error={fieldErrors?.[card.titleName]?.[0]}
                  />
                  <TextareaInput
                    label="Card description"
                    name={card.bodyName}
                    defaultValue={card.bodyValue}
                    rows={4}
                    maxLength={2000}
                    showCharacterCount
                    error={fieldErrors?.[card.bodyName]?.[0]}
                  />
                  <FileUploadInput
                    label="Image file"
                    name={card.fileName}
                    previewUrl={card.preview}
                    previewAlt={`${card.title} image`}
                    removeInputName={card.clearName}
                    layout="auto"
                    replaceLabel="Upload"
                    acceptedFileTypesLabel="JPG, PNG, WebP, or GIF"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        id="admin-about-pse-te-na-zgjidhni"
        title="Pse të na zgjidhni (Why choose Euromiti)"
        description="Dark section on `/about` — main heading, right column image, and the six reason rows (icons + title + text). Scroll here from the note above."
      >
        <div className="space-y-5">
          <TextInput
            label="Main heading (shown as H2 on the page)"
            name="why_choose_heading"
            defaultValue={initial.why_choose_heading}
            maxLength={180}
            error={fieldErrors?.why_choose_heading?.[0]}
          />
          <FileUploadInput
            label="Section image"
            name="gallery_why_image"
            previewUrl={previews.galleryWhy}
            previewAlt="About why choose us image"
            removeInputName="clear_gallery_why"
            layout="auto"
            replaceLabel="Replace image"
            acceptedFileTypesLabel="JPG, PNG, WebP, or GIF"
            helperText="Shown beside the reasons list. Uses the dedicated Why column when set, otherwise the second legacy gallery image (strip → why → partner order)."
          />
          <TextInput
            label="Image alt text"
            name="gallery_why_alt"
            placeholder="Describe the why section image"
            maxLength={500}
            defaultValue={previews.galleryWhyAltFromMedia ?? ""}
            error={fieldErrors?.gallery_why_alt?.[0]}
          />

          <div className="space-y-4">
            {whyReasonSlots.map((reason, i) => (
              <div
                key={i}
                className="rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-4"
              >
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
                  Reason {i + 1}
                </p>
                <AdminContentGrid columns="12">
                  <SelectInput
                    label="Icon"
                    name={`why_reason_${i}_icon`}
                    defaultValue={reason.icon_material}
                    options={materialIconOptions}
                    className="md:col-span-3"
                  />
                  <TextInput
                    label="Title"
                    name={`why_reason_${i}_title`}
                    defaultValue={reason.title}
                    maxLength={180}
                    className="md:col-span-9"
                  />
                  <TextareaInput
                    label="Description"
                    name={`why_reason_${i}_body`}
                    defaultValue={reason.body}
                    rows={3}
                    maxLength={1200}
                    showCharacterCount
                    className="md:col-span-12"
                  />
                </AdminContentGrid>
              </div>
            ))}
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        title="Core values"
        description="Icons use Material Symbols names, for example verified, favorite, trending_up. Leave title/body blank to skip a slot."
      >
        <div className="space-y-4">
          {valueSlots.map((slot, i) => (
            <div
              key={i}
              className="rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-4"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
                Value card {i + 1}
              </p>
              <AdminContentGrid columns="12">
                <TextInput
                  label="Icon"
                  name={`value_${i}_icon`}
                  defaultValue={slot.icon_material}
                  placeholder="verified"
                  maxLength={40}
                  className="md:col-span-3"
                  helperText="Material icon name."
                />
                <TextInput
                  label="Title"
                  name={`value_${i}_title`}
                  defaultValue={slot.title}
                  className="md:col-span-9"
                />
                <TextareaInput
                  label="Body"
                  name={`value_${i}_body`}
                  defaultValue={slot.body}
                  rows={3}
                  className="md:col-span-12"
                />
              </AdminContentGrid>
            </div>
          ))}
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        title="Section images"
        description="Mission strip and partnerships/contact block images (same order as the lower sections on the public About page)."
      >
        <AdminContentGrid columns={2}>
          <div className="space-y-4">
            <FileUploadInput
              label="Mission footer strip"
              name="gallery_strip_image"
              previewUrl={previews.galleryStrip}
              previewAlt="About mission footer strip"
              removeInputName="clear_gallery_strip"
              layout="stacked"
              replaceLabel="Replace image"
              acceptedFileTypesLabel="JPG, PNG, WebP, or GIF"
            />
            <TextInput
              label="Strip image alt text"
              name="gallery_strip_alt"
              placeholder="Describe the strip image"
              maxLength={500}
              defaultValue={previews.galleryStripAltFromMedia ?? ""}
              error={fieldErrors?.gallery_strip_alt?.[0]}
            />
          </div>
          <div className="space-y-4">
            <FileUploadInput
              label="Partnerships / contact block"
              name="gallery_partner_image"
              previewUrl={previews.galleryPartner}
              previewAlt="About partnerships image"
              removeInputName="clear_gallery_partner"
              layout="stacked"
              replaceLabel="Replace image"
              acceptedFileTypesLabel="JPG, PNG, WebP, or GIF"
            />
            <TextInput
              label="Partnerships image alt text"
              name="gallery_partner_alt"
              placeholder="Describe the partnerships image"
              maxLength={500}
              defaultValue={previews.galleryPartnerAltFromMedia ?? ""}
              error={fieldErrors?.gallery_partner_alt?.[0]}
            />
          </div>
        </AdminContentGrid>
      </AdminSectionCard>

      <SaveBar
        submitLabel="Save about page"
        submitPendingLabel="Saving about page..."
        onCancel={() => formRef.current?.reset()}
      />
    </form>
  )
}
