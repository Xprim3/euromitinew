import type { NewsArticle, NewsSummary } from "@/types/public"

const articles: NewsArticle[] = [
  {
    id: "expansion-prishtina",
    slug: "expansion-in-prishtina",
    category: "Company Updates",
    title: "Expansion in the Heart of Prishtina",
    excerpt:
      "Euromiti deepens coverage in the capital with renewed forecourt lighting and refreshed retail bays.",
    publishedAt: "2026-04-18",
    imageSrc:
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=960&q=80",
    imageAlt: "Executive handshake overlooking the city skyline",
    contentParagraphs: [
      "Prishtina travellers will notice brighter, safer forecourts as Euromiti completes a capital-wide refresh of LED lighting, canopy refinishing, and modernised pump islands.",
      "Retail bays are being re-merchandised for faster grab-and-go journeys, with expanded coffee, pastry, and travel essentials tailored to morning commuters.",
      "The programme keeps operations live 24/7 on our flagship route while teams work in phased night windows to limit disruption for drivers and corporate accounts.",
      "We extend our thanks to municipal partners and neighbours for their collaboration as we elevate the roadside experience in Kosovo’s economic centre.",
    ],
  },
  {
    id: "zero-emissions",
    slug: "path-to-zero-emissions",
    category: "Sustainability",
    title: "Our Path to Cleaner Operations",
    excerpt:
      "Solar readiness studies and efficiency upgrades are rolling out across every Euromiti location.",
    publishedAt: "2026-03-22",
    imageSrc:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=960&q=80",
    imageAlt: "Solar panels with blue sky",
    contentParagraphs: [
      "Energy efficiency is now an operating priority: we are auditing every location for LED retrofits, refrigeration performance, and optimised HVAC cycles without compromising guest comfort.",
      "Solar feasibility studies are underway roof-by-roof with local engineers, targeting partial on-site generation before wider battery storage trials.",
      "Fleet and logistics partners will see consolidated reporting on embodied carbon for major construction packages as we align procurement with EU disclosure norms.",
      "This roadmap is iterative — we will publish milestone updates as audits complete and pilots go live across Prishtina, Ferizaj, and Gjilan.",
    ],
  },
  {
    id: "diesel-launch",
    slug: "premium-diesel-launch",
    category: "Innovation",
    title: "Premium Diesel Euro 5+ Launch",
    excerpt:
      "Drivers can now access our latest certified diesel blend tuned for modern EURO engines.",
    publishedAt: "2026-02-05",
    imageSrc:
      "https://images.unsplash.com/photo-1581093843351-3c2b14d6d30d?auto=format&fit=crop&w=960&q=80",
    imageAlt: "Close-up of a fuel dispenser nozzle",
    contentParagraphs: [
      "Euromiti Premium Diesel Euro 5+ is formulated for modern high-pressure common rail engines, helping sustain fuel-system cleanliness alongside everyday performance.",
      "Dispensers clearly label the new blend; attendants remain on hand nightly to advise hauliers and touring drivers who rely on torque for Kosovo’s motorway grades.",
      "Quality assurance includes batched certifications with independent labs — traceability slips are archived for corporate fuel partners who audit their supply chains.",
      "Thank you for choosing Euromiti as your dependable roadside partner — we continue to invest in fuels that reflect European standards and Kosovo’s ambitions.",
    ],
  },
  {
    id: "stem-scholarship",
    slug: "stem-scholarship-2026",
    category: "Community",
    title: "Euromiti STEM Scholarship Programme 2026",
    excerpt:
      "Applications are open for students pursuing engineering and energy disciplines — mentoring and awards across our Kosovo network.",
    publishedAt: "2026-01-28",
    imageSrc:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=960&q=80",
    imageAlt: "Team collaborating in a bright workspace",
    contentParagraphs: [
      "Euromiti is deepening its commitment to young talent through a structured STEM scholarship with mentoring from operations and hospitality leaders.",
      "Eligible applicants are enrolled in accredited Kosovo universities and demonstrate academic strength alongside community involvement.",
      "Recipients receive phased awards aligned with semesters, invitations to facility tours, and optional summer placements at Euromiti stations.",
      "The programme reflects our belief that Kosovo’s corridor economy thrives when technical skills meet practical roadside experience.",
    ],
  },
  {
    id: "ferizaj-corridor",
    slug: "ferizaj-route-reliability",
    category: "Company Updates",
    title: "Ferizaj Corridor Hours & Hospitality Refresh",
    excerpt:
      "Extended evening cover and redesigned restaurant pacing keep the central route dependable for fleets and families.",
    publishedAt: "2026-01-12",
    imageSrc:
      "https://images.unsplash.com/photo-1578575437130-527eed3edb54?auto=format&fit=crop&w=960&q=80",
    imageAlt: "Logistics roadway and trucking infrastructure",
    contentParagraphs: [
      "Fleet managers servicing Prishtina–Gjilan routes will find expanded evening concierge support at Euromiti Ferizaj with clarified pump priority lanes.",
      "Restaurant seating and kitchen choreography were tuned for faster table turns during peak commuter windows without shortening guest rest time.",
      "Digital queue boards pilot at the dessert counter minimise crowding — feedback from January guests already shows higher satisfaction scores.",
      "Operational leadership will publish KPI snapshots quarterly so partners can benchmark dwell time against regional averages.",
    ],
  },
  {
    id: "contactless-payments",
    slug: "contactless-rollout-complete",
    category: "Innovation",
    title: "Contactless Payments Across Every Euromiti Pump Lane",
    excerpt:
      "Tap-to-pay terminals now standard indoor and outdoor, reducing queue friction during winter peaks.",
    publishedAt: "2025-12-08",
    imageSrc:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=960&q=80",
    imageAlt: "Payment terminal interaction",
    contentParagraphs: [
      "We completed a network-wide rollout of EMV-certified contactless readers tethered to each dispenser head and cashier island.",
      "Attendants underwent scenario training for receipt requests, VAT documentation, and corporate account reconciliation.",
      "Security operations monitor transaction velocity with anomaly alerts while PCI scope remains partitioned from guest Wi-Fi.",
      "Drivers who prefer prepaid wallet integrations can watch for pilot announcements mid-year as we certify partners.",
    ],
  },
]

function toSummary(a: NewsArticle): NewsSummary {
  return {
    id: a.id,
    slug: a.slug,
    category: a.category,
    title: a.title,
    excerpt: a.excerpt,
    publishedAt: a.publishedAt,
    imageSrc: a.imageSrc,
    imageAlt: a.imageAlt,
  }
}

export const mockNewsArticles: NewsArticle[] = articles

export const mockNewsSummaries: NewsSummary[] = articles.map(toSummary)

export function getNewsArticleBySlug(slug: string): NewsArticle | undefined {
  return articles.find((a) => a.slug === slug)
}
