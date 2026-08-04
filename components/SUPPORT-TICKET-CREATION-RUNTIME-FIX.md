# Support ticket creation runtime fix

## Cause

The previous health check could reach Supabase and resolve the Support tables, but the ticket creator generated and hashed its private token inside PostgreSQL. On Supabase, extension functions may live outside the restricted `public` search path used by the security-definer RPC. That meant the readiness endpoint could report `ready` while the first real ticket creation failed when the crypto functions were executed.

The v3 pipeline fixes this by generating the raw private token in the trusted About server and sending only its SHA-256 hash to Supabase. The raw token is returned to the browser once as part of the private ticket link and is never stored in the database.

The update also makes email delivery non-fatal. A temporary Resend failure will no longer turn a successfully stored ticket into a misleading submission error.

## Install

1. Run `20260804_007_support_ticket_creation_runtime_fix.sql` in the shared Production Supabase project.
2. Confirm all six verification columns return `true`.
3. Deploy this About website update to Production.
4. Open `/api/support/health` and confirm it reports `pipelineVersion: 3`.
5. Submit a test ticket without an attachment, then submit another with one small image.

No existing Support records are deleted or replaced.
