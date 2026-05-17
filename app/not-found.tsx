import type { Metadata } from "next"

import { GlobalNotFoundClient } from "@/components/layout/GlobalNotFoundClient"
import { metadataForStaticPage } from "@/lib/seo/pages"

export const metadata: Metadata = metadataForStaticPage("notFound")

export default function NotFound() {
  return <GlobalNotFoundClient />
}
