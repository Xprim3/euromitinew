import type { Metadata } from "next"

import { CareersPageView } from "@/components/careers/CareersPageView"
import { getApplicationJobOptionsPublic } from "@/lib/data/careers-public"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Karriera",
  description:
    "Aplikoni për punësim në Euromiti — zgjidhni lokacionin, pozicionin dhe dërgoni aplikimin tuaj online.",
}

type CareersPageProps = {
  searchParams: Promise<{ p?: string }>
}

export default async function CareersPage({ searchParams }: CareersPageProps) {
  const { p } = await searchParams
  const positions = await getApplicationJobOptionsPublic()
  const defaultPositionSlug = typeof p === "string" && p.trim() ? p.trim() : undefined
  return <CareersPageView positions={positions} defaultPositionSlug={defaultPositionSlug} />
}
