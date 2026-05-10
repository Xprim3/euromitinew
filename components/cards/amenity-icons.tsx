import {
  Droplets,
  PlugZap,
  ShoppingBasket,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
} from "lucide-react"

import type { LocationAmenity } from "@/types/public"

const amenityIcons: Record<LocationAmenity, LucideIcon> = {
  petrol: Droplets,
  restaurant: UtensilsCrossed,
  carwash: Waves,
  mini_market: ShoppingBasket,
  ev: PlugZap,
}

export const amenityLabels: Record<LocationAmenity, string> = {
  petrol: "Petrol",
  restaurant: "Restaurant",
  carwash: "Carwash",
  mini_market: "Mini market",
  ev: "EV",
}

export function AmenityIcon({ type }: { type: LocationAmenity }) {
  const Icon = amenityIcons[type]
  return <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
}
