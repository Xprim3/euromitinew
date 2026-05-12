import type { Metadata } from "next"

import { CareersManagementClient } from "@/components/admin/CareersManagementClient"
import { ErrorMessage } from "@/components/admin/design-system"
import { listJobsAdmin } from "@/lib/data/careers-admin"

export const metadata: Metadata = {
  title: "Careers",
}

async function loadJobs(): Promise<{ ok: true; rows: Awaited<ReturnType<typeof listJobsAdmin>> } | { ok: false; message: string }> {
  try {
    const rows = await listJobsAdmin()
    return { ok: true, rows }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error loading jobs." }
  }
}

export default async function AdminCareersPage() {
  const result = await loadJobs()

  if (!result.ok) {
    return <ErrorMessage title="Careers content could not load">{result.message}</ErrorMessage>
  }

  return <CareersManagementClient rows={result.rows} />
}
