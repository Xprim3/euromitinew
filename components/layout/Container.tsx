import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

const sizeClass = {
  narrow: "max-w-3xl",
  /** DESIGN.md: container-max 1280px, gutter 24px, desktop lateral margin ~48px */
  default: "max-w-[80rem]",
  wide: "max-w-[90rem]",
  full: "max-w-none",
} as const

export type ContainerSize = keyof typeof sizeClass

type ContainerProps = {
  children: ReactNode
  size?: ContainerSize
  className?: string
}

/**
 * Horizontal gutters and max width. Use on every major page block for alignment.
 */
export function Container({ children, size = "default", className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-12",
        sizeClass[size],
        className
      )}
    >
      {children}
    </div>
  )
}
