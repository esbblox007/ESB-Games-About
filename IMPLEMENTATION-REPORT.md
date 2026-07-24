# ESB Games About Website — Implementation Report

## 1. Issues fixed and features added

- Corrected the language selector and preserved all 11 language names in their native scripts.
- Added locale persistence, selected-state checkmarks, language search and keyboard controls.
- Connected automatic machine translation and document-language updates.
- Updated the public account-entry calls to `https://esbgames.com/login`.
- Strengthened the homepage purple, magenta, blue and cyan hero lighting while preserving the grid and device showcase.
- Preserved the complete iPad preview instead of cropping its Discover image.
- Restyled the homepage newsletter form to use the shared ESB Games primary-button system and added honest form states.
- Fixed the proof-strip loop by using three repeated groups and a matching one-third animation cycle.
- Expanded and reflowed “The principles we play by.” so cards have more space on desktop, two columns on tablet and one column on mobile.
- Removed the About-page Meet Our Team section and its unused content/layout.
- Added complete News index and article experiences.
- Added safe rich article blocks, images, galleries, approved video embeds, links, calls to action, code and tables.
- Added Backend-managed download architecture and a complete `/download` page.
- Replaced limited page-name search with ranked search over pages, help, careers, downloads, articles and optional Backend search documents.
- Added an accessible mobile navigation sheet, mobile search and mobile language selection.
- Added broad responsive rules for narrow phones through large desktop layouts.
- Added skip navigation, clearer focus states, reduced-motion handling and responsive media safeguards.
- Added dynamic sitemap article entries, RSS, structured data and redirects for older routes.

## 2. Routes created or changed

Created:

```text
/news/[slug]
/news/rss.xml
/download
/api/search
/api/newsletter
/api/revalidate
```

Expanded:

```text
/news
/
/about
/developer-hub
/parental-controls
/support
/sitemap.xml
```

Redirects:

```text
/blog → /news
/blog/:slug* → /news/:slug*
/creator-hub → /developer-hub
```

Primary account action:

```text
Join Now / Start Playing → https://esbgames.com/login
```

## 3. Components created or updated

Created:

```text
components/ArticleCard.tsx
components/ArticleRenderer.tsx
components/DownloadPlatformHint.tsx
components/NewsletterForm.tsx
components/SearchDialog.tsx
components/ShareActions.tsx
```

Updated:

```text
components/Header.tsx
components/Footer.tsx
components/LanguageSelector.tsx
components/PageShell.tsx
components/SiteTranslator.tsx
```

Important service modules:

```text
lib/content/types.ts
lib/content/supabase.ts
lib/content/news.ts
lib/content/downloads.ts
lib/content/previewNews.ts
lib/search/static-index.ts
lib/search/search.ts
```

## 4. Language system changes

The custom black language menu includes the required native names and locale codes:

```text
English — en
Español — es
Português do Brasil — pt-BR
Français — fr
Deutsch — de
简体中文 — zh-CN
繁體中文 — zh-TW
日本語 — ja
한국어 — ko
Bahasa Indonesia — id
हिन्दी — hi
```

The menu:

- Never translates its own language names.
- Saves the user’s explicit selection.
- Restores the selection across navigation and refreshes.
- Updates `<html lang>`.
- Supports keyboard navigation and visible focus.
- Includes a search field and selected checkmark.
- Works inside the mobile navigation sheet.
- Falls back to English when no valid preference exists.

Automatic translated page content currently uses Google Translate. This is machine translation rather than approved first-party locale content. It requires Google’s script to be reachable. Dedicated translated routes and `hreflang` should only be introduced when reviewed translations exist.

## 5. News and article architecture

Public content comes through the typed content-service layer rather than being hard-coded into page components.

Public query rules:

```text
publication_state = Published
visibility = Public
published_at <= current time
```

The article body is a safe block array rather than arbitrary HTML. Incoming blocks and URLs are normalised, limited and validated before rendering. Supported blocks are:

```text
paragraph, heading, list, quote, divider, image, gallery,
video, callout, code, table and button
```

Video embeds are allowlisted to uploaded files, YouTube and Vimeo. Article pages include metadata, Open Graph, NewsArticle structured data, breadcrumb structured data, tags, share actions, related articles, previous/next navigation and responsive media.

Preview article records exist only for renderer QA and are disabled by default. They are visibly labelled when explicitly enabled and are not presented as production content.

## 6. Backend and Supabase integration

The project prepares these server-only tables:

```text
cms_articles
download_releases
site_search_documents
newsletter_subscriptions
```

Existing support and early-access tables remain preserved.

The ESB Games Backend should create, review, approve, schedule and publish records in the shared ESB Games Production project. The protected `/api/revalidate` endpoint lets the Backend refresh News, an article slug, downloads, search, sitemap and RSS after a publish or edit action.

No public RLS policies were added to the new content tables. Server-side service-role access is expected. Existing equivalent tables should be reused rather than duplicated; review `supabase.sql` before running it.

## 7. Search architecture

