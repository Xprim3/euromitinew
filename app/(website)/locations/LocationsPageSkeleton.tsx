import { Container } from "@/components/layout/Container"

export function LocationsPageSkeleton() {
  return (
    <>
      <div className="relative h-[min(52vh,420px)] w-full animate-pulse bg-muted" aria-hidden />
      {[0, 1, 2].map((section) => (
        <section key={section} className={section % 2 === 0 ? "bg-background" : "bg-muted"}>
          <Container className="euromiti-section">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-11">
              <div className="space-y-4 lg:col-span-5">
                <div className="h-4 w-24 animate-pulse rounded bg-muted-foreground/20" />
                <div className="h-10 w-full max-w-md animate-pulse rounded-md bg-muted-foreground/20" />
                <div className="h-24 w-full animate-pulse rounded-md bg-muted-foreground/15" />
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-muted-foreground/15" />
                  <div className="h-4 w-full max-w-sm animate-pulse rounded bg-muted-foreground/15" />
                </div>
              </div>
              <div className="space-y-4 lg:col-span-7">
                <div className="min-h-[260px] animate-pulse rounded-lg bg-muted-foreground/15 lg:min-h-[360px]" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="min-h-[120px] animate-pulse rounded-md bg-muted-foreground/12" />
                  <div className="min-h-[120px] animate-pulse rounded-md bg-muted-foreground/12" />
                </div>
              </div>
            </div>
          </Container>
        </section>
      ))}
    </>
  )
}
