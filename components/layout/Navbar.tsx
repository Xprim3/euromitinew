"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { TOPBAR_NAV_LINKS } from "@/lib/navigation"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
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
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black/95 shadow-lg backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
        <div className="flex items-center gap-4 md:gap-5">
          <div className="md:hidden">
            <MobileMenu />
          </div>
          <Link
            href="/"
            className="inline-flex max-w-[12rem] items-center gap-3 font-[family-name:var(--font-montserrat)] text-xl font-extrabold tracking-tighter text-white uppercase"
          >
            {brand?.logoUrl ? (
              <span className="relative block h-9 w-24 shrink-0">
                <Image
                  src={brand.logoUrl}
                  alt={brand.logoAlt}
                  fill
                  sizes="6rem"
                  className="object-contain object-left"
                />
              </span>
            ) : null}
            <span className="min-w-0 truncate">{companyName}</span>
          </Link>
        </div>

        <nav aria-label="Main" className="hidden items-center gap-5 lg:gap-8 xl:gap-10 md:flex">
          {TOPBAR_NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-xs font-bold tracking-wide uppercase transition-colors",
                navLinkTone(href, pathname)
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="md:hidden">
          <Link
            href="/contact"
            aria-label="Contact Us"
            className="flex size-11 items-center justify-center rounded-full bg-brand-red-vivid text-white shadow-(--shadow-euromiti-secondary-sm) transition hover:bg-secondary"
          >
            <MaterialSymbol name="call" className="text-xl! text-white/95" />
          </Link>
        </div>
      </div>
    </header>
  )
}
