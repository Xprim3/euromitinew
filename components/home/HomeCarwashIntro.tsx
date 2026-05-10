import Image from "next/image"
import Link from "next/link"

import { homeBeyondDesign } from "@/data/mock/homepage-visual"

const carwash = homeBeyondDesign.secondaryServices.find((s) => s.key === "detailing")

export function HomeCarwashIntro() {
  if (!carwash) return null

  return (
    <section className="bg-brand-surface-tinted px-4 py-16 sm:px-6 md:py-20 lg:px-12" aria-labelledby="carwash-intro-heading">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="order-2 md:order-1">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-secondary">Carwash</p>
          <h2
            id="carwash-intro-heading"
            className="mt-3 font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight text-black md:text-4xl"
          >
            Clean And Ready To Go
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-body-soft md:text-lg">{carwash.body}</p>
          <Link
            href="/locations"
            className="mt-7 inline-flex items-center gap-2 rounded-xl border-2 border-black px-6 py-3.5 text-sm font-bold text-black transition hover:bg-black hover:text-white"
          >
            Find Carwash Location
          </Link>
        </div>
        <div className="order-1 md:order-2 relative aspect-4/3 overflow-hidden rounded-3xl shadow-xl">
          <Image
            src={carwash.imageSrc}
            alt={carwash.imageAlt}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
