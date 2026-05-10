import Image from "next/image"
import Link from "next/link"

import { Stagger } from "@/components/motion"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { mockNewsSummaries } from "@/data/mock"
import { homeNewsInsightsDesign } from "@/data/mock/homepage-visual"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { cn } from "@/lib/utils"

const BADGE_BY_SLUG: Record<string, { label: string; className: string }> = {
  "expansion-in-prishtina": { label: "Network update", className: "bg-black text-white" },
  "path-to-zero-emissions": { label: "Sustainability", className: "bg-green-600 text-white" },
  "premium-diesel-launch": { label: "Innovation", className: "bg-black text-white" },
}

export function HomeNewsInsights() {
  const n = homeNewsInsightsDesign
  const previewItems = mockNewsSummaries.slice(0, 2)

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
            const badge = BADGE_BY_SLUG[item.slug] ?? {
              label: "News",
              className: "bg-white text-black",
            }
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
