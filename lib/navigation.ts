export const PRIMARY_NAV_LINKS = [
  { href: "/", label: "Ballina" },
  { href: "/about", label: "Rreth Nesh" },
  { href: "/locations", label: "Lokacionet" },
  { href: "/restaurant", label: "Restaurant" },
  { href: "/news", label: "Lajme" },
] as const

/** Top bar links aligned to the Euromiti homepage mock (desktop + mobile drawer). */
export const TOPBAR_NAV_LINKS = [
  { href: "/", label: "Ballina" },
  { href: "/about", label: "Rreth Nesh" },
  { href: "/services", label: "Shërbimet" },
  { href: "/locations", label: "Lokacionet" },
  { href: "/restaurant", label: "Restaurant" },
  { href: "/news", label: "Lajme" },
  { href: "/contact", label: "Kontakti" },
] as const

export type PrimaryNavLink = (typeof PRIMARY_NAV_LINKS)[number]
export type TopbarNavLink = (typeof TOPBAR_NAV_LINKS)[number]
