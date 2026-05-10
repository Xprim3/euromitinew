import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { Container } from "@/components/layout/Container"
import { PageImageHero } from "@/components/layout/PageImageHero"
import { EuromitiMotionClasses, ImageHoverZoom, Reveal, Stagger } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { homeBeyondDesign, homeHeroDesign, homeStrategicNetworkDesign } from "@/data/mock/homepage-visual"
import { LOCATION_HOSPITALITY_EMAIL, mockLocations } from "@/data/mock"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Euromiti stations in Prishtina, Ferizaj, and Gjilan — addresses, hours, services, and Google Maps.",
}

const SERVICE_LABELS = {
  petrol: "Petrol station",
  restaurant: "Restaurant",
  carwash: "Carwash",
  mini_market: "Mini market",
  ev: "EV",
} as const

const LOCATION_VISUALS = {
  prishtina: {
    main: homeStrategicNetworkDesign[0].imageSrc,
    mainAlt: "Euromiti Prishtina main station",
    galleryOne: homeBeyondDesign.secondaryServices[2].imageSrc,
    galleryOneAlt: "Carwash at Euromiti Prishtina",
    galleryTwo: homeBeyondDesign.restaurant.mainImage,
    galleryTwoAlt: "Restaurant service at Euromiti Prishtina",
    summary:
      "Our Prishtina station is the main Euromiti hub with full service availability and the most complete customer experience for drivers, families, and business travel.",
  },
  ferizaj: {
    main: homeStrategicNetworkDesign[1].imageSrc,
    mainAlt: "Euromiti Ferizaj station",
    galleryOne: homeBeyondDesign.secondaryServices[0].imageSrc,
    galleryOneAlt: "Playground and family area near Ferizaj location",
    galleryTwo: homeBeyondDesign.secondaryServices[1].imageSrc,
    galleryTwoAlt: "Mini market service at Ferizaj station",
    summary:
      "Ferizaj serves commuters and families with practical roadside services and strong day-to-day convenience.",
  },
  gjilan: {
    main: homeStrategicNetworkDesign[2].imageSrc,
    mainAlt: "Euromiti Gjilan station",
    galleryOne: homeBeyondDesign.restaurant.float2,
    galleryOneAlt: "Hospitality environment at Gjilan location",
    galleryTwo: homeBeyondDesign.secondaryServices[2].imageSrc,
    galleryTwoAlt: "Vehicle care services at Gjilan station",
    summary:
      "Gjilan provides reliable fueling and hospitality support for regional drivers and long-route movement.",
  },
} as const

export default function LocationsPage() {
  const prishtina = mockLocations.find((l) => l.id === "prishtina")
  const ferizaj = mockLocations.find((l) => l.id === "ferizaj")
  const gjilan = mockLocations.find((l) => l.id === "gjilan")

  if (!prishtina || !ferizaj || !gjilan) return null

  return (
    <>
      <PageImageHero
        imageSrc={homeHeroDesign.imageSrc}
        imageAlt="Euromiti locations in Kosovo"
        trail={[{ label: "Home", href: "/" }, { label: "Locations" }]}
        title="Locations"
        description={
          "Three flagship Euromiti forecourts across Kosovo — each with full address, contact, opening hours, and on-site services."
        }
        priority
      />

      {[
        {
          key: "prishtina",
          location: prishtina,
          heading: "Prishtina flagship location",
          reverse: false,
          bg: "bg-white",
        },
        {
          key: "ferizaj",
          location: ferizaj,
          heading: "Ferizaj city station",
          reverse: true,
          bg: "bg-muted",
        },
        {
          key: "gjilan",
          location: gjilan,
          heading: "Gjilan regional location",
          reverse: false,
          bg: "bg-white",
        },
      ].map((entry) => {
        const v = LOCATION_VISUALS[entry.key as keyof typeof LOCATION_VISUALS]
        return (
          <section key={entry.key} className={entry.bg}>
            <Container className="euromiti-section">
              <Reveal variant="fade-up" once>
                <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-11">
                  <div className={entry.reverse ? "space-y-5 lg:col-span-5 lg:order-2" : "space-y-5 lg:col-span-5"}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {entry.location.city}
                    </p>
                    <h2 className="font-heading text-[clamp(1.65rem,3.1vw,2.45rem)] font-bold tracking-tight text-foreground">
                      {entry.heading}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{v.summary}</p>
                    <div className="space-y-2 text-sm text-foreground/85 md:text-base">
                      <p>
                        <strong>Address:</strong> {entry.location.address}
                      </p>
                      <p>
                        <strong>Phone:</strong> {entry.location.phone}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {LOCATION_HOSPITALITY_EMAIL[entry.key as keyof typeof LOCATION_HOSPITALITY_EMAIL]}
                      </p>
                      <p>
                        <strong>Hours:</strong> {entry.location.openingHours}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {entry.location.services.map((service) => (
                        <span
                          key={service}
                          className="rounded-full bg-primary/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-foreground/80"
                        >
                          {SERVICE_LABELS[service]}
                        </span>
                      ))}
                    </div>
                    <Button
                      variant="outlinePrimary"
                      render={<Link href={entry.location.googleMapsUrl} />}
                      className={cn(EuromitiMotionClasses.buttonHover)}
                    >
                      Open in Google Maps
                    </Button>
                  </div>

                  <div className={entry.reverse ? "space-y-4 lg:col-span-7 lg:order-1" : "space-y-4 lg:col-span-7"}>
                    <div className="relative min-h-[240px] overflow-hidden rounded-lg border border-border/70 shadow-[0_24px_58px_-34px_rgb(15_23_42/0.45)] md:min-h-[340px] lg:min-h-[380px]">
                      <ImageHoverZoom className="absolute inset-0 h-full w-full">
                        <Image
                          src={v.main}
                          alt={v.mainAlt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 58vw"
                          className="object-cover"
                        />
                      </ImageHoverZoom>
                    </div>
                    <Stagger once className="grid grid-cols-2 gap-3 md:gap-4">
                      <div className="relative min-h-[120px] overflow-hidden rounded-[var(--rounded-md)] border border-border/70 shadow-[0_16px_36px_-30px_rgb(15_23_42/0.4)] md:min-h-[128px]">
                        <ImageHoverZoom className="absolute inset-0 h-full w-full">
                          <Image
                            src={v.galleryOne}
                            alt={v.galleryOneAlt}
                            fill
                            sizes="(max-width: 1024px) 50vw, 28vw"
                            className="object-cover"
                          />
                        </ImageHoverZoom>
                      </div>
                      <div className="relative min-h-[120px] overflow-hidden rounded-[var(--rounded-md)] border border-border/70 shadow-[0_16px_36px_-30px_rgb(15_23_42/0.4)] md:min-h-[128px]">
                        <ImageHoverZoom className="absolute inset-0 h-full w-full">
                          <Image
                            src={v.galleryTwo}
                            alt={v.galleryTwoAlt}
                            fill
                            sizes="(max-width: 1024px) 50vw, 28vw"
                            className="object-cover"
                          />
                        </ImageHoverZoom>
                      </div>
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
