import { ServiceCard } from "@/components/cards/ServiceCard"
import { Container } from "@/components/layout/Container"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { mockServiceHighlights } from "@/data/mock"
import type { ServiceHighlight } from "@/types/public"
import { cn } from "@/lib/utils"

export type ServicesSectionProps = {
  services?: ServiceHighlight[]
  className?: string
}

export function ServicesSection({
  services = mockServiceHighlights,
  className,
}: ServicesSectionProps) {
  return (
    <section
      id="services"
      className={cn("euromiti-section bg-muted/50", className)}
      aria-labelledby="services-heading"
    >
      <Container>
        <SectionHeading
          label="Services"
          headingId="services-heading"
          title="Beyond fueling"
          description="Petrol anchors every visit while dining, car care, and retail extend the Euromiti experience."
          className="mb-10 md:mb-14"
        />
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-5">
          {services.map((s) => (
            <ServiceCard key={s.id} {...s} />
          ))}
        </div>
      </Container>
    </section>
  )
}
