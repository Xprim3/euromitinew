import { z } from "zod"

import type { LocationAmenity } from "@/types/public"

export const LOCATION_AMENITY_KEYS = ["petrol", "restaurant", "carwash", "mini_market", "ev"] as const satisfies readonly LocationAmenity[]

export const locationSlugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens (e.g. prishtina-flagship).")

export const googleMapsUrlSchema = z
  .string()
  .trim()
  .min(1, "Maps link is required")
  .max(2000)
  .refine(
    (v) =>
      v.startsWith("https://maps.") ||
      v.startsWith("https://www.google.") ||
      v.startsWith("https://goo.gl/") ||
      v.startsWith("http://maps.") ||
      v.startsWith("http://www.google.") ||
      v.startsWith("/"),
    "Paste a Google Maps link (usually starts with https://maps… or https://www.google…)"
  )

/** Empty string clears email in the CMS. */
export const optionalEmailSchema = z
  .string()
  .trim()
  .max(200)
  .refine((s) => s.length === 0 || z.string().email().safeParse(s).success, "Invalid email")

export const locationCoreFieldsSchema = z.object({
  slug: locationSlugSchema,
  city: z.string().trim().min(1, "City is required").max(120),
  page_heading: z.string().trim().max(240),
  page_summary: z.string().trim().max(2400),
  address: z.string().trim().min(1, "Address is required").max(600),
  phone: z.string().trim().min(1, "Phone is required").max(160),
  contact_email: optionalEmailSchema,
  opening_hours: z.string().trim().min(1, "Opening hours are required").max(2400),
  google_maps_url: googleMapsUrlSchema,
  sort_order: z.coerce.number().int().min(0).max(9999),
})

export type LocationCoreFieldsParsed = z.infer<typeof locationCoreFieldsSchema>
