import { cache } from "react"

import { mockFuelPrices } from "@/data/mock/fuel"
import { createPublicSupabaseServerClient } from "@/lib/supabase/public-server-client"
import type { HomepageFuelPricesRow } from "@/types/supabase-phase7"
import type { FuelPriceStatus } from "@/types/public"

export type HomepageFuelCard = {
  /** Stable key — `fuel_prices.product_key` when from DB else mock `id`. */
  productKey: string
  headlineLabel: string
  price: number
  currencyCode: string
  labelStatus: FuelPriceStatus
  updatedAtIso: string
}

export type HomepageFuelPricesResult = {
  items: HomepageFuelCard[]
  source: "supabase" | "fallback"
  status: "ready" | "empty" | "error" | "unconfigured"
  message?: string
}

const PREFERRED_KEYS = ["diesel", "euro95", "lpg"] as const

function sortKey(pk: string) {
  const i = PREFERRED_KEYS.indexOf(pk as (typeof PREFERRED_KEYS)[number])
  return i === -1 ? PREFERRED_KEYS.length : i
}

const DEFAULT_LABELS: Record<string, string> = {
  diesel: "Naftë Euro 6",
  euro95: "Benzinë 95",
  lpg: "Gaz LPG",
}

function headlineForProductKey(pk: string, fuelType: string) {
  return DEFAULT_LABELS[pk] ?? fuelType
}

function rowsFromMock(): HomepageFuelCard[] {
  return mockFuelPrices.map((p) => ({
    productKey: p.id,
    headlineLabel: headlineForProductKey(p.id, p.fuelType),
    price: p.price,
    currencyCode: p.currency,
    labelStatus: p.labelStatus,
    updatedAtIso: p.lastUpdated,
  }))
}

function mapDb(rows: HomepageFuelPricesRow[]): HomepageFuelCard[] {
  const sorted = [...rows].sort((a, b) => sortKey(a.product_key) - sortKey(b.product_key))
  return sorted.map((r) => {
    const pk = r.product_key
    const numeric = typeof r.price_numeric === "number" ? r.price_numeric : Number(r.price_numeric)
    const status = r.label_status === "updated" ? "updated" : "active"
    return {
      productKey: pk,
      headlineLabel: headlineForProductKey(pk, r.fuel_type),
      price: Number.isFinite(numeric) ? numeric : 0,
      currencyCode: (r.currency ?? "EUR").trim(),
      labelStatus: status,
      updatedAtIso: r.updated_at,
    }
  })
}

/**
 * Live network fuel SKUs. Supabase is the normal source; mock rows are only used
 * as an emergency fallback when configuration/querying fails.
 */
export const getHomepageFuelPrices = cache(async (): Promise<HomepageFuelPricesResult> => {
  const supabase = createPublicSupabaseServerClient()
  if (!supabase) {
    return {
      items: rowsFromMock(),
      source: "fallback",
      status: "unconfigured",
      message: "Supabase is not configured, so emergency fallback prices are shown.",
    }
  }

  const { data, error } = await supabase
    .from("fuel_prices")
    .select("id, product_key, fuel_type, price_numeric, currency, label_status, updated_at")
    .eq("is_active", true)

  if (error) {
    console.warn("[getHomepageFuelPrices] Supabase error, using mock fallback:", error.message)
    return {
      items: rowsFromMock(),
      source: "fallback",
      status: "error",
      message: "Fuel prices could not be loaded from Supabase, so emergency fallback prices are shown.",
    }
  }

  if (!data?.length) {
    return {
      items: [],
      source: "supabase",
      status: "empty",
      message: "No active fuel prices are currently configured.",
    }
  }

  return {
    items: mapDb(data as HomepageFuelPricesRow[]),
    source: "supabase",
    status: "ready",
  }
})
