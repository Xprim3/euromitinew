import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Container } from "@/components/layout/Container"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionReveal } from "@/components/motion/SectionReveal"
import { Button } from "@/components/ui/button"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { applyHref, applyLabel, getActiveJobBySlugPublic, textArrayFromJson } from "@/lib/data/careers-public"
import { formatNewsDate } from "@/lib/format-news-date"

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 120

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const job = await getActiveJobBySlugPublic(slug)
  if (!job) return { title: "Careers" }
  return {
    title: job.title,
    description: job.summary ?? `Apply for ${job.title} at Euromiti.`,
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

  return (
    <>
      <PageHeader
        title={job.title}
        breadcrumbs={
          <>
            <Link href="/">Home</Link>
            <span className="px-2 text-muted-foreground/80">/</span>
            <Link href="/careers">Careers</Link>
            <span className="px-2 text-muted-foreground/80">/</span>
            <span className="text-foreground line-clamp-1">{job.title}</span>
          </>
        }
      />

      <section className="bg-brand-surface-tinted">
        <Container className="euromiti-section">
          <SectionReveal once variant="fade-up">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <article className="rounded-lg border border-border/70 bg-background p-6 shadow-(--shadow-euromiti-soft) md:p-8 lg:col-span-8">
                <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  <span>{job.location_city ?? "Multiple locations"}</span>
                  {job.posted_at ? (
                    <>
                      <span aria-hidden>·</span>
                      <span>{formatNewsDate(job.posted_at)}</span>
                    </>
                  ) : null}
                </div>

                <div className="mt-8 space-y-10">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-foreground">About the role</h2>
                    <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {description.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="font-heading text-xl font-bold text-foreground">Requirements</h2>
                    <ul className="mt-4 space-y-3 text-sm text-muted-foreground md:text-base">
                      {requirements.map((item, index) => (
                        <li key={index} className="flex gap-2.5">
                          <MaterialSymbol name="check_circle" className="mt-0.5 text-[1rem] text-success" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>

              <aside className="lg:col-span-4">
                <div className="sticky top-28 rounded-lg border border-border/70 bg-card p-6 shadow-(--shadow-euromiti-soft)">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Apply</p>
                  <h2 className="mt-3 font-heading text-xl font-bold text-foreground">Interested in this role?</h2>
                  {job.apply_instructions ? (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {job.apply_instructions}
                    </p>
                  ) : null}
                  <dl className="mt-6 space-y-4 text-sm">
                    {job.apply_email ? (
                      <div>
                        <dt className="font-semibold text-foreground">Email</dt>
                        <dd className="mt-1 break-all text-muted-foreground">{job.apply_email}</dd>
                      </div>
                    ) : null}
                    {job.apply_phone ? (
                      <div>
                        <dt className="font-semibold text-foreground">Phone</dt>
                        <dd className="mt-1 text-muted-foreground">{job.apply_phone}</dd>
                      </div>
                    ) : null}
                  </dl>
                  {href ? (
                    <Button className="mt-6 w-full" variant="default" render={<a href={href} />}>
                      {label}
                    </Button>
                  ) : null}
                  <Button className="mt-3 w-full" variant="outlinePrimary" render={<Link href="/careers" />}>
                    Back to careers
                  </Button>
                </div>
              </aside>
            </div>
          </SectionReveal>
        </Container>
      </section>
    </>
  )
}
