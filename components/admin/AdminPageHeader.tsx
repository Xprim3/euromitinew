import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type AdminPageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function AdminPageHeader({
  title,
  description,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 border-zinc-800 border-b bg-zinc-950/95 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5 md:px-8 lg:px-10">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white">{title}</h1>
          {description ? <p className="mt-1 max-w-2xl text-sm text-zinc-400">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}
