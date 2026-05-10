import Link from "next/link"

import { LocationCard } from "@/components/cards/LocationCard"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { mockLocations } from "@/data/mock"
import type { LocationSummary } from "@/types/public"
import { cn } from "@/lib/utils"

export type LocationsPreviewProps = {
  locations?: LocationSummary[]
  className?: string
}

export function LocationsPreview({
  locations = mockLocations,
  className,
}: LocationsPreviewProps) {
  return (
    <section
      id="locations-preview"
      className={cn("euromiti-section bg-background", className)}
      aria-labelledby="locations-preview-heading"
    >
      <Container>
        <SectionHeading
          label="Network"
          headingId="locations-preview-heading"
          title="Strategic locations"
          description="Flagship forecourts in Prishtina, Ferizaj, and Gjilan — consistent quality and hospitality on every visit."
          actions={
            <Button variant="outlinePrimary" render={<Link href="/locations" />}>
              View all stations
            </Button>
          }
          className="mb-10 md:mb-14"
        />
        <div className="grid gap-8 lg:grid-cols-3">
          {locations.map((loc) => (
            <LocationCard key={loc.id} {...loc} />
          ))}
        </div>
      </Container>
    </section>
  )
}
