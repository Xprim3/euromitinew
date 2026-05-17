import Link from "next/link"

import { Button } from "@/components/ui/button"
import { metadataForStaticPage } from "@/lib/seo/pages"

export const metadata = metadataForStaticPage("notFound")

export default function WebsiteNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-muted/40 px-4 py-20 text-center">
      <p className="font-[family-name:var(--font-montserrat)] text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        404
      </p>
      <h1 className="mt-4 max-w-md font-heading text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-tight text-foreground">
        Kjo faqe nuk u gjet
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Lidhja mund të jetë e prishur ose faqja është zhvendosur.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button render={<Link href="/" />}>Ballina</Button>
        <Button variant="outline" render={<Link href="/contact" />}>
          Kontakt
        </Button>
      </div>
    </div>
  )
}
