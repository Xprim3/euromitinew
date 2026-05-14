import {
  LOCATION_HOSPITALITY_EMAIL,
  LOCATION_IDS_ORDERED,
  mockLocations,
} from "@/data/mock/locations"
import { slugLegacyKey } from "@/lib/data/location-visual-fallback"
import type { ResolvedPublicLocation } from "@/lib/data/locations-public"

export type RestaurantReservationStationCard = {
  slug: string
  city: string
  address: string
  phone: string
  openingHours: string
  email: string
}

function findRowForStationKey(
  rows: ResolvedPublicLocation[],
  key: (typeof LOCATION_IDS_ORDERED)[number]
): ResolvedPublicLocation | undefined {
  const exact = rows.find((r) => r.slug === key)
  if (exact) return exact
  return rows.find((r) => slugLegacyKey(r.slug) === key)
}

/**
 * Three restaurant desk cards (Prishtina, Ferizaj, Gjilan) aligned with public `locations` rows.
 * Falls back to `mockLocations` + hospitality emails when a slug is missing or CMS is empty.
 */
export function resolveRestaurantReservationStations(
  resolvedRows: ResolvedPublicLocation[]
): RestaurantReservationStationCard[] {
  return LOCATION_IDS_ORDERED.map((key) => {
    const row = findRowForStationKey(resolvedRows, key)
    const fallbackEmail = LOCATION_HOSPITALITY_EMAIL[key]

    if (row) {
      return {
        slug: row.slug,
        city: row.city,
        address: row.address,
        phone: row.phone,
        openingHours: row.openingHours,
        email: row.contactEmail ?? fallbackEmail,
      }
    }

    const mock = mockLocations.find((m) => m.id === key)
    if (!mock) {
      return {
        slug: key,
        city: key,
        address: "",
        phone: "",
        openingHours: "",
        email: fallbackEmail,
      }
    }

    return {
      slug: mock.id,
      city: mock.city,
      address: mock.address,
      phone: mock.phone,
      openingHours: mock.openingHours,
      email: fallbackEmail,
    }
  })
}
