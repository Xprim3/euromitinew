import Link from "next/link"

import { NewsCard } from "@/components/cards/NewsCard"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { mockNewsSummaries } from "@/data/mock"
import type { NewsSummary } from "@/types/public"
import { cn } from "@/lib/utils"

export type LatestNewsSectionProps = {
  items?: NewsSummary[]
  className?: string
  /** `landing` mirrors the homepage module; `archive` is for `/news` (no self-link CTA). */
  mode?: "landing" | "archive"
}

export function LatestNewsSection({
  items = mockNewsSummaries,
  className,
  mode = "landing",
}: LatestNewsSectionProps) {
  const headingId = mode === "archive" ? "news-archive-heading" : "latest-news-heading"
  const sectionId = mode === "archive" ? "news-archive" : "latest-news"

  return (
    <section
      id={sectionId}
      className={cn("euromiti-section bg-muted/40", className)}
      aria-labelledby={headingId}
    >
      <Container>
        <SectionHeading
          label={mode === "archive" ? "Newsroom" : "Insights"}
          headingId={headingId}
          title={mode === "archive" ? "All news" : "News & announcements"}
          description="Operational updates for drivers, travellers, and community partners across Kosovo."
          actions={
            mode === "landing" ? (
              <Button variant="outlinePrimary" render={<Link href="/news" />}>
                View newsroom
              </Button>
            ) : undefined
          }
          className="mb-8 md:mb-11"
        />
        <div className="grid gap-6 md:gap-7 lg:grid-cols-3">
          {items.map((item) => (
            <NewsCard
              key={item.id}
              title={item.title}
              excerpt={item.excerpt}
              date={item.publishedAt}
              imageSrc={item.imageSrc}
              imageAlt={item.imageAlt}
              href={`/news/${item.slug}`}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
