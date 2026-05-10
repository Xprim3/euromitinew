import Image from "next/image"
import Link from "next/link"

import { homeBeyondDesign } from "@/data/mock/homepage-visual"

export function HomeRestaurantHighlight() {
  const r = homeBeyondDesign.restaurant
  return (
    <section className="bg-white px-4 py-16 sm:px-6 md:py-20 lg:px-12" aria-labelledby="restaurant-highlight-heading">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-xl">
          <Image src={r.mainImage} alt={r.mainImageAlt} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
        </div>
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-secondary">Restaurant</p>
          <h2
            id="restaurant-highlight-heading"
            className="mt-3 font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight text-black md:text-4xl"
          >
            Premium Dining At Euromiti
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-body-soft md:text-lg">{r.body}</p>
          <Link
            href="/restaurant"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-red-vivid px-6 py-3.5 text-sm font-bold text-white transition hover:bg-secondary"
          >
            Explore Restaurant
          </Link>
        </div>
      </div>
    </section>
  )
}
