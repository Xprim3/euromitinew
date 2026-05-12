import type { Metadata } from "next"
import Link from "next/link"

import { Container } from "@/components/layout/Container"
import { PageImageHero } from "@/components/layout/PageImageHero"
import { SectionReveal } from "@/components/motion/SectionReveal"
import { Button } from "@/components/ui/button"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { homeHeroDesign } from "@/data/mock/homepage-visual"
import { getActiveJobsPublic } from "@/lib/data/careers-public"
import { formatNewsDate } from "@/lib/format-news-date"

export const dynamic = "force-dynamic"

export const revalidate = 120

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles across Euromiti petrol, restaurant, carwash, market, and operations teams.",
}

export default async function CareersPage() {
  const jobs = await getActiveJobsPublic()

  return (
    <>
      <PageImageHero
        imageSrc={homeHeroDesign.imageSrc}
        imageAlt="Euromiti careers and operations"
        trail={[{ label: "Home", href: "/" }, { label: "Careers" }]}
        title="Careers"
        description="Join the Euromiti teams serving drivers, guests, and partners across Kosovo."
        visualPreset="flat-heavy"
        priority
      />

      <section className="bg-brand-surface-tinted">
        <Container className="euromiti-section">
          <SectionReveal once variant="fade-up">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">Open positions</p>
              <h2 className="mt-3 font-heading text-[clamp(1.8rem,3.4vw,2.75rem)] font-bold tracking-tight text-foreground">
                Build the next Euromiti experience
              </h2>
              <p className="mt-4 text-muted-foreground">
                Active jobs are managed from the admin Careers section and appear here automatically.
              </p>
            </div>
          </SectionReveal>

          <div className="mt-10 grid gap-5 md:mt-12">
            {jobs.length === 0 ? (
              <SectionReveal once variant="fade-up">
                <div className="mx-auto max-w-xl rounded-lg border border-border/70 bg-card px-6 py-10 text-center shadow-(--shadow-euromiti-soft)">
                  <h3 className="font-heading text-xl font-bold text-foreground">No open roles right now</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Please check back soon or contact our team for future opportunities.
                  </p>
                  <Button className="mt-6" variant="outlinePrimary" render={<Link href="/contact" />}>
                    Contact us
                  </Button>
                </div>
              </SectionReveal>
            ) : (
              jobs.map((job) => (
                <SectionReveal key={job.id} once variant="fade-up">
                  <article className="rounded-lg border border-border/70 bg-background p-6 shadow-(--shadow-euromiti-soft) md:p-7">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div className="max-w-3xl">
                        <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          <span>{job.location_city ?? "Multiple locations"}</span>
                          {job.posted_at ? (
                            <>
                              <span aria-hidden>·</span>
                              <span>{formatNewsDate(job.posted_at)}</span>
                            </>
                          ) : null}
                        </p>
                        <h3 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground">
                          {job.title}
                        </h3>
                        {job.summary ? (
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                            {job.summary}
                          </p>
                        ) : null}
                      </div>
                      <Button
                        variant="default"
                        className="shrink-0"
                        render={<Link href={`/careers/${job.slug}`} />}
                      >
                        View role
                        <MaterialSymbol name="arrow_forward" className="text-lg!" />
                      </Button>
                    </div>
                  </article>
                </SectionReveal>
              ))
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
