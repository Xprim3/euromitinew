export default function WebsiteLoading() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 bg-background px-4 py-20">
      <div
        className="size-10 animate-spin rounded-full border-2 border-muted-foreground/25 border-t-secondary"
        aria-hidden
      />
      <p className="text-muted-foreground text-sm">Loading…</p>
    </div>
  )
}
