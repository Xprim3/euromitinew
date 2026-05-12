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
            className="group inline-flex min-w-0 items-center gap-3"
          >
            {brand?.logoUrl ? (
              <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-[0.9rem] border border-white/14 bg-white/8 shadow-[0_12px_32px_rgba(15,23,42,0.28)]">
                <Image
                  src={brand.logoUrl}
                  alt={brand.logoAlt}
                  fill
                  sizes="2.75rem"
                  className="object-contain p-1.5"
                />
              </span>
            ) : (
              <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-[0.9rem] border border-white/14 bg-white/8 shadow-[0_12px_32px_rgba(15,23,42,0.28)]">
                <span
                  className="absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(255,180,171,0.34),transparent_32%),linear-gradient(135deg,var(--brand-shell-elevated)_0%,var(--brand-shell)_100%)]"
                  aria-hidden
                />
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-brand-accent-soft" aria-hidden />
                <span className="relative font-(family-name:--font-montserrat) text-lg font-black tracking-[-0.08em] text-white">
                  E
                </span>
              </span>
            )}
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
