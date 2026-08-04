# Support submission pipeline fix

This update corrects a false-positive Support health check and replaces the two
RPCs used by ticket creation with versioned, service-role-only functions.

## What was wrong

The previous `/api/support/health` route only selected one row from
`support_categories`. That proved that the About server could read a table, but
it did not prove that the rate-limit RPC or ticket-creation RPC could be resolved
and executed. The UI could therefore display **Secure submission service ready**
while the actual POST request failed.

The original RPCs also performed a runtime `auth.role()` assertion even though
access was already restricted with PostgreSQL EXECUTE grants. The replacement
RPCs rely on those explicit grants and are available only to `service_role`.

## Deployment order

1. Run `20260804_006_support_submission_pipeline_fix.sql` in the same Supabase
   project used by `about.esbgames.com`.
2. Confirm that all six booleans returned at the end are `true`.
3. Upload this project to GitHub and redeploy the About Vercel project.
4. Open `https://about.esbgames.com/api/support/health`.
5. Confirm the response is `{ "available": true, "state": "ready" }`.
6. Submit a ticket without an attachment first.
7. Then test one small image attachment.

## Diagnostics

Ticket API failures now include a safe incident reference such as
`ESB-SUP-12AB34CD`. The Vercel Function log records that reference together with
the exact failed stage, such as `network_rate_limit`, `create_ticket` or
`upload_attachments`. Technical database details remain hidden from the public.
