import type { Metadata } from "next"

import { CareersAdminClient } from "@/components/admin/CareersAdminClient"
import { ErrorMessage } from "@/components/admin/design-system"
import { loadCareersAdminOverview } from "@/lib/data/careers-admin-overview"

export const metadata: Metadata = {
  title: "Careers",
}

type AdminCareersPageProps = {
  searchParams: Promise<{ applicant?: string }>
}

export default async function AdminCareersPage({ searchParams }: AdminCareersPageProps) {
  try {
    const { applicant } = await searchParams
    const overview = await loadCareersAdminOverview()
    const initialApplicantId = typeof applicant === "string" && applicant.trim() ? applicant.trim() : undefined
    return <CareersAdminClient {...overview} initialApplicantId={initialApplicantId} />
  } catch (e) {
    return (
      <ErrorMessage title="Careers could not load">
        {e instanceof Error ? e.message : "Unexpected error loading careers data."}
      </ErrorMessage>
    )
  }
}
