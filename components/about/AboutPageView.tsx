import Image from "next/image"
import Link from "next/link"

import { Container } from "@/components/layout/Container"
import { PageImageHero } from "@/components/layout/PageImageHero"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { EuromitiMotionClasses, ImageHoverZoom, Reveal, SectionReveal, Stagger } from "@/components/motion"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { Button } from "@/components/ui/button"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { homeBeyondDesign, homeStrategicNetworkDesign } from "@/data/mock/homepage-visual"
import type { ResolvedAboutPage } from "@/lib/data/about-content-public"
import { cn } from "@/lib/utils"

const offerItems = [
  {
    icon: "local_gas_station",
    title: "Elite Fueling",
    body: "Consistent fuel quality and clean forecourts designed for confidence on every route.",
  },
  {
    icon: "restaurant",
    title: "Restaurant",
    body: "Fresh meals, curated coffee, and a calm stopover experience for families and commuters.",
  },
  {
    icon: "toys",
    title: "Playground",
    body: "Family-friendly spaces in selected stations, giving children a safe and active break.",
  },
  {
    icon: "local_car_wash",
    title: "Car Wash",
    body: "Fast, careful wash lanes with reliable turnaround for daily and long-distance travel.",
  },
  {
    icon: "shopping_bag",
    title: "Mini Market",
    body: "Travel essentials, premium snacks, and practical daily goods in one convenient stop.",
  },
] as const

const reasons = [
  {
    icon: "verified",
    title: "Consistent quality standards",
    body: "Unified station standards across fuel quality, cleanliness, and service readiness.",
  },
  {
    icon: "groups",
    title: "Hospitality-driven teams",
    body: "Respectful, efficient service culture built around real guest care.",
  },
  {
    icon: "bolt",
    title: "Fast and reliable experience",
    body: "Optimized forecourt flow and fast service touchpoints for smoother stops.",
  },
  {
    icon: "workspace_premium",
    title: "Premium roadside ecosystem",
    body: "Fuel, dining, market, wash, and family services delivered as one complete stop.",
  },
  {
    icon: "construction",
    title: "Clean and maintained sites",
    body: "Routine upkeep keeps stations bright, safe, and operationally ready.",
  },
  {
    icon: "support_agent",
    title: "Responsive local support",
    body: "On-site teams solve requests quickly with practical, local accountability.",
  },
] as const

