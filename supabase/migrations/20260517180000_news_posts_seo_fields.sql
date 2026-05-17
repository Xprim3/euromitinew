-- Optional SEO overrides for published news articles.

ALTER TABLE public.news_posts
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS no_index boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.news_posts.seo_title IS 'Optional override for <title> and og:title.';
COMMENT ON COLUMN public.news_posts.seo_description IS 'Optional override for meta description and og:description.';
COMMENT ON COLUMN public.news_posts.no_index IS 'When true, article is excluded from search indexing.';
