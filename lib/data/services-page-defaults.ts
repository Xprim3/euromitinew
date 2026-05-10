import { homeBeyondDesign, homeHeroDesign } from "@/data/mock/homepage-visual"

/** Static layout defaults for `/services` when CMS row is missing fields. Mirrors prior marketing mocks. */
export const SERVICES_PAGE_DEFAULT_HERO = {
  title: "Services",
  description: "Fuel, food, vehicle care, and everyday convenience across Prishtina, Ferizaj, and Gjilan.",
  imageSrc: homeHeroDesign.imageSrc,
  imageAlt: "Euromiti premium station services",
} as const

export type ServicesSectionId = "petrol" | "restaurant" | "carwash" | "mini-market"

/** Base panels (CTA, icon, petrol bullets/restaurant bullets etc. from original design file). */
export const SERVICES_PANEL_DEFAULTS = [
  {
    id: "petrol" as const,
    title: "Petrol Station",
    description:
      "Euromiti provides reliable fuel services designed for drivers, travelers, and businesses. Our stations focus on convenience, clean service, and easy access, with current fuel prices and trusted service across our locations.",
    highlights: [
      "Reliable fuel service",
      "Easy access locations",
      "Updated fuel pricing",
      "Professional customer service",
    ],
    ctaLabel: "View Locations",
    ctaHref: "/locations",
    imageSrc: homeHeroDesign.imageSrc,
    imageAlt: "Euromiti petrol station with car fueling",
    icon: "local_gas_station",
  },
  {
    id: "restaurant" as const,
    title: "Premium Restaurant",
    description:
      "Euromiti offers a premium restaurant experience with quality food, a comfortable environment, and welcoming service. The restaurant is designed to give customers a pleasant and relaxing stop during their visit.",
    highlights: [
      "Fresh food",
      "Comfortable dining space",
      "Quality service",
      "Premium experience",
    ],
    ctaLabel: "Explore Restaurant",
    ctaHref: "/restaurant",
    imageSrc: homeBeyondDesign.restaurant.mainImage,
    imageAlt: "Premium restaurant dining at Euromiti",
    icon: "restaurant",
  },
  {
    id: "carwash" as const,
    title: "Carwash",
    description:
      "Euromiti’s carwash service gives drivers a practical and professional way to keep their vehicles clean. It is designed as a convenient stop for everyday use and customer comfort.",
    highlights: [
      "Clean vehicle care",
      "Professional washing service",
      "Convenient location access",
      "Practical for everyday drivers",
    ],
    ctaLabel: "View Locations",
    ctaHref: "/locations",
    imageSrc: homeBeyondDesign.secondaryServices[2].imageSrc,
    imageAlt: "Professional Euromiti carwash service",
    icon: "local_car_wash",
  },
  {
    id: "mini-market" as const,
    title: "Mini Market",
    description:
      "Our mini market provides everyday convenience for drivers and visitors, offering drinks, snacks, travel essentials, and daily products in one easy stop.",
    highlights: ["Drinks and snacks", "Travel essentials", "Daily products", "Convenient shopping"],
    ctaLabel: "View Locations",
    ctaHref: "/locations",
    imageSrc: homeBeyondDesign.secondaryServices[1].imageSrc,
    imageAlt: "Mini market products and essentials at Euromiti",
    icon: "shopping_bag",
  },
] as const

export type ServicesPanelDefault = (typeof SERVICES_PANEL_DEFAULTS)[number]
