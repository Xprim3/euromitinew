export default function AdminLoginLoading() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="h-56 w-full max-w-md animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50" />
      <span className="sr-only">Loading sign-in…</span>
    </div>
  )
}
