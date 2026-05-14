"use client"

import Image from "next/image"
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
  if (href === "/careers") return pathname.startsWith("/careers") ? accent : muted
  if (href === "/contact") return pathname.startsWith("/contact") ? accent : muted
  return muted
}

type NavbarProps = {
  brand?: Pick<SiteFooterPublic, "companyName" | "logoUrl" | "logoAlt">
}

const NAV_LOGO_FALLBACK = "/logo-white.svg"

export function Navbar({ brand }: NavbarProps) {
  const pathname = usePathname()
  const companyName = brand?.companyName?.trim() || "Euromiti"
  const logoSrc = brand?.logoUrl?.trim() || NAV_LOGO_FALLBACK
  const logoAlt = brand?.logoAlt?.trim() || `${companyName} logo`

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-brand-shell-deep/95 shadow-lg backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
        <div className="flex items-center gap-4 md:gap-5">
          <Link
            href="/"
            className="group inline-flex shrink-0 rounded-sm outline-offset-4 transition-opacity hover:opacity-[0.92] focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={220}
              height={71}
              priority
              className="block h-10 w-auto max-w-[min(46vw,10.5rem)] shrink-0 object-contain object-left sm:h-11 sm:max-w-48 md:h-12 md:max-w-52"
            />
          </Link>
        </div>

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex xl:gap-10 2xl:gap-12">
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
