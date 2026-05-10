/**
 * Manual row shapes used before `supabase gen types`.
 * Phase 7 — expands as tables are wired.
 */

export type HomepageFuelPricesRow = {
  id: string
  product_key: string
  fuel_type: string
  price_numeric: string | number
  currency: string
  label_status: "active" | "updated"
  updated_at: string
}
