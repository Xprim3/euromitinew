import type { Metadata } from "next"

import { NewsManagementClient } from "@/components/admin/NewsManagementClient"
import { listNewsPostsAdmin } from "@/lib/data/news-admin"

export const metadata: Metadata = {
  title: "News",
}

export default async function AdminNewsPage() {
  const rows = await listNewsPostsAdmin()

  return <NewsManagementClient rows={rows} />
}
