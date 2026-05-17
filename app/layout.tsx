import type { Metadata, Viewport } from "next"
import { Geist_Mono, Inter, Montserrat, Playfair_Display } from "next/font/google"

import "./globals.css"

import {
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE_PATH,
  getSiteUrl,
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_TITLE,
  SITE_LOCALE,
  SITE_NAME,
} from "@/lib/seo/constants"
import { resolveOgImageUrl } from "@/lib/seo/metadata"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
})

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const siteUrl = getSiteUrl()

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
  /** Lets `env(safe-area-inset-*)` work on notched phones (admin + mobile chrome). */
  viewportFit: "cover",
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DEFAULT_DESCRIPTION,
  keywords: [...DEFAULT_KEYWORDS],
  openGraph: {
    title: SITE_NAME,
    description: SITE_DEFAULT_DESCRIPTION,
    locale: SITE_LOCALE,
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: resolveOgImageUrl(DEFAULT_OG_IMAGE_PATH), alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [resolveOgImageUrl(DEFAULT_OG_IMAGE_PATH)],
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="sq"
      className={`${inter.variable} ${montserrat.variable} ${playfair.variable} ${geistMono.variable} h-full`}
    >
      <head>
        {/* Material Symbols aren’t bundled like text fonts in next/font — load the official stylesheet once for the icon font. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- icon font stylesheet; intentional single global load */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
