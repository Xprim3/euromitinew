import type { LocationSummary } from "@/types/public"

export const LOCATION_IDS_ORDERED = ["prishtina", "ferizaj", "gjilan"] as const

/** Station-specific routing for concierge / restaurant enquiries (mirror on Location + Restaurant pages). */
export const LOCATION_HOSPITALITY_EMAIL = {
  prishtina: "prishtina@euromiti.com",
  ferizaj: "ferizaj@euromiti.com",
  gjilan: "gjilan@euromiti.com",
} as const satisfies Record<(typeof LOCATION_IDS_ORDERED)[number], string>

export const mockLocations: LocationSummary[] = [
  {
    id: "prishtina",
    city: "Prishtina",
    address: "Rruga X, 10000 Prishtina, Kosovo",
    phone: "+383 44 000 111",
    openingHours: "Open 24/7",
    services: ["petrol", "restaurant", "carwash", "mini_market"],
    googleMapsUrl: "https://maps.google.com/?q=Prishtina",
  },
  {
    id: "ferizaj",
    city: "Ferizaj",
    address: "Main Road Y, 70000 Ferizaj, Kosovo",
    phone: "+383 44 000 222",
    openingHours: "05:30 – 23:00 daily",
    services: ["petrol", "mini_market", "carwash"],
    googleMapsUrl: "https://maps.google.com/?q=Ferizaj",
  },
  {
    id: "gjilan",
    city: "Gjilan",
    address: "North Gate Z, 60000 Gjilan, Kosovo",
    phone: "+383 44 000 333",
    openingHours: "06:00 – 23:30 daily",
    services: ["petrol", "restaurant"],
    googleMapsUrl: "https://maps.google.com/?q=Gjilan",
  },
]
