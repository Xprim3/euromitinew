"use client"

import Image from "next/image"
import { useState } from "react"

type RestaurantImage = {
  src: string
  alt: string
}

export function HomeRestaurantImageSwitcher({ images }: { images: [RestaurantImage, RestaurantImage, RestaurantImage] }) {
  const [activeImages, setActiveImages] = useState(images)
  const mainImage = activeImages[0]
  const thumbnails = activeImages.slice(1)

  function promoteImage(thumbnailIndex: number) {
    const imageIndex = thumbnailIndex + 1
    setActiveImages((current) => {
      const next = [...current] as [RestaurantImage, RestaurantImage, RestaurantImage]
      const previousMain = next[0]
      next[0] = next[imageIndex]
      next[imageIndex] = previousMain
      return next
    })
  }

  return (
    <div className="relative w-full">
      <div className="absolute -inset-5 rounded-[1.75rem] bg-white/8 blur-3xl" aria-hidden />
      <div className="relative overflow-hidden rounded-[1.25rem] border border-white/14 bg-white/8 p-2 shadow-[0_34px_90px_rgba(0,0,0,0.45)]">
        <div className="euromiti-img-zoom relative min-h-88 overflow-hidden rounded-[0.9rem] sm:min-h-112 lg:min-h-128">
          <Image
            src={mainImage.src}
            alt={mainImage.alt}
            fill
            sizes="(max-width: 1023px) 100vw, 55vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-shell-deep/50 via-transparent to-transparent" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:absolute sm:-bottom-8 sm:right-6 sm:mt-0 sm:w-[42%] sm:min-w-72">
        {thumbnails.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            onClick={() => promoteImage(index)}
            className="group relative aspect-4/3 overflow-hidden rounded-[0.85rem] border border-white/18 bg-white/8 text-left shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:border-brand-accent-soft/45 focus-visible:border-brand-accent-soft focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-accent-soft/30"
            aria-label="Show this restaurant image as the main image"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 639px) 45vw, 18vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-brand-shell-deep/8" aria-hidden />
          </button>
        ))}
      </div>
    </div>
  )
}
