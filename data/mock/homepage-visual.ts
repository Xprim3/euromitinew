/**
 * Homepage layout + imagery aligned to Euromiti design mock (static HTML reference).
 */

export const homeHeroDesign = {
  imageSrc:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDFsEp-KUrU8cQdOnecAyAXQ3U2uog4dKT9CEQ0KLP5lw7Uy2LOCgmrdIbSFJxm-gaKCbSddItdHeeCnvGoBT76hp-l1mMPI_QNVBoOj2pCYlTaqQMJxt7ZVKYgdNecvKH5BeD48RNw6xR0TOUcsOOMWbUvRg40pqdlDDDzxDvH3QNdvxuFs5ngWphmM4E1cZItguJG7IvSRxxjgXjbBLf656eOUfau2iJqht7PDXcJcZm8ohoznL9t3s6Z18Zge2HJMn4mPxD3pjU5",
  imageAlt: "Modern Euromiti petrol station canopy at dusk with warm lighting",
  badge: "Fuel driven by passion",
  titleLine1: "Excellence in",
  titleLine2: "Every Drop.",
  subtitle:
    "Petrol, restaurant, mini market, and carwash across Prishtina, Ferizaj, and Gjilan — paired with bright forecourts and the routes you rely on.",
  primaryCta: { label: "Our Services", href: "/services" },
  secondaryCta: { label: "Locations", href: "/locations" },
} as const

export const homeBeyondDesign = {
  kicker: "The Euromiti Experience",
  quote:
    "Every journey deserves a moment of pause that feels more like a destination than a stop.",
  elite: {
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDFsEp-KUrU8cQdOnecAyAXQ3U2uog4dKT9CEQ0KLP5lw7Uy2LOCgmrdIbSFJxm-gaKCbSddItdHeeCnvGoBT76hp-l1mMPI_QNVBoOj2pCYlTaqQMJxt7ZVKYgdNecvKH5BeD48RNw6xR0TOUcsOOMWbUvRg40pqdlDDDzxDvH3QNdvxuFs5ngWphmM4E1cZItguJG7IvSRxxjgXjbBLf656eOUfau2iJqht7PDXcJcZm8ohoznL9t3s6Z18Zge2HJMn4mPxD3pjU5",
    imageAlt: "Pompë moderne e Euromitit",
    badge: "Shërbim kryesor",
    title: "Karburant Cilësor",
    body: "Standardet tona Euro 6+ janë të zhvilluara për efikasitet të lartë, performancë të qëndrueshme dhe emetime më të ulëta.",
    chips: [
      { icon: "verified" as const, label: "Cilësi e lartë" },
      { icon: "eco" as const, label: "Emetime të ulëta" },
    ],
  },
  secondaryServices: [
    {
      key: "family",
      title: "Këndi familjar",
      body: "Hapësira të sigurta dhe argëtuese ku fëmijët mund të luajnë gjatë ndalesës.",
      imageSrc:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuADBeDZHZAtBNzWpI3FuV1jEa6H11obUs1HMHbSv5Zq31pEaAk3k0_J9lmSHyevmofr9x6u9IkBC13JB_uFuoxhcWz9i_7jKVDQ-o600nNmnnJ1N7mZkdWplFQqHCFh3gmdcuM73ogs0CuTr01Nr0_fw1omR2tfkyOppnSNWACg532puP7mwJ24hOUNewWtcXQmc5i_X-F3WWixk6cZmBY0rYnZP1YBIRWM5YVSmxDkBvv9PATxITYI0ps6A6oxyx4CapUKnd3yebha",
      imageAlt: "Family playground",
    },
    {
      key: "market",
      title: "Mini Market",
      body: "Produkte të nevojshme për rrugë, pije, ushqime dhe artikuj praktikë për çdo udhëtim.",
      imageSrc:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD8S5hGP1c18sfDFaDaUppXHP46HuuFboTBzwrqQDLf7q4PSXQTe0SHQG7TgmOTwEgK_fe43LVqQDJd-ScVPoQmq2-IZ09lTYyfOVH2CgTTVUp3hmTEclyYGaizppdWNgj2QGg4XhRZLcJIbha9lPBCt9W6Q9m2SOJDCdQ5Xz7pXeGDNZyxInOd8uNm8CgWuG8qHD7fHBjrmpn7zbQ8inK6ovO6PTn14B98DPNG1iUWZjZycpN9aikm-EFxByyLyk_ct8EGIQZlbgJB",
      imageAlt: "Boutique mini market",
    },
    {
      key: "detailing",
      title: "Autolarje profesionale",
      body: "Pastrime të kujdesshme me pajisje moderne për një veturë të pastër dhe të freskët.",
      imageSrc:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD5B-EZQOzTwHzaJouKcr9yQO3K-Hk-IRy8BE8Ki-CfYOAcowCglwAkLnWGo3gxp9I8SWwkseEt4ec_dcrrlQ5PlXU-dvzihluc25gLZzXDg6W1KpB9F_RuP2um6dBGeJBhF9c5A4vMm4gKFc6vmAz_5kX91gXJaNfzJg8EjLOe1KlooGf3HE-SpR5JZdqV4cN5tKfl2c9jHtLwuxihK_j-eI8ihDwHi3YHiuA5pZvV1mhqQdFZIToFAYN-OCN5uzFSLi9u8GLmcbpg",
      imageAlt: "Artisan detailing",
    },
  ] as const,
  restaurant: {
    kicker: "The Atelier",
    title: "A Curated Culinary Sanctuary",
    body: "Where local harvests meet global mastery. Every dish is a narrative of freshness and quality downtime.",
    ctaLabel: "Reserve a table",
    ctaHref: "/restaurant",
    mainImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAPKs5AJzRkauqdXtM7yLTO6l56xgVi1VzK0cbCvcsjrqT5AKK2W11vv8YB_1ivxFco2-SwDHc2E8H2C4WvX343X0MYu2iwbt7gbP7Ep8rRutnIdXagmB5NaZjg_LOc94cqL9QwWXGXdvRvwWzSl0QxLh0ayahu5U1sSEub31iPfFcGeLE4sw9o-036RPVsN8kOkJRILbUtkXV5vgZcnY2A12PKydoodk6Rbju4VM7MPSXl9Cnoh-umnRT66SPgYuU0olF4g_IJCeGn",
    mainImageAlt: "The Euromiti Atelier",
    float1:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBxa6jgnbEtIsiiyd_-3YK1fcvjWfAdjG7aESiD478mMPE9OI-j-EAxwDA7k6D96hiDnYxnT9GOaakMVerjHswU6vAW9gn0WlpFV_hwW_zWlO1S2fhlErFMEXSsBo835mi2f2yidNbHslCzTb93cJwkhNN9jS_id1kq8nefBxSzrNwVMxr257yb7MKlyOkVz84eTJWkGRbWu0gjNrGLFhY7yCKnKU5dPuJXcQWrGhv0DbhJSiaaJpj6nNIBVC6wG_fWR7mZvdynTpyh",
    float1Alt: "Gourmet detail",
    float2:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCR1xtchlPTysXXn1qvIjEsuoAaAlWULNR3KcJPsnq6sOlg2bd50Uy1_pQjHr9ANkfYpg249jal3oR0TjTCF6Ag7TlmhfwuRJW_yeYlhKnx6tnb1VZFoyP9rwQ_mJFXAbVH-kMZbaH1ApA5-TzqmIY6k_b_j2J7ydgn_qifKxeEIOor6j9q_oYLcaDnc5oGs4Rkgvc1CqlPbAD8RXBaIbjh1CCQVtXz6k80FvzJ1M-Ww3Z8pm0MvWeIGW73M-WirsyL1VRCs759dC0N",
    float2Alt: "Interior ambiance",
  },
} as const

