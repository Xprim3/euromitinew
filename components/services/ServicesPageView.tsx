import Image from "next/image"
import Link from "next/link"

import { Container } from "@/components/layout/Container"
import { PageImageHero } from "@/components/layout/PageImageHero"
import { SectionHeading } from "@/components/layout/SectionHeading"
import {
  EuromitiMotionClasses,
  ImageHoverZoom,
  Reveal,
  SectionReveal,
  Stagger,
} from "@/components/motion"
import { Button } from "@/components/ui/button"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import type { ResolvedServicesPage } from "@/lib/data/services-content-public"
import { cn } from "@/lib/utils"

const WHY_CHOOSE = [
  {
    icon: "shield_with_heart",
    title: "Reliable service",
    body: "Dependable fuel and support 24/7.",
  },
  {
    icon: "diamond",
    title: "Premium experience",
    body: "Luxury at every stop on your journey.",
  },
  {
    icon: "map",
    title: "Multiple locations",
    body: "Strategic hubs across Kosovo.",
  },
  {
    icon: "flatware",
    title: "Quality food",
    body: "Fresh meals for the discerning traveler.",
  },
  {
    icon: "colors_spark",
    title: "Clean facilities",
    body: "Pristine carwash and market areas.",
  },
] as const

export type ServicesPageViewProps = {
  data: ResolvedServicesPage
}

export function ServicesPageView({ data }: ServicesPageViewProps) {
  return (
    <>
      <PageImageHero
        imageSrc={data.heroImageSrc}
        imageAlt={data.heroImageAlt}
        trail={[{ label: "Home", href: "/" }, { label: "Services" }]}
        title={data.heroTitle}
        description={data.heroSubtitle}
        visualPreset="flat-heavy"
        priority
      />

      {data.sections.map((service, index) => {
        const reversed = index % 2 === 1
        return (
          <section key={service.id} className={index % 2 === 0 ? "bg-background" : "bg-muted"}>
            <Container className="euromiti-section">
              <Reveal variant="fade-up" once>
                <div className="grid items-center gap-7 lg:grid-cols-12 lg:gap-11">
                  <div className={reversed ? "lg:col-span-7 lg:order-2" : "lg:col-span-7"}>
                    <div className="relative min-h-[220px] overflow-hidden rounded-[var(--rounded-lg)] border border-border/70 md:min-h-[280px] lg:min-h-[360px]">
                      <ImageHoverZoom className="absolute inset-0 h-full w-full">
                        <Image
                          src={service.imageSrc}
                          alt={service.imageAlt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 58vw"
                          className="object-cover"
                        />
                      </ImageHoverZoom>
                      <div className="absolute inset-0 bg-black/10" aria-hidden />
                    </div>
                  </div>

                  <div className={reversed ? "space-y-5 lg:col-span-5 lg:order-1" : "space-y-5 lg:col-span-5"}>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                        <MaterialSymbol name={service.icon} className="text-[1.2rem]" />
                      </span>
                      <h2 className="font-heading text-[clamp(1.6rem,3vw,2.35rem)] font-bold tracking-tight text-foreground">
                        {service.title}
                      </h2>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{service.description}</p>
                    <ul className="space-y-2">
                      {service.highlights.map((highlight, hIdx) => (
                        <li
                          key={`${service.id}-h-${hIdx}`}
                          className="flex items-start gap-2.5 text-sm text-foreground/85 md:text-base"
                        >
                          <MaterialSymbol name="check_circle" className="mt-0.5 text-[1rem] text-success" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </Container>
          </section>
        )
      })}

      <section className="bg-primary text-primary-foreground">
        <Container className="euromiti-section">
          <Reveal variant="fade-up" once>
            <div className="mb-9 space-y-3 text-center md:mb-12">
              <SectionHeading
                headingId="services-why-heading"
                title="Why Choose Euromiti"
                align="center"
                invert
                className="[&>div]:max-w-none"
              />
              <div className="mx-auto h-1 w-20 rounded-full bg-accent" aria-hidden />
            </div>
          </Reveal>
          <Stagger once className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {WHY_CHOOSE.map((item) => (
              <article
                key={item.title}
                className="flex flex-col items-center rounded-[var(--rounded-lg)] border border-primary-foreground/12 bg-primary-foreground/6 p-5 text-center md:p-6"
              >
                <div className="mb-3 flex items-center gap-2">
                  <MaterialSymbol name={item.icon} className="text-[1.5rem] text-accent" />
                  <h3 className="text-sm font-bold uppercase tracking-wide text-primary-foreground">{item.title}</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-primary-foreground/70">{item.body}</p>
              </article>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="bg-muted">
        <Container className="euromiti-section">
          <SectionReveal variant="fade-up" once>
            <div className="rounded-[var(--rounded-lg)] border border-border/70 bg-card p-6 shadow-(--shadow-euromiti-soft) md:p-8">
              <SectionHeading
                headingId="services-nearest-location"
                title="Find the Nearest Euromiti Location"
                description="Explore our stations across Prishtina, Ferizaj, and Gjilan to find the service mix you need, exactly where you need it."
                actions={
                  <Button
                    variant="default"
                    render={<Link href="/locations" />}
                    className={cn(EuromitiMotionClasses.buttonHover)}
                  >
                    View All Locations
                  </Button>
                }
              />
            </div>
          </SectionReveal>
        </Container>
      </section>
    </>
  )
}
