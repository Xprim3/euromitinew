"use client"

import { type ReactNode, useLayoutEffect, useRef, useState } from "react"

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"

export type RevealProps = {
  children: ReactNode
  className?: string
  /** `fade` = opacity only; `fade-up` adds a short vertical travel */
  variant?: "fade" | "fade-up"
  /** If true, stop observing after the first intersection */
  once?: boolean
  /** Extra delay before this node transitions (ms) */
  delayMs?: number
  /** Passed to IntersectionObserver `rootMargin` */
  rootMargin?: string
  /** 0–1; lower = element can be more off-screen before firing */
  threshold?: number
}

/**
 * Intersection-based entrance. Opt-in only — wrap specific blocks.
 * Honors `prefers-reduced-motion` (content shows immediately).
 */
export function Reveal({
  children,
  className,
  variant = "fade-up",
  once = true,
  delayMs = 0,
  rootMargin = "0px 0px -8% 0px",
  threshold = 0.08,
}: RevealProps) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(reduced)

  useLayoutEffect(() => {
    if (reduced) return
    const node = ref.current
    if (!node) return

    let disconnected = false

    const applyEntries = (entries: IntersectionObserverEntry[]) => {
      const hit = entries.some((e) => e.isIntersecting)
      if (hit) {
        setShown(true)
        if (once) disconnect()
      } else if (!once) setShown(false)
    }

    const io = new IntersectionObserver(applyEntries, { rootMargin, threshold })

    const disconnect = () => {
      if (disconnected) return
      disconnected = true
      io.disconnect()
    }
    io.observe(node)
    /** Some mobile engines skip the async callback for already-visible nodes; flush synchronously. */
    applyEntries(io.takeRecords())
    /** One frame catches layout settled after hydrate / font swap. */
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
      className={cn(
        "euromiti-reveal",
        variant === "fade-up" && "euromiti-reveal--fade-up",
        (reduced || shown) && "euromiti-reveal--visible",
        className
      )}
      style={delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  )
}