export function AboutPageView({ data }: { data: ResolvedAboutPage }) {
  return (
    <>
      <PageImageHero
        imageSrc={data.heroImageSrc}
        imageAlt={data.heroImageAlt}
        trail={[{ label: "Home", href: "/" }, { label: "About" }]}
        title={data.heroTitle}
        description={data.heroSubtitle}
        priority
      />

      <section className="bg-background">
        <Container className="euromiti-section">
          <SectionReveal variant="fade-up" once>
            <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="relative lg:col-span-5">
                <div className="relative aspect-4/5 w-full overflow-hidden rounded-[var(--rounded-lg)]">
                  <ImageHoverZoom className="absolute inset-0 h-full w-full">
                    <Image
                      src={data.storyImageSrc}
                      alt={data.storyImageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                    />
                  </ImageHoverZoom>
                  <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" aria-hidden />
                </div>
              </div>

              <div className="space-y-6 lg:col-span-7">
                <h2
                  id="about-story-heading"
                  className="font-heading text-[clamp(1.7rem,3.2vw,2.4rem)] font-bold tracking-tight text-foreground"
                >
                  Who We Are
                </h2>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground md:text-[1.05rem]">
                  {data.storyParagraphs.map((p) => (
                    <p key={`${p.slice(0, 48)}-${p.length}`}>{p}</p>
                  ))}
                </div>

                <div className="grid gap-3 border-t border-border/65 pt-5 sm:grid-cols-3 sm:gap-5">
                  <div>
                    <p className="text-[1.55rem] font-bold leading-none text-foreground">15+ years</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Years of experience</p>
                  </div>
                  <div>
                    <p className="text-[1.55rem] font-bold leading-none text-foreground">3 cities</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Locations</p>
                  </div>
                  <div>
                    <p className="text-[1.55rem] font-bold leading-none text-foreground">5 core services</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">Service portfolio</p>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>

      <section className="border-y border-border/60 bg-brand-shell text-white">
        <Container className="euromiti-section">
          <Reveal variant="fade-up" once>
            <div className="mb-8 grid gap-7 lg:grid-cols-12 lg:items-end lg:gap-10 md:mb-11">
              <div className="space-y-4 lg:col-span-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Mission & vision</p>
                <h2
                  id="about-purpose-heading"
                  className="font-heading text-[1.9rem] font-bold leading-[1.15] tracking-tight text-white md:text-[2.45rem]"
                >
                  The direction behind every station decision
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-white/75 md:text-base lg:col-span-5">
                One clear standard for fuel, hospitality, and service quality across every Euromiti location.
              </p>
            </div>
          </Reveal>

          <Stagger once className="grid gap-5 md:grid-cols-2 md:gap-6">
            <article className="rounded-[var(--rounded-lg)] border border-white/20 bg-white/5 p-7 md:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
                  <MaterialSymbol name="flag" className="text-[1.2rem] text-brand-accent-soft" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent-soft">
                  {data.missionTitle}
                </p>
              </div>
              <p className="mt-4 leading-relaxed text-white/92 md:text-lg">{data.missionBody}</p>
              <SectionAccentRule className="mt-6 w-full from-brand-red-vivid/65" />
            </article>
            <article className="rounded-[var(--rounded-lg)] border border-white/20 bg-white/5 p-7 md:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
                  <MaterialSymbol name="visibility" className="text-[1.2rem] text-brand-accent-soft" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent-soft">{data.visionTitle}</p>
              </div>
              <p className="mt-4 leading-relaxed text-white/92 md:text-lg">{data.visionBody}</p>
              <SectionAccentRule className="mt-6 w-full from-brand-red-vivid/65" />
            </article>
          </Stagger>

          <Reveal variant="fade-up" once className="mt-6 md:mt-8">
            <div className="relative h-32 overflow-hidden rounded-[var(--rounded-lg)] border border-white/15 md:h-40">
              <ImageHoverZoom className="absolute inset-0 h-full w-full">
                <Image
                  src={data.missionStripSrc}
                  alt={data.missionStripAlt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </ImageHoverZoom>
              <div className="absolute inset-0 bg-black/45" aria-hidden />
              <p className="absolute bottom-4 left-4 text-sm font-medium text-white/90 md:bottom-5 md:left-5">
                Premium standards. Consistent execution. Every station.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-background">
        <Container className="euromiti-section">
          <SectionHeading
            label="What we offer"
            headingId="about-offer-heading"
            title="Integrated services, curated as one premium ecosystem"
            description="From first fuel stop to final coffee break, each service is run with the same Euromiti standards."
            fullWidth
            className="mb-8 md:mb-11"
          />

          <div className="grid gap-4 md:gap-5">
            <Reveal variant="fade-up" once>
              <article className="group relative min-h-[240px] overflow-hidden rounded-[var(--rounded-lg)] border border-border/70 md:min-h-[300px]">
                <div className="absolute inset-0">
                  <ImageHoverZoom className="absolute inset-0 h-full w-full">
                    <Image
                      src={homeStrategicNetworkDesign[0].imageSrc}
                      alt="Elite fueling at Euromiti"
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  </ImageHoverZoom>
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                  <h3 className="text-[1.28rem] font-bold tracking-tight text-white md:text-[1.65rem]">Elite Fueling</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/82 md:text-[0.9375rem]">
                    Premium-grade fueling standards with disciplined forecourt operations and consistency across every
                    Euromiti station.
                  </p>
                </div>
              </article>
            </Reveal>

            <Stagger once className="grid gap-4 sm:grid-cols-2 md:gap-5">
              {offerItems
                .filter((item) => item.title !== "Elite Fueling")
                .map((item) => {
                  const visual =
                    item.title === "Restaurant"
                      ? homeBeyondDesign.restaurant.mainImage
                      : item.title === "Playground"
                        ? homeBeyondDesign.secondaryServices[0].imageSrc
                        : item.title === "Mini Market"
                          ? homeBeyondDesign.secondaryServices[1].imageSrc
                          : homeBeyondDesign.secondaryServices[2].imageSrc

                  return (
                    <article
                      key={item.title}
                      className="group relative min-h-[190px] overflow-hidden rounded-[var(--rounded-lg)] border border-border/70 md:min-h-[210px]"
                    >
                      <ImageHoverZoom className="absolute inset-0 h-full w-full">
                        <Image
                          src={visual}
                          alt={`${item.title} at Euromiti`}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </ImageHoverZoom>
                      <div className="absolute inset-0 bg-linear-to-t from-black/78 via-black/32 to-transparent" aria-hidden />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex size-8 items-center justify-center rounded-full bg-white/18 backdrop-blur-sm">
                            <MaterialSymbol name={item.icon} className="text-[1rem] text-brand-accent-soft" />
                          </span>
                          <h3 className="text-xl font-semibold tracking-tight text-white">{item.title}</h3>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-white/78">{item.body}</p>
                      </div>
                    </article>
                  )
                })}
            </Stagger>
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 bg-brand-shell text-white">
        <Container className="euromiti-section">
          <Reveal variant="fade-up" once>
            <h2 className="mb-8 font-heading text-[clamp(1.7rem,3.2vw,2.4rem)] font-bold tracking-tight text-white md:mb-10">
              Why Choose Us
            </h2>
          </Reveal>
          <div className="grid gap-7 lg:grid-cols-12 lg:gap-9">
            <Stagger once className="grid gap-6 md:grid-cols-2 lg:col-span-7 lg:gap-9">
              {reasons.map((reason) => (
                <article key={reason.title} className="border-b border-white/20 pb-5">
                  <div className="flex items-start gap-3.5">
                    <MaterialSymbol name={reason.icon} className="mt-0.5 text-[1.15rem] text-brand-accent-soft" />
                    <div className="space-y-2">
                      <h3 className="text-[1.08rem] font-semibold tracking-tight text-white md:text-[1.15rem]">
                        {reason.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/78 md:text-[0.985rem]">{reason.body}</p>
                    </div>
                  </div>
                </article>
              ))}
            </Stagger>

            <Reveal variant="fade-up" once className="lg:col-span-5">
              <div className="relative min-h-[min(52vh,22rem)] overflow-hidden rounded-[var(--rounded-lg)] border border-border/70 md:min-h-[24rem] lg:min-h-[26rem]">
                <ImageHoverZoom className="absolute inset-0 h-full w-full">
                  <Image
                    src={data.whyUsAsideSrc}
                    alt={data.whyUsAsideAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </ImageHoverZoom>
                <div className="absolute inset-0 bg-black/18" aria-hidden />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 bg-white text-foreground">
        <Container className="euromiti-section">
          <Reveal variant="fade-up" once>
            <h2 className="mb-8 text-center font-heading text-[clamp(1.7rem,3.2vw,2.4rem)] font-bold tracking-tight text-foreground md:mb-10">
              Core Values
            </h2>
            <div className="-mt-4 mb-8 flex justify-center md:mb-10">
              <span className="h-[3px] w-24 rounded-full bg-linear-to-r from-brand-red-vivid via-secondary to-brand-red-vivid/40" />
            </div>
          </Reveal>
          <Stagger once className="grid gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
            {data.values.map((value, index) => (
              <article key={`${value.title}-${index}`} className="flex flex-col items-center text-center">
                <span className="inline-flex size-11 items-center justify-center rounded-full border border-brand-red-vivid/25 bg-brand-red-vivid/10">
                  <MaterialSymbol name={value.icon_material} className="text-[1.2rem] text-secondary" />
                </span>
                <h3 className="mt-4 text-xl font-semibold text-foreground">{value.title}</h3>
                <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-muted-foreground md:text-base">{value.body}</p>
              </article>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="border-t border-border/60 bg-brand-shell text-white">
        <Container className="euromiti-section">
          <SectionReveal variant="fade-up" once>
            <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="space-y-4 lg:col-span-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Contact</p>
                <h2 className="font-heading text-[clamp(1.8rem,3.4vw,2.7rem)] font-bold tracking-tight text-white">
                  Partnerships & enquiries
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-white/78 md:text-base">
                  Reach the Euromiti team for corporate fuel accounts, leasing, procurement, restaurant bookings, or media
                  requests.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    variant="secondary"
                    render={<Link href="/contact" />}
                    className={cn(EuromitiMotionClasses.buttonHover)}
                  >
                    Contact us
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative min-h-[260px] overflow-hidden rounded-[var(--rounded-lg)] border border-white/15">
                  <ImageHoverZoom className="absolute inset-0 h-full w-full">
                    <Image
                      src={data.partnershipAsideSrc}
                      alt={data.partnershipAsideAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 38vw"
                      className="object-cover"
                    />
                  </ImageHoverZoom>
                  <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/28 to-transparent" aria-hidden />
                </div>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>
    </>
  )
}
