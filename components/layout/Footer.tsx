import Image from "next/image"
import Link from "next/link"

import { Container } from "./Container"

import {
  getSiteFooterPublic,
  type SiteFooterPublic,
} from "@/lib/data/site-contact-public"
import { TOPBAR_NAV_LINKS } from "@/lib/navigation"

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Legal" },
] as const

const footerLinkClass =
  "text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/68 transition-colors duration-200 hover:text-brand-accent-soft"

const socialClass =
  "text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/55 transition-colors hover:text-brand-accent-soft"

function FooterView({ data }: { data: SiteFooterPublic }) {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-white/8 border-t bg-brand-shell-deep py-14 text-white md:py-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 lg:gap-y-14">
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-flex max-w-full items-center gap-3 font-(family-name:--font-montserrat) text-xl font-extrabold tracking-tighter text-white uppercase transition hover:text-brand-accent-soft"
            >
              {data.logoUrl ? (
                <span className="relative block h-9 w-28 shrink-0">
                  <Image
                    src={data.logoUrl}
                    alt={data.logoAlt}
                    fill
                    sizes="7rem"
                    className="object-contain object-left"
                  />
                </span>
              ) : null}
              <span className="min-w-0 leading-tight">{data.companyName}</span>
            </Link>
            <p className="mt-5 max-w-md whitespace-pre-line text-[0.9375rem] leading-[1.65] text-white/58">{data.footerBody}</p>
            {data.socialLinks.length ? (
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {data.socialLinks.map((s) => (
                  <a key={`${s.platform}-${s.url}`} href={s.url} className={socialClass} target="_blank" rel="noopener noreferrer">
                    {s.platform}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-7">
            <p className="mb-5 text-[0.65rem] font-black uppercase tracking-[0.22em] text-brand-accent-soft">Navigate</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 sm:grid-cols-3">
              {TOPBAR_NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className={footerLinkClass}>
                  {label}
                </Link>
              ))}
              <Link href="/#fuel-prices" className={footerLinkClass}>
                Fuel prices
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-white/8 border-t pt-8 md:mt-16 md:flex-row md:items-center md:justify-between md:gap-6">
          <p className="text-[0.7rem] font-medium tracking-[0.04em] text-white/42">
            © {year} {data.footerCopyrightLine}. Website designed by{" "}
            <a
              href="https://www.denisjanuzi.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/62 transition-colors hover:text-brand-accent-soft"
            >
              Denis Januzi
            </a>
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/48 transition-colors hover:text-white/85"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  )
}

export async function Footer() {
  const data = await getSiteFooterPublic()
  return <FooterView data={data} />
}
