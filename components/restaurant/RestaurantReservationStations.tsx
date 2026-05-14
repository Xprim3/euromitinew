import { Container } from "@/components/layout/Container"
import { Reveal } from "@/components/motion"
import { buttonVariants, Button } from "@/components/ui/button"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import type { RestaurantReservationStationCard } from "@/lib/data/restaurant-reservation-stations-public"
import { cn, telHrefFromDisplayPhone } from "@/lib/utils"

import type { RestaurantReservationStationsSectionMock } from "@/data/mock/restaurant-page"

type RestaurantReservationStationsProps = {
  section: RestaurantReservationStationsSectionMock
  stations: RestaurantReservationStationCard[]
  className?: string
}

export function RestaurantReservationStations({ section, stations, className }: RestaurantReservationStationsProps) {
  const { sectionId, headingId, eyebrow, title, subtitle, reservationCtaLabel } = section

  return (
    <section id={sectionId} aria-labelledby={headingId} className={cn("bg-muted py-[clamp(3rem,6.8vw,5.85rem)]", className)}>
      <Container>
        <Reveal variant="fade" once>
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

        <Reveal variant="fade" once>
        <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {stations.map((loc) => {
            const reservationTelHref = telHrefFromDisplayPhone(loc.phone)

            return (
              <li key={loc.slug}>
                <article
                  className={cn(
                    "flex h-full flex-col overflow-hidden border border-primary/12 bg-linear-to-b from-background via-background to-muted/45",
                    "shadow-(--shadow-euromiti-soft)"
                  )}
                >
                  <div className="grow px-6 pb-8 pt-8 sm:px-8 sm:pb-9 sm:pt-9 lg:px-9">
                    <p className="font-heading text-[0.58rem] font-semibold uppercase tracking-[0.34em] text-secondary/90">
                      {loc.city}
                    </p>
                    <h3 className="font-playfair mt-4 text-[1.65rem] font-normal leading-snug tracking-tight text-primary md:text-[1.85rem]">
                      Euromiti {loc.city}
                    </h3>
                    <div className="my-7 h-px w-14 bg-secondary/38" aria-hidden />

                    <dl className="space-y-6 font-sans text-[0.875rem] font-light md:text-[0.9rem]">
                      <div className="flex gap-3.5">
                        <MaterialSymbol
                          name="location_on"
                          className="mt-0.5 shrink-0 text-[1.2rem] text-secondary/90"
                          aria-hidden
                        />
                        <div className="min-w-0">
                          <dt className="font-heading text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-primary">
                            Address
                          </dt>
                          <dd className="mt-2 leading-[1.7] text-muted-foreground">{loc.address}</dd>
                        </div>
                      </div>
                      <div className="flex gap-3.5">
                        <MaterialSymbol name="call" className="mt-0.5 shrink-0 text-[1.2rem] text-secondary/90" aria-hidden />
                        <div className="min-w-0">
                          <dt className="font-heading text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-primary">
                            Phone
                          </dt>
                          <dd className="mt-2">
                            {reservationTelHref ? (
                              <a
                                href={reservationTelHref}
                                className="text-muted-foreground transition-colors hover:text-primary"
                              >
                                {loc.phone}
                              </a>
                            ) : (
                              <span className="text-muted-foreground">{loc.phone}</span>
                            )}
                          </dd>
                        </div>
                      </div>
                      <div className="flex gap-3.5">
                        <MaterialSymbol name="mail" className="mt-0.5 shrink-0 text-[1.2rem] text-secondary/90" aria-hidden />
                        <div className="min-w-0">
                          <dt className="font-heading text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-primary">
                            Email
                          </dt>
                          <dd className="mt-2">
                            <a href={`mailto:${loc.email}`} className="break-all text-muted-foreground hover:text-secondary">
                              {loc.email}
                            </a>
                          </dd>
                        </div>
                      </div>
                      <div className="flex gap-3.5">
                        <MaterialSymbol name="schedule" className="mt-0.5 shrink-0 text-[1.2rem] text-secondary/90" aria-hidden />
                        <div className="min-w-0">
                          <dt className="font-heading text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-primary">
                            Station hours
                          </dt>
                          <dd className="mt-2 leading-relaxed text-muted-foreground">{loc.openingHours}</dd>
                        </div>
                      </div>
                    </dl>

                    {reservationTelHref ? (
                      <a
                        href={reservationTelHref}
                        aria-label={`${reservationCtaLabel} — ${loc.phone}`}
                        className={cn(
                          buttonVariants({ variant: "secondary", size: "lg" }),
                          "mt-10 w-full rounded-full text-[0.65rem] font-semibold uppercase tracking-[0.24em]"
                        )}
                      >
                        {reservationCtaLabel}
                      </a>
                    ) : (
                      <Button
                        variant="secondary"
                        size="lg"
                        disabled
                        className="mt-10 w-full rounded-full text-[0.65rem] font-semibold uppercase tracking-[0.24em]"
                      >
                        {reservationCtaLabel}
                      </Button>
                    )}
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
