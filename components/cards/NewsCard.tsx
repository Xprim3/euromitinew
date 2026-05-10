import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { formatNewsDate } from "@/lib/format-news-date"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type NewsCardProps = {
  title: string
  excerpt: string
  date: string
  imageSrc: string
  imageAlt: string
  href: string
  className?: string
}

export function NewsCard({
  title,
  excerpt,
  date,
  imageSrc,
  imageAlt,
  href,
  className,
}: NewsCardProps) {
  return (
    <Card
      className={cn(
        "group flex cursor-default flex-col overflow-hidden p-0 shadow-(--shadow-euromiti-soft)",
        className
      )}
    >
      <div className="relative aspect-video shrink-0 overflow-hidden bg-muted">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <CardHeader className="gap-2.5 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {formatNewsDate(date)}
        </p>
        <CardTitle>
          <Link
            href={href}
            className="text-balance underline-offset-[5px] transition-colors hover:text-primary hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/45 focus-visible:outline-none"
          >
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="grow px-6 pb-6">
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
          {excerpt}
        </p>
      </CardContent>
      <CardFooter className="border-border/75 border-t px-5 py-3.5">
        <Link
          href={href}
          className="inline-flex items-center gap-1 font-semibold text-primary text-sm transition-colors hover:underline hover:underline-offset-4 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/45 focus-visible:outline-none"
        >
          Read more <ArrowUpRight className="size-5" aria-hidden />
        </Link>
      </CardFooter>
    </Card>
  )
}
