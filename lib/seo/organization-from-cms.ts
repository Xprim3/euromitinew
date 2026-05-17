import type { ContactDetailsPublic, SiteFooterPublic } from "@/lib/data/site-contact-public"
import type { OrganizationSchemaInput } from "@/lib/seo/json-ld"

/** Map public CMS contact/footer into Organization JSON-LD — omit empty fields. */
export function organizationSchemaInputFromCms(
  contact: ContactDetailsPublic,
  footer: SiteFooterPublic
): OrganizationSchemaInput {
  const description = footer.footerBody.trim() || contact.hqDescription.trim() || null
  const phone = contact.phone.trim() || null
  const email = contact.email.trim() || null
  const streetAddress = contact.hqAddress.trim() || null
  const sameAs = contact.socialLinks.map((l) => l.url.trim()).filter(Boolean)

  return {
    description,
    phone,
    email,
    streetAddress,
    sameAs,
  }
}
