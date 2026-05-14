import { Container } from "@/components/layout/Container"
import { cn } from "@/lib/utils"

export function LocationsPageSkeleton() {
  return (
    <>
      <div className="relative h-[min(40svh,22rem)] w-full animate-pulse bg-muted md:h-[min(36svh,20rem)]" aria-hidden />
      <section className="border-t border-brand-shell-deep/10 bg-white">
        <Container className="euromiti-section-loose">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <div className="mx-auto h-6 w-32 animate-pulse rounded-md bg-muted-foreground/15" />
            <div className="mx-auto h-px w-12 animate-pulse bg-muted-foreground/20" />
            <div className="mx-auto h-8 max-w-lg animate-pulse rounded-md bg-muted-foreground/20" />
            <div className="mx-auto h-20 max-w-2xl animate-pulse rounded-md bg-muted-foreground/10" />
          </div>
        </Container>
      </section>
      {[0, 1, 2].map((i) => {
        const imageLeft = i % 2 === 0
        const dark = i % 2 === 1
        const imageBlock = (
          <div
            className={cn(
              "min-h-[min(52vw,22rem)] animate-pulse sm:min-h-96 lg:min-h-112",
              dark ? "bg-neutral-800" : "bg-muted-foreground/20"
            )}
            aria-hidden
          />
        )
        const textBlock = (
          <div
            className={cn("space-y-5 px-8 py-14 lg:px-14 lg:py-20", dark ? "bg-brand-shell-deep" : "bg-[#faf8f5]")}
            aria-hidden
          >
            <div className={cn("h-3 w-24 animate-pulse rounded-full", dark ? "bg-white/15" : "bg-muted-foreground/20")} />
            <div className={cn("h-9 max-w-sm animate-pulse rounded-md", dark ? "bg-white/10" : "bg-muted-foreground/15")} />
            <div className="space-y-2">
              <div className={cn("h-4 w-full animate-pulse rounded", dark ? "bg-white/10" : "bg-muted-foreground/12")} />
              <div className={cn("h-4 max-w-md animate-pulse rounded", dark ? "bg-white/10" : "bg-muted-foreground/12")} />
            </div>
            <div className={cn("h-px w-16", dark ? "bg-white/20" : "bg-muted-foreground/20")} />
            <div className="space-y-3 pt-2">
              <div className={cn("h-4 w-full animate-pulse rounded", dark ? "bg-white/10" : "bg-muted-foreground/12")} />
              <div className={cn("h-4 max-w-lg animate-pulse rounded", dark ? "bg-white/10" : "bg-muted-foreground/12")} />
            </div>
            <div className="flex gap-2 pt-4">
              <div className={cn("h-8 w-20 animate-pulse", dark ? "bg-white/10" : "bg-muted-foreground/12")} />
              <div className={cn("h-8 w-16 animate-pulse", dark ? "bg-white/10" : "bg-muted-foreground/12")} />
            </div>
          </div>
        )
        return (
          <section key={i} className={cn("border-t border-black/6", dark ? "bg-brand-shell-deep" : "bg-[#ebe6df]")}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {imageLeft ? (
                <>
                  <div className="min-h-0 max-lg:row-start-1">{imageBlock}</div>
                  <div className="min-h-0 max-lg:row-start-2">{textBlock}</div>
                </>
              ) : (
                <>
                  <div className="min-h-0 max-lg:col-start-1 max-lg:row-start-2">{textBlock}</div>
                  <div className="min-h-0 max-lg:col-start-1 max-lg:row-start-1">{imageBlock}</div>
                </>
              )}
            </div>
          </section>
        )
      })}
    </>
  )
}
