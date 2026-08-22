# ESB Games About — QA website fix (22 August 2026)

This package addresses the QA findings reported for the About website.

## Fixed

- Newsletter subscriptions now use the server-side Supabase helper consistently, can re-subscribe an existing unsubscribed address, and log server-side database failures for diagnosis.
- Added `20260822_010_newsletter_subscriptions.sql`, an idempotent migration that creates the newsletter table if needed and grants the required `service_role` privileges while keeping browser roles blocked.
- Newsletter failure copy is now clearly red; success/already-subscribed feedback remains green.
- Support Quick Help links have more internal horizontal space and a slightly taller hit area.
- The site header is structurally fixed to the top of the viewport and `main` reserves the exact header height. This prevents body-level Google Translate chrome from pushing the navigation down after refresh/client-side navigation.
- Careers > Culture uses real ESB Games / ESB Studio imagery instead of placeholder ESB-letter cards.
- Home product screenshots are delivered from their original high-resolution assets rather than being downsized through Next Image optimisation in the hero composition.
- Home hero line-height/spacing was relaxed enough to prevent the descender in “everyone” colliding with “discover”.

## Supabase deployment

Run `20260822_010_newsletter_subscriptions.sql` once in the shared Production Supabase SQL Editor before testing newsletter sign-up. The migration is safe to re-run and does not delete existing subscriptions.
