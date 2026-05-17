"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"

const SCROLL_SHOW_OFFSET = 320

/** rAF scroll avoids fighting `html { scroll-smooth }` + `scrollTo({ behavior: "smooth" })`. */
function animateScrollToTop(onDone: () => void): () => void {
  const startY = window.scrollY
  if (startY <= 0) {
    onDone()
    return () => {}
  }

  const html = document.documentElement
  const previousBehavior = html.style.scrollBehavior
  html.style.scrollBehavior = "auto"

  const duration = Math.min(650, Math.max(280, startY * 0.4))
  const startTime = performance.now()
  let frame = 0

  const step = (now: number) => {
    const progress = Math.min(1, (now - startTime) / duration)
    const eased = 1 - (1 - progress) ** 3
    window.scrollTo(0, Math.round(startY * (1 - eased)))

    if (progress < 1) {
      frame = requestAnimationFrame(step)
    } else {
      window.scrollTo(0, 0)
      html.style.scrollBehavior = previousBehavior
      onDone()
    }
  }

  frame = requestAnimationFrame(step)

  return () => {
    cancelAnimationFrame(frame)
    html.style.scrollBehavior = previousBehavior
    onDone()
  }
}

export function BackToTopButton() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [visible, setVisible] = useState(false)
  const scrollingToTop = useRef(false)
  const cancelScroll = useRef<(() => void) | null>(null)

  useEffect(() => {
    const onScroll = () => {
      if (scrollingToTop.current) return
      setVisible(window.scrollY > SCROLL_SHOW_OFFSET)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => () => cancelScroll.current?.(), [])

  const scrollToTop = useCallback(() => {
    cancelScroll.current?.()
    scrollingToTop.current = true
    setVisible(true)

    const finish = () => {
      scrollingToTop.current = false
      cancelScroll.current = null
      setVisible(window.scrollY > SCROLL_SHOW_OFFSET)
    }

    if (prefersReducedMotion) {
      window.scrollTo(0, 0)
      finish()
      return
    }

    cancelScroll.current = animateScrollToTop(finish)
  }, [prefersReducedMotion])

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Kthehu në fillim të faqes"
      title="Kthehu lart"
      className={cn(
        "fixed z-30 flex size-11 items-center justify-center rounded-full border border-white/12 bg-brand-shell-deep text-white transition-[opacity,background-color,border-color,color] duration-300 ease-out",
        "right-[max(1rem,env(safe-area-inset-right,0px))] bottom-[max(1rem,env(safe-area-inset-bottom,0px))]",
        "sm:size-12 sm:right-6 sm:bottom-6",
        "hover:border-brand-accent-soft/40 hover:bg-brand-shell-deep hover:text-brand-accent-soft",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-brand-shell-deep",
        "active:scale-95 motion-reduce:active:scale-100",
        visible
          ? "pointer-events-auto scale-100 opacity-100"
          : "pointer-events-none scale-95 opacity-0"
      )}
    >
      <MaterialSymbol name="keyboard_arrow_up" className="text-[1.65rem]!" />
    </button>
  )
}
