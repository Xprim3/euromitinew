import { Container } from "@/components/layout/Container"
import { Stagger } from "@/components/motion"
import { cn } from "@/lib/utils"

import type { RestaurantExperiencePillarsMock } from "@/data/mock/restaurant-page"

type RestaurantExperiencePillarsProps = {
  data: RestaurantExperiencePillarsMock
  className?: string
}

/** Four-column promise band — thin left rule, Playfair headings, restrained body copy. */
export function RestaurantExperiencePillars({ data, className }: RestaurantExperiencePillarsProps) {
  const { headingId, pillars } = data

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "bg-background py-[clamp(3rem,6.8vw,5.85rem)]",
        className
      )}
    >
      <Container size="wide">
        <h2 id={headingId} className="sr-only">
          What defines the restaurant experience
        </h2>
        <Stagger once className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {pillars.map((pillar, index) => (
            <article
              key={`restaurant-pillar-${index}`}
              className="border-l border-border px-5 py-1 md:px-4 lg:border-border/80 lg:px-6"
            >
              <h3 className="font-playfair mb-4 text-[1.1rem] font-normal tracking-tight text-primary md:text-xl">
                {pillar.title}
              </h3>
              <p className="font-sans text-[0.9rem] font-light leading-[1.75] text-muted-foreground lg:text-[0.9375rem]">
                {pillar.body}
              </p>
            </article>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}
