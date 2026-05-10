import type { Metadata } from "next"

import {
  restaurantAtmosphereGalleryMock,
  restaurantEditorialHeroMock,
  restaurantEditorialIntroMock,
  restaurantExperiencePillarsMock,
  restaurantReservationStationsSectionMock,
  restaurantSeasonalFoodGalleryMock,
  restaurantSkanomSectionMock,
} from "@/data/mock"
import { PageImageHero } from "@/components/layout/PageImageHero"
import { RestaurantEditorialHero } from "@/components/restaurant/RestaurantEditorialHero"
import { RestaurantEditorialIntroSection } from "@/components/restaurant/RestaurantEditorialIntroSection"
import { RestaurantAtmosphereGallery } from "@/components/restaurant/RestaurantAtmosphereGallery"
import { RestaurantExperiencePillars } from "@/components/restaurant/RestaurantExperiencePillars"
import { RestaurantReservationStations } from "@/components/restaurant/RestaurantReservationStations"
import { RestaurantSeasonalFoodGallery } from "@/components/restaurant/RestaurantSeasonalFoodGallery"
import { RestaurantSkanomSection } from "@/components/restaurant/RestaurantSkanomSection"
import { homeBeyondDesign } from "@/data/mock/homepage-visual"

export const metadata: Metadata = {
  title: "Restaurant",
  description:
    "Euromiti restaurant — chef-led menus, wine service, private dining beside flagship forecourts.",
}

export default function RestaurantPage() {
  return (
    <>
      <PageImageHero
        imageSrc={homeBeyondDesign.restaurant.mainImage}
        imageAlt="Premium restaurant dining at Euromiti"
        trail={[{ label: "Home", href: "/" }, { label: "Restaurant" }]}
        title="Restaurant"
        description={
          "Chef-led dining, curated menus, and hospitality standards designed to elevate every Euromiti stop."
        }
        visualPreset="restaurant"
        priority
      />
      <RestaurantEditorialHero data={restaurantEditorialHeroMock} />

      <RestaurantEditorialIntroSection data={restaurantEditorialIntroMock} />

      <RestaurantSeasonalFoodGallery data={restaurantSeasonalFoodGalleryMock} />

      <RestaurantSkanomSection data={restaurantSkanomSectionMock} />

      <RestaurantExperiencePillars data={restaurantExperiencePillarsMock} />

      <RestaurantAtmosphereGallery data={restaurantAtmosphereGalleryMock} />

      <RestaurantReservationStations section={restaurantReservationStationsSectionMock} />
    </>
  )
}
