import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { ScrollToTop } from "@/components/layout/ScrollToTop"
import { JsonLd } from "@/components/seo/JsonLd"
import { getContactDetailsPublic, getSiteFooterPublic } from "@/lib/data/site-contact-public"
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/seo/json-ld"
import { organizationSchemaInputFromCms } from "@/lib/seo/organization-from-cms"

export default async function WebsiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [brand, contact] = await Promise.all([getSiteFooterPublic(), getContactDetailsPublic()])

  return (
    <div className="flex min-h-svh min-h-full flex-col">
      <JsonLd
        data={[buildOrganizationSchema(organizationSchemaInputFromCms(contact, brand)), buildWebSiteSchema()]}
      />
      <ScrollToTop />
      <Navbar brand={brand} />
      <main id="main-content" className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
    </div>
  )
}
