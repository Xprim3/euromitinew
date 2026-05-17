import { SITE_DEFAULT_DESCRIPTION, SITE_DEFAULT_TITLE } from "@/lib/seo/constants"
import { buildPageMetadata } from "@/lib/seo/metadata"

/** Static public routes — Albanian SEO copy. */
export const staticPageSeo = {
  home: {
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    path: "/",
    absoluteTitle: true,
  },
  about: {
    title: "Rreth Nesh",
    description:
      "Njihuni me Euromitin — rrjet modern stacionesh në Kosovë me karburant, restaurant, autolarje dhe mini market në Prishtinë, Ferizaj dhe Gjilan.",
    path: "/about",
  },
  services: {
    title: "Shërbimet",
    description:
      "Shërbimet Euromiti në Kosovë: karburant, restaurant, autolarje, mini market dhe më shumë — në Prishtinë, Ferizaj dhe Gjilan.",
    path: "/services",
  },
  locations: {
    title: "Pikat e Shitjes",
    description:
      "Gjeni stacionet Euromiti në Prishtinë, Ferizaj dhe Gjilan — adresa, orar, karburant, restaurant, autolarje dhe mini market.",
    path: "/locations",
  },
  restaurant: {
    title: "Restaurant",
    description:
      "Restaurant Euromiti pranë stacioneve tona — kuzhinë e kujdesshme dhe mikpritje premium në Prishtinë, Ferizaj dhe Gjilan.",
    path: "/restaurant",
  },
  news: {
    title: "Lajme",
    description:
      "Lajmet dhe përditësimet nga Euromiti — zhvillime në stacione, karburant, restaurant dhe komunitet në Kosovë.",
    path: "/news",
  },
  careers: {
    title: "Karriera",
    description:
      "Aplikoni për punësim në Euromiti — zgjidhni lokacionin (Prishtinë, Ferizaj, Gjilan), pozicionin dhe dërgoni aplikimin online.",
    path: "/careers",
  },
  contact: {
    title: "Kontakt",
    description:
      "Kontaktoni Euromitin — telefon, email dhe orar. Na shkruani për karburant, restaurant, autolarje ose pyetje të përgjithshme në Kosovë.",
    path: "/contact",
  },
  privacy: {
    title: "Politika e Privatësisë",
    description: "Politika e privatësisë së Euromitit — si trajtojmë të dhënat tuaja në faqen zyrtare.",
    path: "/privacy-policy",
    noIndex: true,
  },
  terms: {
    title: "Kushtet e Përdorimit",
    description: "Kushtet e përdorimit të faqes zyrtare të Euromitit.",
    path: "/terms",
    noIndex: true,
  },
  notFound: {
    title: "Faqja nuk u gjet",
    description: "Kjo faqe nuk ekziston ose është zhvendosur. Kthehuni te faqja kryesore e Euromitit.",
    path: "/404",
    noIndex: true,
    absoluteTitle: true,
  },
} as const

export function metadataForStaticPage(key: keyof typeof staticPageSeo) {
  const page = staticPageSeo[key]
  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    ...("noIndex" in page && page.noIndex ? { noIndex: true } : {}),
    ...("absoluteTitle" in page && page.absoluteTitle === true ? { absoluteTitle: true } : {}),
  })
}

export function metadataForLocation(city: string, slug: string, summary: string) {
  const cityLabel = city.trim() || "Kosovë"
  return buildPageMetadata({
    title: `Stacioni Euromiti në ${cityLabel}`,
    description:
      summary.trim() ||
      `Stacioni Euromiti në ${cityLabel}: karburant, restaurant, autolarje dhe mini market. Adresa, orar dhe shërbime.`,
    path: `/locations/${slug}`,
  })
}
