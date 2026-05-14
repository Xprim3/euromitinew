import Link from "next/link"

import { Container } from "@/components/layout/Container"
import { PageImageHero } from "@/components/layout/PageImageHero"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { SectionReveal } from "@/components/motion/SectionReveal"
import { Stagger } from "@/components/motion/Stagger"
import { Button } from "@/components/ui/button"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { homeHeroDesign } from "@/data/mock/homepage-visual"
import { formatNewsDate } from "@/lib/format-news-date"
import type { JobRow } from "@/types/supabase-cms"
import { cn } from "@/lib/utils"

export function CareersPageView({ jobs }: { jobs: JobRow[] }) {
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

      <section className="border-t border-border/60 bg-background">
        <Container className="euromiti-section">
          <SectionReveal once variant="fade-up">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <SectionHeading
                align="center"
                label="Pozicionet e hapura"
                title="Bëhu pjesë e ekipit Euromiti"
                description="Pozicionet aktive shfaqen këtu automatikisht. Hapni një rol për detajet dhe për të aplikuar online me dokument CV (PDF, Word, RTF ose ODT)."
              />
              <SectionAccentRule className="mt-6 w-28 md:mt-8" />
            </div>
          </SectionReveal>
        </Container>
      </section>

      <section className="border-t border-border/50 bg-brand-surface-tinted">
        <Container className="euromiti-section">
          {jobs.length === 0 ? (
            <SectionReveal once variant="fade-up">
              <div className="mx-auto max-w-xl rounded-xl border border-border/70 bg-card px-5 py-10 text-center shadow-(--shadow-euromiti-soft) sm:px-8 sm:py-12">
                <h2 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Nuk ka pozicione të hapura për momentin
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Na vizitoni përsëri së shpejti ose na shkruani përmes faqes së kontaktit për mundësi të ardhshme.
                </p>
                <Button className="mt-8 w-full max-w-xs sm:w-auto" variant="outlinePrimary" render={<Link href="/contact" />}>
                  Kontakti
                </Button>
              </div>
            </SectionReveal>
          ) : (
            <SectionReveal once variant="fade-up">
              <Stagger
                once
                className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:gap-8"
              >
                {jobs.map((job) => {
                  const jobHref = `/careers/${job.slug}`
                  return (
                    <div
                      key={job.id}
                      className={cn(
                        "flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border/70 bg-background shadow-(--shadow-euromiti-soft) md:min-h-40",
                        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
                      )}
                    >
                      <Link
                        href={jobHref}
                        className="flex min-h-0 flex-1 flex-col p-5 pb-4 outline-none sm:p-6 sm:pb-4 md:p-7 md:pb-5"
                      >
                        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
                          <span>{job.location_city ?? "Shumë lokacione"}</span>
                          {job.posted_at ? (
                            <>
                              <span aria-hidden className="text-border">
                                ·
                              </span>
                              <time dateTime={job.posted_at}>{formatNewsDate(job.posted_at)}</time>
                            </>
                          ) : null}
                        </p>
                        <h3 className="mt-3 font-heading text-lg font-bold leading-snug tracking-tight text-foreground sm:text-xl md:text-2xl">
                          {job.title}
                          <span className="sr-only"> — detaje dhe aplikim</span>
                        </h3>
                        {job.summary ? (
                          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            {job.summary}
                          </p>
                        ) : (
                          <div className="flex-1" aria-hidden />
                        )}
                      </Link>
                      <div className="border-border/60 border-t px-5 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4 md:px-7 md:pb-7">
                        <Button
                          variant="default"
                          className="w-full gap-2 sm:w-auto"
                          render={<Link href={jobHref} />}
                        >
                          Shiko rolin
                          <MaterialSymbol name="arrow_forward" className="text-lg!" aria-hidden />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </Stagger>
            </SectionReveal>
          )}
        </Container>
      </section>
    </>
  )
}
