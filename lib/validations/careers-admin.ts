import { z } from "zod"

/** Euromiti station cities — one position row per city + role title. */
export const JOB_LOCATION_OPTIONS = ["Prishtina", "Ferizaj", "Gjilan"] as const

export type JobLocationOption = (typeof JOB_LOCATION_OPTIONS)[number]

export const JOB_LOCATION_ADMIN_LABELS: Record<JobLocationOption, string> = {
  Prishtina: "Prishtinë",
  Ferizaj: "Ferizaj",
  Gjilan: "Gjilan",
}

export function jobLocationAdminLabel(city: string): string {
  if (city in JOB_LOCATION_ADMIN_LABELS) {
    return JOB_LOCATION_ADMIN_LABELS[city as JobLocationOption]
  }
  return city
}

export const jobAdminFieldsSchema = z.object({
  title: z.string().trim().min(1, "Position title is required.").max(240),
  location_city: z.enum(JOB_LOCATION_OPTIONS, { message: "Select a location." }),
  summary: z.string().trim().max(1000).optional(),
})

export type JobAdminFields = z.infer<typeof jobAdminFieldsSchema>

export function paragraphsFromAdminText(raw: string): string[] {
  return raw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export function linesFromAdminText(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}
