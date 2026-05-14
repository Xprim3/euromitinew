import type { Metadata } from "next"

import { FuelPricesAdminClient, type AdminFuelPriceRow } from "@/components/admin/FuelPricesAdminClient"
import { ErrorMessage } from "@/components/admin/design-system"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Fuel Prices",
}

async function loadFuelPrices(): Promise<
  | { ok: true; rows: AdminFuelPriceRow[] }
  | { ok: false; message: string }
> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from("fuel_prices")
      .select("id, product_key, fuel_type, price_numeric, currency, label_status, is_active, updated_at")
      .order("product_key", { ascending: true })

    if (error) return { ok: false, message: error.message }

    return {
      ok: true,
      rows: (data ?? []).map((row) => {
        const r = row as Record<string, unknown>
        return {
          id: String(r.id ?? ""),
          product_key: String(r.product_key ?? ""),
          fuel_type: String(r.fuel_type ?? ""),
          price_numeric: typeof r.price_numeric === "number" || typeof r.price_numeric === "string" ? r.price_numeric : 0,
          currency: String(r.currency ?? "EUR"),
          label_status: String(r.label_status ?? "active"),
          is_active: r.is_active !== false,
          updated_at: String(r.updated_at ?? new Date().toISOString()),
        }
      }),
    }
  } catch {
    return {
      ok: false,
      message:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    }
  }
}

export default async function AdminFuelPricesPage() {
  const result = await loadFuelPrices()

  return (
    <div className="space-y-6">
      {!result.ok ? (
        <ErrorMessage title="Fuel prices could not load">{result.message}</ErrorMessage>
      ) : (
        <FuelPricesAdminClient rows={result.rows} />
      )}
    </div>
  )
}
