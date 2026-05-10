import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type ImageHoverZoomProps = {
  children: ReactNode
  className?: string
}

/**
 * Overflow clip + slowed zoom on hover (fine pointers only — see globals `.euromiti-img-zoom`).
 * Wrapper only (Server Component — no `"use client"`) so `next/image` is not sliced by a useless client boundary; zoom targets `img` via CSS`.
 */
export function ImageHoverZoom({ children, className }: ImageHoverZoomProps) {
  return <div className={cn("euromiti-img-zoom", className)}>{children}</div>
}
