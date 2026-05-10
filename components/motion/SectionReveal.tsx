"use client"

import { type ComponentProps } from "react"

import { Reveal } from "./Reveal"

const sectionDefaults = {
  rootMargin: "0px 0px -12% 0px",
  threshold: 0.06,
} as const

export type SectionRevealProps = Omit<ComponentProps<typeof Reveal>, keyof typeof sectionDefaults>

/** Full-band reveal preset (gentler trigger than default `Reveal`). */
export function SectionReveal({ children, ...rest }: SectionRevealProps) {
  return (
    <Reveal {...sectionDefaults} {...rest}>
      {children}
    </Reveal>
  )
}
