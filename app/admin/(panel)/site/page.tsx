import type { Metadata } from "next"

import { saveSiteContactAction } from "@/app/admin/(panel)/site/actions"
import { SiteContactForm } from "@/components/admin/SiteContactForm"
import { getContactInfoAdmin } from "@/lib/data/site-contact-admin"
import type { ContactInfoRow } from "@/types/supabase-cms"

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

export default async function AdminSiteContactPage() {
  const contactRow = await getContactInfoAdmin()
  const contact = contactRow ?? contactFallback

  return (
    <div className="space-y-6">
      <SiteContactForm contact={contact} submitAction={saveSiteContactAction} />
    </div>
  )
}
