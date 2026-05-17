import { listJobsAdmin } from "@/lib/data/careers-admin"
import { listJobApplicationsAdmin, type JobApplicationWithJob } from "@/lib/data/job-applications-admin"
import type { JobRow } from "@/types/supabase-cms"

export type JobPositionWithStats = JobRow & {
  application_count: number
}

export type CareersAdminStats = {
  totalApplications: number
  applicationsLast7Days: number
  openPositions: number
  totalPositions: number
}

export type CareersAdminOverview = {
  stats: CareersAdminStats
  positions: JobPositionWithStats[]
  applications: JobApplicationWithJob[]
}

function applicationsInLastDays(applications: JobApplicationWithJob[], days: number): number {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return applications.filter((a) => {
    if (!a.created_at) return false
    const t = Date.parse(a.created_at)
    return Number.isFinite(t) && t >= cutoff
  }).length
}

export async function loadCareersAdminOverview(): Promise<CareersAdminOverview> {
  const [positions, applications] = await Promise.all([listJobsAdmin(), listJobApplicationsAdmin()])

  const countByJob = new Map<string, number>()
  for (const app of applications) {
    if (!app.job_id) continue
    countByJob.set(app.job_id, (countByJob.get(app.job_id) ?? 0) + 1)
  }

  const positionsWithStats: JobPositionWithStats[] = positions.map((job) => ({
    ...job,
    application_count: countByJob.get(job.id) ?? 0,
  }))

  return {
    stats: {
      totalApplications: applications.length,
      applicationsLast7Days: applicationsInLastDays(applications, 7),
      openPositions: positions.filter((p) => p.is_active).length,
      totalPositions: positions.length,
    },
    positions: positionsWithStats,
    applications,
  }
}
