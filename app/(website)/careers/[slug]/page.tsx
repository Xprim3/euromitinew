import { redirect } from "next/navigation"

type Props = { params: Promise<{ slug: string }> }

export const dynamic = "force-dynamic"

/** Legacy job URLs → apply form with position pre-selected. */
export default async function CareerDetailPage({ params }: Props) {
  const { slug } = await params
  const trimmed = slug.trim()
  if (!trimmed) redirect("/careers#apliko")
  redirect(`/careers?p=${encodeURIComponent(trimmed)}#apliko`)
}
