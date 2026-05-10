import { cn } from "@/lib/utils"

export type SoftGradientBlobTint = "navyMist" | "goldWash" | "redHint"

const tintClasses: Record<SoftGradientBlobTint, string> = {
  navyMist:
    "bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.15)_0%,rgba(15,23,42,0.05)_40%,transparent_72%)]",
  goldWash:
    "bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.14)_0%,rgba(245,158,11,0.04)_42%,transparent_72%)]",
  redHint: "bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.09)_0%,transparent_58%)]",
}

export type SoftGradientBlobProps = {
  tint?: SoftGradientBlobTint
  placement?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
  className?: string
}

/**
 * Large diffuse radial wash — place inside a `relative` parent (hero, split image column, restaurant band).
 * `pointer-events-none` + `-z-10` so copy and CTAs stay on top.
 */
export function SoftGradientBlob({ tint = "navyMist", placement = "top-right", className }: SoftGradientBlobProps) {
  const position =
    placement === "top-right"
      ? "-right-[12%] -top-[18%] md:-right-[8%]"
      : placement === "top-left"
        ? "-left-[12%] -top-[18%] md:-left-[8%]"
        : placement === "bottom-right"
          ? "-bottom-[20%] -right-[12%] md:-right-[6%]"
          : "-bottom-[20%] -left-[12%] md:-left-[6%]"

  return (
    <div
      className={cn(
        "pointer-events-none absolute -z-10 size-[min(72vw,22rem)] md:size-[min(52vw,28rem)]",
        "rounded-full blur-3xl saturate-115",
        tintClasses[tint],
        position,
        "max-md:size-[min(85vw,16rem)] max-md:blur-2xl max-md:opacity-90",
        className
      )}
      aria-hidden
    />
  )
}
