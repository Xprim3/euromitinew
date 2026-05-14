import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { JobApplicationForm } from "@/components/careers/JobApplicationForm"
import { Container } from "@/components/layout/Container"
import { PageImageHero } from "@/components/layout/PageImageHero"
import { SectionReveal } from "@/components/motion/SectionReveal"
import { Button } from "@/components/ui/button"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { homeHeroDesign } from "@/data/mock/homepage-visual"
import { applyHref, applyLabel, getActiveJobBySlugPublic, textArrayFromJson } from "@/lib/data/careers-public"
import { formatNewsDate } from "@/lib/format-news-date"
import { telHrefFromDisplayPhone } from "@/lib/utils"

type Props = { params: Promise<{ slug: string }> }

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const job = await getActiveJobBySlugPublic(slug)
  if (!job) return { title: "Karriera" }
  return {
    title: job.title,
    description: job.summary ?? `Aplikoni për ${job.title} në Euromiti.`,
  }
}

export default async function CareerDetailPage({ params }: Props) {
  const { slug } = await params
  const job = await getActiveJobBySlugPublic(slug)
  if (!job) notFound()

  const description = textArrayFromJson(job.description)
  const requirements = textArrayFromJson(job.requirements)
  const href = applyHref(job)
  const label = applyLabel(job)
  const phoneHref = job.apply_phone ? telHrefFromDisplayPhone(job.apply_phone) : null
  const hasAlternateApply =
    Boolean(job.apply_instructions?.trim()) ||
    Boolean(job.apply_email?.trim()) ||
    Boolean(job.apply_phone?.trim()) ||
    Boolean(href)

  return (
    <>
      <PageImageHero
        imageSrc={homeHeroDesign.imageSrc}
        imageAlt="Euromiti — karriera dhe operacione"
        title={job.title}
        visualPreset="flat-heavy"
        priority
        trail={[
          { label: "Ballina", href: "/" },
          { label: "Karriera", href: "/careers" },
        ]}
      />

      <section className="border-t border-border/60 bg-background py-16 md:py-20 lg:py-24">
        <Container>
          <SectionReveal once variant="fade-up">
            <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16">
              <article className="lg:col-span-7">
                <nav aria-label="Navigim karriere" className="mb-7 border-border/50 border-b pb-7 sm:mb-9 sm:pb-8">
                  <Link
                    href="/careers"
                    className="inline-block text-base font-semibold tracking-tight text-foreground underline-offset-[6px] transition-colors hover:text-brand-red-vivid hover:underline sm:text-lg"
                  >
                    ← Kthehu te karriera
                  </Link>
                </nav>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  <span>{job.location_city ?? "Shumë lokacione"}</span>
                  {job.posted_at ? (
                    <>
                      <span aria-hidden>·</span>
                      <time dateTime={job.posted_at}>{formatNewsDate(job.posted_at)}</time>
                    </>
                  ) : null}
                </div>
                <SectionAccentRule className="mt-5 max-w-24 sm:mt-6" />

                <div className="mt-8 space-y-10 sm:mt-10 sm:space-y-12">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">Rreth pozicionit</h2>
                    <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {description.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">Kërkesat</h2>
                    <ul className="mt-4 space-y-3 text-sm text-muted-foreground md:text-base">
                      {requirements.map((item, index) => (
                        <li key={index} className="flex gap-2.5">
                          <MaterialSymbol name="check_circle" className="mt-0.5 shrink-0 text-[1rem] text-success" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>

              <div className="lg:col-span-5">
                <div className="rounded-xl border border-border/70 bg-card p-5 shadow-(--shadow-euromiti-soft) sm:p-6 md:p-7 lg:sticky lg:top-28 lg:max-h-[min(100vh-7rem,56rem)] lg:overflow-y-auto">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Apliko online</p>
                  <h2 className="mt-3 font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    Dërgo aplikimin tënd
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Plotësoni të dhënat dhe ngarkoni CV-në në PDF. Të dhënat përdoren vetëm për procesin e rekrutimit.
                  </p>
                  <SectionAccentRule className="mt-5 max-w-24 sm:mt-6" />

                  {hasAlternateApply ? (
                    <div className="mt-6 space-y-3 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-foreground">
                        Mundësi të tjera aplikimi
                      </p>
                      {job.apply_instructions ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{job.apply_instructions}</p>
                      ) : null}
                      {job.apply_email ? (
                        <p>
                          <span className="font-semibold text-foreground">Email: </span>
                          <a
                            className="break-all font-medium text-primary underline-offset-2 hover:underline"
                            href={`mailto:${job.apply_email}`}
                          >
                            {job.apply_email}
                          </a>
                        </p>
                      ) : null}
                      {job.apply_phone ? (
                        <p>
                          <span className="font-semibold text-foreground">Telefoni: </span>
                          {phoneHref ? (
                            <a className="font-medium text-primary underline-offset-2 hover:underline" href={phoneHref}>
                              {job.apply_phone}
                            </a>
                          ) : (
                            job.apply_phone
                          )}
                        </p>
                      ) : null}
                      {href ? (
                        <Button className="mt-1 w-full sm:w-auto" variant="outlinePrimary" size="sm" render={<a href={href} />}>
                          {label}
                        </Button>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="mt-6 sm:mt-8">
                    <JobApplicationForm jobSlug={job.slug} />
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>
    </>
  )
}
