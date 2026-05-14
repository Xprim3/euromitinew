"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { TOPBAR_NAV_LINKS } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import type { SiteFooterPublic } from "@/lib/data/site-contact-public"

import { MobileMenu } from "./MobileMenu"

const accent = "text-brand-accent-soft"
const muted = "text-white/70 hover:text-white"

function navLinkTone(href: string, pathname: string) {
  if (href === "/") return pathname === "/" ? accent : muted
  if (href === "/about") return pathname.startsWith("/about") ? accent : muted
  if (href === "/services") return pathname.startsWith("/services") ? accent : muted
  if (href === "/locations") return pathname.startsWith("/locations") ? accent : muted
  if (href === "/restaurant") return pathname.startsWith("/restaurant") ? accent : muted
  if (href === "/news") return pathname.startsWith("/news") ? accent : muted
  if (href === "/contact") return pathname.startsWith("/contact") ? accent : muted
  return muted
}

type NavbarProps = {
  brand?: Pick<SiteFooterPublic, "companyName" | "logoUrl" | "logoAlt">
}

export function Navbar({ brand }: NavbarProps) {
  const pathname = usePathname()
  const companyName = brand?.companyName?.trim() || "Euromiti"

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-brand-shell-deep/95 shadow-lg backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
        <div className="flex items-center gap-4 md:gap-5">
          <Link
            href="/"
            className="group inline-flex min-w-0 items-center gap-3 md:gap-4"
          >
            <span
              aria-hidden
              className="h-11 w-px shrink-0 bg-linear-to-b from-transparent via-brand-accent-gold/50 to-transparent sm:h-12"
            />
            <span className="min-w-0 leading-none">
              <span className="block truncate font-(family-name:--font-montserrat) text-[1.05rem] font-black uppercase tracking-[0.16em] text-white transition-colors group-hover:text-brand-accent-soft sm:text-lg">
                {companyName}
              </span>
              <span className="mt-1 block truncate text-[0.57rem] font-bold uppercase tracking-[0.22em] text-white/48 sm:text-[0.62rem]">
                Petrol & Restaurant
              </span>
            </span>
          </Link>
        </div>

        <nav aria-label="Main" className="hidden items-center gap-5 lg:flex xl:gap-8">
          {TOPBAR_NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "whitespace-nowrap text-xs font-bold tracking-wide uppercase transition-colors",
                navLinkTone(href, pathname)
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="lg:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
