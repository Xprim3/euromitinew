"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createSupabaseServerClient } from "@/lib/supabase/server"

const fuelTypeSchema = z.enum(["diesel", "petrol", "lpg"])

const fuelTypeMeta = {
  diesel: { product_key: "diesel", fuel_type: "Diesel" },
  petrol: { product_key: "euro95", fuel_type: "Petrol" },
  lpg: { product_key: "lpg", fuel_type: "LPG" },
} as const

const fuelPriceSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  fuel_type_key: fuelTypeSchema,
  price_numeric: z.coerce.number().min(0, "Price must be 0 or higher").max(999, "Price is too high"),
  currency: z.enum(["EUR", "USD", "ALL"]),
  is_active: z.boolean(),
})

export type FuelPriceSaveState =
  | { ok: null }
  | { ok: true; message: string }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: Record<string, string[] | undefined> }

function checkbox(value: FormDataEntryValue | null) {
  return value === "on" || value === "true"
}

async function ensureAdminProfile(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  user: { id: string; email?: string | null }
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { data: existing, error: existingErr } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (existingErr) return { ok: false, message: existingErr.message }
  if (existing) return { ok: true }

  const { error: insertErr } = await supabase
    .from("admins")
    .insert({ user_id: user.id, display_name: user.email ?? null })

  if (!insertErr) return { ok: true }

  return {
    ok: false,
    message:
      "Your signed-in user is not in the admins table. Apply the latest RLS repair migration, then save again, or add this user to public.admins.",
  }
}

export async function saveFuelPrice(_prev: FuelPriceSaveState, formData: FormData): Promise<FuelPriceSaveState> {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()

    if (authErr || !user) {
      return { ok: false, message: "You must be signed in as an admin to update fuel prices." }
    }

    const adminReady = await ensureAdminProfile(supabase, user)
    if (!adminReady.ok) return { ok: false, message: adminReady.message }

    const parsed = fuelPriceSchema.safeParse({
      id: formData.get("id") ?? "",
      fuel_type_key: formData.get("fuel_type_key"),
      price_numeric: formData.get("price_numeric"),
      currency: formData.get("currency"),
      is_active: checkbox(formData.get("is_active")),
    })

    if (!parsed.success) {
      return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }
    }

    const values = parsed.data
    const meta = fuelTypeMeta[values.fuel_type_key]
    const payload = {
      product_key: meta.product_key,
      fuel_type: meta.fuel_type,
      price_numeric: values.price_numeric,
      currency: values.currency,
      label_status: "updated" as const,
      is_active: values.is_active,
    }

    const query = values.id
      ? supabase.from("fuel_prices").update(payload).eq("id", values.id)
      : supabase.from("fuel_prices").upsert(payload, { onConflict: "product_key" })

    const { error } = await query
    if (error) return { ok: false, message: error.message }

    revalidatePath("/")
    revalidatePath("/admin/fuel-prices")

    return { ok: true, message: "Fuel price saved. The homepage fuel cards will refresh on the next request." }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unexpected error while saving fuel price." }
  }
}
