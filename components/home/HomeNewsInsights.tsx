import Image from "next/image"
import Link from "next/link"

import { Stagger } from "@/components/motion"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { homeNewsInsightsDesign } from "@/data/mock/homepage-visual"
import { getLatestNewsForHomePublic } from "@/lib/data/news-public"
import type { NewsSummary } from "@/types/public"
import { cn } from "@/lib/utils"

const BADGE_BY_SLUG: Record<string, { label: string; className: string }> = {
  "expansion-in-prishtina": { label: "Network update", className: "bg-black text-white" },
  "path-to-zero-emissions": { label: "Sustainability", className: "bg-green-600 text-white" },
  "premium-diesel-launch": { label: "Innovation", className: "bg-black text-white" },
}

function badgeForHomeNews(item: NewsSummary): { label: string; className: string } {
  const fromSlug = BADGE_BY_SLUG[item.slug]
  if (fromSlug) return fromSlug
  const cat = item.category ?? "Company Updates"
  const label = item.teaserLabel ?? cat
  if (cat === "Sustainability") return { label, className: "bg-green-600 text-white" }
  if (cat === "Innovation" || cat === "Community") return { label, className: "bg-black text-white" }
  return { label, className: "bg-white text-black" }
}

export async function HomeNewsInsights() {
  const previewItems = await getLatestNewsForHomePublic(2)
  const n = homeNewsInsightsDesign

  if (!previewItems.length) {
    return (
      <section
        className="overflow-hidden bg-brand-shell px-4 py-11 sm:px-6 md:py-14 lg:px-12"
        aria-labelledby="insights-heading"
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-8 text-center md:mb-11">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.34em] text-brand-accent-soft">Latest news</p>
            <h2
              id="insights-heading"
              className="mt-3 font-[family-name:var(--font-montserrat)] text-[1.65rem] font-extrabold tracking-tight text-white sm:text-[1.85rem] md:text-[2.15rem]"
            >
              {n.title}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base font-medium text-white/75">{n.subtitle}</p>
            <SectionAccentRule className="mx-auto mt-5 md:mt-6" />
          </div>
          <div className="flex justify-center">
            <Link
              href="/news"
              className="group relative flex max-w-lg min-h-[min(52vw,14rem)] w-full flex-col justify-end overflow-hidden rounded-2xl border border-white/15 bg-linear-to-br from-brand-shell-elevated via-brand-shell-mid to-brand-shell p-8 transition duration-300 hover:-translate-y-0.5 hover:border-brand-accent-soft/40 sm:min-h-[14rem]"
            >
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,180,171,0.24),transparent_40%),radial-gradient(circle_at_20%_85%,rgba(217,53,47,0.20),transparent_42%)]"
                aria-hidden
              />
              <div className="relative space-y-3">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-brand-accent-soft">
                  Stories & insights
                </p>
                <h3 className="font-[family-name:var(--font-montserrat)] text-xl font-extrabold tracking-tight text-white md:text-2xl">
                  Visit News &amp; Insights
                </h3>
                <p className="text-sm leading-relaxed text-white/75">
                  Operational updates will appear here as soon as new posts are published.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="overflow-hidden bg-brand-shell px-4 py-11 sm:px-6 md:py-14 lg:px-12"
      aria-labelledby="insights-heading"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 text-center md:mb-11">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.34em] text-brand-accent-soft">Latest news</p>
          <h2
            id="insights-heading"
            className="mt-3 font-[family-name:var(--font-montserrat)] text-[1.65rem] font-extrabold tracking-tight text-white sm:text-[1.85rem] md:text-[2.15rem]"
          >
            {n.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base font-medium text-white/75">{n.subtitle}</p>
          <SectionAccentRule className="mx-auto mt-5 md:mt-6" />
        </div>

        <Stagger once className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {previewItems.map((item) => {
            const badge = badgeForHomeNews(item)
            return (
              <article
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/4 transition duration-300 hover:bg-white/6"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2.5 p-4 md:p-5">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-3 py-1 text-[0.6rem] font-black uppercase tracking-widest",
                      badge.className
                    )}
                  >
                    {badge.label}
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                    {new Date(item.publishedAt).toLocaleDateString("en-GB")}
                  </p>
                  <h3 className="font-[family-name:var(--font-montserrat)] text-lg font-bold leading-tight text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/75">{item.excerpt}</p>
                  <Link
                    href={`/news/${item.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-brand-accent-soft hover:text-white"
                  >
                    Read article
                    <MaterialSymbol name="arrow_forward" className="text-sm!" />
                  </Link>
                </div>
              </article>
            )
          })}

          <Link
            href="/news"
            className="group relative flex min-h-[min(52vw,17.5rem)] flex-col justify-end overflow-hidden rounded-2xl border border-white/15 bg-linear-to-br from-brand-shell-elevated via-brand-shell-mid to-brand-shell p-5 transition duration-300 hover:-translate-y-0.5 hover:border-brand-accent-soft/40 sm:min-h-[16rem] md:min-h-[17rem]"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,180,171,0.24),transparent_40%),radial-gradient(circle_at_20%_85%,rgba(217,53,47,0.20),transparent_42%)]"
              aria-hidden
            />
            <div className="relative space-y-3">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-brand-accent-soft">More news</p>
              <h3 className="font-[family-name:var(--font-montserrat)] text-xl font-extrabold tracking-tight text-white md:text-2xl">
                Read More News
              </h3>
              <p className="text-sm leading-relaxed text-white/75">
                Explore all updates, launches, network developments, and company stories.
              </p>
            </div>
          </Link>
        </Stagger>
      </div>
    </section>
  )
}

export function HomeNewsInsightsSkeleton() {
  const n = homeNewsInsightsDesign
  const bars = ["h-52", "h-52", "min-h-[17rem]"] as const

  return (
    <section className="overflow-hidden bg-brand-shell px-4 py-11 sm:px-6 md:py-14 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 text-center md:mb-11">
          <div className="mx-auto mb-4 h-3 w-32 animate-pulse rounded-full bg-white/18" aria-hidden />
          <div className="mx-auto mb-4 h-8 max-w-xl animate-pulse rounded-lg bg-white/12" aria-hidden />
          <div className="mx-auto h-12 max-w-2xl animate-pulse rounded-lg bg-white/10" aria-hidden />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {bars.map((h, idx) => (
            <div
              key={`${idx}`}
              aria-hidden
              className={`${h} animate-pulse rounded-2xl border border-white/8 bg-white/6`}
            />
          ))}
        </div>

        {/* Keep heading text for screen readers approximate — section is decorative while loading */}
        <h2 className="sr-only">{n.title}</h2>
      </div>
    </section>
  )
}
