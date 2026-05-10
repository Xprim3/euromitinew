import type { ServiceHighlight } from "@/types/public"

export const mockServiceHighlights: ServiceHighlight[] = [
  {
    id: "petrol",
    name: "Elite Fueling",
    shortDescription:
      "High-quality fuels with fast service and dependable forecourts across the Euromiti network.",
    iconKey: "fuel",
    ctaLabel: "View locations",
    ctaHref: "/locations",
  },
  {
    id: "restaurant",
    name: "Restaurant",
    shortDescription:
      "Premium dining for travellers and locals — warm service and menus built for Kosovo tastes.",
    iconKey: "utensils",
    ctaLabel: "Explore restaurant",
    ctaHref: "/restaurant",
    ctaVariant: "default",
  },
  {
    id: "playground",
    name: "Playground",
    shortDescription:
      "Family-friendly play areas so children can recharge while you take a short break.",
    iconKey: "playground",
    ctaLabel: "Find a station",
    ctaHref: "/locations",
  },
  {
    id: "carwash",
    name: "Car Wash",
    shortDescription:
      "Careful cleaning lanes and attentive staff to keep your vehicle looking its best.",
    iconKey: "car",
    ctaLabel: "Find a station",
    ctaHref: "/locations",
  },
  {
    id: "mini_market",
    name: "Mini market",
    shortDescription:
      "Snacks, drinks, essentials, and roadside conveniences curated for everyday journeys.",
    iconKey: "shopping",
    ctaLabel: "Visit us",
    ctaHref: "/locations",
  },
]
