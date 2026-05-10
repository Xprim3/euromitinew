export default function AdminPanelLoading() {
  return (
    <div className="flex min-h-svh flex-1 items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div
          className="size-9 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200"
          aria-hidden
        />
        <p className="text-sm text-zinc-500">Loading admin…</p>
      </div>
    </div>
  )
}
