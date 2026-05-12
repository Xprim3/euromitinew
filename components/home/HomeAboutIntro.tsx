import Link from "next/link"
import Image from "next/image"

import { SectionReveal } from "@/components/motion"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { getPublicHomepageSingleton } from "@/lib/data/homepage-singleton-public"

const defaultImageSrc =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBsNa_ar016Z5HDibQivrNY67SzYbUZKe0WG7DpwaQHOKOeVj-l6ZjPd9UkJT1LCPzEazL1wiBZ_RJs9BpODXlhQ15zQeb6u4Nx9Nw-TjdxnGqubvhDM82tXM8JsA2oTjSFJ4y1qXyW3SUrLKH_wekefXvyL7ptLyD22du9apP7qiRMyUQ3K6MmfOBWGJHfTIGApzf9cLuk4qB-e21yQ_5cIDKKx-sHZi2k9Zg-Bh_v3gfG2DeskV7uxZU4VgQlaoepKSRqoRtu7kaI"
const defaultImageAlt = "Euromiti premium station architecture"
const defaultHeadline = "Të ndërtuar në Kosovë. Të besuar në çdo rrugë."
const defaultEyebrow = "Kush jemi"
const defaultWhoWeAre =
  "Euromiti është kompani vendore në Kosovë për karburante dhe shërbime rrugore, me standarde të besueshme në Prishtinë, Ferizaj dhe Gjilan."
const defaultWhyText =
  "Cilësi e qëndrueshme e karburantit, shërbime praktike në një vend dhe ekip i fokusuar në shpejtësi, siguri dhe kujdes premium."
const defaultCompanyDetail =
  "Qëllimi ynë është të ndërtojmë një standard të qëndrueshëm shërbimi: furnizim korrekt, ambiente të pastra, ushqim të freskët dhe kujdes të shpejtë për klientët që ndalen gjatë rrugës."
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
    <section
      className="relative overflow-hidden bg-brand-surface-tinted px-4 py-12 sm:px-6 sm:py-16 md:py-18 lg:px-12 lg:py-20"
      aria-labelledby="about-intro-heading"
    >
      <div className="relative mx-auto max-w-[1280px]">
        <SectionReveal variant="fade-up" once>
          <div className="grid grid-cols-1 items-center gap-8 md:gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
            <div className="order-1 flex flex-col justify-center lg:col-span-7">
              <div className="max-w-[43rem]">
                <p className="mb-3 text-[0.6rem] font-black uppercase tracking-[0.28em] text-brand-red-vivid sm:mb-4 sm:text-[0.64rem] sm:tracking-[0.32em]">
                  {defaultEyebrow}
                </p>
                <h2
                  id="about-intro-heading"
                  className="font-(family-name:--font-montserrat) text-[clamp(1.75rem,7vw,2.35rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-brand-primary sm:text-[clamp(2.05rem,4.2vw,3rem)] lg:text-[clamp(2.35rem,3.4vw,3.25rem)]"
                >
                  {headlineCopy.main}
                  {headlineCopy.accent ? (
                    <>
                      {" "}
                      <span className="text-brand-red-vivid">{headlineCopy.accent}</span>
                    </>
                  ) : null}
                </h2>
                <SectionAccentRule className="mt-5 sm:mt-6" />

                <div className="mt-5 max-w-[39rem] space-y-3 sm:mt-6 sm:space-y-4">
                  <p className="text-[0.98rem] leading-8 text-brand-body-soft md:text-[1.04rem]">{whoWeAre}</p>
                  <p className="text-[0.96rem] leading-8 text-brand-body-soft md:text-[1rem]">{whyText}</p>
                  <p className="text-[0.96rem] leading-8 text-brand-body-soft md:text-[1rem]">{defaultCompanyDetail}</p>
                </div>

                <Link
                  href={defaultButtonHref}
                  className="group mt-7 inline-flex w-full items-center justify-between gap-4 rounded-[0.85rem] border border-brand-shell-deep/12 bg-white px-4 py-3 text-sm font-extrabold uppercase tracking-[0.1em] text-brand-shell-deep shadow-[0_18px_45px_rgba(15,23,42,0.1)] transition-colors duration-300 hover:border-brand-shell-deep/24 sm:w-auto sm:min-w-64 sm:tracking-[0.12em] lg:mt-8"
                >
                  <span>{defaultButtonLabel}</span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-shell-deep text-white transition-transform duration-300 group-hover:translate-x-1">
                    <MaterialSymbol name="arrow_forward" className="text-base" />
                  </span>
                </Link>
              </div>
            </div>

            <div className="relative order-2 min-h-72 overflow-hidden rounded-[1rem] bg-brand-shell-deep/8 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:min-h-88 md:min-h-104 lg:col-span-5 lg:min-h-136">
              <Image
                src={image?.public_url?.trim() || defaultImageSrc}
                alt={image?.alt_text?.trim() || defaultImageAlt}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 88vw, 42vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-shell-deep/32 via-transparent to-transparent" aria-hidden />
              <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/85 px-3 py-1.5 text-[0.6rem] font-black uppercase tracking-[0.16em] text-brand-primary backdrop-blur-md sm:text-[0.64rem] sm:tracking-[0.18em]">
                Euromiti
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
