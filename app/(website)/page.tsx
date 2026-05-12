import type { Metadata } from "next"
import { Suspense } from "react"

import { HomeAboutIntro } from "@/components/home/HomeAboutIntro"
import { HomeHero, HomeHeroSkeleton } from "@/components/home/HomeHero"
import { HomeHeroFuelPriceBar, HomeHeroFuelPriceBarSkeleton } from "@/components/home/HomeHeroFuelPriceBar"
import { HomeNewsInsights, HomeNewsInsightsSkeleton } from "@/components/home/HomeNewsInsights"
import { HomeRestaurantLuxury, HomeRestaurantLuxurySkeleton } from "@/components/home/HomeRestaurantLuxury"
import { HomeServicesIntro, HomeServicesIntroSkeleton } from "@/components/home/HomeServicesIntro"
import { HomeStrategicNetwork, HomeStrategicNetworkSkeleton } from "@/components/home/HomeStrategicNetwork"

export const metadata: Metadata = {
  title: "Home",
  description:
    "Euromiti — reliability in every liter. Fuel, hospitality, retail, and car care across Kosovo.",
  openGraph: {
    title: "Euromiti — reliability in every liter",
    description:
      "Fuel, hospitality, retail, and car care across Kosovo — Prishtina, Ferizaj, and Gjilan.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Euromiti",
    description: "Premium forecourts and hospitality across Kosovo.",
  },
}

export const dynamic = "force-dynamic"

/** Brief ISR cache; Saving in `/admin/homepage` calls `revalidatePath("/")` for faster picks-up. */
export const revalidate = 120

export default function HomePage() {
  return (
    <div className="overflow-x-hidden bg-brand-surface-tinted text-primary">
      <Suspense fallback={<HomeHeroSkeleton />}>
        <HomeHero />
      </Suspense>
      <Suspense fallback={<HomeHeroFuelPriceBarSkeleton />}>
        <HomeHeroFuelPriceBar />
      </Suspense>
      <Suspense fallback={<HomeServicesIntroSkeleton />}>
        <HomeServicesIntro />
      </Suspense>
      <Suspense fallback={<HomeRestaurantLuxurySkeleton />}>
        <HomeRestaurantLuxury />
      </Suspense>
      <Suspense fallback={<HomeStrategicNetworkSkeleton />}>
        <HomeStrategicNetwork />
      </Suspense>
      <HomeAboutIntro />
      <Suspense fallback={<HomeNewsInsightsSkeleton />}>
        <HomeNewsInsights />
      </Suspense>
    </div>
  )
}
