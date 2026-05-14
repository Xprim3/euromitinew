/** Restaurant landing page mocks. */

/** Luxury editorial hero (Playfair headline, asymmetric image, floating quote). */
export const restaurantEditorialHeroMock = {
  eyebrow: "The culinary issue",
  titleLine1: "The Art of",
  titleLine2: "Slow Dining",
  description:
    "Experience a refined sanctuary where seasonal flavors meet architectural elegance. A comfort stop reimagined for the modern connoisseur.",
  quote: {
    line: `"A masterpiece of atmosphere."`,
    attribution: "— Kosova Hospitality Review",
  },
  imageSrc:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAPKs5AJzRkauqdXtM7yLTO6l56xgVi1VzK0cbCvcsjrqT5AKK2W11vv8YB_1ivxFco2-SwDHc2E8H2C4WvX343X0MYu2iwbt7gbP7Ep8rRutnIdXagmB5NaZjg_LOc94cqL9QwWXGXdvRvwWzSl0QxLh0ayahu5U1sSEub31iPfFcGeLE4sw9o-036RPVsN8kOkJRILbUtkXV5vgZcnY2A12PKydoodk6Rbju4VM7MPSXl9Cnoh-umnRT66SPgYuU0olF4g_IJCeGn",
  imageAlt: "Euromiti restaurant interior and dining ambience",
} as const

export type RestaurantEditorialHeroMock = typeof restaurantEditorialHeroMock

/** Section 2 — editorial split (headline / copy vs image). */
export const restaurantEditorialIntroMock = {
  headingId: "restaurant-editorial-intro",
  eyebrow: "The dining room",
  headlineLine1: "Freshness",
  headlineLine2: "Redefined",
  paragraphs: [
    "Euromiti Restaurant brings quality cooking, considerate service, and a composed dining room together in one place. A meal here is more than sustenance—it is the pause inside a journey, the moment where conversation opens, and a careful walk through Kosovo’s seasonal larder.",
    "Whether you are stopping mid-route or gathering for something to celebrate, the room is tuned for acoustics and light—clean, restorative, memorable long after dessert.",
  ] as const,
  imageSrc:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBxa6jgnbEtIsiiyd_-3YK1fcvjWfAdjG7aESiD478mMPE9OI-j-EAxwDA7k6D96hiDnYxnT9GOaakMVerjHswU6vAW9gn0WlpFV_hwW_zWlO1S2fhlErFMEXSsBo835mi2f2yidNbHslCzTb93cJwkhNN9jS_id1kq8nefBxSzrNwVMxr257yb7MKlyOkVz84eTJWkGRbWu0gjNrGLFhY7yCKnKU5dPuJXcQWrGhv0DbhJSiaaJpj6nNIBVC6wG_fWR7mZvdynTpyh",
  imageAlt: "Chef-prepared gourmet detail at Euromiti restaurant",
} as const

export type RestaurantEditorialIntroMock = typeof restaurantEditorialIntroMock

/** Section 3 — asymmetric grid of seasonal food photography + captions. */
export const restaurantSeasonalFoodGalleryMock = {
  sectionId: "menu-highlights",
  headingId: "restaurant-seasonal-menu-heading",
  eyebrow: "Nga kuzhina në tryezë",
  title: "Shije të përgatitura me kujdes",
  lead:
    "Në Restaurant Euromiti, çdo pjatë përgatitet me përkushtim, duke kombinuar përbërës cilësorë, shije të balancuar dhe prezantim të kujdesshëm. Qëllimi ynë është të ofrojmë ushqim të shijshëm, të freskët dhe të përshtatshëm për çdo moment të ditës.",
  items: [
    {
      title: "The Breakfast Service",
      description: "Artisan viennoiserie and morning classics in a light-filled salon beside the forecourt.",
      src: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=960&q=85",
      alt: "Breakfast spread with coffee and pastries",
    },
    {
      title: "Signature Mains",
      description: "Sea bass with salmoriglio, mountain herb risotto, and wood-grilled cuts from trusted suppliers.",
      src: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=960&q=85",
      alt: "Plated seafood main course with herbs and lemon",
    },
    {
      title: "Flame & Grill",
      description: "Aged beef and open-flame cooking for depth, smoke, and a crisp, caramelised finish.",
      src: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=960&q=85",
      alt: "Grilled meat with char and garnish",
    },
    {
      title: "Garden Plates",
      description: "Seasonal greens, mountain herbs, and house dressings — bright counterpoints to richer courses.",
      src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=960&q=85",
      alt: "Fresh gourmet salad bowl with vegetables",
    },
    {
      title: "Dolce & Finis",
      description: "Pastry trolley signatures and restrained desserts conceived to close the meal without heaviness.",
      src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=960&q=85",
      alt: "Artistic dessert plating with berry and cream",
    },
    {
      title: "Bar & Brew",
      description: "Specialty espresso, cold infusions, and a concise list of wines chosen for pace and palate.",
      src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=960&q=85",
      alt: "Artisan coffee and bar service detail",
    },
  ] as const,
} as const

