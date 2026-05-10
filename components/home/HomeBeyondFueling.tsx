import Image from "next/image"
import Link from "next/link"

import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { homeBeyondDesign } from "@/data/mock/homepage-visual"

export function HomeBeyondFueling() {
  const d = homeBeyondDesign

  return (
    <section
      id="services"
      className="overflow-hidden bg-white py-24 md:py-32"
      aria-labelledby="home-services-heading"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        <header className="mb-20 flex flex-col items-end justify-between gap-8 md:mb-32 md:flex-row">
          <div className="max-w-2xl space-y-4">
            <span className="block text-[0.625rem] font-black tracking-[0.4em] text-secondary uppercase">
              {d.kicker}
            </span>
            <h2
              id="home-services-heading"
              className="font-[family-name:var(--font-montserrat)] text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-tight tracking-tight text-black"
            >
              Beyond <span className="text-secondary italic">Fueling.</span>
            </h2>
          </div>
          <div className="max-w-sm border-secondary/30 border-l-2 py-2 pl-6 md:border-l-0 md:border-r-2 md:pr-6 md:pl-0 md:text-right">
            <p className="text-lg leading-relaxed text-brand-body-soft italic font-light">{d.quote}</p>
          </div>
        </header>

        <div className="relative mb-24 md:mb-32 group">
          <div className="relative h-[600px] overflow-hidden rounded-[3rem] shadow-2xl md:h-[800px]">
            <Image
              src={d.elite.imageSrc}
              alt={d.elite.imageAlt}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" aria-hidden />
            <div className="absolute bottom-0 left-0 max-w-4xl space-y-8 p-12 md:p-20">
              <div className="space-y-4">
                <h3 className="font-playfair text-5xl font-bold text-white md:text-7xl">{d.elite.title}</h3>
              </div>
              <p className="max-w-3xl text-xl leading-relaxed text-white/80">{d.elite.body}</p>
            </div>
          </div>
        </div>

        <div className="mb-40 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {d.secondaryServices.map((s) => (
            <div key={s.key} className="space-y-8 group">
              <div className="aspect-4/3 overflow-hidden rounded-[2.5rem] shadow-xl">
                <Image
                  src={s.imageSrc}
                  alt={s.imageAlt}
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="space-y-4 px-2">
                <h3 className="text-2xl font-bold tracking-tighter text-black uppercase">{s.title}</h3>
                <p className="text-brand-body-soft text-md leading-relaxed italic">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-40 space-y-16">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-7">
              <h3 className="font-playfair text-5xl font-bold leading-tight text-black md:text-6xl">
                {d.restaurant.title}
              </h3>
              <p className="max-w-2xl text-xl leading-relaxed text-brand-body-soft italic">{d.restaurant.body}</p>
              <Link
                href={d.restaurant.ctaHref}
                className="inline-flex items-center gap-4 text-secondary text-xs font-black tracking-widest uppercase transition-transform hover:translate-x-2"
              >
                {d.restaurant.ctaLabel}
                <MaterialSymbol name="arrow_forward" className="text-sm" />
              </Link>
            </div>
            <div className="relative lg:col-span-5">
              <div className="aspect-4/5 overflow-hidden rounded-[3rem] shadow-2xl">
                <Image
                  src={d.restaurant.mainImage}
                  alt={d.restaurant.mainImageAlt}
                  width={1000}
                  height={1250}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="-bottom-10 -left-10 absolute hidden h-48 w-48 overflow-hidden rounded-3xl border-4 border-white shadow-xl md:block">
                <Image
                  src={d.restaurant.float1}
                  alt={d.restaurant.float1Alt}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="top-10 -right-10 absolute hidden h-40 w-40 overflow-hidden rounded-3xl border-4 border-white shadow-xl md:block">
                <Image
                  src={d.restaurant.float2}
                  alt={d.restaurant.float2Alt}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
