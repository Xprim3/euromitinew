import Image from "next/image"
import Link from "next/link"

import { Container } from "./Container"

import {
  getSiteFooterPublic,
  type SiteFooterPublic,
} from "@/lib/data/site-contact-public"
import { TOPBAR_NAV_LINKS } from "@/lib/navigation"

const legalLinks = [
  { href: "/privacy-policy", label: "Politika e privatësisë" },
  { href: "/terms", label: "Kushtet" },
] as const

/** Public vector mark when no CMS footer logo is set (`public/logo-white.svg`). */
const FOOTER_BRAND_MARK_SVG = "/logo-white.svg"

const footerLinkClass =
  "inline-block py-1 text-[0.8125rem] font-light leading-snug tracking-[0.01em] text-white/72 transition-colors duration-300 hover:text-brand-accent-soft"

const socialClass =
  "text-[0.68rem] font-light uppercase tracking-[0.2em] text-white/45 transition-colors duration-300 hover:text-brand-accent-soft"

function FooterView({ data }: { data: SiteFooterPublic }) {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-white/6 bg-brand-shell-deep text-white">
      <Container>
        <div className="py-16 md:py-20 lg:py-21">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_1px_minmax(0,1fr)] lg:items-stretch lg:gap-0 xl:grid-cols-[minmax(0,1.1fr)_1px_minmax(0,0.95fr)]">
            <div className="max-w-xl lg:max-w-none lg:pr-10 xl:pr-14">
              <Link
                href="/"
                className="group inline-flex max-w-full items-center rounded-sm outline-offset-4 transition-opacity hover:opacity-[0.9] focus-visible:outline-2 focus-visible:outline-ring"
              >
                {data.logoUrl?.trim() ? (
                  <Image
                    src={data.logoUrl.trim()}
                    alt={data.logoAlt?.trim() || `${data.companyName} logo`}
                    width={360}
                    height={120}
                    className="block h-10 w-auto max-w-[min(72vw,11rem)] object-contain object-left sm:h-11 sm:max-w-52 md:h-12 md:max-w-60"
                    sizes="(max-width: 640px) 176px, (max-width: 1024px) 208px, 240px"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- small static SVG mark; avoids raster optimization pipeline
                  <img
                    src={FOOTER_BRAND_MARK_SVG}
                    alt={data.logoAlt?.trim() || `${data.companyName} logo`}
                    width={360}
                    height={120}
                    decoding="async"
                    className="block h-10 w-auto max-w-[min(72vw,11rem)] object-contain object-left sm:h-11 sm:max-w-52 md:h-12 md:max-w-60"
                  />
                )}
                <span className="sr-only">{data.companyName}</span>
              </Link>
              <p className="mt-6 max-w-lg text-[0.9375rem] font-light leading-[1.8] text-white/62 md:text-[1rem] md:leading-[1.78]">
                {data.footerBody}
              </p>
              {data.socialLinks.length ? (
                <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2.5">
                  {data.socialLinks.map((s) => (
                    <a
                      key={`${s.platform}-${s.url}`}
                      href={s.url}
                      className={socialClass}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {s.platform}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <div
              className="hidden w-px shrink-0 bg-linear-to-b from-transparent from-10% via-white/10 to-transparent to-90% lg:block"
              aria-hidden
            />

            <nav aria-label="Lidhje kryesore" className="lg:pl-10 xl:pl-14">
              <ul className="grid grid-cols-1 gap-x-10 gap-y-1 sm:grid-cols-2 sm:gap-y-0.5">
                {TOPBAR_NAV_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className={footerLinkClass}>
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/#fuel-prices" className={footerLinkClass}>
                    Çmimet e karburantit
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="mt-14 flex flex-col gap-6 border-t border-white/6 pt-10 md:mt-16 md:flex-row md:items-center md:justify-between md:gap-8 md:pt-11">
            <p className="max-w-2xl text-[0.7rem] font-light leading-relaxed tracking-[0.02em] text-white/38">
              © {year} {data.footerCopyrightLine}
              <span className="text-white/28"> · </span>
              Dizajnuar nga{" "}
              <a
                href="https://www.denisjanuzi.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/48 transition-colors duration-300 hover:text-brand-accent-soft"
              >
                Denis Januzi
              </a>
            </p>
            <nav aria-label="Ligjore" className="flex flex-wrap gap-x-8 gap-y-2 md:shrink-0">
              {legalLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[0.68rem] font-light tracking-[0.04em] text-white/42 transition-colors duration-300 hover:text-white/78"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export async function Footer() {
  const data = await getSiteFooterPublic()
  return <FooterView data={data} />
}
