import { cva, type VariantProps } from "class-variance-authority"
import type { HTMLAttributes, ReactNode } from "react"

import { cnDs } from "./cn-ds"

const statusBadgeVariants = cva(
  "inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide uppercase",
  {
    variants: {
      tone: {
        success: "bg-emerald-500/15 text-emerald-800 ring-1 ring-emerald-600/25",
        warning: "bg-amber-500/15 text-amber-900 ring-1 ring-amber-600/25",
        error: "bg-red-500/15 text-red-800 ring-1 ring-red-600/25",
        info: "bg-sky-500/15 text-sky-900 ring-1 ring-sky-600/25",
        neutral: "bg-slate-100 text-slate-700 ring-1 ring-slate-300",
        brand: "bg-[var(--admin-accent-active)]/12 text-[var(--admin-accent-active)] ring-1 ring-[var(--admin-accent-active)]/30",
        gold: "bg-[var(--admin-accent-gold)]/15 text-yellow-900 ring-1 ring-yellow-700/25",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  }
)

export type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof statusBadgeVariants> & {
    children: ReactNode
  }

/** Compact pill for row status (published, draft, error, etc.). */
export function StatusBadge({ className, tone, children, ...rest }: StatusBadgeProps) {
  return (
    <span className={cnDs(statusBadgeVariants({ tone }), className)} {...rest}>
      {children}
    </span>
  )
}
