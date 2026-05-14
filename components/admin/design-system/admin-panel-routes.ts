/** Route-driven header title (no icons — safe from server or client). */
export type AdminRouteHeaderMeta = {
  title: string
}

export function adminRouteHeaderMeta(pathname: string): AdminRouteHeaderMeta {
  const p = pathname.replace(/\/$/, "") || "/admin/dashboard"

  if (p === "/admin" || p === "/admin/dashboard") return { title: "Dashboard" }
  if (p === "/admin/homepage") return { title: "Homepage" }
  if (p === "/admin/fuel-prices") return { title: "Fuel prices" }
  if (p === "/admin/locations/new") return { title: "New location" }
  if (p.startsWith("/admin/locations/")) return { title: "Edit location" }
  if (p === "/admin/locations") return { title: "Locations" }
  if (p === "/admin/services") return { title: "Services" }
  if (p === "/admin/restaurant") return { title: "Restaurant" }
  if (p === "/admin/news/new") return { title: "New article" }
  if (p.startsWith("/admin/news/")) return { title: "Edit article" }
  if (p === "/admin/news") return { title: "News" }
  if (p === "/admin/careers/new") return { title: "New job" }
  if (p === "/admin/careers/applications" || p === "/admin/careers/applications/") return { title: "Job applications" }
  if (p.startsWith("/admin/careers/applications/")) return { title: "Applicant" }
  if (p.startsWith("/admin/careers/")) return { title: "Edit job" }
  if (p === "/admin/careers") return { title: "Careers" }
  if (p === "/admin/site") return { title: "Contact info" }
  if (p === "/admin/media") return { title: "Media library" }
  if (p === "/admin/settings") return { title: "Settings" }
  if (p === "/admin/about") return { title: "About Page" }

  return { title: "Admin" }
}
