import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type PremiumSectionLabelProps = {
  children: ReactNode
  className?: string
  /** Show a short gold-tinted rule under the label (default true). */
  showRule?: boolean
  as?: "p" | "span"
}

/**
 * Uppercase micro-label for luxury sections — distinct from `BrandEyebrow` (no pill; rule + tracking).
 * Use once per major section block; pair with Playfair / Montserrat headings below.
 */
export function PremiumSectionLabel({
  children,
  className,
  showRule = true,
  as: Comp = "p",
}: PremiumSectionLabelProps) {
  return (
    <Comp
      className={cn(
        "text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[#0F172A]/55",
        "dark:text-white/55",
        showRule && "after:mt-2.5 after:block after:h-px after:w-9 after:bg-[#F59E0B]/30 after:content-['']",
        "max-md:tracking-[0.28em] max-md:text-[#0F172A]/48",
        className
      )}
    >
      {children}
    </Comp>
  )
}
