import { cn } from "@/lib/utils"

type MaterialSymbolProps = {
  name: string
  className?: string
}

/** Google Material Symbols Outlined — load the family in `app/layout.tsx`. */
export function MaterialSymbol({ name, className }: MaterialSymbolProps) {
  return (
    <span
      className={cn(
        "material-symbols-outlined inline-flex select-none items-center justify-center align-middle leading-none",
        "[font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24]",
        className
      )}
      aria-hidden
    >
      {name}
    </span>
  )
}
