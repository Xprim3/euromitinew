import { cn } from "@/lib/utils"

export type BackgroundPatternProps = {
  className?: string
}

/** Extremely faint angled weave — large-band ambience only; fades harder below md */
export function BackgroundPattern({ className }: BackgroundPatternProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        "opacity-[0.045] max-md:opacity-[0.022]",
        "[background-image:linear-gradient(120deg,rgba(15,23,42,0.45)_1px,transparent_1px),linear-gradient(210deg,rgba(245,158,11,0.35)_1px,transparent_1px)]",
        "[background-size:140px_140px,170px_170px]",
        "[background-position:center]",
        "mask-[radial-gradient(circle_at_center,black_0%,transparent_70%)]",
        className
      )}
      aria-hidden
    />
  )
}
