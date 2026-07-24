# ESB Games About Website

The public ESB Games information website for `https://about.esbgames.com`, built with Next.js 15, React 19 and TypeScript.

The project preserves the established ESB Games dark navy visual identity, blue shield branding, shared navigation, account links, responsive layouts and Vercel deployment structure. News, downloads, search and newsletter areas are prepared for the shared **ESB Games Production** Supabase project and the ESB Games Backend System.

## Public routes

```text
/                     Homepage
/about                About ESB Games
/developer-hub        Creator Hub
/parental-controls    Parental Controls
/news                 News index
/news/[slug]          Published news or blog article
/news/rss.xml         RSS feed
/download             Official product downloads
/careers              Careers and vacancies
/support              Help and support
/subscriptions        Subscription information
/early-access         Existing early-access form
/login                Existing About-site login design
/signup               Existing About-site signup design
```

Legacy redirects:

```text
/blog                  → /news
/blog/[slug]           → /news/[slug]
/creator-hub           → /developer-hub
```

The main **Join Now**, **Start Playing** and equivalent public account actions use:

```text
https://esbgames.com/login
```

## Main capabilities

- Responsive desktop, laptop, tablet and mobile layouts
- Accessible mobile navigation drawer
- Native-name language selector with 11 languages
- Persistent selected locale and document-language updates
- Automatic machine translation through Google Translate, with English fallback
- Intent-aware global search across static pages, help content, careers, downloads, published articles and optional Backend search documents
- Full `/news` and `/news/[slug]` publishing experience
- Safe block-based article renderer; arbitrary article HTML is not rendered
- Responsive image, gallery, table, code, callout and approved-video support
- Article metadata, Open Graph, NewsArticle JSON-LD, breadcrumbs, sitemap entries and RSS
- Backend-managed download releases with honest unavailable states
- Working newsletter subscription form with validation and Supabase persistence
- Existing support and early-access API integrations preserved
- Cache tags and protected revalidation endpoint for Backend publishing workflows

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production commands:

```bash
npm run build
npm run start
```

## Environment variables

Copy `env.example` to `.env.local` for local development.

```env
NEXT_PUBLIC_SITE_URL=https://about.esbgames.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
REVALIDATION_SECRET=
NEXT_PUBLIC_CONTENT_PREVIEW=false
```

`SUPABASE_SERVICE_ROLE_KEY` and `REVALIDATION_SECRET` are server-only secrets. Never prefix them with `NEXT_PUBLIC_` or expose them in browser code.

`NEXT_PUBLIC_CONTENT_PREVIEW` is disabled by default. Turning it on displays clearly labelled preview articles only for renderer testing when no content Backend is connected. It must remain `false` in production unless an authorised preview deployment intentionally uses it.

## Supabase setup

1. Open the shared **ESB Games Production** project.
2. Review existing tables before creating anything new.
3. Run only the missing parts of `supabase.sql` through Supabase SQL Editor.
4. Add the required environment variables in Vercel.
5. Keep Row Level Security enabled. The new content tables intentionally have no public policies and are accessed by server-side services or the Backend.

The schema includes or prepares:

```text
support_tickets
 early_access
newsletter_subscriptions
cms_articles
download_releases
site_search_documents
```

The article body uses the typed block structure in `lib/content/types.ts`. The Backend CMS should create that JSON structure instead of arbitrary executable HTML.

## Backend publishing flow

```text
Backend draft
→ Editorial review
→ Approval
→ Scheduled or immediate publication
→ Published Supabase article
→ About website revalidation
→ News, article route, search index, sitemap and RSS update
```

Only records with all of the following are public:

```text
publication_state = Published
visibility = Public
published_at is not in the future
```

The Backend may call `POST /api/revalidate` with:

```text
x-esb-revalidate-secret: <REVALIDATION_SECRET>
```

Optional JSON body:

```json
{
  "slug": "article-slug",
  "downloads": false,
  "search": true
}
```

## News content model

Important `cms_articles` fields include title, slug, subtitle, excerpt, body, cover image or video, author, category, tags, publication state, featured state, SEO fields, canonical URL, published date, updated date, related articles, locale, translation group, reading time, creator and approver.

Supported safe article blocks:

```text
paragraph
heading
list
quote
divider
image
gallery
video
callout
code
table
button
```

YouTube and Vimeo embeds use an allowlist. Uploaded video URLs and all article/download URLs are validated before rendering.

## Download management

The `/download` page contains the official product areas for:

- ESB Games Play Platform
- ESB Studio

The UI does not create fake downloads. A release needs an approved Backend record with `available = true` and a valid `file_url` before a download button is enabled.

## Search architecture

Search combines:

1. A maintained static metadata index for public pages, common questions, keywords and synonyms.
2. Published news articles.
3. Live download release information.
4. Optional `site_search_documents` records managed by the Backend.

Results are ranked by exact title, phrase, keyword, common question, synonym, content and limited typo tolerance. The website does not scrape every page on each request.

## Language system

The selector always displays these native names in this order:

```text
English
Español
Português do Brasil
Français
Deutsch
简体中文
繁體中文
日本語
한국어
Bahasa Indonesia
हिन्दी
```

The explicit selection is saved in local storage and takes priority over automatic browser detection. Automatic page translation currently relies on Google Translate and therefore requires access to Google’s translation service. Approved first-party translated routes and `hreflang` entries can be added later when reviewed locale content exists.

## Deployment

1. Commit the project to the existing GitHub repository.
2. Push to the production branch connected to Vercel.
3. Confirm Vercel detects Next.js and uses `npm run build`.
4. Add the environment variables in Vercel Project Settings.
5. Deploy and test the production and custom-domain URLs.

Do not add a generated `package-lock.json` containing environment-specific registry addresses. This repository intentionally excludes it.

## Implementation status

See `IMPLEMENTATION-REPORT.md` for completed work, verification, live integrations, Backend setup requirements and remaining limitations.
