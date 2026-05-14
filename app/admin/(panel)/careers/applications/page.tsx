import type { Metadata } from "next"

import { JobApplicationsManagementClient } from "@/components/admin/JobApplicationsManagementClient"
import { ErrorMessage } from "@/components/admin/design-system"
import { listJobApplicationsAdmin } from "@/lib/data/job-applications-admin"

export const metadata: Metadata = {
  title: "Job applications",
}

async function load(): Promise<
  { ok: true; rows: Awaited<ReturnType<typeof listJobApplicationsAdmin>> } | { ok: false; message: string }
> {
  try {
    const rows = await listJobApplicationsAdmin()
    return { ok: true, rows }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error loading applications." }
  }
}

export default async function AdminJobApplicationsPage() {
  const result = await load()

  if (!result.ok) {
    return <ErrorMessage title="Applications could not load">{result.message}</ErrorMessage>
  }

  return <JobApplicationsManagementClient rows={result.rows} />
}
