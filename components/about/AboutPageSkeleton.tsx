/** Layout-shaped placeholder while `/about` resolves Supabase + media. */
export function AboutPageSkeleton() {
  return (
    <div aria-busy aria-label="Loading about page" className="animate-pulse">
      <div className="relative h-[clamp(260px,min(52vh,26rem),480px)] w-full bg-muted" />
      <div className="bg-background px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
          <div className="aspect-4/5 rounded-lg bg-muted lg:col-span-5" />
          <div className="space-y-4 lg:col-span-7">
            <div className="h-9 w-2/5 rounded-md bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-4/5 rounded bg-muted" />
          </div>
        </div>
      </div>
      <div className="border-y bg-brand-shell-deep px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="h-32 w-full rounded-xl bg-muted" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-48 rounded-xl bg-muted/80" />
            <div className="h-48 rounded-xl bg-muted/80" />
          </div>
        </div>
      </div>
      <div className="bg-background px-4 py-12">
        <div className="mx-auto h-64 max-w-6xl rounded-xl bg-muted" />
      </div>
    </div>
  )
}
