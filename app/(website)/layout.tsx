import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { ScrollToTop } from "@/components/layout/ScrollToTop"
import { getSiteFooterPublic } from "@/lib/data/site-contact-public"

export default async function WebsiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const brand = await getSiteFooterPublic()

  return (
    <div className="flex min-h-svh min-h-full flex-col">
      <ScrollToTop />
      <Navbar brand={brand} />
      <main id="main-content" className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
    </div>
  )
}
