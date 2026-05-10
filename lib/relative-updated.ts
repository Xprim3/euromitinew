/** Friendly “Updated … ago” string for server-rendered snapshots. */
export function formatUpdatedAgo(isoDate: string): string {
  const ms = Date.now() - new Date(isoDate).getTime()
  if (!Number.isFinite(ms) || ms < 0) {
    return "Updated recently"
  }
  const minutes = Math.floor(ms / 60000)
  if (minutes < 1) return "Updated just now"
  if (minutes < 60) return `Updated ${minutes} min${minutes === 1 ? "" : "s"} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Updated ${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  return `Updated ${days} day${days === 1 ? "" : "s"} ago`
}
