"use client"

import { useActionState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import type { SiteContactSaveState } from "@/app/admin/(panel)/site/actions"
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
import { parseSocialLinks, type SocialLinkItem } from "@/lib/data/site-contact-public"
import type { ContactInfoRow, SiteSettingsRow } from "@/types/supabase-cms"

const initialState: SiteContactSaveState = { ok: null }

const SOCIAL_SLOTS = 6

function padSocial(links: SocialLinkItem[]): SocialLinkItem[] {
  const out = [...links]
  while (out.length < SOCIAL_SLOTS) out.push({ platform: "", url: "" })
  return out.slice(0, SOCIAL_SLOTS)
}

type SiteContactFormProps = {
  site: SiteSettingsRow
  contact: ContactInfoRow
  logoPreviewUrl: string | null
  submitAction: (prev: SiteContactSaveState, formData: FormData) => Promise<SiteContactSaveState>
}

export function SiteContactForm({ site, contact, logoPreviewUrl, submitAction }: SiteContactFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(submitAction, initialState)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined
  const hasFieldErrors = Boolean(fieldErrors && Object.values(fieldErrors).some((v) => v?.length))

  useEffect(() => {
    if (state.ok === true) router.refresh()
  }, [router, state.ok])

  const socialRows = padSocial(parseSocialLinks(site.social_links))

  return (
    <form ref={formRef} action={formAction} className="space-y-6 pb-24">
      {state.ok === true ? (
        <SuccessMessage title="Contact and footer saved">
          {state.message}
        </SuccessMessage>
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
          <AdminContentGrid columns={2}>
            <TextInput
              label="Careers email"
              name="careers_email"
              type="email"
              defaultValue={contact.careers_email ?? ""}
              error={fieldErrors?.careers_email?.[0]}
            />
            <TextInput
              label="Careers CTA button label"
              name="careers_apply_instructions"
              defaultValue={contact.careers_apply_instructions ?? ""}
              placeholder="Apply by Email"
            />
          </AdminContentGrid>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Footer & Brand" description="Global footer text, copyright line, and logo image.">
        <div className="space-y-5">
          <TextInput
            label="Company name"
            name="company_name"
            required
            defaultValue={site.company_name}
            error={fieldErrors?.company_name?.[0]}
          />
          <TextareaInput
            label="Footer text"
            name="footer_body"
            rows={5}
            defaultValue={site.footer_body}
            maxLength={12000}
            showCharacterCount
            error={fieldErrors?.footer_body?.[0]}
          />
          <TextInput
            label="Copyright line"
            name="footer_copyright_line"
            defaultValue={site.footer_copyright_line ?? ""}
            placeholder="Euromiti Kosovo"
            error={fieldErrors?.footer_copyright_line?.[0]}
          />
          <FileUploadInput
            label="Logo upload"
            name="logo_image"
            previewUrl={logoPreviewUrl}
            previewAlt={site.company_name}
            removeInputName="clear_logo"
            helperText="Shown in the footer next to the company name. JPEG, PNG, WebP, or GIF up to 5 MB."
          />
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Social Media Links" description="Saved to both contact and footer settings so public pages stay aligned.">
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
        hasUnsavedChanges
        unsavedLabel="Review contact/footer changes"
        cancelLabel="Reset changes"
        onCancel={() => formRef.current?.reset()}
        submitLabel="Save contact & footer"
        submitPendingLabel="Saving…"
      />
    </form>
  )
}
