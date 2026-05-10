import Link from "next/link"

import { CTASection } from "@/components/layout/CTASection"
import { Button } from "@/components/ui/button"

export type ContactCTAProps = {
  className?: string
}

/** Secondary conversion band routed to `/contact`. */
export function ContactCTA({ className }: ContactCTAProps) {
  return (
    <CTASection
      slug="contact"
      variant="muted"
      label="Contact"
      title="Partnerships & enquiries"
      description="Reach the Euromiti team for corporate fuel accounts, leasing, procurement, restaurant bookings, or media requests."
      className={className}
    >
      <Button variant="default" size="lg" render={<Link href="/contact" />}>
        Contact us
      </Button>
    </CTASection>
  )
}
