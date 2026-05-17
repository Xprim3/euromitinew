import { z } from "zod"

import { JOB_LOCATION_OPTIONS } from "@/lib/validations/careers-admin"

export const jobApplicationFieldsSchema = z.object({
  location_city: z.enum(JOB_LOCATION_OPTIONS, { message: "Zgjidhni lokacionin." }),
  job_slug: z.string().trim().min(1, "Zgjidhni pozicionin.").max(200),
  full_name: z.string().trim().min(2, "Shkruani emrin e plotë.").max(200),
  email: z.string().trim().email("Email jo i vlefshëm."),
  phone: z
    .string()
    .trim()
    .min(6, "Shkruani numrin e telefonit.")
    .max(40),
  cover_letter: z.string().trim().max(8000),
})

export type JobApplicationFieldsParsed = z.infer<typeof jobApplicationFieldsSchema>
