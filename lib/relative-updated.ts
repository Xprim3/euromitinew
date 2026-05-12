/** Friendly Albanian “updated … ago” string for server-rendered snapshots. */
export function formatUpdatedAgo(isoDate: string): string {
  const ms = Date.now() - new Date(isoDate).getTime()
  if (!Number.isFinite(ms) || ms < 0) {
    return "Përditësuar së fundmi"
  }
  const minutes = Math.floor(ms / 60000)
  if (minutes < 1) return "Përditësuar tani"
  if (minutes < 60) return `Përditësuar ${minutes} min më parë`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Përditësuar ${hours} ${hours === 1 ? "orë" : "orë"} më parë`
  const days = Math.floor(hours / 24)
  return `Përditësuar ${days} ${days === 1 ? "ditë" : "ditë"} më parë`
}
