import { cn } from "@/lib/utils"

export type SectionWaveDividerProps = {
  /** Flip vertically so crest points up (sit at bottom of preceding section edge). */
  flip?: boolean
  /** Additional classes on the SVG wrapper row. */
  className?: string
  /** Slightly taller on lg+ screens. */
  size?: "sm" | "md"
}

/**
 * Full-width SVG wave silhouette — fills parent width only (no vw tricks) to avoid horizontal overflow.
 * Place at the boundary between two sections; keep parent `relative overflow-x-hidden` if needed elsewhere.
 */
export function SectionWaveDivider({ flip = false, className, size = "md" }: SectionWaveDividerProps) {
  const h = size === "sm" ? "h-8 md:h-10" : "h-10 md:h-14"

  return (
    <div
      className={cn(
        "pointer-events-none -my-px w-full shrink-0 select-none overflow-hidden leading-none",
        h,
        "opacity-[0.08] md:opacity-[0.1]",
        "max-md:opacity-[0.06]",
        className
      )}
      aria-hidden
    >
      <svg
        className={cn("h-full w-full text-[#0F172A]", flip && "rotate-180 scale-x-[-1]")}
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          fillOpacity="1"
          d="M0 32C180 14 360 42 540 34C720 26 900 38 1080 32C1260 26 1392 44 1440 22V48H0V32Z"
        />
      </svg>
    </div>
  )
}
