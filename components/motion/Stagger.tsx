"use client"

import { type ReactNode, useLayoutEffect, useRef, useState } from "react"

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"

export type StaggerProps = {
  children: ReactNode
  className?: string
  once?: boolean
  rootMargin?: string
  threshold?: number
}

/**
 * Staggered entrance for **direct** children only (`nth-child` delays in CSS).
 * Honors reduced motion; lighter timings on small viewports via CSS variables.
 */
export function Stagger({
  children,
  className,
  once = true,
  rootMargin = "0px 0px -6% 0px",
  threshold = 0.06,
}: StaggerProps) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(reduced)

  useLayoutEffect(() => {
    if (reduced) return
    const node = ref.current
    if (!node) return

    let disconnected = false

    const applyEntries = (entries: IntersectionObserverEntry[]) => {
      const hit = entries.some((e) => e.isIntersecting)
      if (hit) {
        setActive(true)
        if (once) disconnect()
      } else if (!once) setActive(false)
    }

    const io = new IntersectionObserver(applyEntries, { rootMargin, threshold })

    const disconnect = () => {
      if (disconnected) return
      disconnected = true
      io.disconnect()
    }
    io.observe(node)
    applyEntries(io.takeRecords())
    const raf = requestAnimationFrame(() => {
      applyEntries(io.takeRecords())
    })

    return () => {
      cancelAnimationFrame(raf)
      disconnect()
    }
  }, [reduced, once, rootMargin, threshold])

  return (
    <div
      ref={ref}
      className={cn("euromiti-stagger-group", (reduced || active) && "euromiti-stagger-group--active", className)}
    >
      {children}
    </div>
  )
}