export type RestaurantSeasonalFoodGalleryMock = typeof restaurantSeasonalFoodGalleryMock

/**
 * Skanom digital menu — replace `ctaHref` with Euromiti’s live menu URL when available.
 */
export const restaurantSkanomSectionMock = {
  sectionId: "restaurant-digital-menu-skanom",
  headingId: "restaurant-skanom-digital-menu-heading",
  eyebrow: "Digital menu",
  title: "Taste everything before your table arrives.",
  description:
    "Our live menu unfolds on Skanom—photography paced like the dining room, wine and coffee corridors side by side, and allergen cues that track the pass in real time. Open it beside the motorway or tucked into a banquet before dessert.",
  ctaLabel: "View menu online",
  ctaHref: "https://skanom.com/",
  /** Left mosaic — four plated moments (reuse proven food photography URLs). */
  collageImages: [
    {
      src: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=720&q=85",
      alt: "Morning pastries and espresso at Euromiti",
    },
    {
      src: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=720&q=85",
      alt: "Chef’s seafood entrée plating",
    },
    {
      src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=720&q=85",
      alt: "Seasonal greens and garnish",
    },
    {
      src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=720&q=85",
      alt: "Dessert course detail",
    },
  ] as const,
  partner: {
    advertisementLabel: "Partneri i menusë digjitale",
    headline: "Skanom.com",
    body:
      "Platforma që përdorim për menunë online të Restaurant Euromiti e shpejtë, moderne dhe e lehtë për t'u përditësuar. Përmes Skanom, mysafirët mund ta shfletojnë menunë në mënyrë të qartë, nga telefoni apo çdo pajisje tjetër, me përvojë të përshtatur për përdorim të thjeshtë dhe profesional.",
    href: "https://skanom.com/",
    hint: "Mësoni më shumë për Skanom",
  },
} as const

export type RestaurantSkanomSectionMock = typeof restaurantSkanomSectionMock

/** Section 4 — four editorial pillars with left rule (experience principles). */
export const restaurantExperiencePillarsMock = {
  headingId: "restaurant-experience-pillars-heading",
  pillars: [
    {
      title: "Purity of Origin",
      body: "We work with growers and distributors we trust across the region so every ingredient clears the same freshness and traceability benchmarks as our fuels.",
    },
    {
      title: "Quiet Luxury",
      body: "Interiors favour calm materials, natural light on the banquettes, and an acoustic plan that keeps conversations private even when the room is humming.",
    },
    {
      title: "Intuitive Service",
      body: "Hosting is understated: pacing is read from the table, allergens and wine notes are clarified without flourish, and the team moves as one disciplined floor.",
    },
    {
      title: "Total Well-being",
      body: "Kitchen and dining protocols align with Euromiti’s wider hygiene ladder — from line checks to plated delivery — so comfort extends beyond flavour alone.",
    },
  ] as const,
} as const

export type RestaurantExperiencePillarsMock = typeof restaurantExperiencePillarsMock

