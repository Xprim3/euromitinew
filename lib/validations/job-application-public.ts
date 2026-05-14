import { z } from "zod"

export const jobApplicationFieldsSchema = z.object({
  job_slug: z.string().trim().min(1).max(200),
  full_name: z.string().trim().min(2, "Shkruani emrin e plotë.").max(200),
  email: z.string().trim().email("Email jo i vlefshëm."),
  phone: z.string().trim().max(40),
  cover_letter: z.string().trim().max(8000),
})

export type JobApplicationFieldsParsed = z.infer<typeof jobApplicationFieldsSchema>
