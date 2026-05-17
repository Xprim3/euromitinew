import type { Metadata } from "next"
import Link from "next/link"

import { DocumentSections } from "@/components/layout/DocumentSections"
import { Container } from "@/components/layout/Container"
import { PageHeader } from "@/components/layout/PageHeader"
import { termsAndLegalSections } from "@/data/mock/legal"
import { metadataForStaticPage } from "@/lib/seo/pages"

export const metadata: Metadata = metadataForStaticPage("terms")

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms & Legal"
        breadcrumbs={
          <>
            <Link href="/">Home</Link>
            <span className="px-2 text-muted-foreground/80">/</span>
            <span className="text-foreground">Terms</span>
          </>
        }
      />
      <Container size="narrow" className="euromiti-section">
        <DocumentSections sections={termsAndLegalSections} />
      </Container>
    </>
  )
}
