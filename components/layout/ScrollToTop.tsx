"use client"

import { useLayoutEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/**
 * Ensures client navigations land at the top of the page. Next already
 * scrolls on route change, but body scroll-lock (mobile menu) and
 * `scroll-behavior: smooth` on `html` can leave the window offset; this
 * runs synchronously before paint on pathname changes (not on first mount,
 * so deep links / hashes on initial load stay intact).
 */
export function ScrollToTop() {
  const pathname = usePathname()
  const isFirstPath = useRef(true)

  useLayoutEffect(() => {
    if (isFirstPath.current) {
      isFirstPath.current = false
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname])

  return null
}
