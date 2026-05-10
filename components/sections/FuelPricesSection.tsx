import { FuelPriceCard } from "@/components/cards/FuelPriceCard"
import { Container } from "@/components/layout/Container"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { mockFuelPrices } from "@/data/mock"
import type { FuelPrice } from "@/types/public"
import { cn } from "@/lib/utils"

export type FuelPricesSectionProps = {
  prices?: FuelPrice[]
  className?: string
}

export function FuelPricesSection({
  prices = mockFuelPrices,
  className,
}: FuelPricesSectionProps) {
  return (
    <section
      id="fuel-prices"
      className={cn("euromiti-section border-y border-border/70 bg-muted/60", className)}
      aria-labelledby="fuel-prices-heading"
    >
      <Container>
        <SectionHeading
          label="Live prices"
          headingId="fuel-prices-heading"
          title="Fuel prices at a glance"
          description="Indicative rates for Euromiti fuels — refreshed regularly for drivers planning their next fill-up."
          className="mb-10 md:mb-14"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {prices.map((p) => (
            <FuelPriceCard key={p.id} {...p} />
          ))}
        </div>
      </Container>
    </section>
  )
}
