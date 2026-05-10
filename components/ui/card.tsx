import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

type DivProps = HTMLAttributes<HTMLDivElement>

/**
 * Raised surface — fuel tiles, station cards, news snippets, dashboard tiles.
 * DESIGN.md: white surface, ~8px radius, ≥24px padding, ambient shadow.
 */
function Card({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-[var(--rounded-DEFAULT)] border border-border/80 bg-card text-card-foreground shadow-(--shadow-euromiti-soft)",
        "transition-[box-shadow,border-color] hover:border-border hover:shadow-(--shadow-euromiti-soft-hover)",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "font-heading text-lg font-bold leading-snug tracking-tight text-foreground md:text-xl",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: DivProps) {
  return (
    <div data-slot="card-content" className={cn("p-6 pt-0", className)} {...props} />
  )
}

function CardFooter({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "mt-auto flex flex-wrap gap-3 border-border/70 border-t px-6 py-4",
        className
      )}
      {...props}
    />
  )
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
