import Link from "next/link"
import { CarFront, Droplets, ShoppingBasket, ToyBrick, UtensilsCrossed } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ServiceHighlight } from "@/types/public"

const SERVICE_ICONS = {
  fuel: Droplets,
  utensils: UtensilsCrossed,
  car: CarFront,
  shopping: ShoppingBasket,
  playground: ToyBrick,
} satisfies Record<ServiceHighlight["iconKey"], typeof Droplets>

export type ServiceCardProps = Omit<ServiceHighlight, "id" | "iconKey"> & {
  iconKey: ServiceHighlight["iconKey"]
  className?: string
}

export function ServiceCard({
  name,
  shortDescription,
  iconKey,
  ctaLabel,
  ctaHref,
  ctaVariant = "outlinePrimary",
  className,
}: ServiceCardProps) {
  const Icon = SERVICE_ICONS[iconKey]
  return (
    <Card
      className={cn(
        "flex flex-col shadow-(--shadow-euromiti-soft) transition-transform duration-300 hover:-translate-y-px hover:shadow-(--shadow-euromiti-soft-hover)",
        className
      )}
    >
      <CardHeader className="gap-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="shrink-0 rounded-[var(--rounded-DEFAULT)] border border-white/60 bg-primary p-3 shadow-(--shadow-euromiti-primary-sm)">
            <Icon className="size-8 text-primary-foreground" aria-hidden />
          </div>
          <CardTitle className="min-w-[12rem] flex-1 text-balance pt-2">{name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grow pt-3">
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          {shortDescription}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant={ctaVariant} render={<Link href={ctaHref} />}>
          {ctaLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}
