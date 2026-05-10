import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type ImageAccentFrameProps = {
  children: ReactNode
  className?: string
  /** Tighter halo for thumbnails / cards. */
  density?: "default" | "tight"
  /** Corners inherit from child — pass matching `rounded-*` on both wrapper and inner media. */
  rounded?: string
}

/**
 * One-pixel tonal frame + faint outer glow — wrap existing `relative overflow-hidden rounded-*` image shells.
 * Does not resize media; additive only.
 */
export function ImageAccentFrame({ children, className, density = "default", rounded = "rounded-2xl" }: ImageAccentFrameProps) {
  const pad = density === "tight" ? "p-px" : "p-[1.5px]"

  return (
    <div
      className={cn(
        "pointer-events-none relative bg-linear-to-br from-[#F59E0B]/[0.22] via-[#0F172A]/[0.08] to-[#F59E0B]/[0.12]",
        "shadow-[0_0_0_1px_rgba(15,23,42,0.06)] ring-1 ring-[#F59E0B]/[0.08]",
        "max-md:from-[#F59E0B]/15 max-md:via-[#0F172A]/[0.05] max-md:ring-[#F59E0B]/[0.06]",
        pad,
        rounded,
        className
      )}
    >
      <div className={cn("pointer-events-auto relative overflow-hidden", rounded)}>{children}</div>
    </div>
  )
}
