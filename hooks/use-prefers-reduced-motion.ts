"use client"

import { useSyncExternalStore } from "react"

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function getServerSnapshot() {
  return false
}

/**
 * Hydration-safe subscription to `prefers-reduced-motion`.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
