/** Row shape for `public.homepage_content` singleton (Phase 10). */
export type HomepageContentRow = {
  id: number
  hero_headline_line1: string
  hero_headline_line2: string
  hero_subtitle: string
  hero_image_media_id: string | null
  hero_cta_primary_label: string
  hero_cta_primary_href: string
  hero_cta_secondary_label: string
  hero_cta_secondary_href: string
  about_preview_text: string
  restaurant_highlight_text: string
  carwash_intro_text: string
  mini_market_intro_text: string
  /** Services intro (“Elite fueling”) — dark homepage band. */
  services_intro_title: string
  services_intro_body: string
  services_intro_media_id: string | null
  /** Restaurant homepage block headings (split headline). Body is `restaurant_highlight_text`. */
  restaurant_home_headline_primary: string
  restaurant_home_headline_accent: string
  restaurant_home_main_media_id: string | null
  restaurant_home_float_1_media_id: string | null
  restaurant_home_float_2_media_id: string | null
  carwash_intro_media_id: string | null
  mini_market_intro_media_id: string | null
  /** Copy above homepage location cards. */
  locations_band_kicker: string
  locations_band_heading: string
  locations_band_subtitle: string
  updated_at: string
  updated_by: string | null
}

/** `public.about_content` singleton — Phase 10. */
export type AboutContentRow = {
  id: number
  hero_title: string
  hero_subtitle: string
  company_story: unknown
  mission_title: string
  mission_body: string
  vision_title: string
  vision_body: string
  values_json: unknown
  hero_media_id: string | null
  story_media_id: string | null
  gallery_media_ids: string[] | null
  gallery_strip_media_id: string | null
  gallery_why_us_media_id: string | null
  gallery_partnerships_media_id: string | null
  updated_at: string
  updated_by: string | null
}

/** Card shape stored in `about_content.values_json`. */
export type AboutValueCard = {
  title: string
  body: string
  icon_material: string
}

/** `public.services_content` singleton — Phase 10 + petrol bullets column. */
export type ServicesContentRow = {
  id: number
  petrol_section_title: string
  petrol_description: string
  petrol_image_media_id: string | null
  petrol_highlights_json: unknown
  restaurant_section_title: string
  restaurant_description: string
  restaurant_image_media_id: string | null
  carwash_section_title: string
  carwash_description: string
  carwash_image_media_id: string | null
  mini_market_section_title: string
  mini_market_description: string
  mini_market_image_media_id: string | null
  hero_page_title: string
  hero_page_subtitle: string
  why_sections_json: unknown
  updated_at: string
  updated_by: string | null
}
