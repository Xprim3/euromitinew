import { redirect } from "next/navigation"

/** Applications list lives on the main careers admin page. */
export default function AdminJobApplicationsPage() {
  redirect("/admin/careers#candidates")
}
