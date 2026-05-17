import type { Metadata } from "next"
import Link from "next/link"

import { DocumentSections } from "@/components/layout/DocumentSections"
import { Container } from "@/components/layout/Container"
import { PageHeader } from "@/components/layout/PageHeader"
import { privacyPolicySections } from "@/data/mock/legal"
import { metadataForStaticPage } from "@/lib/seo/pages"

export const metadata: Metadata = metadataForStaticPage("privacy")

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        breadcrumbs={
          <>
            <Link href="/">Home</Link>
            <span className="px-2 text-muted-foreground/80">/</span>
            <span className="text-foreground">Privacy</span>
          </>
        }
      />
      <Container size="narrow" className="euromiti-section">
        <DocumentSections sections={privacyPolicySections} />
      </Container>
    </>
  )
}
