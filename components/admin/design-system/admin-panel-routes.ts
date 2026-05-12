import type { AdminHeaderBreadcrumb } from "./AdminHeader"

/** Route-driven header copy (no icons — safe from server or client). */
export type AdminRouteHeaderMeta = {
  title: string
  subtitle?: string
  breadcrumbs: readonly AdminHeaderBreadcrumb[]
}

const crumbAdmin: AdminHeaderBreadcrumb = { label: "Admin", href: "/admin/dashboard" }

export function adminRouteHeaderMeta(pathname: string): AdminRouteHeaderMeta {
  const p = pathname.replace(/\/$/, "") || "/admin/dashboard"

  if (p === "/admin" || p === "/admin/dashboard") {
    return {
      title: "Dashboard",
      subtitle: "High-level overview and quick links.",
      breadcrumbs: [crumbAdmin, { label: "Dashboard" }],
    }
  }

  if (p === "/admin/homepage") {
    return {
      title: "Homepage",
      subtitle: "Marketing homepage singleton — hero, sections, and media.",
      breadcrumbs: [crumbAdmin, { label: "Homepage" }],
    }
  }

  if (p === "/admin/fuel-prices") {
    return {
      title: "Fuel prices",
      subtitle: "Retail pump prices on the marketing homepage.",
      breadcrumbs: [crumbAdmin, { label: "Fuel prices" }],
    }
  }

  if (p === "/admin/locations/new") {
    return {
      title: "New location",
      subtitle: "Create a forecourt record.",
      breadcrumbs: [crumbAdmin, { label: "Locations", href: "/admin/locations" }, { label: "New" }],
    }
  }

  if (p.startsWith("/admin/locations/")) {
    return {
      title: "Edit location",
      subtitle: "Update address, services, gallery, and visibility.",
      breadcrumbs: [crumbAdmin, { label: "Locations", href: "/admin/locations" }, { label: "Edit" }],
    }
  }

  if (p === "/admin/locations") {
    return {
      title: "Locations",
      subtitle: "Forecourt records for the public `/locations` page.",
      breadcrumbs: [crumbAdmin, { label: "Locations" }],
    }
  }

  if (p === "/admin/services") {
    return {
      title: "Services",
      subtitle: "Services page copy and section media.",
      breadcrumbs: [crumbAdmin, { label: "Services" }],
    }
  }

  if (p === "/admin/restaurant") {
    return {
      title: "Restaurant",
      subtitle: "Restaurant marketing page content.",
      breadcrumbs: [crumbAdmin, { label: "Restaurant" }],
    }
  }

  if (p === "/admin/news/new") {
    return {
      title: "New article",
      subtitle: "Create a news post.",
      breadcrumbs: [crumbAdmin, { label: "News", href: "/admin/news" }, { label: "New" }],
    }
  }

  if (p.startsWith("/admin/news/")) {
    return {
      title: "Edit article",
      subtitle: "Update slug, body, hero image, and publish state.",
      breadcrumbs: [crumbAdmin, { label: "News", href: "/admin/news" }, { label: "Edit" }],
    }
  }

  if (p === "/admin/news") {
    return {
      title: "News",
      subtitle: "Posts for `/news` and article pages.",
      breadcrumbs: [crumbAdmin, { label: "News" }],
    }
  }

  if (p === "/admin/careers/new") {
    return {
      title: "New job",
      subtitle: "Create a careers opening.",
      breadcrumbs: [crumbAdmin, { label: "Careers", href: "/admin/careers" }, { label: "New" }],
    }
  }

  if (p.startsWith("/admin/careers/")) {
    return {
      title: "Edit job",
      subtitle: "Update job details and visibility.",
      breadcrumbs: [crumbAdmin, { label: "Careers", href: "/admin/careers" }, { label: "Edit" }],
    }
  }

  if (p === "/admin/careers") {
    return {
      title: "Careers",
      subtitle: "Manage job openings.",
      breadcrumbs: [crumbAdmin, { label: "Careers" }],
    }
  }

  if (p === "/admin/site") {
    return {
      title: "Contact info",
      subtitle: "Footer, branding, and headquarters contact fields.",
      breadcrumbs: [crumbAdmin, { label: "Contact info" }],
    }
  }

  if (p === "/admin/media") {
    return {
      title: "Media library",
      subtitle: "Uploaded images and files.",
      breadcrumbs: [crumbAdmin, { label: "Media library" }],
    }
  }

  if (p === "/admin/settings") {
    return {
      title: "Settings",
      subtitle: "Admin profile, account, and logout.",
      breadcrumbs: [crumbAdmin, { label: "Settings" }],
    }
  }

  if (p === "/admin/about") {
    return {
      title: "About Page",
      subtitle: "Edit the public About page hero, story, mission, values, and images.",
      breadcrumbs: [crumbAdmin, { label: "About" }],
    }
  }

  return {
    title: "Admin",
    subtitle: undefined,
    breadcrumbs: [crumbAdmin],
  }
}
