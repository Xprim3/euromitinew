import type { SVGProps } from "react"

import { cn } from "@/lib/utils"

export type DecorativeLinesAccent = "gold" | "navy" | "redSoft"

const strokeMap: Record<DecorativeLinesAccent, string> = {
  gold: "#F59E0B33",
  navy: "#0F172A22",
  redSoft: "#B91C1C26",
}

export type DecorativeLinesProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  accent?: DecorativeLinesAccent
  /** Horizontal rule with soft ends (default). */
  variant?: "rule" | "arc"
}

/**
 * Lightweight SVG accents — tuck beside headings (`-mt-*`/`mb-*`) or image corners (`absolute`).
 */
export function DecorativeLines({ accent = "gold", variant = "rule", className, ...svg }: DecorativeLinesProps) {
  const stroke = strokeMap[accent]

  if (variant === "arc") {
    return (
      <svg
        className={cn("pointer-events-none shrink-0", "opacity-75 max-md:opacity-50", className)}
        width="112"
        height="36"
        viewBox="0 0 112 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        {...svg}
      >
        <path d="M4 28C28 14 54 12 108 28" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <path d="M8 34H96" stroke={strokeMap.navy} strokeWidth="1" opacity="0.45" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg
      className={cn("pointer-events-none shrink-0", "opacity-80 max-md:opacity-55", className)}
      width="120"
      height="8"
      viewBox="0 0 120 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...svg}
    >
      <line x1="0" y1="4" x2="116" y2="4" stroke={strokeMap.navy} strokeWidth="0.75" strokeLinecap="round" />
      <line x1="12" y1="4" x2="108" y2="4" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}
