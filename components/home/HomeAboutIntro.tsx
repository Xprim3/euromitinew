import Link from "next/link"
import Image from "next/image"

import { SectionReveal } from "@/components/motion"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"

export function HomeAboutIntro() {
  return (
    <section className="bg-brand-surface-tinted px-4 py-11 sm:px-6 md:py-14 lg:px-12" aria-labelledby="about-intro-heading">
      <div className="mx-auto max-w-[1280px]">
        <SectionReveal variant="fade-up" once>
          <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-2 md:gap-10">
            <div className="relative min-h-[15rem] overflow-hidden rounded-3xl md:min-h-[22rem]">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsNa_ar016Z5HDibQivrNY67SzYbUZKe0WG7DpwaQHOKOeVj-l6ZjPd9UkJT1LCPzEazL1wiBZ_RJs9BpODXlhQ15zQeb6u4Nx9Nw-TjdxnGqubvhDM82tXM8JsA2oTjSFJ4y1qXyW3SUrLKH_wekefXvyL7ptLyD22du9apP7qiRMyUQ3K6MmfOBWGJHfTIGApzf9cLuk4qB-e21yQ_5cIDKKx-sHZi2k9Zg-Bh_v3gfG2DeskV7uxZU4VgQlaoepKSRqoRtu7kaI"
                alt="Euromiti premium station architecture"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
            </div>

            <div className="space-y-6">
              <p className="inline-flex rounded-full bg-brand-border-accent px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.24em] text-secondary">
                About us
              </p>
              <h2
                id="about-intro-heading"
                className="font-[family-name:var(--font-montserrat)] text-[1.35rem] font-extrabold tracking-tight text-black md:text-[2rem] md:leading-[1.12]"
              >
                Built In Kosovo.
                <span className="mt-1 block text-secondary">Trusted On Every Route.</span>
              </h2>
              <SectionAccentRule className="mt-4 md:mt-5" />

              <div className="space-y-4 border-brand-border-muted border-l-2 pl-4 md:pl-5">
                <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-secondary">Who we are</p>
                <p className="max-w-xl text-[0.95rem] leading-relaxed text-brand-body-soft">
                  Euromiti is a Kosovo-grown fuel and roadside service company operating with dependable standards
                  in Prishtina, Ferizaj, and Gjilan.
                </p>
              </div>

              <div className="space-y-4 border-brand-border-muted border-l-2 pl-4 md:pl-5">
                <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-secondary">Why choose us</p>
                <p className="max-w-xl text-[0.95rem] leading-relaxed text-brand-body-soft">
                  Consistent fuel quality, practical one-stop services, and a team focused on speed, safety,
                  and premium customer care.
                </p>
              </div>

              <div className="pt-3 md:pt-5 md:flex md:justify-end">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-secondary transition hover:translate-x-1 hover:text-black"
                >
                  Read Full About Us
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
