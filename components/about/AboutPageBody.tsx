import { getAboutContentPublic, resolveAboutPage } from "@/lib/data/about-content-public"

import { AboutPageView } from "./AboutPageView"

export async function AboutPageBody() {
  const { row, media } = await getAboutContentPublic()
  const data = resolveAboutPage(row, media)
  return <AboutPageView data={data} />
}
