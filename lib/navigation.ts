export const PRIMARY_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/locations", label: "Locations" },
  { href: "/restaurant", label: "Restaurant" },
  { href: "/news", label: "News" },
] as const

/** Top bar links aligned to the Euromiti homepage mock (desktop + mobile drawer). */
export const TOPBAR_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/locations", label: "Locations" },
  { href: "/restaurant", label: "Restaurant" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact us" },
] as const

export type PrimaryNavLink = (typeof PRIMARY_NAV_LINKS)[number]
export type TopbarNavLink = (typeof TOPBAR_NAV_LINKS)[number]
