/** Mock records for Phase 5 admin UI only — replace with Supabase later. */

export type AdminDashboardMetric = {
  id: string
  label: string
  value: string
  hint: string
}

export const mockAdminDashboardMetrics: AdminDashboardMetric[] = [
  { id: "m1", label: "Published news", value: "8", hint: "Last edit 2 days ago" },
  { id: "m2", label: "Active stations", value: "3", hint: "Prishtina · Ferizaj · Gjilan" },
  { id: "m3", label: "Fuel SKUs", value: "3", hint: "Diesel · Euro 95 · LPG" },
  { id: "m4", label: "Media library", value: "24", hint: "JPEG / WebP assets" },
]

export type AdminActivityRow = {
  id: string
  action: string
  context: string
  actor: string
  at: string
}

export const mockAdminActivity: AdminActivityRow[] = [
  {
    id: "a1",
    action: "Price update",
    context: "Euro 95 set to €1.38/L",
    actor: "operations@euromiti.com",
    at: "2026-05-10T08:12:00.000Z",
  },
  {
    id: "a2",
    action: "Draft saved",
    context: "News — “Premium diesel programme”",
    actor: "marketing@euromiti.com",
    at: "2026-05-09T16:40:00.000Z",
  },
  {
    id: "a3",
    action: "Hero copy",
    context: "Homepage headline revised",
    actor: "marketing@euromiti.com",
    at: "2026-05-08T11:05:00.000Z",
  },
]

export type AdminHomepageBlock = {
  id: string
  section: string
  field: string
  value: string
  lastSaved: string
}

export const mockAdminHomepageBlocks: AdminHomepageBlock[] = [
  {
    id: "hb1",
    section: "Hero",
    field: "Headline",
    value: "Premium fuel. Calm stops. Kosovo-wide.",
    lastSaved: "2026-05-08T11:05:00.000Z",
  },
  {
    id: "hb2",
    section: "Hero",
    field: "Primary CTA label",
    value: "Explore services",
    lastSaved: "2026-05-08T11:05:00.000Z",
  },
  {
    id: "hb3",
    section: "Fuel prices",
    field: "Eyebrow",
    value: "Live prices",
    lastSaved: "2026-05-07T09:00:00.000Z",
  },
  {
    id: "hb4",
    section: "Fuel prices",
    field: "Section title",
    value: "Today's Fuel Rates",
    lastSaved: "2026-05-07T09:00:00.000Z",
  },
  {
    id: "hb5",
    section: "Strategic network",
    field: "Intro paragraph",
    value: "Three flagship forecourts — each built for families, commuters, and long-route travel.",
    lastSaved: "2026-05-06T14:22:00.000Z",
  },
]

export type AdminRestaurantBlock = {
  id: string
  component: string
  field: string
  value: string
  lastSaved: string
}

export const mockAdminRestaurantBlocks: AdminRestaurantBlock[] = [
  {
    id: "rb1",
    component: "Editorial hero",
    field: "Eyebrow",
    value: "Chef-led dining",
    lastSaved: "2026-05-05T10:00:00.000Z",
  },
  {
    id: "rb2",
    component: "Editorial hero",
    field: "Display title",
    value: "Restaurant at Euromiti",
    lastSaved: "2026-05-05T10:00:00.000Z",
  },
  {
    id: "rb3",
    component: "Reservation band",
    field: "Supporting line",
    value: "Reserve beside our flagship forecourts.",
    lastSaved: "2026-05-04T18:30:00.000Z",
  },
  {
    id: "rb4",
    component: "Skajnom feature",
    field: "Title",
    value: "Skajnom pairing",
    lastSaved: "2026-05-03T12:45:00.000Z",
  },
]

export type AdminMediaAsset = {
  id: string
  name: string
  path: string
  kind: "image" | "document"
  usedIn: string
  uploadedAt: string
  bytes: number
}

export const mockAdminMediaAssets: AdminMediaAsset[] = [
  {
    id: "img1",
    name: "hero-station-twilight.webp",
    path: "/images/marketing/station-twilight.webp",
    kind: "image",
    usedIn: "Home hero · Locations",
    uploadedAt: "2026-04-22T09:18:00.000Z",
    bytes: 186_422,
  },
  {
    id: "img2",
    name: "restaurant-dining-floor.jpg",
    path: "/images/restaurant/main-dining.jpg",
    kind: "image",
    usedIn: "Restaurant · Homepage",
    uploadedAt: "2026-04-20T11:00:00.000Z",
    bytes: 512_800,
  },
  {
    id: "img3",
    name: "news-diesel-upgrade.webp",
    path: "/images/news/diesel-upgrade.webp",
    kind: "image",
    usedIn: "News archive",
    uploadedAt: "2026-04-28T07:05:00.000Z",
    bytes: 98_210,
  },
  {
    id: "doc1",
    name: "brand-guidelines-placeholder.pdf",
    path: "/docs/internal/brand-v0.pdf",
    kind: "document",
    usedIn: "Internal (mock)",
    uploadedAt: "2026-03-15T13:40:00.000Z",
    bytes: 1_048_576,
  },
]
