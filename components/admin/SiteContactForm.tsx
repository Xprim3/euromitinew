"use client"

import Image from "next/image"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

import type { SiteContactSaveState } from "@/app/admin/(panel)/site/actions"
import { adminInputClass, adminLabelClass } from "@/components/admin/cn-admin"
import { ServicesSaveSubmitButton } from "@/components/admin/ServicesSaveSubmitButton"
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
  const [state, formAction] = useActionState(submitAction, initialState)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined
  const hasFieldErrors = Boolean(fieldErrors && Object.values(fieldErrors).some((v) => v?.length))

  useEffect(() => {
    if (state.ok === true) router.refresh()
  }, [router, state.ok])

  const socialRows = padSocial(parseSocialLinks(site.social_links))

  return (
    <form action={formAction} className="max-w-4xl space-y-10 pb-24">
      {state.ok === true ? (
        <p
          role="status"
          className="rounded-lg border border-emerald-500/35 bg-emerald-500/15 px-4 py-3 text-emerald-100 text-sm"
        >
          {state.message}
        </p>
      ) : null}
      {state.ok === false && "message" in state ? (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-100 text-sm"
        >
          {state.message}
        </p>
      ) : null}
      {hasFieldErrors ? (
        <p className="rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-400">
          Fix the highlighted fields and try again.
        </p>
      ) : null}

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Contact page (`contact_info`)</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={adminLabelClass} htmlFor="phone">
              Phone
            </label>
            <input id="phone" name="phone" required defaultValue={contact.phone} className={adminInputClass} />
            {fieldErrors?.phone?.[0] ? <p className="mt-1 text-red-400 text-xs">{fieldErrors.phone[0]}</p> : null}
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" required defaultValue={contact.email} className={adminInputClass} />
            {fieldErrors?.email?.[0] ? <p className="mt-1 text-red-400 text-xs">{fieldErrors.email[0]}</p> : null}
          </div>
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="hq_address">
            Address (headquarters)
          </label>
          <textarea id="hq_address" name="hq_address" required rows={3} defaultValue={contact.hq_address} className={adminInputClass} />
          {fieldErrors?.hq_address?.[0] ? <p className="mt-1 text-red-400 text-xs">{fieldErrors.hq_address[0]}</p> : null}
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="map_link">
            Google Maps link
          </label>
          <input
            id="map_link"
            name="map_link"
            defaultValue={contact.map_link}
            placeholder="https://maps.google.com/..."
            className={adminInputClass}
          />
          {fieldErrors?.map_link?.[0] ? <p className="mt-1 text-red-400 text-xs">{fieldErrors.map_link[0]}</p> : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={adminLabelClass} htmlFor="weekday_hours">
              Weekday hours
            </label>
            <input id="weekday_hours" name="weekday_hours" defaultValue={contact.weekday_hours ?? ""} className={adminInputClass} />
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="weekend_hours">
              Weekend hours
            </label>
            <input id="weekend_hours" name="weekend_hours" defaultValue={contact.weekend_hours ?? ""} className={adminInputClass} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={adminLabelClass} htmlFor="careers_email">
              Careers email (optional)
            </label>
            <input id="careers_email" name="careers_email" type="email" defaultValue={contact.careers_email ?? ""} className={adminInputClass} />
            {fieldErrors?.careers_email?.[0] ? <p className="mt-1 text-red-400 text-xs">{fieldErrors.careers_email[0]}</p> : null}
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="careers_apply_instructions">
              Careers CTA button label
            </label>
            <input
              id="careers_apply_instructions"
              name="careers_apply_instructions"
              defaultValue={contact.careers_apply_instructions ?? ""}
              placeholder="Apply by Email"
              className={adminInputClass}
            />
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Footer &amp; brand (`site_settings`)</h2>
        <div>
          <label className={adminLabelClass} htmlFor="company_name">
            Company name (navbar-style wordmark text)
          </label>
          <input id="company_name" name="company_name" required defaultValue={site.company_name} className={adminInputClass} />
          {fieldErrors?.company_name?.[0] ? <p className="mt-1 text-red-400 text-xs">{fieldErrors.company_name[0]}</p> : null}
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="footer_body">
            Footer text
          </label>
          <textarea id="footer_body" name="footer_body" rows={5} defaultValue={site.footer_body} className={adminInputClass} />
          {fieldErrors?.footer_body?.[0] ? <p className="mt-1 text-red-400 text-xs">{fieldErrors.footer_body[0]}</p> : null}
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="footer_copyright_line">
            Copyright line (after © year)
          </label>
          <input
            id="footer_copyright_line"
            name="footer_copyright_line"
            defaultValue={site.footer_copyright_line ?? ""}
            placeholder="Euromiti Kosovo"
            className={adminInputClass}
          />
          {fieldErrors?.footer_copyright_line?.[0] ? (
            <p className="mt-1 text-red-400 text-xs">{fieldErrors.footer_copyright_line[0]}</p>
          ) : null}
        </div>

        {logoPreviewUrl ? (
          <div className="relative h-16 w-48 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950">
            <Image src={logoPreviewUrl} alt="" fill className="object-contain object-left p-1" sizes="12rem" />
          </div>
        ) : null}
        {site.logo_media_id ? (
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" name="clear_logo" className="size-4 rounded border-zinc-600" />
            Remove logo (after save)
          </label>
        ) : null}
        <div>
          <label className={adminLabelClass} htmlFor="logo_image">
            Logo image
          </label>
          <input
            id="logo_image"
            name="logo_image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="block w-full max-w-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-2 file:text-sm file:text-white"
          />
          <p className="mt-1 text-xs text-zinc-500">Shown in the footer next to the company name. JPEG / PNG / WebP / GIF, up to 5 MB.</p>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Social links</h2>
        <p className="text-sm text-zinc-500">
          Saved to both <span className="font-mono text-zinc-400">site_settings</span> and{" "}
          <span className="font-mono text-zinc-400">contact_info</span> so the footer and contact page stay aligned.
        </p>
        <div className="space-y-3">
          {socialRows.map((row, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[1fr_2fr]">
              <input
                name={`social_platform_${i}`}
                defaultValue={row.platform}
                placeholder="Instagram"
                className={adminInputClass}
              />
              <input name={`social_url_${i}`} defaultValue={row.url} placeholder="https://…" className={adminInputClass} />
            </div>
          ))}
        </div>
      </section>

      <ServicesSaveSubmitButton label="Save site & contact" pendingLabel="Saving…" />
    </form>
  )
}
