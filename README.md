# ESB Games About Website

The public ESB Games information website for `https://about.esbgames.com`, built with Next.js 15, React 19 and TypeScript.

This release presents ESB Games honestly as a pre-launch gaming and creator ecosystem. Unsupported user, game, creator, country, press, rating and payout claims have been replaced with verified development information.

## Public routes

```text
/                              Homepage
/about                         About ESB Games
/developer-hub                 Creator Hub
/parental-controls             Parental Controls
/news                          News index
/news/[slug]                   Published news article
/news/rss.xml                  RSS feed
/download                      Official product availability
/careers                       Careers and vacancy list
/careers/[slug]                Dedicated role and application preview
/support                       Help and support frontend
/support/help/[slug]           Help article
/subscriptions                 Provisional subscription preview
/legal/terms                   Terms route awaiting final reviewed content
/legal/privacy                 Privacy route awaiting final reviewed content
/legal/community-standards     Community Standards route awaiting final reviewed content
/legal/cookies                 Cookie Policy route awaiting final reviewed content
/accessibility                 Accessibility route awaiting final reviewed content
```

Redirects:

```text
/blog and /blog/[slug]  → News
/creator-hub            → /developer-hub
/login                  → https://esbgames.com/login
/signup and /sign-up    → https://esbgames.com/sign-up
/early-access           → https://esbgames.com/sign-up
```

## Current backend boundaries

- **Support:** frontend preview only. The form does not send or store information and does not generate ticket references.
- **Careers:** frontend preview only. Applications and CV files are not sent or stored.
- **Newsletter:** can use the shared Supabase Production project when configured.
- **News, downloads and search documents:** prepared for Backend-managed Supabase content.

Do not show submission success for Support or Careers until a durable backend write and acknowledgement flow has been implemented.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production:

```bash
npm run typecheck
npm run build
npm run start
```

## Environment variables

Copy `env.example` to `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://about.esbgames.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
REVALIDATION_SECRET=
NEXT_PUBLIC_CONTENT_PREVIEW=false
```

`SUPABASE_SERVICE_ROLE_KEY` and `REVALIDATION_SECRET` are server-only. Never expose them through a `NEXT_PUBLIC_` variable.

## Supabase

`supabase.sql` contains only the optional About-site content tables currently used or prepared by this project:

```text
newsletter_subscriptions
cms_articles
download_releases
site_search_documents
```

Support and Careers tables are intentionally excluded until their backend workflows, permissions, attachment storage, notifications and internal queues are approved.

## Deployment

1. Review the changes and commit them to the existing GitHub repository.
2. Push the branch connected to Vercel.
3. Add the required environment variables in Vercel.
4. Run a production build and test all redirects, forms, legal routes and responsive layouts.
5. Add final reviewed legal content before public launch.

See `UPDATE-NOTES.md` for the cleanup summary.

## Dependency lockfile

This package does not include a generated `package-lock.json` because the review environment could not reach the public npm registry. Run `npm install` in a normal development environment and commit the generated lockfile before production deployment.
