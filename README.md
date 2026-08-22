# ESB Games About Website

Public information, News, Careers, Help and Trust for `https://about.esbgames.com`.

**Brand line:** `Discover. Belong. Build.`

## Stack

- Next.js 15
- React 19
- TypeScript
- ESB Games Production Supabase project
- Resend for transactional website email

## Main routes

```text
/                              Home
/about                         About ESB Games
/developer-hub                 Creator Hub
/parental-controls             Families
/trust                         Trust, Safety & Legal
/trust/safety                  Safety Centre
/help                          Help Centre
/news                          News
/documentation                 Documentation
/download                      Product availability
/subscriptions                 Membership information
/careers                       Careers
/support                       Contact Support
```

Policy pages are generated from `lib/content/policies-data.ts`. Route aliases are configured centrally in `next.config.ts`.

## Live content

- **News and Documentation:** Backend-managed Supabase content records.
- **Careers:** Backend-managed published careers through Supabase.
- **Support:** Supabase support workflow with private case access and email verification.
- **Newsletter:** Supabase subscriber records with Resend confirmation email and token-based unsubscribe.
- **Policies:** Native About-site policy pages.

## Supabase migrations

Database changes live under `supabase/migrations/`. Apply migrations in filename order to the Production project and keep secret/service-role credentials server-only.

## Environment

Copy `env.example` to `.env.local` and supply the Production values. Never expose a secret/service-role key through a `NEXT_PUBLIC_` variable.

## Local development

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run typecheck
npm run build
```

## Deployment

1. Apply any Supabase migration required by the release.
2. Verify Vercel environment variables.
3. Run type checking and a production build.
4. Deploy the GitHub branch connected to Vercel.
5. Smoke-test navigation, translations, News, Help, Trust, newsletter, Careers and Support.
