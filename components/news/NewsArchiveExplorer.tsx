"use client"

import { useLayoutEffect, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import type { NewsSummary } from "@/types/public"
import { cn } from "@/lib/utils"

import { SectionReveal } from "@/components/motion/SectionReveal"
import { Stagger } from "@/components/motion/Stagger"

import type { NewsFilterTab } from "@/lib/constants/news-archive"
import { NEWS_FILTER_TABS } from "@/lib/constants/news-archive"

import { NewsArchiveCard } from "./NewsArchiveCard"

/** Re-export for callers that depended on `./NewsArchiveExplorer`. */
export { NEWS_FILTER_TABS }

/** Desktop: 3 columns × 2 rows — keeps the archive visually compact before pagination */
const NEWS_PAGE_SIZE = 6

function visiblePageNumbers(totalPages: number, current: number): (number | "gap")[] {
  if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const pages = new Set<number>([1, totalPages, current])
  if (current - 1 > 1) pages.add(current - 1)
  if (current + 1 < totalPages) pages.add(current + 1)
  const sorted = [...pages].sort((a, b) => a - b)
  const out: (number | "gap")[] = []
  for (let i = 0; i < sorted.length; i++) {
    const v = sorted[i]!
    if (i && v - sorted[i - 1]! > 1) out.push("gap")
    out.push(v)
  }
  return out
}

type NewsArchiveExplorerProps = {
  items: readonly NewsSummary[]
  className?: string
}

export function NewsArchiveExplorer({ items, className }: NewsArchiveExplorerProps) {
  const [active, setActive] = useState<NewsFilterTab>("All News")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const gridAnchorRef = useRef<HTMLDivElement>(null)
  /** When true, the next `safePage` commit came from Prev/Next or a numbered page button. */
  const scrollGridAfterPaginationRef = useRef(false)

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      const cat = item.category ?? "Company Updates"
      if (active !== "All News" && cat !== active) return false
      if (!q) return true
      return `${item.title} ${item.excerpt}`.toLowerCase().includes(q)
    })
  }, [items, active, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / NEWS_PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * NEWS_PAGE_SIZE
  const slice = filtered.slice(start, start + NEWS_PAGE_SIZE)
  const showingFrom = filtered.length === 0 ? 0 : start + 1
  const showingTo = start + slice.length

  useLayoutEffect(() => {
    if (!scrollGridAfterPaginationRef.current) return
    scrollGridAfterPaginationRef.current = false
    gridAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [safePage])

  function goTo(next: number) {
    const p = Math.max(1, Math.min(totalPages, next))
    if (p === safePage) return
    scrollGridAfterPaginationRef.current = true
    setPage(p)
  }

  return (
    <div className={cn("euromiti-section bg-brand-surface-tinted", className)}>
      <div
        className="sticky top-20 z-30 border-brand-border-muted border-b bg-brand-surface-tinted/95 backdrop-blur-md supports-backdrop-filter:bg-brand-surface-tinted/88"
        aria-label="News filters"
      >
        <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-12">
          <div
            className="flex max-w-full gap-6 overflow-x-auto pb-1 scrollbar-none md:gap-8 [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-orientation="horizontal"
          >
            {NEWS_FILTER_TABS.map((tab) => {
              const selected = active === tab
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setActive(tab)
                    setPage(1)
                  }}
                  className={cn(
                    "shrink-0 border-b-2 pb-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] transition-colors",
                    selected
                      ? "border-brand-red-vivid text-brand-red-vivid"
                      : "border-transparent text-brand-body-soft hover:text-[#0F172A]"
                  )}
                >
                  {tab}
                </button>
              )
            })}
          </div>
          <div className="relative min-w-[min(100%,16rem)] max-w-xs flex-1 sm:max-w-[16rem]">
            <MaterialSymbol
              name="search"
              className="pointer-events-none absolute top-1/2 left-3 text-xl! text-brand-neutrals-mid -translate-y-1/2"
              aria-hidden
            />
            <label htmlFor="news-search" className="sr-only">
              Search news
            </label>
            <input
              id="news-search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Search news…"
              className="w-full rounded-full border border-brand-border-muted bg-background py-2.5 pr-4 pl-10 text-sm outline-none ring-brand-red-vivid/30 transition-[box-shadow,border-color] placeholder:text-brand-neutrals-mid focus:border-brand-red-vivid focus:ring-3"
              type="search"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1280px] px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
        <SectionReveal once variant="fade-up">
          {slice.length === 0 ? (
            <p className="text-center text-sm text-brand-body-soft">No stories match those filters.</p>
          ) : (
            <>
              <div ref={gridAnchorRef} id="news-archive-grid" className="scroll-mt-24">
                <Stagger
                  key={`${safePage}-${slice.map((i) => i.id).join()}`}
                  once
                  className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-8"
                >
                  {slice.map((item) => (
                    <NewsArchiveCard key={item.id} item={item} href={`/news/${item.slug}`} />
                  ))}
                </Stagger>
              </div>

            <div className="mt-8 flex flex-col items-center gap-5 border-brand-border-muted border-t pt-8 sm:mt-10 sm:pt-10">
              <p className="text-center text-xs font-medium text-brand-neutrals-mid sm:text-sm">
                Showing <span className="font-semibold text-[#0F172A]">{showingFrom}</span>–
                <span className="font-semibold text-[#0F172A]">{showingTo}</span> of{" "}
                <span className="font-semibold text-[#0F172A]">{filtered.length}</span>
                {totalPages > 1 ? (
                  <>
                    {" "}
                    · Page <span className="font-semibold text-[#0F172A]">{safePage}</span> of{" "}
                    <span className="font-semibold text-[#0F172A]">{totalPages}</span>
                  </>
                ) : null}
              </p>

              {totalPages > 1 ? (
                <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="News pagination">
                  <Button
                    variant="outlinePrimary"
                    size="sm"
                    type="button"
                    className="min-w-10 gap-1 px-3"
                    disabled={safePage <= 1}
                    onClick={() => goTo(safePage - 1)}
                  >
                    <MaterialSymbol name="chevron_left" className="text-lg!" />
                    <span className="sr-only sm:not-sr-only sm:inline">Prev</span>
                  </Button>

                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {visiblePageNumbers(totalPages, safePage).map((entry, i) =>
                      entry === "gap" ? (
                        <span
                          key={`gap-${i}`}
                          className="px-1 text-sm font-medium text-brand-neutrals-mid"
                          aria-hidden
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={entry}
                          type="button"
                          onClick={() => goTo(entry)}
                          className={cn(
                            "flex size-10 items-center justify-center rounded-lg text-sm font-bold transition-colors",
                            entry === safePage
                              ? "bg-black text-white shadow-(--shadow-euromiti-primary-sm)"
                              : "border border-brand-border-muted bg-background text-brand-body-soft hover:border-brand-red-vivid/40 hover:text-[#0F172A]"
                          )}
                          aria-label={`Page ${entry}`}
                          aria-current={entry === safePage ? "page" : undefined}
                        >
                          {entry}
                        </button>
                      )
                    )}
                  </div>

                  <Button
                    variant="outlinePrimary"
                    size="sm"
                    type="button"
                    className="min-w-10 gap-1 px-3"
                    disabled={safePage >= totalPages}
                    onClick={() => goTo(safePage + 1)}
                  >
                    <span className="sr-only sm:not-sr-only sm:inline">Next</span>
                    <MaterialSymbol name="chevron_right" className="text-lg!" />
                  </Button>
                </nav>
              ) : null}
            </div>
          </>
          )}
        </SectionReveal>
      </div>
    </div>
  )
}
