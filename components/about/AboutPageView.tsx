import Image from "next/image"
import Link from "next/link"

import { Container } from "@/components/layout/Container"
import { PageImageHero } from "@/components/layout/PageImageHero"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { EuromitiMotionClasses, ImageHoverZoom, Reveal, SectionReveal, Stagger } from "@/components/motion"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { Button } from "@/components/ui/button"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import type { ResolvedAboutPage } from "@/lib/data/about-content-public"
import { cn } from "@/lib/utils"

export function AboutPageView({ data }: { data: ResolvedAboutPage }) {
  return (
    <>
      <PageImageHero
        imageSrc={data.heroImageSrc}
        imageAlt={data.heroImageAlt}
        trail={[{ label: "Ballina", href: "/" }, { label: "Rreth nesh" }]}
        title={data.heroTitle}
        description={data.heroSubtitle}
        priority
      />

      <section className="bg-background">
        <div
          className="pointer-events-none absolute inset-x-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
          aria-hidden
        />
        <Container className="py-10 sm:py-12 md:py-16 lg:py-20">
          <SectionReveal variant="fade-up" once>
            <div className="grid items-start gap-7 md:gap-10 lg:grid-cols-12 lg:items-center lg:gap-14 xl:gap-20">
              <div className="relative lg:col-span-5">
                <div className="relative h-[min(78vw,22rem)] w-full overflow-hidden rounded-[1.25rem] bg-muted shadow-[0_20px_60px_-48px_rgba(15,27,45,0.6)] sm:h-[24rem] sm:rounded-[1.5rem] md:h-[28rem] lg:aspect-4/5 lg:h-auto lg:rounded-[1.75rem]">
                  <ImageHoverZoom className="absolute inset-0 h-full w-full">
                    <Image
                      src={data.storyImageSrc}
                      alt={data.storyImageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                    />
                  </ImageHoverZoom>
                  <div className="absolute inset-0 bg-linear-to-t from-black/18 via-transparent to-transparent" aria-hidden />
                </div>
              </div>

              <div className="space-y-5 md:space-y-6 lg:col-span-7">
                <div className="max-w-3xl">
                  <h2
                    id="about-story-heading"
                    className="font-[family-name:var(--font-montserrat)] text-[clamp(1.65rem,8vw,2.45rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-foreground md:text-[clamp(2rem,4vw,3.2rem)] md:leading-[1.04] md:tracking-[-0.055em]"
                  >
                    Kush jemi
                  </h2>
                  <SectionAccentRule className="mt-4 md:mt-6" />
                </div>

                <div className="max-w-3xl space-y-3 text-[0.95rem] leading-[1.75] text-muted-foreground sm:text-base md:space-y-4 md:text-[1.05rem] md:leading-[1.85]">
                  {data.storyParagraphs.map((p) => (
                    <p key={`${p.slice(0, 48)}-${p.length}`}>
                      {p}
                    </p>
                  ))}
                </div>

                <div className="max-w-3xl border-t border-border/70 pt-5 md:pt-6">
                  <div className="rounded-[1.5rem] bg-brand-shell px-4 py-4 text-white shadow-[0_18px_50px_-42px_rgba(15,27,45,0.7)] sm:px-5">
                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-brand-accent-soft">
                      Standard i qëndrueshëm
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/82 sm:text-[0.95rem]">
                      Çdo ndalesë është ndërtuar për të qenë e pastër, e shpejtë dhe komode - nga karburanti deri te
                      restoranti, marketi dhe kujdesi për veturën.
                    </p>
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
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Misioni dhe vizioni</p>
                <h2
                  id="about-purpose-heading"
                  className="font-heading text-[1.9rem] font-bold leading-[1.15] tracking-tight text-white md:text-[2.45rem]"
                >
                  Drejtimi pas çdo vendimi në stacion
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-white/75 md:text-base lg:col-span-5">
                Një standard i qartë për karburantin, mikpritjen dhe cilësinë e shërbimit në çdo lokacion të Euromitit.
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

        </Container>
      </section>

      <section className="bg-background">
        <Container className="euromiti-section">
          <SectionHeading
            label={data.offerLabel}
            headingId="about-offer-heading"
            title={data.offerTitle}
            description={data.offerDescription}
            fullWidth
            className="mb-8 md:mb-11"
          />

          <div className="grid gap-4 md:gap-5">
            {data.offerCards[0] ? (
              <Reveal variant="fade-up" once>
                <article className="group relative min-h-[240px] overflow-hidden rounded-[var(--rounded-lg)] border border-border/70 md:min-h-[300px]">
                  <div className="absolute inset-0">
                    <ImageHoverZoom className="absolute inset-0 h-full w-full">
                      <Image
                        src={data.offerCards[0].imageSrc}
                        alt={data.offerCards[0].imageAlt}
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                    </ImageHoverZoom>
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent" aria-hidden />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                    <h3 className="text-[1.28rem] font-bold tracking-tight text-white md:text-[1.65rem]">
                      {data.offerCards[0].title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/82 md:text-[0.9375rem]">
                      {data.offerCards[0].body}
                    </p>
                  </div>
                </article>
              </Reveal>
            ) : null}

            <Stagger once className="grid gap-4 sm:grid-cols-2 md:gap-5">
              {data.offerCards.slice(1).map((item) => (
                <article
                  key={item.title}
                  className="group relative min-h-[190px] overflow-hidden rounded-[var(--rounded-lg)] border border-border/70 md:min-h-[210px]"
                >
                  <ImageHoverZoom className="absolute inset-0 h-full w-full">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
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
              ))}
            </Stagger>
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 bg-brand-shell text-white">
        <Container className="euromiti-section">
          <Reveal variant="fade-up" once>
            <h2 className="mb-8 font-heading text-[clamp(1.7rem,3.2vw,2.4rem)] font-bold tracking-tight text-white md:mb-10">
              {data.whyChooseHeading}
            </h2>
          </Reveal>
          <div className="grid gap-7 lg:grid-cols-12 lg:gap-9">
            <Stagger once className="grid gap-6 md:grid-cols-2 lg:col-span-7 lg:gap-9">
              {data.whyChooseReasons.map((reason) => (
                <article key={reason.title} className="border-b border-white/20 pb-5">
                  <div className="flex items-start gap-3.5">
                    <MaterialSymbol name={reason.icon_material} className="mt-0.5 text-[1.15rem] text-brand-accent-soft" />
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
              Vlerat kryesore
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
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Kontakti</p>
                <h2 className="font-heading text-[clamp(1.8rem,3.4vw,2.7rem)] font-bold tracking-tight text-white">
                  Partneritete dhe kërkesa
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-white/78 md:text-base">
                  Kontaktoni ekipin e Euromitit për llogari korporative karburanti, qira, furnizime, rezervime në
                  restaurant ose kërkesa mediatike.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    variant="secondary"
                    render={<Link href="/contact" />}
                    className={cn(EuromitiMotionClasses.buttonHover)}
                  >
                    Na kontaktoni
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
