import Image from "next/image"
import Link from "next/link"

import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { formatNewsDate } from "@/lib/format-news-date"
import type { NewsSummary } from "@/types/public"
import { cn } from "@/lib/utils"

type NewsArchiveCardProps = {
  item: NewsSummary
  href: string
  className?: string
}

function categoryTone(category: string) {
  const pill = category === "Innovation" || category === "Sustainability"
  return pill
    ? "rounded-md bg-brand-border-accent px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-secondary"
    : "text-[0.7rem] font-bold uppercase tracking-wide text-brand-red-vivid"
}

export function NewsArchiveCard({ item, href, className }: NewsArchiveCardProps) {
  const cat = item.category ?? "Company Updates"

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-brand-border-muted bg-background shadow-[0_14px_40px_-28px_rgba(20,27,43,0.35)] transition-shadow duration-300 hover:shadow-[0_22px_50px_-28px_rgba(20,27,43,0.42)]",
        className
      )}
    >
      <Link href={href} className="relative block h-56 shrink-0 overflow-hidden">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className={categoryTone(cat)}>{cat}</span>
          <time className="shrink-0 text-xs font-medium text-brand-neutrals-mid" dateTime={item.publishedAt}>
            {formatNewsDate(item.publishedAt)}
          </time>
        </div>
        <h3 className="mb-3 font-heading text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-secondary md:text-xl">
          <Link href={href} className="text-balance focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            {item.title}
          </Link>
        </h3>
        <p className="mb-6 line-clamp-3 flex-1 text-sm leading-relaxed text-brand-body-soft md:text-[0.9375rem]">
          {item.excerpt}
        </p>
        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-[#0F172A] transition-transform hover:text-secondary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring group-hover:translate-x-1"
        >
          Read more
          <MaterialSymbol name="chevron_right" className="text-lg!" />
        </Link>
      </div>
    </article>
  )
}
