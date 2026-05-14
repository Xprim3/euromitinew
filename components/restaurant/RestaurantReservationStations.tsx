import Link from "next/link"

import { Container } from "@/components/layout/Container"
import { EuromitiMotionClasses, Reveal } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { LocationSummary } from "@/types/public"

import {
  LOCATION_HOSPITALITY_EMAIL,
  LOCATION_IDS_ORDERED,
  mockLocations,
} from "@/data/mock"
import type { RestaurantReservationStationsSectionMock } from "@/data/mock/restaurant-page"

type RestaurantReservationStationsProps = {
  section: RestaurantReservationStationsSectionMock
  className?: string
}

function sanitizeTel(phone: string) {
  return phone.replace(/\s+/g, "")
}

export function RestaurantReservationStations({ section, className }: RestaurantReservationStationsProps) {
  const stations: LocationSummary[] = LOCATION_IDS_ORDERED.map((id) =>
    mockLocations.find((loc) => loc.id === id)
  ).filter((loc): loc is LocationSummary => loc != null)

  const { sectionId, headingId, eyebrow, title, subtitle, reservationCtaLabel, stationTaglines } = section

  return (
    <section id={sectionId} aria-labelledby={headingId} className={cn("bg-muted py-[clamp(3rem,6.8vw,5.85rem)]", className)}>
      <Container>
        <Reveal variant="fade-up" once>
          <header className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
            <p className="mb-5 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-secondary">
              {eyebrow}
            </p>
            <h2 id={headingId} className="font-playfair text-[clamp(1.85rem,3.25vw,2.55rem)] font-normal italic leading-[1.12] tracking-tight text-primary">
              {title}
            </h2>
            <p className="mt-5 font-sans text-[0.9375rem] font-light leading-[1.75] text-muted-foreground md:text-base">{subtitle}</p>
          </header>
        </Reveal>

        <Reveal variant="fade-up" once>
        <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {stations.map((loc) => {
            const tagline =
              stationTaglines[loc.id as keyof typeof stationTaglines]
            const email = LOCATION_HOSPITALITY_EMAIL[loc.id as keyof typeof LOCATION_HOSPITALITY_EMAIL]
            const reservationHref = `/contact?topic=restaurant&location=${encodeURIComponent(loc.id)}`

            return (
              <li key={loc.id}>
                <article
                  className={cn(
                    "flex h-full flex-col overflow-hidden border border-primary/12 bg-linear-to-b from-background via-background to-muted/45",
                    "shadow-(--shadow-euromiti-soft) md:transition-transform md:duration-300 md:will-change-transform md:hover:-translate-y-0.5"
                  )}
                >
                  <div className="grow px-6 pb-8 pt-8 sm:px-8 sm:pb-9 sm:pt-9 lg:px-9">
                    <p className="font-heading text-[0.58rem] font-semibold uppercase tracking-[0.34em] text-secondary/90">
                      {loc.city}
                    </p>
                    <h3 className="font-playfair mt-4 text-[1.65rem] font-normal leading-snug tracking-tight text-primary md:text-[1.85rem]">
                      Euromiti {loc.city}
                    </h3>
                    <p className="mt-4 font-sans text-[0.9rem] font-light italic leading-snug text-muted-foreground">
                      {tagline}
                    </p>
                    <div className="my-7 h-px w-14 bg-secondary/38" aria-hidden />

                    <dl className="space-y-6 font-sans text-[0.875rem] font-light md:text-[0.9rem]">
                      <div>
                        <dt className="font-heading text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-primary">
                          Address
                        </dt>
                        <dd className="mt-2 leading-[1.7] text-muted-foreground">{loc.address}</dd>
                      </div>
                      <div>
                        <dt className="font-heading text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-primary">
                          Phone
                        </dt>
                        <dd className="mt-2">
                          <a
                            href={`tel:${sanitizeTel(loc.phone)}`}
                            className="text-muted-foreground transition-colors hover:text-primary"
                          >
                            {loc.phone}
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt className="font-heading text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-primary">
                          Email
                        </dt>
                        <dd className="mt-2">
                          <a href={`mailto:${email}`} className="break-all text-muted-foreground hover:text-secondary">
                            {email}
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt className="font-heading text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-primary">
                          Station hours
                        </dt>
                        <dd className="mt-2 leading-relaxed text-muted-foreground">{loc.openingHours}</dd>
                      </div>
                    </dl>

                    <Button
                      variant="secondary"
                      size="lg"
                      className={cn(
                        "mt-10 w-full rounded-full text-[0.65rem] font-semibold uppercase tracking-[0.24em]",
                        EuromitiMotionClasses.buttonHover
                      )}
                      render={<Link href={reservationHref} />}
                    >
                      {reservationCtaLabel}
                    </Button>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
        </Reveal>
      </Container>
    </section>
  )
}
