/** Archive filter tabs shared by `/news` UI and CMS validation. */
export const NEWS_FILTER_TABS = ["All News", "Company Updates", "Sustainability", "Innovation", "Community"] as const

export type NewsFilterTab = (typeof NEWS_FILTER_TABS)[number]
