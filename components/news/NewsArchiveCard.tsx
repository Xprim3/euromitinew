import Image from "next/image"
import Link from "next/link"

import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { formatNewsDateTime } from "@/lib/format-news-date"
import type { NewsSummary } from "@/types/public"
import { cn } from "@/lib/utils"

type NewsArchiveCardProps = {
  item: NewsSummary
  href: string
  className?: string
}

/** Horizontal news list row — image left, story right (no card chrome). */
export function NewsArchiveCard({ item, href, className }: NewsArchiveCardProps) {
  const publishedLabel = formatNewsDateTime(item.publishedAt)

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-5 py-8 transition-colors sm:flex-row sm:items-start sm:gap-8 md:py-10",
        className
      )}
    >
      <Link
        href={href}
        className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden rounded-md bg-brand-border-muted/25 ring-1 ring-brand-border-muted/80 ring-inset sm:w-[min(100%,18.5rem)] md:w-80"
      >
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 639px) 100vw, 320px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="min-w-0 flex-1 sm:pt-0.5">
        <h3 className="font-heading text-xl font-bold leading-snug tracking-tight text-foreground md:text-[1.65rem] md:leading-tight lg:text-[1.75rem]">
          <Link
            href={href}
            className="text-balance transition-colors hover:text-brand-red-vivid focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {item.title}
          </Link>
        </h3>

        <p className="mt-2.5 flex items-center gap-2 text-sm text-brand-neutrals-mid">
          <MaterialSymbol name="schedule" className="text-[1.1rem]! text-brand-red-vivid" aria-hidden />
          <time dateTime={item.publishedAt}>{publishedLabel}</time>
        </p>

        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-brand-body-soft md:mt-4 md:text-[0.9375rem] md:leading-[1.65]">
          {item.excerpt}
        </p>

        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-red-vivid hover:text-secondary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:mt-5"
        >
          Lexo më shumë
          <MaterialSymbol name="arrow_forward" className="text-[1.05rem]!" />
        </Link>
      </div>
    </article>
  )
}