export type StrategicStationVisual = {
  locationId: "prishtina" | "ferizaj" | "gjilan"
  imageSrc: string
  imageAlt: string
  title: string
  /** Fallback only; homepage prefers `mockLocations` address when available. */
  addressLine: string
  hubBadge?: string
}

export const homeStrategicNetworkDesign: StrategicStationVisual[] = [
  {
    locationId: "prishtina",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsNa_ar016Z5HDibQivrNY67SzYbUZKe0WG7DpwaQHOKOeVj-l6ZjPd9UkJT1LCPzEazL1wiBZ_RJs9BpODXlhQ15zQeb6u4Nx9Nw-TjdxnGqubvhDM82tXM8JsA2oTjSFJ4y1qXyW3SUrLKH_wekefXvyL7ptLyD22du9apP7qiRMyUQ3K6MmfOBWGJHfTIGApzf9cLuk4qB-e21yQ_5cIDKKx-sHZi2k9Zg-Bh_v3gfG2DeskV7uxZU4VgQlaoepKSRqoRtu7kaI",
    imageAlt: "Euromiti Prishtina hub",
    title: "Prishtina — Central",
    addressLine: "Magjistralja Prishtinë–Ferizaj, KM 7",
    hubBadge: "Main hub",
  },
  {
    locationId: "ferizaj",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5B-EZQOzTwHzaJouKcr9yQO3K-Hk-IRy8BE8Ki-CfYOAcowCglwAkLnWGo3gxp9I8SWwkseEt4ec_dcrrlQ5PlXU-dvzihluc25gLZzXDg6W1KpB9F_RuP2um6dBGeJBhF9c5A4vMm4gKFc6vmAz_5kX91gXJaNfzJg8EjLOe1KlooGf3HE-SpR5JZdqV4cN5tKfl2c9jHtLwuxihK_j-eI8ihDwHi3YHiuA5pZvV1mhqQdFZIToFAYN-OCN5uzFSLi9u8GLmcbpg",
    imageAlt: "Euromiti Ferizaj station",
    title: "Ferizaj — South Station",
    addressLine: "Rruga Prishtinës, Ferizaj 70000",
  },
  {
    locationId: "gjilan",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADBeDZHZAtBNzWpI3FuV1jEa6H11obUs1HMHbSv5Zq31pEaAk3k0_J9lmSHyevmofr9x6u9IkBC13JB_uFuoxhcWz9i_7jKVDQ-o600nNmnnJ1N7mZkdWplFQqHCFh3gmdcuM73ogs0CuTr01Nr0_fw1omR2tfkyOppnSNWACg532puP7mwJ24hOUNewWtcXQmc5i_X-F3WWixk6cZmBY0rYnZP1YBIRWM5YVSmxDkBvv9PATxITYI0ps6A6oxyx4CapUKnd3yebha",
    imageAlt: "Euromiti Gjilan station",
    title: "Gjilan — East Gate",
    addressLine: "Zona Industriale, Gjilan 60000",
  },
] as const

export const homeNewsInsightsDesign = {
  title: "Insights & Innovations",
  subtitle: "Operational news from Euromiti — fuels, footprint, and the guest experience.",
} as const
