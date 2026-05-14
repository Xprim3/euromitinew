import { z } from "zod"

export const JOB_LOCATION_OPTIONS = ["Prishtina", "Ferizaj", "Gjilan", "Multiple locations"] as const

export const jobAdminFieldsSchema = z.object({
  title: z.string().trim().min(1, "Job title is required.").max(240),
  location_city: z.enum(JOB_LOCATION_OPTIONS),
  summary: z.string().trim().max(1000).optional(),
  description: z.string().max(30000),
  requirements: z.string().max(30000),
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
