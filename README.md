# ESB Games About Website

A coded, responsive seven-page website for `about.esbgames.com`, based on the supplied visual direction. The reference screenshots are **not** embedded as page images: the layout, gradients, navigation, cards, editor window, pricing, forms and animated elements are built with React, TypeScript and CSS.

## Pages

1. `/` — Home
2. `/about` — About
3. `/developer-hub` — Developer Hub
4. `/subscriptions` — Subscriptions
5. `/careers` — Careers
6. `/support` — Support
7. `/early-access` — Early Access

The top navigation changes route correctly, highlights the current page and becomes a mobile menu on smaller screens. The search button opens a working page search; `Ctrl/⌘ + K` opens it from anywhere.

## Included functionality

- Responsive desktop, tablet and mobile design
- Shared navigation and footer
- Functional page search
- Monthly/yearly pricing toggle with a 20% yearly calculation
- Careers department filters and working email application links
- Support ticket form with generated references
- Ticket tracking from local browser storage and optional Supabase records
- Early-access waitlist form
- Optional Resend confirmation and support emails
- Optional Supabase persistence
- Server-side validation and HTML escaping for email content
- No external font or icon CDN dependency

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For a production check:

```bash
npm run build
npm run start
```

## Deploy through GitHub and Vercel

1. Create a new GitHub repository.
2. Upload the contents of this folder to the repository root.
3. In Vercel, choose **Add New → Project** and import the repository.
4. Vercel should detect **Next.js** automatically. Keep the default build command: `next build`.
5. Add the environment variables below in **Project Settings → Environment Variables**.
6. Deploy.
7. In the Vercel project, open **Settings → Domains** and add `about.esbgames.com`.
8. Add the DNS record Vercel gives you at the provider that controls `esbgames.com`.

## Environment variables

Copy `.env.example` to `.env.local` for local development.

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
SUPPORT_INBOX_EMAIL=support@esbgames.com
RESEND_FROM_EMAIL=ESB Games <support@your-verified-domain.com>
NEXT_PUBLIC_SITE_URL=https://about.esbgames.com
```

All integrations are optional. Without them, the forms still work in demonstration mode and save the current visitor's submitted details in that browser's local storage. Configure Supabase for permanent records and cross-device ticket tracking. Configure Resend for real email delivery.

### Important security note

`SUPABASE_SERVICE_ROLE_KEY` must only be added as a Vercel server environment variable. Never prefix it with `NEXT_PUBLIC_` and never put it in client code.

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Run the contents of `supabase.sql`.
4. Copy the project URL and service-role key into Vercel.

The database tables are protected by Row Level Security and accessed through the Next.js API routes.

## Resend setup

1. Create a Resend account.
2. Verify a sending domain, ideally a subdomain such as `mail.esbgames.com`.
3. Create an API key.
4. Set `RESEND_FROM_EMAIL` to an address on the verified domain.
5. Set `SUPPORT_INBOX_EMAIL` to the inbox that should receive support tickets.

The support API sends an internal ticket email and a confirmation to the requester. The early-access API sends a waitlist confirmation.

## Content to review before public launch

The website deliberately labels product systems as planned, in development or pre-launch where appropriate. Before launch, review:

- Subscription prices and benefits
- Careers vacancies
- Support response-time wording
- Legal links and final privacy policy
- Public launch dates
- Email addresses
- Platform-status information

## Project structure

```text
app/                 Pages and API routes
components/          Shared UI and interactive components
lib/                 Supabase and Resend helpers
public/              Static public files
supabase.sql          Database schema
.env.example          Environment-variable template
```
