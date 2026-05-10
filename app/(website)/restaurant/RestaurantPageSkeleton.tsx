import { Container } from "@/components/layout/Container"

export function RestaurantPageSkeleton() {
  return (
    <>
      <div className="relative h-[min(52vh,420px)] w-full animate-pulse bg-muted" aria-hidden />
      {[0, 1, 2].map((i) => (
        <section key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted"}>
          <Container className="py-14 md:py-16" size={i === 0 ? "wide" : "default"}>
            <div className="grid gap-8 animate-pulse md:grid-cols-12">
              <div className="space-y-4 md:col-span-5">
                <div className="h-3 w-32 rounded bg-muted-foreground/20" />
                <div className="h-14 w-full max-w-md rounded-lg bg-muted-foreground/18" />
                <div className="h-20 w-full max-w-lg rounded-lg bg-muted-foreground/14" />
              </div>
              <div className="md:col-span-7">
                <div className="min-h-[280px] rounded-xl bg-muted-foreground/15 md:aspect-video" />
              </div>
            </div>
          </Container>
        </section>
      ))}
    </>
  )
}
