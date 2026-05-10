import Image from "next/image"
import Link from "next/link"

import { homeBeyondDesign } from "@/data/mock/homepage-visual"

const market = homeBeyondDesign.secondaryServices.find((s) => s.key === "market")

export function HomeMiniMarketIntro() {
  if (!market) return null

  return (
    <section className="bg-white px-4 py-16 sm:px-6 md:py-20 lg:px-12" aria-labelledby="mini-market-intro-heading">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-xl">
          <Image src={market.imageSrc} alt={market.imageAlt} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
        </div>
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-secondary">Mini market</p>
          <h2
            id="mini-market-intro-heading"
            className="mt-3 font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight text-black md:text-4xl"
          >
            Everyday Convenience
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-body-soft md:text-lg">
            Everyday products, drinks, snacks, and travel essentials ready for quick stops.
          </p>
          <Link
            href="/locations"
            className="mt-7 inline-flex items-center gap-2 rounded-xl border-2 border-black px-6 py-3.5 text-sm font-bold text-black transition hover:bg-black hover:text-white"
          >
            See Nearby Station
          </Link>
        </div>
      </div>
    </section>
  )
}
