"use client"

import { useActionState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import type { SiteContactSaveState } from "@/app/admin/(panel)/site/actions"
import {
  AdminContentGrid,
  AdminSectionCard,
  ErrorMessage,
  SaveBar,
  SuccessMessage,
  TextareaInput,
  TextInput,
} from "@/components/admin/design-system"
import { parseSocialLinks, type SocialLinkItem } from "@/lib/data/site-contact-public"
import type { ContactInfoRow } from "@/types/supabase-cms"

const initialState: SiteContactSaveState = { ok: null }

const SOCIAL_SLOTS = 6

function padSocial(links: SocialLinkItem[]): SocialLinkItem[] {
  const out = [...links]
  while (out.length < SOCIAL_SLOTS) out.push({ platform: "", url: "" })
  return out.slice(0, SOCIAL_SLOTS)
}

type SiteContactFormProps = {
  contact: ContactInfoRow
  submitAction: (prev: SiteContactSaveState, formData: FormData) => Promise<SiteContactSaveState>
}

export function SiteContactForm({ contact, submitAction }: SiteContactFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(submitAction, initialState)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined
  const hasFieldErrors = Boolean(fieldErrors && Object.values(fieldErrors).some((v) => v?.length))

  useEffect(() => {
    if (state.ok === true) router.refresh()
  }, [router, state.ok])

  const socialRows = padSocial(parseSocialLinks(contact.social_links))

  return (
    <form ref={formRef} action={formAction} className="space-y-6 pb-24">
      {state.ok === true ? (
        <SuccessMessage title="Saved">{state.message}</SuccessMessage>
      ) : null}
      {state.ok === false && "message" in state ? (
        <ErrorMessage title="Could not save contact info">
          {state.message}
        </ErrorMessage>
      ) : null}
      {hasFieldErrors ? (
        <ErrorMessage title="Check the highlighted fields">
          Fix the highlighted fields and try again.
        </ErrorMessage>
      ) : null}

      <AdminSectionCard title="Contact Info" description="Company contact details used by the public contact page.">
        <div className="space-y-5">
          <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
            <p className="mb-3 text-muted-foreground text-xs">
              Headquarters intro (top of /contact — eyebrow, title, paragraph). Leave blank to use site defaults.
            </p>
            <div className="space-y-4">
              <TextInput
                label="HQ eyebrow"
                name="hq_eyebrow"
                defaultValue={contact.hq_eyebrow}
                placeholder="Euromiti · Prishtina"
                error={fieldErrors?.hq_eyebrow?.[0]}
              />
              <TextInput
                label="HQ heading"
                name="hq_heading"
                defaultValue={contact.hq_heading}
                placeholder="Selia qendrore"
                error={fieldErrors?.hq_heading?.[0]}
              />
              <TextareaInput
                label="HQ intro paragraph"
                name="hq_description"
                rows={5}
                defaultValue={contact.hq_description}
                error={fieldErrors?.hq_description?.[0]}
              />
            </div>
          </div>
          <AdminContentGrid columns={2}>
            <TextInput
              label="Company phone"
              name="phone"
              required
              defaultValue={contact.phone}
              error={fieldErrors?.phone?.[0]}
            />
            <TextInput
              label="Company email"
              name="email"
              type="email"
              required
              defaultValue={contact.email}
              error={fieldErrors?.email?.[0]}
            />
          </AdminContentGrid>
          <TextareaInput
            label="Address"
            name="hq_address"
            required
            rows={4}
            defaultValue={contact.hq_address}
            error={fieldErrors?.hq_address?.[0]}
          />
          <TextInput
            label="Google Maps link"
            name="map_link"
            type="url"
            defaultValue={contact.map_link}
            placeholder="https://maps.google.com/..."
            error={fieldErrors?.map_link?.[0]}
          />
          <AdminContentGrid columns={2}>
            <TextInput label="Weekday hours" name="weekday_hours" defaultValue={contact.weekday_hours ?? ""} />
            <TextInput label="Weekend hours" name="weekend_hours" defaultValue={contact.weekend_hours ?? ""} />
          </AdminContentGrid>
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        title="Social Media Links"
        description="Synced to site settings for the public footer. Footer copy and logo are fixed in code."
      >
        <div className="space-y-3">
          {socialRows.map((row, i) => (
            <AdminContentGrid key={i} columns={2}>
              <TextInput
                label={`Platform ${i + 1}`}
                name={`social_platform_${i}`}
                defaultValue={row.platform}
                placeholder="Instagram"
              />
              <TextInput label={`URL ${i + 1}`} name={`social_url_${i}`} defaultValue={row.url} placeholder="https://..." />
            </AdminContentGrid>
          ))}
        </div>
      </AdminSectionCard>

      <SaveBar
        cancelLabel="Reset changes"
        onCancel={() => formRef.current?.reset()}
        submitLabel="Save contact & social"
        submitPendingLabel="Saving…"
      />
    </form>
  )
}
