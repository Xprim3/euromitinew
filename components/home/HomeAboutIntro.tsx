import Link from "next/link"
import Image from "next/image"

import { SectionReveal } from "@/components/motion"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { getPublicHomepageSingleton } from "@/lib/data/homepage-singleton-public"

const defaultImageSrc =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBsNa_ar016Z5HDibQivrNY67SzYbUZKe0WG7DpwaQHOKOeVj-l6ZjPd9UkJT1LCPzEazL1wiBZ_RJs9BpODXlhQ15zQeb6u4Nx9Nw-TjdxnGqubvhDM82tXM8JsA2oTjSFJ4y1qXyW3SUrLKH_wekefXvyL7ptLyD22du9apP7qiRMyUQ3K6MmfOBWGJHfTIGApzf9cLuk4qB-e21yQ_5cIDKKx-sHZi2k9Zg-Bh_v3gfG2DeskV7uxZU4VgQlaoepKSRqoRtu7kaI"
const defaultImageAlt = "Euromiti premium station architecture"
const defaultHeadline = "Të ndërtuar në Kosovë. Të besuar në çdo rrugë."
const defaultEyebrow = "Kush jemi"
const defaultWhoWeAre =
  "Euromiti është kompani vendore në Kosovë për karburante dhe shërbime rrugore, me standarde të besueshme në Prishtinë, Ferizaj dhe Gjilan."
const defaultWhyTitle = "Pse të na zgjidhni"
const defaultWhyText =
  "Cilësi e qëndrueshme e karburantit, shërbime praktike në një vend dhe ekip i fokusuar në shpejtësi, siguri dhe kujdes premium."
const defaultButtonLabel = "Lexo më shumë për ne"
const defaultButtonHref = "/about"

function headlineParts(headline: string) {
  const parts = headline
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean)
  if (parts.length < 2) return { main: headline, accent: "" }
  return {
    main: `${parts.slice(0, -1).join(". ")}.`,
    accent: `${parts.at(-1)}.`,
  }
}

export async function HomeAboutIntro() {
  const { row, media } = await getPublicHomepageSingleton()
  const image = row?.about_preview_image_media_id ? media[row.about_preview_image_media_id] : undefined
  const headline = row?.about_preview_headline?.trim() || defaultHeadline
  const headlineCopy = headlineParts(headline)
  const whoWeAre = row?.about_preview_text?.trim() || defaultWhoWeAre
  const whyText = row?.about_preview_why_text?.trim() || defaultWhyText

  return (
    <section className="bg-brand-surface-tinted px-4 py-11 sm:px-6 md:py-14 lg:px-12" aria-labelledby="about-intro-heading">
      <div className="mx-auto max-w-[1280px]">
        <SectionReveal variant="fade-up" once>
          <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-2 md:gap-10">
            <div className="relative min-h-[15rem] overflow-hidden rounded-3xl md:min-h-[22rem]">
              <Image
                src={image?.public_url?.trim() || defaultImageSrc}
                alt={image?.alt_text?.trim() || defaultImageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
            </div>

            <div className="space-y-6">
              <h2
                id="about-intro-heading"
                className="font-[family-name:var(--font-montserrat)] text-[1.35rem] font-extrabold tracking-tight text-black md:text-[2rem] md:leading-[1.12]"
              >
                {headlineCopy.main}
                {headlineCopy.accent ? <span className="mt-1 block text-secondary">{headlineCopy.accent}</span> : null}
              </h2>
              <SectionAccentRule className="mt-4 md:mt-5" />

              <div className="space-y-4 border-brand-border-muted border-l-2 pl-4 md:pl-5">
                <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-secondary">
                  {defaultEyebrow}
                </p>
                <p className="max-w-xl text-[0.95rem] leading-relaxed text-brand-body-soft">
                  {whoWeAre}
                </p>
              </div>

              <div className="space-y-4 border-brand-border-muted border-l-2 pl-4 md:pl-5">
                <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-secondary">
                  {defaultWhyTitle}
                </p>
                <p className="max-w-xl text-[0.95rem] leading-relaxed text-brand-body-soft">
                  {whyText}
                </p>
              </div>

              <div className="pt-3 md:pt-5 md:flex md:justify-end">
                <Link
                  href={defaultButtonHref}
                  className="inline-flex items-center gap-2 text-sm font-bold text-secondary transition hover:translate-x-1 hover:text-black"
                >
                  {defaultButtonLabel}
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
