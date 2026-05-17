import Link from "next/link"

import { JobApplicationForm } from "@/components/careers/JobApplicationForm"
import { Container } from "@/components/layout/Container"
import { PageImageHero } from "@/components/layout/PageImageHero"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { SectionReveal } from "@/components/motion/SectionReveal"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { homeHeroDesign } from "@/data/mock/homepage-visual"
import type { JobApplicationOption } from "@/lib/data/careers-public"

type CareersPageViewProps = {
  positions: JobApplicationOption[]
  defaultPositionSlug?: string
}

const APPLY_STEPS = [
  {
    title: "Zgjidhni lokacionin dhe pozicionin",
    body: "Së pari zgjidhni qytetin ose zonën, pastaj rolin që ju intereson — karburant, restorant, market, lavazh ose operacione.",
  },
  {
    title: "Plotësoni të dhënat",
    body: "Emri i plotë, email-i dhe telefoni janë të detyrueshëm që ekipi ynë t’ju kontaktojë.",
  },
  {
    title: "Ngarkoni CV-në",
    body: "PDF, Word (.doc, .docx), RTF ose ODT — deri në 5 MB. Mesazhi shoqërues është opsional.",
  },
  {
    title: "Prisni përgjigjen",
    body: "Çdo aplikim shqyrtohet nga ekipi i punësimit. Do t’ju kontaktojmë nëse profili juaj përputhet.",
  },
] as const

export function CareersPageView({ positions, defaultPositionSlug }: CareersPageViewProps) {
  return (
    <>
      <PageImageHero
        imageSrc={homeHeroDesign.imageSrc}
        imageAlt="Euromiti — karriera dhe operacione"
        trail={[{ label: "Ballina", href: "/" }, { label: "Karriera" }]}
        title="Karriera"
        visualPreset="flat-heavy"
        priority
      />

      <section id="apliko" className="scroll-mt-24 border-t border-border/50 bg-brand-surface-tinted">
        <Container className="euromiti-section">
          <SectionReveal once variant="fade-up">
            <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
              <div className="min-w-0 md:max-w-xl md:pr-4 lg:pr-8">
                <SectionHeading
                  align="left"
                  label="Punësim"
                  title="Si të aplikoni"
                  description="Formulari i aplikimit është gjithmonë i hapur. Ndiqni hapat më poshtë dhe dërgoni aplikimin tuaj në pak minuta."
                />
                <SectionAccentRule className="mt-6 max-w-24 md:mt-8" />

                <ol className="mt-8 space-y-6 sm:mt-10">
                  {APPLY_STEPS.map((step, index) => (
                    <li key={step.title} className="flex gap-4">
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background font-heading text-sm font-bold text-secondary shadow-(--shadow-euromiti-soft)"
                        aria-hidden
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <h3 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <p className="mt-8 border-border/60 border-t pt-8 text-sm leading-relaxed text-muted-foreground">
                  Keni pyetje para se të aplikoni?{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-foreground underline-offset-4 transition-colors hover:text-brand-red-vivid hover:underline"
                  >
                    Na kontaktoni
                  </Link>
                  .
                </p>
              </div>

              <div className="min-w-0 md:sticky md:top-28">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary md:sr-only">Formulari</p>
                <h2 className="font-heading text-xl font-bold tracking-tight text-foreground md:sr-only">Apliko online</h2>
                <div className="rounded-xl border border-border/70 bg-card p-5 shadow-(--shadow-euromiti-soft) sm:p-6 md:p-7 lg:p-8">
                  <p className="mb-6 hidden text-sm leading-relaxed text-muted-foreground md:block">
                    Plotësoni fushat dhe dërgoni aplikimin. Të dhënat përdoren vetëm për procesin e rekrutimit.
                  </p>
                  <JobApplicationForm positions={positions} defaultSlug={defaultPositionSlug} />
                </div>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>
    </>
  )
}
