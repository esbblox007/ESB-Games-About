# Support system update

## Fixed

- Added compatibility with both legacy Supabase `anon`/`service_role` keys and
  the newer `sb_publishable_...` / `sb_secret_...` keys.
- Added `/api/support/health` so the deployed About site can verify that its own
  Vercel environment is connected to the shared Supabase project.
- Replaced the technical Supabase configuration error shown to visitors with a
  professional service-unavailable message.
- Rebuilt ticket intake around category-specific, professional questions.
- Every completed answer is assembled into the initial support conversation
  message, so the Backend ticket contains the full questionnaire.
- Preserved all six approved support categories and Option A1 guest access.
- Kept private evidence uploads, restricted safety evidence and chat-style
  ticket conversations.
- Prevented the Support page from restoring an outdated browser back/forward
  cache version after visiting the external status website.
- Opened status links in a separate tab and added no-store rules for Support.
- Removed outdated copy claiming that ticket submissions were not connected.

## Vercel action required

Database migrations do not configure the About website's Vercel project. Add
its Supabase URL and server secret under Vercel Environment Variables, then
redeploy. See `VERCEL-SUPPORT-CONNECTION.md`.

## SQL

No additional SQL migration is required for this update. Structured answers are
stored in the existing ticket description and first conversation message.
