import { excerptFromParagraphs } from "@/lib/news/excerpt-from-body"
import type { NewsArticle, NewsSummary } from "@/types/public"

const articles: NewsArticle[] = [
  {
    id: "expansion-prishtina",
    slug: "expansion-in-prishtina",
    category: "Company Updates",
    title: "Zgjerim në zemër të Prishtinës",
    excerpt:
      "Euromiti forcon praninë në kryeqytet me ndriçim të rinovuar në stacion dhe hapësira të përditësuara retail.",
    publishedAt: "2026-04-18",
    imageSrc:
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=960&q=80",
    imageAlt: "Shtrëngim doresh në horizontin e qytetit",
    contentParagraphs: [
      "Udhëtarët në Prishtinë do të vërejnë stacione më të ndriçuara dhe më të sigurta, pasi Euromiti përfundon rinovimin e ndriçimit LED, kanopeve dhe ishujve të pompave në kryeqytet.",
      "Hapësirat retail po riorganizohen për udhëtime më të shpejta grab-and-go, me kafé, pastiçeri dhe artikuj udhëtimi të zgjeruar për komuterët e mëngjesit.",
      "Programi mbajt operimin 24/7 në linjën kryesore, ndërsa ekipet punojnë në faza natën për të kufizuar ndërprerjet për shoferët dhe llogaritë korporative.",
      "Faleminderit partnerëve lokalë dhe fqinjëve për bashkëpunimin ndërsa përmirësojmë përvojën rrugore në qendrën ekonomike të Kosovës.",
    ],
  },
  {
    id: "zero-emissions",
    slug: "path-to-zero-emissions",
    category: "Sustainability",
    title: "Rruga jonë drejt operimeve më të pastra",
    excerpt:
      "Studime për gatishmëri diellore dhe përmirësime efikasiteti po zbatohen në çdo lokacion Euromiti.",
    publishedAt: "2026-03-22",
    imageSrc:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=960&q=80",
    imageAlt: "Panele diellore nën qiell të kaltër",
    contentParagraphs: [
      "Efikasiteti energjetik është prioritet operativ: po auditohet çdo lokacion për LED, performancën e ftohjes dhe ciklet e optimizuara të HVAC pa ulur komodin e vizitorëve.",
      "Studimet e fizibilitetit për diell po zhvillohen çati pas çatie me inxhinierë lokalë, me synim gjenerim të pjesshëm në vend para provave më të gjera me bateri.",
      "Partnerët e flotës dhe logjistikës do të marrin raporte të konsoliduara për karbonin e përfshirë në paketat kryesore të ndërtimit, në përputhje me normat e zbulimit në BE.",
      "Ky plan është gradual — do të publikojmë përditësime me arritje sapo të përfundojnë auditimet dhe pilotet në Prishtinë, Ferizaj dhe Gjilan.",
    ],
  },
  {
    id: "diesel-launch",
    slug: "premium-diesel-launch",
    category: "Innovation",
    title: "Lansimi i naftës premium Euro 5+",
    excerpt:
      "Shoferët tani mund të përdorin përzierjen tonë më të re të certifikuar, të krijuar për motorët modernë EURO.",
    publishedAt: "2026-02-05",
    imageSrc:
      "https://images.unsplash.com/photo-1581093843351-3c2b14d6d30d?auto=format&fit=crop&w=960&q=80",
    imageAlt: "Pompë karburanti nga afër",
    contentParagraphs: [
      "Euromiti Premium Diesel Euro 5+ është formuluar për motorët modernë me injektim me presion të lartë, duke ndihmuar pastërtinë e sistemit të karburantit dhe performancën e përditshme.",
      "Pompat etiketojnë qartë përzierjen e re; stafi mbetet në dispozicion për t’u këshilluar transportuesit dhe udhëtarët që mbështeten në çift rrotullues në autostradat e Kosovës.",
      "Siguria e cilësisë përfshin certifikime të grupeve me laboratorë të pavarur — dokumentet e gjurmueshmërisë ruhen për partnerët korporativë që auditohen zinxhirin e furnizimit.",
      "Faleminderit që zgjidhni Euromiti si partner të besueshëm rrugor — vazhdojmë të investojmë në karburante që reflektojnë standardet evropiane dhe ambicionet e Kosovës.",
    ],
  },
  {
    id: "stem-scholarship",
    slug: "stem-scholarship-2026",
    category: "Community",
    title: "Programi i bursave Euromiti STEM 2026",
    excerpt:
      "Aplikimet janë hapur për studentë në inxhinieri dhe energji — mentorim dhe shpërblime në rrjetin tonë në Kosovë.",
    publishedAt: "2026-01-28",
    imageSrc:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=960&q=80",
    imageAlt: "Ekip që bashkëpunon në ambient të ndriçuar",
    contentParagraphs: [
      "Euromiti thellon angazhimin për talentin e ri përmes një bursë të strukturuar STEM me mentorim nga drejtuesit e operacioneve dhe mikpritjes.",
      "Aplikuesit e përshtatshëm janë të regjistruar në universitete të akredituara në Kosovë dhe tregojnë forcë akademike së bashku me përfshirje në komunitet.",
      "Marrësit marrin shpërblime të fazuara sipas semestrave, ftesa për turne në stacione dhe praktika verore opsionale në Euromiti.",
      "Programi pasqyron bindjen tonë se ekonomia e korridorit në Kosovë lulëzon kur aftësitë teknike takohen me përvojën praktike rrugore.",
    ],
  },
  {
    id: "ferizaj-corridor",
    slug: "ferizaj-route-reliability",
    category: "Company Updates",
    title: "Orari në korridorin e Ferizajit dhe rifreskim i mikpritjes",
    excerpt:
      "Mbulesë e zgjeruar në mbrëmje dhe ritëm i ri në restaurant e bën rrugën qendrore të besueshme për flota dhe familje.",
    publishedAt: "2026-01-12",
    imageSrc:
      "https://images.unsplash.com/photo-1578575437130-527eed3edb54?auto=format&fit=crop&w=960&q=80",
    imageAlt: "Infrastrukturë rrugore dhe logjistike",
    contentParagraphs: [
      "Menaxherët e flotës në rrugët Prishtinë–Gjilan do të gjejnë mbështetje të zgjeruar në mbrëmje në Euromiti Ferizaj, me korsi prioritare të qarta për pompën.",
      "Ulëset dhe ritmi i kuzhinës u rregulluan për kthime më të shpejta të tavolinave në oraret e pikut pa shkurtuar kohën e pushimit të mysafirëve.",
      "Tabelat dixhitale të radhës në vitrinën e ëmbëlsirave reduktojnë ngjeshjen — reagimet e mysafirëve në janar tregojnë tashmë kënaqësi më të lartë.",
      "Drejtoria operacionale do të publikojë pamje KPI çerekore që partnerët të krahasojnë kohën e qëndrimit me mesataret rajonale.",
    ],
  },
  {
    id: "contactless-payments",
    slug: "contactless-rollout-complete",
    category: "Innovation",
    title: "Pagesa pa kontakt në çdo korsi pompash Euromiti",
    excerpt:
      "Terminalet tap-to-pay tani janë standarde brenda dhe jashtë, duke ulur radhët në kulmin e dimrit.",
    publishedAt: "2025-12-08",
    imageSrc:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=960&q=80",
    imageAlt: "Pagesë me terminal",
    contentParagraphs: [
      "Përfunduam zbatimin në të gjithë rrjetin e lexuesve pa kontakt të certifikuar EMV në çdo kokë pompe dhe ishull arkë.",
      "Stafi u trajnua për kuponë, dokumentacion TVSH dhe barazimin e llogarive korporative.",
      "Operacionet e sigurisë monitorojnë shpejtësinë e transaksioneve me alarme anomalie, ndërsa fusha PCI mbetet e ndarë nga Wi‑Fi i mysafirëve.",
      "Shoferët që preferojnë portofolët paraprakisht mund të presin njoftime për pilotet gjatë vitit ndërsa certifikojmë partnerët.",
    ],
  },
]

function toSummary(a: NewsArticle): NewsSummary {
  const bodyPlain = a.contentParagraphs.join(" ").replace(/\s+/g, " ").trim()
  return {
    id: a.id,
    slug: a.slug,
    category: a.category,
    title: a.title,
    excerpt: excerptFromParagraphs(a.contentParagraphs) || a.excerpt,
    publishedAt: a.publishedAt,
    imageSrc: a.imageSrc,
    imageAlt: a.imageAlt,
    ...(bodyPlain ? { bodyPlain } : {}),
  }
}

export const mockNewsArticles: NewsArticle[] = articles

export const mockNewsSummaries: NewsSummary[] = articles.map(toSummary)

export function getNewsArticleBySlug(slug: string): NewsArticle | undefined {
  return articles.find((a) => a.slug === slug)
}