Search uses a combined prebuilt index rather than scraping the site on every request:

- Static page metadata.
- Descriptions and headings.
- Keywords and synonyms.
- Common user questions.
- Careers, support and legal destinations.
- Published article titles, excerpts, tags and safe body text.
- Product and download-release information.
- Optional Backend-managed `site_search_documents`.

Ranking favours exact title and phrase matches, followed by keywords, common questions, synonyms, body relevance and limited typo tolerance. The interface includes keyboard navigation, loading, partial, empty and unavailable states and becomes full-screen on mobile.

## 8. Download architecture

The `/download` page contains distinct product areas for:

```text
ESB Games Play Platform
ESB Studio
```

Releases are Backend-managed by product, platform, architecture, version, release state, file URL, date, requirements, release notes, checksum and signing state.

A download button is enabled only when a Backend record is marked available and contains a validated URL. Otherwise the page honestly states that the product or platform is not yet publicly available. No fake download files are included.

## 9. Mobile and responsive changes

- Desktop navigation is preserved at suitable widths.
- Tablet and mobile use an accessible navigation sheet instead of squeezing the desktop links.
- Hero content reflows without horizontally cropping the device preview.
- Flexible grids replace forced single-row layouts.
- Principles, article cards, downloads, search, forms and footer groups stack appropriately.
- Inputs use mobile-safe font sizes.
- Buttons wrap or become full width where required.
- Article media, tables and videos remain inside the viewport.
- CSS includes targeted behavior for narrow mobile, mobile, tablet and desktop ranges, including the requested 320–1920px range.

## 10. Accessibility changes

- Skip-to-content link.
- Semantic `<main>` landmark.
- Logical page/article headings.
- Accessible mobile-navigation dialog.
- Accessible search dialog and keyboard result selection.
- Accessible language listbox, current selection and search.
- Visible focus styles.
- Form labels, status messages and live regions.
- Alt text and captions supported for article media.
- Video titles and controls.
- Touch-friendly controls.
- Reduced-motion support.
- Responsive tables with horizontal containment instead of page overflow.

## 11. SEO changes

- Canonical metadata for major routes.
- NewsArticle and Blog-style metadata.
- Article publication and modification dates.
- Open Graph and social metadata.
- Article and breadcrumb JSON-LD.
- SoftwareApplication JSON-LD for downloads.
- Dynamic sitemap records for published articles.
- RSS feed for published articles.
- Draft, unpublished and unavailable article routes are not indexed through generated metadata.
- Legacy news routes redirect to the canonical News structure.

Approved translated routes do not yet exist, so locale-specific canonical routes and `hreflang` have intentionally not been fabricated.

## 12. Verification completed

Completed in the provided environment:

- Parsed all 56 TypeScript/TSX files with the TypeScript parser: no syntax errors.
- Strict type check for the new server content/search service layer: passed.
- Parsed the full global stylesheet with PostCSS: passed.
- Checked 46 internal static route references: no missing application routes.
- Confirmed no `package-lock.json`, `node_modules`, `.next` output or secrets are included.
- Reviewed Backend content queries to ensure only published, public and due content is returned.
- Reviewed rich-content rendering to ensure arbitrary HTML and arbitrary iframe providers are not accepted.

A full `npm run build` could not be completed in this workspace because both the configured package registry and the public npm registry were unavailable during dependency installation. The internal registry returned HTTP 503 and the public registry returned a DNS `EAI_AGAIN` error. This limitation is environmental rather than a reported successful build, and the project should receive a normal Vercel build after the ZIP is committed.

## 13. Live integrations currently working when configured

- Existing support-ticket Supabase API.
- Existing early-access API and optional Resend delivery.
- Newsletter persistence through Supabase.
- Published article reading through Supabase REST.
- Download release reading through Supabase REST.
- Optional Backend search documents.
- Cache-tag and route revalidation endpoint.
- Google automatic page translation.

## 14. UI or service areas awaiting Backend integration

- Backend CMS editor must save the block-based `cms_articles.body` schema.
- Editorial review, approval, scheduling and archive controls must write the documented article states.
- Backend publishing must call the revalidation endpoint.
- Official article content, media, authors and approved translations must be added.
- Download release files, requirements, checksums and signatures must be added.
- Search documents and approved locale indexes may be maintained by the Backend.
- Newsletter unsubscribe and mailing-campaign management remain Backend/email-service responsibilities.
- Approved analytics were not present, so no new invasive tracking SDK was added.

## 15. Remaining limitations

- Automatic translation quality depends on Google and has not been editorially reviewed.
- First-party locale routes and `hreflang` are not created until approved translations exist.
- Dynamic external article images use responsive lazy-loaded `<img>` elements because their domains are Backend-controlled and cannot be safely enumerated in Next Image configuration yet.
- The current newsletter rate limit is a best-effort serverless guard; a shared Redis or Supabase rate-limit store is recommended for production scale.
- A full dependency-backed Next.js production build must still be run by Vercel or a machine with npm registry access.
