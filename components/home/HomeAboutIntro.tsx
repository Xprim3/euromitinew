import Link from "next/link"
import Image from "next/image"

import { ImageHoverZoom } from "@/components/motion"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { getPublicHomepageSingleton } from "@/lib/data/homepage-singleton-public"

const defaultImageSrc =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBsNa_ar016Z5HDibQivrNY67SzYbUZKe0WG7DpwaQHOKOeVj-l6ZjPd9UkJT1LCPzEazL1wiBZ_RJs9BpODXlhQ15zQeb6u4Nx9Nw-TjdxnGqubvhDM82tXM8JsA2oTjSFJ4y1qXyW3SUrLKH_wekefXvyL7ptLyD22du9apP7qiRMyUQ3K6MmfOBWGJHfTIGApzf9cLuk4qB-e21yQ_5cIDKKx-sHZi2k9Zg-Bh_v3gfG2DeskV7uxZU4VgQlaoepKSRqoRtu7kaI"
const defaultImageAlt = "Euromiti premium station architecture"
const defaultHeadline = "Të ndërtuar në Kosovë. Të besuar në çdo rrugë."
const defaultTeaser =
  "Euromiti është kompani vendore në Kosovë — karburante cilësore dhe shërbime praktike në Prishtinë, Ferizaj dhe Gjilan."
const defaultButtonLabel = "Lexo më shumë për ne"
const defaultButtonHref = "/about"

const ABOUT_HOME_TEASER_MAX = 200

/** Short homepage blurb — full copy lives on /about. */
function aboutHomeTeaser(text: string, maxLen = ABOUT_HOME_TEASER_MAX) {
  const trimmed = text.trim().replace(/\s+/g, " ")
  if (!trimmed) return ""
  if (trimmed.length <= maxLen) return trimmed
  const slice = trimmed.slice(0, maxLen)
  const lastSpace = slice.lastIndexOf(" ")
  const cut = lastSpace > maxLen * 0.55 ? slice.slice(0, lastSpace) : slice
  return `${cut}…`
}

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
  const teaserRaw = row?.about_preview_text?.trim() || defaultTeaser
  const teaser = aboutHomeTeaser(teaserRaw)
  const buttonLabel = row?.about_preview_button_label?.trim() || defaultButtonLabel
  const buttonHref = row?.about_preview_button_href?.trim() || defaultButtonHref

  return (
    <section
      className="relative overflow-hidden bg-brand-surface-tinted px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-12"
      aria-labelledby="about-intro-heading"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 overflow-hidden rounded-[1.2rem] lg:grid-cols-12">
          <div className="relative flex flex-col justify-center bg-brand-accent-soft px-5 py-8 text-brand-shell-deep sm:px-7 sm:py-10 lg:col-span-7 lg:px-10 xl:px-12">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.22),transparent_40%)]"
              aria-hidden
            />
            <div className="relative max-w-2xl">
              <h2
                id="about-intro-heading"
                className="font-(family-name:--font-montserrat) text-[clamp(1.9rem,8vw,2.55rem)] font-extrabold leading-[1.05] tracking-[-0.045em] text-brand-shell-deep sm:text-[clamp(2.35rem,4.4vw,3.7rem)]"
              >
                {headlineCopy.main}
                {headlineCopy.accent ? <> {headlineCopy.accent}</> : null}
              </h2>

              <p className="mt-5 max-w-xl text-[0.98rem] leading-8 text-brand-shell-deep/85 md:text-[1.04rem]">{teaser}</p>

              <SectionAccentRule className="mt-6 !from-brand-shell-deep/55" />
              <Link
                href={buttonHref}
                className="group mt-7 inline-flex w-full max-w-none items-center justify-between gap-4 rounded-[0.85rem] border border-brand-shell-deep/12 bg-brand-shell-deep px-4 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_18px_45px_rgba(10,17,32,0.28)] transition-colors duration-300 hover:bg-brand-primary-hover sm:w-auto sm:min-w-64 sm:px-5 lg:mt-8"
              >
                <span>{buttonLabel}</span>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-brand-shell-deep transition-transform duration-300 group-hover:translate-x-1">
                  <MaterialSymbol name="arrow_forward" className="text-base" />
                </span>
              </Link>
            </div>
          </div>

          <div className="relative min-h-72 overflow-hidden lg:col-span-5 lg:min-h-112">
            <ImageHoverZoom className="absolute inset-0 h-full w-full">
              <Image
                src={image?.public_url?.trim() || defaultImageSrc}
                alt={image?.alt_text?.trim() || defaultImageAlt}
                fill
                sizes="(max-width: 1023px) 100vw, 42vw"
                className="object-cover"
              />
            </ImageHoverZoom>
          </div>
        </div>
      </div>
    </section>
  )
}
