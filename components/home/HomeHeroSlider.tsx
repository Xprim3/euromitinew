"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

import type { HomeHeroSlideResolved } from "@/lib/data/homepage-singleton-public"

const ROTATE_MS = 6500
const SWIPE_THRESHOLD = 42

export function HomeHeroSlider({ slides }: { slides: HomeHeroSlideResolved[] }) {
  const safeSlides = slides.length ? slides : []
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const normalizedIndex = safeSlides.length ? activeIndex % safeSlides.length : 0
  const activeSlide = safeSlides[normalizedIndex] ?? safeSlides[0]

  const goTo = useCallback(
    (index: number) => {
      if (!safeSlides.length) return
      setActiveIndex((index + safeSlides.length) % safeSlides.length)
    },
    [safeSlides.length]
  )

  useEffect(() => {
    if (safeSlides.length <= 1) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % safeSlides.length)
    }, ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [safeSlides.length])

  if (!activeSlide) return null

  return (
    <section
      className="relative isolate min-h-[calc(100svh-5rem)] scroll-mt-20 overflow-hidden bg-[#131b2e] sm:min-h-[clamp(34rem,82svh,49rem)]"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current == null || safeSlides.length <= 1) return
        const endX = event.changedTouches[0]?.clientX ?? touchStartX.current
        const deltaX = endX - touchStartX.current
        touchStartX.current = null
        if (Math.abs(deltaX) < SWIPE_THRESHOLD) return
        goTo(normalizedIndex + (deltaX < 0 ? 1 : -1))
      }}
    >
      <div className="absolute inset-0">
        {safeSlides.map((slide, index) => (
          <div
            key={`${slide.title}-${index}`}
            className={[
              "absolute inset-0 transition-[transform,opacity] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)]",
              index === normalizedIndex ? "z-10 translate-x-0 opacity-100" : "z-0 translate-x-full opacity-0",
            ].join(" ")}
            aria-hidden={index !== normalizedIndex}
          >
            <Image
              src={slide.imageSrc}
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-[#131b2e]/28" aria-hidden />
      <div className="absolute inset-0 bg-linear-to-r from-[#131b2e]/76 via-[#131b2e]/36 to-[#131b2e]/6" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-[68%] bg-linear-to-t from-black/92 via-black/58 to-transparent backdrop-blur-[2px]" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-black via-black/52 to-transparent" aria-hidden />
      <div
        className="absolute left-0 top-0 hidden h-full w-2/3 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_18px)] opacity-20 md:block"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-[1280px] items-end px-4 pt-28 pb-24 sm:min-h-[clamp(34rem,82svh,49rem)] sm:items-center sm:px-6 sm:py-16 lg:px-12">
        <div key={normalizedIndex} className="euromiti-hero-copy-slide max-w-3xl">
          <div className="border-white/14 border-l pl-4 sm:pl-5">
            <p className="mb-3 text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-[#ffb4ab] sm:mb-4 sm:text-[0.68rem] sm:tracking-[0.22em]">
              Euromiti
            </p>
            <h1 className="font-(family-name:--font-montserrat) text-[clamp(2.1rem,12vw,3.2rem)] font-extrabold leading-[0.98] tracking-[-0.055em] text-white sm:text-[clamp(2.45rem,8vw,5.25rem)] sm:leading-[0.94] sm:tracking-[-0.06em]">
              {activeSlide.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/82 sm:mt-6 sm:text-[1rem] sm:leading-[1.75] md:text-lg md:leading-relaxed">
              {activeSlide.subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
