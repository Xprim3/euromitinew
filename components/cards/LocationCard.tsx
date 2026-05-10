import Link from "next/link"
import { MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LocationAmenity, LocationSummary } from "@/types/public"

import { AmenityIcon, amenityLabels } from "./amenity-icons"

export type LocationCardProps = Pick<
  LocationSummary,
  "city" | "address" | "phone" | "openingHours" | "services" | "googleMapsUrl"
> & { className?: string }

export function LocationCard({
  city,
  address,
  phone,
  openingHours,
  services,
  googleMapsUrl,
  className,
}: LocationCardProps) {
  return (
    <Card className={cn("flex flex-col shadow-(--shadow-euromiti-soft)", className)}>
      <CardHeader>
        <CardTitle>{city}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
        <div className="flex gap-3 text-foreground">
          <MapPin className="size-6 shrink-0 text-primary/80" aria-hidden />
          <span>{address}</span>
        </div>
        <div className="flex gap-3 text-foreground">
          <Phone className="size-6 shrink-0 text-primary/80" aria-hidden />
          <Link href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-primary">
            {phone}
          </Link>
        </div>
        <p>
          <span className="font-semibold text-foreground">Opening hours:</span> {openingHours}
        </p>
        <div>
          <p className="mb-3 font-semibold text-foreground">Services</p>
          <div className="flex flex-wrap gap-3">
            {services.map((service: LocationAmenity) => (
              <div
                key={service}
                className="inline-flex items-center gap-2 rounded-[var(--rounded-sm)] bg-muted px-3 py-1.5 font-medium text-muted-foreground text-xs"
              >
                <AmenityIcon type={service} />
                <span>{amenityLabels[service]}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          variant="secondary"
          className="w-full md:w-auto"
          render={<a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" />}
        >
          Open in Google Maps
        </Button>
      </CardFooter>
    </Card>
  )
}
