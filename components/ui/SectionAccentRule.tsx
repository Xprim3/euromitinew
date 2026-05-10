import { cn } from "@/lib/utils"

type SectionAccentRuleProps = {
  className?: string
}

/** Short brand gradient rule — use under section intros, before CTAs or card grids. */
export function SectionAccentRule({ className }: SectionAccentRuleProps) {
  return (
    <div
      className={cn("h-px w-28 bg-linear-to-r from-brand-red-vivid to-transparent", className)}
      aria-hidden
    />
  )
}
