import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type BrandEyebrowProps = {
  /** Small uppercase Euromiti label on light backgrounds; uses semantic secondary (+ /10 tint). */
  children: ReactNode
  className?: string
  as?: "span" | "p"
}

export function BrandEyebrow({ children, className, as: Comp = "span" }: BrandEyebrowProps) {
  return (
    <Comp
      className={cn(
        "inline-block rounded-full bg-secondary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-secondary",
        className
      )}
    >
      {children}
    </Comp>
  )
}
