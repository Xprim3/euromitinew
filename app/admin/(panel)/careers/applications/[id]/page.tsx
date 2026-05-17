import { redirect } from "next/navigation"

type Props = { params: Promise<{ id: string }> }

/** Applicant detail is shown inline on the main careers admin page. */
export default async function AdminJobApplicationDetailPage({ params }: Props) {
  const { id } = await params
  const trimmed = id.trim()
  if (!trimmed) redirect("/admin/careers#candidates")
  redirect(`/admin/careers?applicant=${encodeURIComponent(trimmed)}#candidates`)
}
