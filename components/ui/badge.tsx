import type { HTMLAttributes } from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors ring-offset-background focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/55 focus-visible:outline-none [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** DESIGN.md chips — muted fill, navy-ish text */
        default:
          "border border-transparent bg-muted text-foreground hover:bg-muted/90",
        primary:
          "border border-transparent bg-primary/11 text-primary ring-1 ring-primary/20",
        secondary:
          "border border-transparent bg-secondary/11 text-secondary ring-1 ring-secondary/22",
        accent:
          "border border-transparent bg-accent/18 text-accent-foreground ring-1 ring-accent/30",
        outline:
          "border border-border bg-background text-muted-foreground hover:bg-muted/60",
        success:
          "border border-transparent bg-success/14 text-success ring-1 ring-success/35",
      },
      size: {
        default: "rounded-[var(--rounded-sm)]",
        lg: "rounded-[var(--rounded-sm)] px-4 py-1 text-sm [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      data-slot="badge"
      {...props}
    />
  )
}
