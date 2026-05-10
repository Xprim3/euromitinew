import Link from "next/link"

import { Container } from "./Container"

import { TOPBAR_NAV_LINKS } from "@/lib/navigation"

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Legal" },
] as const

const footerLinkClass =
  "text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/68 transition-colors duration-200 hover:text-brand-accent-soft"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-white/8 border-t bg-black py-14 text-white md:py-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 lg:gap-y-14">
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-block font-[family-name:var(--font-montserrat)] text-xl font-extrabold tracking-tighter text-white uppercase transition hover:text-brand-accent-soft"
            >
              Euromiti
            </Link>
            <p className="mt-5 max-w-md text-[0.9375rem] leading-[1.65] text-white/58">
              Pioneering transit fuel and hospitality experiences in Kosovo — built on safety, brightness, and craft
              across Prishtina, Ferizaj, and Gjilan.
            </p>
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
          <p className="text-[0.7rem] font-medium tracking-[0.04em] text-white/42">© {year} Euromiti Kosovo</p>
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
