import type { Metadata } from "next"

import { CareersPageView } from "@/components/careers/CareersPageView"
import { getActiveJobsPublic } from "@/lib/data/careers-public"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Karriera",
  description:
    "Pozicionet e hapura në Euromiti — karburant, restorant, lavazh, market dhe operacione.",
}

export default async function CareersPage() {
  const jobs = await getActiveJobsPublic()
  return <CareersPageView jobs={jobs} />
}
