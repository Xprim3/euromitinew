import type { Metadata } from "next"

import { saveSiteContactAction } from "@/app/admin/(panel)/site/actions"
import { SiteContactForm, type SitePageHeroPreviews } from "@/components/admin/SiteContactForm"
import { getContactInfoAdmin, getLogoPreviewUrlAdmin, getSiteSettingsAdmin } from "@/lib/data/site-contact-admin"
import type { ContactInfoRow, SiteSettingsRow } from "@/types/supabase-cms"

export const metadata: Metadata = {
  title: "Site & contact",
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
  hq_eyebrow: "",
  hq_heading: "",
  hq_description: "",
  updated_at: "",
  updated_by: null,
}

const siteFallback: SiteSettingsRow = {
  id: 1,
  logo_media_id: null,
  company_name: "Euromiti",
  social_links: [],
  footer_body: "",
  footer_copyright_line: null,
  contact_page_hero_media_id: null,
  contact_page_hero_image_alt: "",
  locations_page_hero_media_id: null,
  locations_page_hero_image_alt: "",
  careers_page_hero_media_id: null,
  careers_page_hero_image_alt: "",
  news_page_hero_media_id: null,
  news_page_hero_image_alt: "",
  updated_at: "",
  updated_by: null,
}

export default async function AdminSiteContactPage() {
  const [contactRow, siteRow] = await Promise.all([getContactInfoAdmin(), getSiteSettingsAdmin()])
  const contact = contactRow ?? contactFallback
  const site = siteRow ?? siteFallback

  const pageHeroPreviews: SitePageHeroPreviews = {
    contact: await getLogoPreviewUrlAdmin(site.contact_page_hero_media_id),
    locations: await getLogoPreviewUrlAdmin(site.locations_page_hero_media_id),
    careers: await getLogoPreviewUrlAdmin(site.careers_page_hero_media_id),
    news: await getLogoPreviewUrlAdmin(site.news_page_hero_media_id),
  }

  return (
    <div className="space-y-6">
      <SiteContactForm
        key={`${site.updated_at}-${contact.updated_at}`}
        contact={contact}
        site={site}
        pageHeroPreviews={pageHeroPreviews}
        submitAction={saveSiteContactAction}
      />
    </div>
  )
}
