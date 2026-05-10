/** Copy blocks for homepage sections — replace via CMS later. */

export const homeHeroMock = {
  title: "Excellence in every drop.",
  subtitle:
    "Petrol you can rely on across Prishtina, Ferizaj, and Gjilan — paired with hospitality, freshness, and care.",
  primaryCta: { label: "Check locations", href: "/locations" },
  secondaryCta: { label: "Fuel prices snapshot", href: "/#fuel-prices" },
  imageSrc:
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1920&q=80",
  imageAlt: "Euromiti station canopy at dusk with warm lighting",
} as const

export const restaurantHighlightMock = {
  label: "Dining",
  title: "A curated culinary sanctuary",
  description:
    "Seasonal menus, calm interiors, and a team trained to elevate every reservation — Euromiti restaurant welcomes guests beside our flagship forecourts.",
  bullets: ["À la carte & business lunch", "Private dining enquiries", "Events & catering"],
  ctaLabel: "Visit the restaurant page",
  ctaHref: "/restaurant",
  secondaryCta: {
    label: "Find a location with dining",
    href: "/locations",
  },
  imageAlt: "Restaurant interior with warm ambient lighting",
} as const

export const carwashIntroMock = {
  label: "Car care",
  title: "Showroom shine, every visit",
  description:
    "Automated arches, meticulous attendants, and spot-free rinses engineered for Kosovo's roads and weather.",
  ctaLabel: "Find stations with carwash",
  ctaHref: "/locations",
} as const

export const miniMarketIntroMock = {
  label: "Retail",
  title: "Mini market essentials done right",
  description:
    "Fresh pastries, brewed coffee, travel snacks, batteries, chargers, and roadside basics — thoughtfully stocked for drivers and neighbourhoods.",
  ctaLabel: "Find stations with retail",
  ctaHref: "/locations",
} as const
