import type { Metadata, Viewport } from "next"
import { Geist_Mono, Inter, Montserrat, Playfair_Display } from "next/font/google"

import "./globals.css"

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://euromiti.com"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Euromiti",
    template: "%s | Euromiti",
  },
  description:
    "Euromiti — petrol stations, premium restaurant, carwash, and mini markets across Prishtina, Ferizaj, and Gjilan, Kosovo.",
  keywords: [
    "Euromiti",
    "petrol",
    "gas station",
    "Kosovo",
    "Prishtina",
    "Ferizaj",
    "Gjilan",
    "restaurant",
    "carwash",
  ],
  openGraph: {
    title: "Euromiti",
    description:
      "Fuel, dining, carwash, and convenience — Euromiti locations across Kosovo.",
    locale: "en_XK",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
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
