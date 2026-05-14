import { PageImageHero } from "@/components/layout/PageImageHero"
import { RestaurantAtmosphereGallery } from "@/components/restaurant/RestaurantAtmosphereGallery"
import { RestaurantEditorialHero } from "@/components/restaurant/RestaurantEditorialHero"
import { RestaurantEditorialIntroSection } from "@/components/restaurant/RestaurantEditorialIntroSection"
import { RestaurantExperiencePillars } from "@/components/restaurant/RestaurantExperiencePillars"
import { RestaurantReservationStations } from "@/components/restaurant/RestaurantReservationStations"
import { RestaurantSeasonalFoodGallery } from "@/components/restaurant/RestaurantSeasonalFoodGallery"
import { RestaurantSkanomSection } from "@/components/restaurant/RestaurantSkanomSection"
import {
  restaurantExperiencePillarsMock,
  restaurantReservationStationsSectionMock,
} from "@/data/mock/restaurant-page"
import {
  getRestaurantContentPublic,
  resolveRestaurantPage,
} from "@/lib/data/restaurant-content-public"

export async function RestaurantPageBody() {
  const { row, media } = await getRestaurantContentPublic()
  const data = resolveRestaurantPage(row, media)

  return (
    <>
      <PageImageHero
        imageSrc={data.pageHeroImageSrc}
        imageAlt={data.pageHeroImageAlt}
        trail={[{ label: "Home", href: "/" }, { label: "Restaurant" }]}
        title={data.pageHeroTitle}
        description={data.pageHeroSubtitle}
        visualPreset="restaurant"
        priority
      />
      <RestaurantEditorialHero data={data.editorialHero} />
      <RestaurantEditorialIntroSection data={data.editorialIntro} />
      <RestaurantSeasonalFoodGallery data={data.seasonalGallery} />
      <RestaurantSkanomSection data={data.skanom} />
      <RestaurantExperiencePillars data={restaurantExperiencePillarsMock} />
      <RestaurantAtmosphereGallery data={data.atmosphereGallery} />
      <RestaurantReservationStations section={restaurantReservationStationsSectionMock} deskInfo={data.deskInfo} />
    </>
  )
}
