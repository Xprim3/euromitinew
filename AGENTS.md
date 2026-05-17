<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## SEO and business data

When adding or changing SEO (metadata, JSON-LD, local pages):

- **Do not invent** street addresses, phone numbers, opening hours, geo coordinates, legal names, or job terms (e.g. full-time) unless they exist in the CMS or the owner confirms them.
- **Use CMS/public data** for `locations`, `contact_info`, `site_settings`, news, and jobs.
- **Omit** structured-data fields when the source value is empty — do not use placeholder NAP data.
- **Meta descriptions** may describe services and cities at a marketing level, but must not state specific addresses/phones/hours that are not in CMS.
- **Ask the site owner** for missing real business details before filling gaps with invented copy.
