import { Container } from "@/components/layout/Container"

export function ServicesPageSkeleton() {
  return (
    <>
      <div className="relative h-[min(52vh,420px)] w-full animate-pulse bg-muted" aria-hidden />
      {[0, 1, 2, 3].map((i) => (
        <section key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted"}>
          <Container className="euromiti-section">
            <div className="grid gap-7 lg:grid-cols-12 lg:gap-11">
              <div className="lg:col-span-7">
                <div className="min-h-[220px] animate-pulse rounded-[var(--rounded-lg)] bg-muted-foreground/15 md:min-h-[280px] lg:min-h-[360px]" />
              </div>
              <div className="space-y-4 lg:col-span-5">
                <div className="h-8 w-2/3 animate-pulse rounded-md bg-muted-foreground/15" />
                <div className="h-24 w-full animate-pulse rounded-md bg-muted-foreground/10" />
                <div className="space-y-2">
                  <div className="h-5 w-full animate-pulse rounded-md bg-muted-foreground/10" />
                  <div className="h-5 max-w-xl animate-pulse rounded-md bg-muted-foreground/10" />
                </div>
              </div>
            </div>
          </Container>
        </section>
      ))}
    </>
  )
}
