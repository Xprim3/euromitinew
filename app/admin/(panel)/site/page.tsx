import type { Metadata } from "next"

import { saveSiteContactAction } from "@/app/admin/(panel)/site/actions"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { SiteContactForm } from "@/components/admin/SiteContactForm"
import { getContactInfoAdmin, getLogoPreviewUrlAdmin, getSiteSettingsAdmin } from "@/lib/data/site-contact-admin"
import type { ContactInfoRow, SiteSettingsRow } from "@/types/supabase-cms"

export const metadata: Metadata = {
  title: "Site & contact",
}

const siteFallback: SiteSettingsRow = {
  id: 1,
  logo_media_id: null,
  company_name: "Euromiti",
  social_links: [],
  footer_body: "",
  footer_copyright_line: "Euromiti Kosovo",
  updated_at: "",
  updated_by: null,
}

const contactFallback: ContactInfoRow = {
  id: 1,
  phone: "",
  email: "",
  hq_address: "",
  map_link: "",
  social_links: [],
  weekday_hours: null,
  weekend_hours: null,
  careers_email: null,
  careers_apply_instructions: null,
  updated_at: "",
  updated_by: null,
}

export default async function AdminSiteContactPage() {
  const [siteRow, contactRow] = await Promise.all([getSiteSettingsAdmin(), getContactInfoAdmin()])
  const site = siteRow ?? siteFallback
  const contact = contactRow ?? contactFallback
  const logoPreviewUrl = await getLogoPreviewUrlAdmin(site.logo_media_id)

  return (
    <>
      <AdminPageHeader
        title="Site & contact"
        description="Footer copy, logo, social URLs, and the headquarters block on `/contact` (singleton rows in Supabase)."
      />
      <div className="flex-1 px-6 py-8 md:px-8 lg:px-10">
        <SiteContactForm site={site} contact={contact} logoPreviewUrl={logoPreviewUrl} submitAction={saveSiteContactAction} />
      </div>
    </>
  )
}
