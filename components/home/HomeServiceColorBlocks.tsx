import { Stagger } from "@/components/motion"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { cn } from "@/lib/utils"

export type HomeServiceColorBlock = {
  id: string
  title: string
  body: string
  icon: string
}

type HomeServiceColorBlocksProps = {
  blocks: readonly HomeServiceColorBlock[]
}

/** Euromiti marketing theme — matches globals.css / homepage bands */
const PANEL_THEME: Record<
  string,
  { panel: string; icon: string }
> = {
  fuel: {
    panel: "bg-primary text-primary-foreground",
    icon: "border-primary-foreground/20 bg-primary-foreground/10 text-brand-accent-soft",
  },
  restaurant: {
    panel: "bg-brand-shell-deep text-white",
    icon: "border-white/20 bg-white/10 text-brand-accent-soft",
  },
  market: {
    panel: "bg-accent text-foreground",
    icon: "border-foreground/15 bg-foreground/8 text-secondary",
  },
  ev: {
    panel: "bg-brand-success text-white",
    icon: "border-white/20 bg-white/10 text-brand-accent-soft",
  },
  carwash: {
    panel: "bg-secondary text-secondary-foreground",
    icon: "border-secondary-foreground/20 bg-secondary-foreground/10 text-brand-accent-soft",
  },
  playground: {
    panel: "bg-brand-shell-mid text-white",
    icon: "border-white/20 bg-white/10 text-brand-accent-soft",
  },
}

const FALLBACK_THEME = PANEL_THEME.fuel

export function HomeServiceColorBlocks({ blocks }: HomeServiceColorBlocksProps) {
  return (
    <Stagger once className="grid w-full grid-cols-1 overflow-hidden sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {blocks.map((block) => {
        const theme = PANEL_THEME[block.id] ?? FALLBACK_THEME
        return (
          <article
            key={block.id}
            className={cn(
              "relative flex min-h-[590px] flex-col items-center justify-center px-6 py-12 text-center sm:px-8 sm:py-14",
              theme.panel
            )}
          >
            <span
              className={cn(
                "mb-6 inline-flex size-16 items-center justify-center rounded-full border backdrop-blur-sm sm:mb-8 sm:size-[4.25rem]",
                theme.icon
              )}
              aria-hidden
            >
              <MaterialSymbol name={block.icon} className="text-[2rem]! sm:text-[2.15rem]!" />
            </span>
            <h3 className="font-(family-name:--font-montserrat) text-[1.2rem] font-extrabold tracking-[-0.02em] sm:text-[1.35rem]">
              {block.title}
            </h3>
            <p className="mt-4 max-w-[18rem] text-[0.88rem] leading-[1.7] opacity-92 sm:mt-5 sm:max-w-[15rem] sm:text-[0.92rem] sm:leading-[1.75] lg:max-w-[16rem] xl:max-w-[18rem]">
              {block.body}
            </p>
          </article>
        )
      })}
    </Stagger>
  )
}
