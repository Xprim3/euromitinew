import type { NewsFilterTab } from "@/lib/constants/news-archive"

/** English values stored in CMS — Albanian labels for public UI. */
export const NEWS_CATEGORY_LABEL_SQ: Record<string, string> = {
  "Company Updates": "Përditësime",
  Sustainability: "Qëndrueshmëri",
  Innovation: "Inovacion",
  Community: "Komunitet",
}

export function newsCategoryLabelSq(category: string | null | undefined): string {
  const key = (category?.trim() || "Company Updates") as keyof typeof NEWS_CATEGORY_LABEL_SQ
  return NEWS_CATEGORY_LABEL_SQ[key] ?? category?.trim() ?? "Përditësime"
}

export function newsFilterTabLabelSq(tab: NewsFilterTab): string {
  if (tab === "All News") return "Të gjitha"
  return newsCategoryLabelSq(tab)
}
