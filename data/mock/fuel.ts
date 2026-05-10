import type { FuelPrice } from "@/types/public"

export const mockFuelPrices: FuelPrice[] = [
  {
    id: "diesel",
    fuelType: "Euro Diesel",
    price: 1.34,
    currency: "EUR",
    lastUpdated: "2026-05-10T07:42:00.000Z",
    labelStatus: "active",
  },
  {
    id: "euro95",
    fuelType: "Euro 95",
    price: 1.38,
    currency: "EUR",
    lastUpdated: "2026-05-10T07:45:00.000Z",
    labelStatus: "active",
  },
  {
    id: "lpg",
    fuelType: "LPG",
    price: 0.72,
    currency: "EUR",
    lastUpdated: "2026-05-10T06:58:00.000Z",
    labelStatus: "updated",
  },
]
