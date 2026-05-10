import type { Metadata } from "next"
import Image from "next/image"
import { Container } from "@/components/layout/Container"
import { PageImageHero } from "@/components/layout/PageImageHero"
import { SectionReveal } from "@/components/motion/SectionReveal"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { Button } from "@/components/ui/button"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { contactPageMock } from "@/data/mock/contact"
import { LOCATION_HOSPITALITY_EMAIL } from "@/data/mock/locations"
import { homeHeroDesign, homeStrategicNetworkDesign } from "@/data/mock/homepage-visual"
import { mockLocations } from "@/data/mock"
import { cn } from "@/lib/utils"
import type { LocationSummary } from "@/types/public"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Euromiti headquarters in Prishtina — phone, email, hours, forecourt locations across Kosovo, and careers.",
}

function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`
}

function hospitalityMailHref(locId: LocationSummary["id"]) {
  const email = LOCATION_HOSPITALITY_EMAIL[locId as keyof typeof LOCATION_HOSPITALITY_EMAIL]
  return email ? `mailto:${email}` : null
}

function visualForLocation(id: string) {
  return homeStrategicNetworkDesign.find((v) => v.locationId === id)
}

export default function ContactPage() {
  const m = contactPageMock
  const mailHref = `mailto:${m.email}`
  const careersMailHref = `mailto:${m.careersEmail}?subject=Career%20enquiry%20%E2%80%94%20Euromiti`

  return (
    <>
      <PageImageHero
        imageSrc={homeHeroDesign.imageSrc}
        imageAlt="Euromiti — hospitality and operations"
        trail={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        title="Contact"
        description="Headquarters in Prishtina, forecourts across Kosovo — direct lines for guests, partners, and careers."
        visualPreset="flat-heavy"
        priority
      />

      {/* 1 · Headquarters */}
      <section className="bg-background py-16 md:py-20 lg:py-24">
        <Container>
          <SectionReveal once variant="fade-up">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Image collage — reference layout */}
              <div className="order-2 lg:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative h-52 overflow-hidden rounded-xl shadow-lg sm:h-56 md:h-64">
                      <Image
                        src={m.hqImages.lounge}
                        alt={m.hqImages.loungeAlt}
                        fill
                        sizes="(max-width: 1024px) 42vw, 22vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-36 overflow-hidden rounded-xl shadow-lg sm:h-44 md:h-48">
                      <Image
                        src={m.hqImages.amenities}
                        alt={m.hqImages.amenitiesAlt}
                        fill
                        sizes="(max-width: 1024px) 42vw, 22vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="pt-8 md:pt-12">
                    <div className="relative h-[min(24rem,calc(100vw-8rem))] overflow-hidden rounded-xl shadow-lg lg:h-96">
                      <Image
                        src={m.hqImages.reception}
                        alt={m.hqImages.receptionAlt}
                        fill
                        sizes="(max-width: 1024px) 42vw, 22vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.34em] text-brand-red-vivid">{m.hqEyebrow}</p>
                <h2 className="mt-3 font-heading text-[clamp(1.75rem,3.8vw,2.5rem)] font-bold tracking-tight text-foreground lg:mt-4">
                  {m.hqHeading}
                </h2>
                <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground md:text-base md:leading-relaxed">
                  {m.hqDescription}
                </p>
                <SectionAccentRule className="mt-8 max-w-24" />

                <dl className="mt-8 space-y-5">
                  <div className="flex gap-3">
                    <MaterialSymbol name="location_on" className="mt-0.5 shrink-0 text-xl! text-muted-foreground" aria-hidden />
                    <div>
                      <dt className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">Address</dt>
                      <dd className="mt-1 max-w-sm text-muted-foreground text-[0.8125rem] leading-snug">{m.hqAddressCompact}</dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MaterialSymbol name="call" className="mt-0.5 shrink-0 text-xl! text-muted-foreground" aria-hidden />
                    <div>
                      <dt className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Phone</dt>
                      <dd className="mt-1">
                        <a className="font-semibold text-foreground text-lg hover:text-brand-red-vivid" href={telHref(m.phone)}>
                          {m.phone}
                        </a>
                      </dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MaterialSymbol name="mail" className="mt-0.5 shrink-0 text-xl! text-muted-foreground" aria-hidden />
                    <div>
                      <dt className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Email</dt>
                      <dd className="mt-1">
                        <a className="break-all font-semibold text-foreground text-lg hover:text-brand-red-vivid" href={mailHref}>
                          {m.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MaterialSymbol name="schedule" className="mt-0.5 shrink-0 text-xl! text-muted-foreground" aria-hidden />
                    <div>
                      <dt className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Weekdays</dt>
                      <dd className="mt-1 text-foreground">{m.weekdayHours}</dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MaterialSymbol name="today" className="mt-0.5 shrink-0 text-xl! text-muted-foreground" aria-hidden />
                    <div>
                      <dt className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Weekend</dt>
                      <dd className="mt-1 text-foreground">{m.weekendHours}</dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* 2 · Locations band */}
      <section className="border-border/60 border-y bg-brand-surface-tinted py-16 md:py-20 lg:py-24">
        <Container>
          <SectionReveal once variant="fade-up">
            <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
              {mockLocations.map((loc) => {
                const viz = visualForLocation(loc.id)
                const guestMailHref = hospitalityMailHref(loc.id)
                const src = viz?.imageSrc ?? homeHeroDesign.imageSrc
                const alt = viz?.imageAlt ?? `${loc.city} Euromiti`
                const routeHint = viz?.addressLine ?? null
                return (
                  <article
                    key={loc.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-border/80 bg-background shadow-sm transition-[box-shadow,transform] hover:shadow-xl"
                  >
                    <div className="relative aspect-4/3 h-52 w-full shrink-0 md:aspect-auto md:h-52">
                      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                      {viz?.hubBadge ? (
                        <span className="absolute top-3 left-3 rounded-md bg-black/72 px-2.5 py-1 font-semibold text-[0.65rem] text-white uppercase tracking-[0.12em] backdrop-blur-sm">
                          {viz.hubBadge}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col px-6 pt-6 pb-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-heading text-xl font-bold text-foreground">{loc.city}</h3>
                          {viz?.title ? (
                            <p className="mt-1 text-sm leading-snug font-medium text-brand-body-soft">{viz.title}</p>
                          ) : null}
                        </div>
                      </div>

                      {routeHint ? (
                        <p className="mt-4 text-[0.8rem] leading-relaxed text-muted-foreground italic md:text-sm">
                          {routeHint}
                        </p>
                      ) : null}

                      <dl className="mt-5 space-y-4 text-sm">
                        <div className="flex gap-3">
                          <MaterialSymbol name="location_on" className="mt-0.5 shrink-0 text-xl! text-muted-foreground" aria-hidden />
                          <div>
                            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">Address</dt>
                            <dd className="mt-1 leading-snug text-foreground">{loc.address}</dd>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <MaterialSymbol name="call" className="mt-0.5 shrink-0 text-xl! text-muted-foreground" aria-hidden />
                          <div>
                            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">Phone</dt>
                            <dd className="mt-1">
                              <a className="font-semibold text-foreground hover:text-brand-red-vivid" href={telHref(loc.phone)}>
                                {loc.phone}
                              </a>
                            </dd>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <MaterialSymbol name="schedule" className="mt-0.5 shrink-0 text-xl! text-muted-foreground" aria-hidden />
                          <div>
                            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">Opening hours</dt>
                            <dd className="mt-1 leading-snug text-foreground">{loc.openingHours}</dd>
                          </div>
                        </div>
                        {guestMailHref ? (
                          <div className="flex gap-3">
                            <MaterialSymbol name="restaurant_menu" className="mt-0.5 shrink-0 text-xl! text-muted-foreground" aria-hidden />
                            <div>
                              <dt className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                                Guest / restaurant enquiries
                              </dt>
                              <dd className="mt-1">
                                <a className="break-all font-medium text-foreground hover:text-brand-red-vivid" href={guestMailHref}>
                                  {LOCATION_HOSPITALITY_EMAIL[loc.id as keyof typeof LOCATION_HOSPITALITY_EMAIL]}
                                </a>
                              </dd>
                            </div>
                          </div>
                        ) : null}
                      </dl>
                    </div>
                  </article>
                )
              })}
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* 3 · Careers / partnerships */}
      <section className="relative flex min-h-[min(100svh,36rem)] items-center justify-center overflow-hidden md:min-h-112 lg:min-h-128">
        <Image
          src={m.careersImage}
          alt={m.careersImageAlt}
          fill
          priority={false}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-shell-deep/72 backdrop-blur-[2px]" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-4 py-14 text-center sm:px-6">
          <SectionReveal once variant="fade-up">
            <h2 className="font-heading text-[clamp(1.75rem,4.5vw,3rem)] font-bold tracking-tight text-white">{m.careersTitle}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/90 md:text-[1.125rem]">{m.careersSupporting}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Button
                variant="default"
                size="lg"
                className="min-h-14 rounded-full px-8 text-lg shadow-xl transition hover:brightness-105 sm:min-w-50 sm:px-10"
                render={<a href={telHref(m.phone)} />}
              >
                <MaterialSymbol name="call" className="text-xl!" />
                {m.phone}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  "min-h-14 rounded-full border-white/35 bg-transparent px-8 text-lg text-white sm:min-w-50 sm:px-10",
                  "shadow-xl hover:bg-white/12 hover:text-white"
                )}
                render={<a href={careersMailHref} />}
              >
                <MaterialSymbol name="mail" className="text-xl!" />
                {m.careersCtaApplyByEmail}
              </Button>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