/** Section 5 — dark-band atmospheric mosaic (hero + stack + wide strip). Slots: [hero, stackTop, stackBottom, bottomLead, bottomWide]. */
export const restaurantAtmosphereGalleryMock = {
  headingId: "restaurant-atmosphere-heading",
  title: "Atmosphere",
  label: "Vignettes",
  slots: [
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCR1xtchlPTysXXn1qvIjEsuoAaAlWULNR3KcJPsnq6sOlg2bd50Uy1_pQjHr9ANkfYpg249jal3oR0TjTCF6Ag7TlmhfwuRJW_yeYlhKnx6tnb1VZFoyP9rwQ_mJFXAbVH-kMZbaH1ApA5-TzqmIY6k_b_j2J7ydgn_qifKxeEIOor6j9q_oYLcaDnc5oGs4Rkgvc1CqlPbAD8RXBaIbjh1CCQVtXz6k80FvzJ1M-Ww3Z8pm0MvWeIGW73M-WirsyL1VRCs759dC0N",
      alt: "Soft evening light across the Euromiti dining room",
    },
    {
      src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=85",
      alt: "Wine wall washed in warm amber light",
    },
    {
      src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1400&q=85",
      alt: "Chef plating at the pass with precision",
    },
    {
      src: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=1400&q=85",
      alt: "Guests at linen tables in the dining salon",
    },
    {
      src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=85",
      alt: "Course spread along the chef’s counter",
    },
  ] as const,
} as const

export type RestaurantAtmosphereGalleryMock = typeof restaurantAtmosphereGalleryMock

/** Section framing for per-station reservation cards (addresses + contacts from `mockLocations`). */
export const restaurantReservationStationsSectionMock = {
  sectionId: "restaurant-reservations-stations",
  headingId: "restaurant-reservations-stations-heading",
  eyebrow: "Reservations",
  title: "Choose your Euromiti table",
  subtitle: "Each flagship routes guest care through its local desk—the same chefs, calibrated to the rhythm of Prishtina, Ferizaj, and Gjilan.",
  reservationCtaLabel: "Make a reservation",
  /** Short luxe line under each city name — Ferizaj mock has no licensed restaurant badge; concierge still anchors enquiries. */
  stationTaglines: {
    prishtina: "Flagship dining salon beside the motorway",
    ferizaj: "Forecourt desk & traveller hospitality",
    gjilan: "Regional dining salon & guest care",
  } as const,
} as const

export type RestaurantReservationStationsSectionMock = typeof restaurantReservationStationsSectionMock

export const restaurantPageHeroMock = {
  title: "Dine where Kosovo travels.",
  subtitle:
    "Chef-led menus, precise service, and a dining room engineered for respite between cities — Euromiti restaurant sits beside our flagship forecourts in Prishtina and Gjilan.",
  primaryCta: { label: "Plan your visit", href: "/contact" },
  secondaryCta: { label: "View locations", href: "/locations" },
  imageSrc:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80",
  imageAlt: "Refined plated dish with wine glass softly lit",
} as const

export const restaurantStoryMock = {
  title: "A calm table beside the motorway",
  paragraphs: [
    "Inspired by Adriatic restraint and Kosovo’s hearty palate, our kitchen emphasises seafood from trusted suppliers, wood-grilled staples, and produce that rotates with each season.",
    "Service teams train weekly on pacing, allergens, and wine pairings curated for both quick business lunches and unhurried weekend dinners.",
    "Private dining and event menus are available for partners who want the Euromiti kitchen without leaving the forecourt ecosystem.",
  ],
} as const

export const restaurantMenuHighlightMock = [
  {
    name: "Grilled sea bass · salmoriglio",
    description: "Wild-caught filet, blistered cherry tomatoes, caper-lemon oil.",
  },
  {
    name: "Berkshire tomahawk for two",
    description: "Aged Kosovar beef, rosemary jus, truffle potato pave.",
  },
  {
    name: "Mountain herb risotto",
    description: "Carnaroli rice, foraged thyme, shaved aged cheese, crisp hazelnuts.",
  },
  {
    name: "Pastry trolley",
    description: "Signatures from our pastry chefs — rotated nightly at your table.",
  },
] as const

export const restaurantGalleryMock = [
  {
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
    alt: "Wine wall with amber lighting behind bottles",
  },
  {
    src: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=1200&q=80",
    alt: "Guests dining in a warmly lit contemporary restaurant",
  },
  {
    src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80",
    alt: "Chef finishing a plate with garnish",
  },
  {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    alt: "Rustic platter of appetisers at a polished table",
  },
] as const
