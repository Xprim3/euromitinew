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
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import type { ResolvedServicesPage } from "@/lib/data/services-content-public"
import { cn } from "@/lib/utils"

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

      <section className="relative overflow-hidden bg-brand-shell-deep text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,180,171,0.12),transparent_34%),linear-gradient(135deg,var(--brand-shell-deep)_0%,var(--brand-shell)_52%,var(--brand-primary-hover)_100%)]"
          aria-hidden
        />
        <Container className="relative euromiti-section">
          <div className="grid grid-cols-1 gap-9 lg:grid-cols-12 lg:gap-12">
            <Reveal variant="fade-up" once className="lg:col-span-4">
              <div className="max-w-xl">
                <p className="mb-4 text-[0.64rem] font-black uppercase tracking-[0.32em] text-brand-accent-soft">
                  {data.whyChoose.kicker}
                </p>
                <h2
                  id="services-why-heading"
                  className="font-(family-name:--font-montserrat) text-[clamp(2rem,8vw,2.75rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-white sm:text-[clamp(2.35rem,4.8vw,3.5rem)]"
                >
                  {data.whyChoose.title}
                </h2>
                <p className="mt-5 text-[0.98rem] leading-8 text-white/70">
                  {data.whyChoose.body}
                </p>
                <SectionAccentRule className="mt-6" />
              </div>
            </Reveal>

            <div className="lg:col-span-8">
              <Stagger once className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
                <article className="relative overflow-hidden rounded-[1.1rem] border border-white/12 bg-white/8 p-6 shadow-[0_22px_55px_rgba(0,0,0,0.2)] backdrop-blur-md md:p-7">
                  <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(255,180,171,0.18),transparent_34%)]"
                    aria-hidden
                  />
                  <div className="relative">
                    <span className="inline-flex size-12 items-center justify-center rounded-full border border-white/14 bg-white/8 text-brand-accent-soft">
                      <MaterialSymbol name={data.whyChoose.featuredIcon} className="text-[1.45rem]" />
                    </span>
                    <h3 className="mt-6 font-(family-name:--font-montserrat) text-2xl font-extrabold leading-tight tracking-[-0.04em] text-white md:text-3xl">
                      {data.whyChoose.featuredTitle}
                    </h3>
                    <p className="mt-4 max-w-md text-[0.98rem] leading-8 text-white/68">
                      {data.whyChoose.featuredBody}
                    </p>
                  </div>
                </article>

                <div className="rounded-[1.1rem] border border-white/12 bg-white/6 p-2 shadow-[0_22px_55px_rgba(0,0,0,0.16)] backdrop-blur-md">
                  <div className="divide-y divide-white/10">
                    {data.whyChoose.cards.map((item) => (
                      <article key={item.title} className="grid grid-cols-[auto_1fr] gap-4 px-4 py-4 sm:px-5">
                        <span className="mt-1 inline-flex size-9 items-center justify-center rounded-full bg-white/8 text-brand-accent-soft">
                          <MaterialSymbol name={item.icon} className="text-[1.15rem]" />
                        </span>
                        <div>
                          <h3 className="font-(family-name:--font-montserrat) text-[0.78rem] font-extrabold uppercase tracking-[0.14em] text-white">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-white/62">{item.body}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </Stagger>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-muted">
        <Container className="euromiti-section">
          <SectionReveal variant="fade-up" once>
            <div className="rounded-[var(--rounded-lg)] border border-border/70 bg-card p-6 shadow-(--shadow-euromiti-soft) md:p-8">
              <SectionHeading
                headingId="services-nearest-location"
                title="Gjeni lokacionin më të afërt të Euromitit"
                description="Shikoni stacionet tona në Prishtinë, Ferizaj dhe Gjilan për të gjetur shërbimet që ju duhen, pikërisht aty ku ju përshtatet."
                actions={
                  <Button
                    variant="default"
                    render={<Link href="/locations" />}
                    className={cn(EuromitiMotionClasses.buttonHover)}
                  >
                    Shiko të gjitha lokacionet
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
