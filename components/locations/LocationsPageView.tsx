import Image from "next/image"
import Link from "next/link"

import { Container } from "@/components/layout/Container"
import { PageImageHero } from "@/components/layout/PageImageHero"
import { EuromitiMotionClasses, ImageHoverZoom, Reveal, Stagger } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { homeHeroDesign } from "@/data/mock/homepage-visual"
import { LOCATION_PAGE_SERVICE_LABELS, type ResolvedPublicLocation } from "@/lib/data/locations-public"
import { cn } from "@/lib/utils"
import type { LocationAmenity } from "@/types/public"

export type LocationsPageViewProps = {
  locations: ResolvedPublicLocation[]
}

export function LocationsPageView({ locations }: LocationsPageViewProps) {
  return (
    <>
      <PageImageHero
        imageSrc={homeHeroDesign.imageSrc}
        imageAlt="Euromiti locations in Kosovo"
        trail={[{ label: "Home", href: "/" }, { label: "Locations" }]}
        title="Locations"
        description="Three flagship Euromiti forecourts across Kosovo — each with full address, contact, opening hours, and on-site services."
        priority
      />

      {locations.map((entry, index) => {
        const reverse = index % 2 === 1
        const bg = index % 2 === 0 ? "bg-white" : "bg-muted"

        return (
          <section key={entry.id} className={bg}>
            <Container className="euromiti-section">
              <Reveal variant="fade-up" once>
                <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-11">
                  <div className={reverse ? "space-y-5 lg:col-span-5 lg:order-2" : "space-y-5 lg:col-span-5"}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{entry.city}</p>
                    <h2 className="font-heading text-[clamp(1.65rem,3.1vw,2.45rem)] font-bold tracking-tight text-foreground">
                      {entry.pageHeading}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{entry.pageSummary}</p>
                    <div className="space-y-2 text-sm text-foreground/85 md:text-base">
                      <p>
                        <strong>Address:</strong> {entry.address}
                      </p>
                      <p>
                        <strong>Phone:</strong> {entry.phone}
                      </p>
                      <p>
                        <strong>Email:</strong> {entry.contactEmailDisplay}
                      </p>
                      <p>
                        <strong>Hours:</strong> {entry.openingHours}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {entry.services.map((service: LocationAmenity) => (
                        <span
                          key={service}
                          className="rounded-full bg-primary/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-foreground/80"
                        >
                          {LOCATION_PAGE_SERVICE_LABELS[service]}
                        </span>
                      ))}
                    </div>
                    <Button
                      variant="outlinePrimary"
                      render={<Link href={entry.googleMapsUrl} />}
                      className={cn(EuromitiMotionClasses.buttonHover)}
                    >
                      Open in Google Maps
                    </Button>
                  </div>

                  <div className={reverse ? "space-y-4 lg:col-span-7 lg:order-1" : "space-y-4 lg:col-span-7"}>
                    <div className="relative min-h-[240px] overflow-hidden rounded-lg border border-border/70 shadow-[0_24px_58px_-34px_rgb(15_23_42/0.45)] md:min-h-[340px] lg:min-h-[380px]">
                      <ImageHoverZoom className="absolute inset-0 h-full w-full">
                        <Image
                          src={entry.mainImageSrc}
                          alt={entry.mainImageAlt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 58vw"
                          className="object-cover"
                        />
                      </ImageHoverZoom>
                    </div>
                    <Stagger once className="grid grid-cols-2 gap-3 md:gap-4">
                      {entry.gallery.map((tile, gIdx) => (
                        <div
                          key={`${entry.id}-g-${gIdx}`}
                          className="relative min-h-[120px] overflow-hidden rounded-[var(--rounded-md)] border border-border/70 shadow-[0_16px_36px_-30px_rgb(15_23_42/0.4)] md:min-h-[128px]"
                        >
                          <ImageHoverZoom className="absolute inset-0 h-full w-full">
                            <Image
                              src={tile.src}
                              alt={tile.alt}
                              fill
                              sizes="(max-width: 1024px) 50vw, 28vw"
                              className="object-cover"
                            />
                          </ImageHoverZoom>
                        </div>
                      ))}
                    </Stagger>
                  </div>
                </div>
              </Reveal>
            </Container>
          </section>
        )
      })}
    </>
  )
}
