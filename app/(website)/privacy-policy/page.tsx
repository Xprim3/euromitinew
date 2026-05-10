import type { Metadata } from "next"
import Link from "next/link"

import { DocumentSections } from "@/components/layout/DocumentSections"
import { Container } from "@/components/layout/Container"
import { PageHeader } from "@/components/layout/PageHeader"
import { privacyPolicySections } from "@/data/mock/legal"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Euromiti privacy policy (placeholder content for development).",
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        description="Placeholder policy for layout and routing — replace with counsel-approved legal text before launch."
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
