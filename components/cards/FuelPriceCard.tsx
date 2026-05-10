import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { FuelPrice, FuelPriceStatus } from "@/types/public"

const statusCopy: Record<FuelPriceStatus, string> = {
  active: "Live",
  updated: "Updated",
}

export type FuelPriceCardProps = {
  fuelType: FuelPrice["fuelType"]
  price: FuelPrice["price"]
  currency: FuelPrice["currency"]
  lastUpdated: FuelPrice["lastUpdated"]
  labelStatus: FuelPrice["labelStatus"]
  className?: string
}

function formatFuelPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

function formatUpdated(iso: string) {
  return new Intl.DateTimeFormat("en-XK", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Belgrade",
  }).format(new Date(iso))
}

export function FuelPriceCard({
  fuelType,
  price,
  currency,
  lastUpdated,
  labelStatus,
  className,
}: FuelPriceCardProps) {
  return (
    <Card className={cn("flex flex-col shadow-(--shadow-euromiti-soft)", className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <CardTitle className="text-xl">{fuelType}</CardTitle>
          <Badge variant={labelStatus === "active" ? "success" : "outline"} size="lg">
            {statusCopy[labelStatus]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-heading text-[2.25rem] font-bold tracking-tight text-primary">
          {formatFuelPrice(price, currency)}{" "}
          <span className="font-sans text-base font-semibold tracking-normal text-muted-foreground">
            / L
          </span>
        </p>
      </CardContent>
      <CardFooter className="px-6 pt-3">
        <p className="text-xs text-muted-foreground">
          Updated {formatUpdated(lastUpdated)}
        </p>
      </CardFooter>
    </Card>
  )
}
