import { HomeHeroSlider } from "@/components/home/HomeHeroSlider"
import { getPublicHomepageSingleton, heroSliderFromHomepageCMS } from "@/lib/data/homepage-singleton-public"

/** Static shell behind image while Next/Image loads (Supabase or remote). */
export function HomeHeroSkeleton() {
  return (
    <section
      className="relative overflow-hidden bg-[#f9f9ff]"
      aria-busy
      aria-label="Loading hero"
    >
      <div className="absolute inset-x-0 top-0 h-[68%] bg-[#131b2e] md:inset-y-0 md:h-auto md:w-[62%]" />
      <div className="relative mx-auto flex min-h-[clamp(34rem,82svh,49rem)] w-full max-w-[1280px] items-center px-4 py-16 sm:px-6 lg:px-12">
        <div className="w-full max-w-3xl space-y-6 border-white/14 border-l pl-4 sm:pl-5">
          <div className="h-3 w-24 rounded bg-white/14" />
          <div className="h-32 w-full max-w-2xl rounded-lg bg-white/10" />
          <div className="h-20 w-full max-w-xl rounded bg-white/10" />
          <div className="h-10 w-48 rounded bg-white/8" />
        </div>
      </div>
    </section>
  )
}

export async function HomeHero() {
  const { row, media } = await getPublicHomepageSingleton()
  const slides = heroSliderFromHomepageCMS(row, media)
  return <HomeHeroSlider slides={slides} />
}
