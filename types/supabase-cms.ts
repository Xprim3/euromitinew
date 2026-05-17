/** Row shape for `public.homepage_content` singleton (Phase 10). */
export type HomepageContentRow = {
  id: number
  hero_headline_line1: string
  hero_headline_line2: string
  hero_subtitle: string
  hero_image_media_id: string | null
  hero_slides_json: unknown
  hero_cta_primary_label: string
  hero_cta_primary_href: string
  hero_cta_secondary_label: string
  hero_cta_secondary_href: string
  about_preview_kicker: string
  about_preview_headline: string
  about_preview_eyebrow: string
  about_preview_text: string
  about_preview_why_title: string
  about_preview_why_text: string
  about_preview_button_label: string
  about_preview_button_href: string
  about_preview_image_media_id: string | null
  restaurant_highlight_text: string
  carwash_intro_text: string
  playground_intro_text: string
  mini_market_intro_text: string
  /** Services intro (“Elite fueling”) — dark homepage band. */
  services_intro_title: string
  services_intro_body: string
  services_intro_chips_json: unknown
  services_intro_media_id: string | null
  /** Restaurant homepage block headings (split headline). Body is `restaurant_highlight_text`. */
  restaurant_home_headline_primary: string
  restaurant_home_headline_accent: string
  restaurant_home_main_media_id: string | null
  restaurant_home_float_1_media_id: string | null
  restaurant_home_float_2_media_id: string | null
  carwash_intro_media_id: string | null
  playground_intro_media_id: string | null
  mini_market_intro_media_id: string | null
  /** Copy above homepage location cards. */
  locations_band_kicker: string
  locations_band_heading: string
  locations_band_subtitle: string
  updated_at: string
  updated_by: string | null
}

export type HomepageHeroSlide = {
  title: string
  body: string
  mediaId: string | null
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
  why_choose_heading: string
  why_choose_reasons_json: unknown
  offer_label: string
  offer_title: string
  offer_description: string
  offer_fuel_title: string
  offer_fuel_body: string
  offer_fuel_media_id: string | null
  offer_restaurant_title: string
  offer_restaurant_body: string
  offer_restaurant_media_id: string | null
  offer_playground_title: string
  offer_playground_body: string
  offer_playground_media_id: string | null
  offer_carwash_title: string
  offer_carwash_body: string
  offer_carwash_media_id: string | null
  offer_mini_market_title: string
  offer_mini_market_body: string
  offer_mini_market_media_id: string | null
  owner_section_kicker: string
  owner_section_title: string
  owner_name: string
  owner_role: string
  owner_body: string
  owner_media_id: string | null
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

/** Editable "Why Choose Us" reason card stored in `about_content.why_choose_reasons_json`. */
export type AboutWhyReason = {
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
  restaurant_highlights_json: unknown
  carwash_section_title: string
  carwash_description: string
  carwash_image_media_id: string | null
  carwash_highlights_json: unknown
  mini_market_section_title: string
  mini_market_description: string
  mini_market_image_media_id: string | null
  mini_market_highlights_json: unknown
  hero_page_title: string
  hero_page_subtitle: string
  why_choose_kicker: string
  why_choose_title: string
  why_choose_body: string
  why_choose_featured_title: string
  why_choose_featured_body: string
  why_sections_json: unknown
  updated_at: string
  updated_by: string | null
}

/** `public.restaurant_content` singleton — Phase 10. */
export type RestaurantContentRow = {
  id: number
  hero_title: string
  hero_subtitle: string
  hero_description: string
  intro_eyebrow: string
  intro_headline_line1: string
  intro_headline_line2: string
  intro_body: string
  intro_image_media_id: string | null
  hero_image_media_id: string | null
  opening_hours: string
  contact_phone: string | null
  contact_email: string | null
  contact_notes: string | null
  menu_highlights_json: unknown
  experience_pillars_json: unknown
  gallery_media_ids: string[] | null
  skanom_eyebrow: string
  skanom_title: string
  skanom_description: string
  skanom_image_media_id: string | null
  skanom_cta_label: string
  skanom_cta_href: string
  editorial_eyebrow: string
  editorial_title_line1: string
  editorial_title_line2: string
  editorial_description: string
  editorial_quote_line: string
  editorial_quote_attribution: string
  editorial_image_media_id: string | null
  updated_at: string
  updated_by: string | null
}

/** Row from `public.locations` (Phase 10 + marketing copy migration). */
export type LocationRow = {
  id: string
  slug: string
  city: string
  address: string
  phone: string
  opening_hours: string
  services: string[]
  google_maps_url: string
  contact_email: string | null
  main_media_id: string | null
  sort_order: number
  is_active: boolean
  page_heading: string
  page_summary: string
  created_at: string
  updated_at: string
}

/** Row from `public.news_posts`. */
export type NewsPostRow = {
  id: string
  slug: string
  status: string
  title: string
  excerpt: string
  category: string | null
  teaser_label: string | null
  published_at: string | null
  hero_media_id: string | null
  hero_image_alt: string | null
  seo_title: string | null
  seo_description: string | null
  no_index: boolean
  body: unknown
  created_at: string
  updated_at: string
}

/** Row from `public.job_applications` (admin / SQL reads). */
export type JobApplicationRow = {
  id: string
  job_id: string
  full_name: string
  email: string
  phone: string
  cover_letter: string
  cv_bucket: string
  cv_object_path: string
  cv_original_filename: string | null
  cv_mime_type: string
  cv_byte_size: number
  created_at: string
}

/** Row from `public.jobs`. */
export type JobRow = {
  id: string
  title: string
  slug: string
  location_city: string | null
  summary: string | null
  description: unknown
  requirements: unknown
  is_active: boolean
  apply_channel: string
  apply_email: string | null
  apply_phone: string | null
  apply_url: string | null
  apply_instructions: string | null
  hero_media_id: string | null
  posted_at: string | null
  created_at: string
  updated_at: string
}

/** Row from `public.media_uploads`. */
export type MediaUploadRow = {
  id: string
  storage_bucket: string
  object_path: string
  public_url: string | null
  mime_type: string
  byte_size: number
  original_filename: string | null
  alt_text: string | null
  uploaded_by: string | null
  category: string | null
  usage_section: string | null
  created_at: string
}

/** Singleton `public.site_settings` (id = 1). */
export type SiteSettingsRow = {
  id: number
  logo_media_id: string | null
  company_name: string
  social_links: unknown
  footer_body: string
  footer_copyright_line: string | null
  updated_at: string
  updated_by: string | null
}

/** Singleton `public.contact_info` (id = 1). */
export type ContactInfoRow = {
  id: number
  phone: string
  email: string
  hq_address: string
  map_link: string
  social_links: unknown
  weekday_hours: string | null
  weekend_hours: string | null
  careers_email: string | null
  careers_apply_instructions: string | null
  /** /contact HQ band — upper label */
  hq_eyebrow: string
  /** /contact HQ band — main title */
  hq_heading: string
  /** /contact HQ band — intro paragraph */
  hq_description: string
  updated_at: string
  updated_by: string | null
}
