# ESB Games Support 025 — Deployment Guide

Support 025 is an additive refinement of Support 024. It does not reset Supabase, replace ticket IDs, or redesign unrelated pages.

## What changed

### Backend / Admin Portal
- Converts Support Operations into a viewport-height desktop workspace while a ticket is selected.
- Ticket list and conversation scroll independently; the composer remains visible.
- Replaces the six large KPI cards with a compact live summary while working a ticket; the cards remain when no ticket is selected.
- Removes horizontal status navigation and uses quick filters plus a Status dropdown.
- Uses one canonical authorised-ticket metric service for queue counters and the Admin sidebar ticket count.
- Sidebar count automatically displays `0 tickets`, `1 ticket`, `2 tickets`, etc. for tickets the current staff member can access.
- Adds automatic queue/detail refresh after local mutations and a scoped near-real-time refresh loop without per-ticket database listeners.
- Adds customer typing indicators and staff typing presence.
- Adds a Reopen action for owned resolved/closed tickets where the existing update RPC permits it.
- Makes CUSTOMER REPLY vs INTERNAL NOTE explicit in the composer.
- Internal notes remain in `support_ticket_internal_notes` and are not exposed by customer endpoints.
- Shrinks evidence previews and adds controlled image preview / sensitive-evidence reveal handling.
- Adds client-message idempotency for staff replies.
- Separates attachment/storage failure from an already-saved support reply so the UI cannot falsely claim the whole reply failed.

### Customer ticket page
- Keeps the existing ESB Games appearance but changes the desktop ticket into a compact messaging workspace.
- Removes customer-facing internal team ownership and support priority.
- Removes redundant case/latest-activity/sidebar panels from the working conversation view.
- Keeps the ticket header, conversation and composer visible in the viewport on desktop.
- Opens at the newest messages; if the customer scrolls upward, new data does not force them down and a `New messages ↓` control appears.
- Shows staff typing and publishes customer typing/presence.
- Shows attachment previews before sending and supports removal before submission.
- Reduces inline image size to approximately 300 px maximum preview height.
- Adds stable client-message IDs to reduce duplicate replies after network retries.
- Replaces the old `PLAY · CREATE · CONNECT` logo tagline with `DISCOVER · BELONG · BUILD`.

### Notifications / presence
- Viewing the authorised customer ticket refreshes a short customer-presence window.
- Typing also refreshes customer presence.
- Staff-reply email is suppressed while the customer is active or has viewed the ticket within five minutes.
- The 24-hour no-reply reminder is also deferred while the customer is actively viewing/typing; it becomes eligible after the customer leaves.
- A customer reply after the staff message cancels the pending email job.
- Rapid staff follow-ups within five minutes remain collapsed/deferred rather than creating one email per message.

### Security / evidence
- Adds `customer_visible`, validation state, detected MIME, sensitive-reveal and retention metadata without replacing existing ticket tables.
- Customer attachment downloads now require: a valid authorised ticket session, the same ticket ID, `customer_visible = true`, a linked public message, and an available validation state.
- Internal/staff-only attachments cannot be reached through the customer attachment endpoint.
- Blocks dangerous active/executable extensions and rejects HTML/SVG/script-like content and common MIME/signature mismatches.
- Enforces 8 files, 100 MB per file and 400 MB combined per reply server-side.
- Keeps `support-ticket-evidence` private and uses short-lived signed URLs after permission checks.
- Sensitive staff evidence access is permission checked and audited.
- Adds retention classification / legal-hold fields for future policy enforcement; no automatic deletion policy is hard-coded.
- Adds ephemeral typing rows with expiry. The typing RPC and customer-view RPC are service-role-only.
- Revokes direct browser access to core support records so customer/staff access continues through server-side ticket/session/RBAC checks.

## Required Supabase migration

Run this file in the Production Supabase SQL Editor **after Support 022 and Support 024 have been applied**:

`20260808_025_support_workspace_security_realtime.sql`

The migration is additive and uses `IF NOT EXISTS`/safe updates where appropriate. It does not reset or delete existing support ticket data.

After the migration, confirm:
- `support_ticket_typing` exists.
- `support_ticket_attachments` has `customer_visible`, `validation_state`, `detected_mime_type`, `available_at`, `rejected_reason`, and `sensitive_reveal_required`.
- `support_tickets` has `retention_classification`, `legal_hold`, and `retention_review_at`.
- `support-ticket-evidence` remains private.
- The PostgREST schema cache has reloaded (the migration sends the reload notification).

The migration also attempts to include the relevant support tables in the existing `supabase_realtime` publication where available. The UI continues to use an authorisation-safe short refresh loop as a fallback because support data is intentionally served through server APIs rather than exposed directly to browser Supabase sessions.

## Environment variables

### New environment variables
None.

### Existing variables to retain
Use your current values. Do not expose service-role keys to the browser.

Backend commonly uses:
- `NEXT_PUBLIC_SUPABASE_URL` / existing Supabase URL variable
- `SUPABASE_SERVICE_ROLE_KEY` / existing server secret equivalent
- `SUPPORT_FROM_EMAIL`
- `SUPPORT_REPLY_TO_EMAIL`
- `NEXT_PUBLIC_ABOUT_SITE_URL`
- `SUPPORT_EVIDENCE_BUCKET` (defaults to `support-ticket-evidence`)

About/support commonly uses:
- `NEXT_PUBLIC_SUPABASE_URL` / existing Supabase URL variable
- `SUPABASE_SERVICE_ROLE_KEY` / existing server secret equivalent
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or existing publishable key for account verification
- existing Resend API key / sender settings used by `lib/server/email.ts`
- `NEXT_PUBLIC_SITE_URL`
- `SUPPORT_EVIDENCE_BUCKET` (defaults to `support-ticket-evidence`)

No existing environment variable needs to be renamed for Support 025.

## Resend actions

No new Resend configuration is required. Keep the existing verified sending domain, API key and support sender/reply-to configuration. Support 025 reuses the existing verification and staff-reply email integrations.

## Notification processor

Keep the existing Support notification-job processor/cron enabled. It is responsible for retrying deferred staff-reply emails and the 24-hour reminder after presence rules allow delivery.

## Production checks performed in the artifact environment

- Parsed/transpiled all 15 touched TypeScript/TSX files with the installed TypeScript 5.8.3 compiler: passed.
- Ran 19 targeted static regression/security assertions covering canonical active status logic, authorised metrics, customer metadata isolation, internal-note isolation, attachment authorisation, typing endpoints, active-user email suppression, idempotency, private storage, service-role-only RPCs, upload limits, active-format blocking and desktop workspace rules: passed 19/19.
- Attempted `npm install` for the Backend project: blocked by the artifact environment package proxy returning HTTP 404 for `yocto-queue@0.1.0`.
- Attempted dependency installation against the public npm registry for the About project: the artifact environment timed out before installation completed.

Because dependencies could not be installed in this runtime, `next build`, project lint and the repository's full `tsc --noEmit` cannot be honestly reported as completed here. Vercel/GitHub CI should run the normal project build after deployment. The failure observed here is dependency-registry access, not a source compile diagnostic from the changed files.

## Recommended deployment order

1. Back up or snapshot the current production Supabase project as you normally would for a production migration.
2. Run `20260808_025_support_workspace_security_realtime.sql` in Supabase Production.
3. Deploy the updated Backend project.
4. Deploy the updated About project.
5. Confirm the existing notification processor/cron is running.
6. Test with one normal Support role and one elevated Trust & Safety/management role.
7. Test a guest customer ticket through a fresh/private browser session to confirm email verification is required.
8. Verify a second customer cannot access the first customer's ticket/attachment URL.

## Remaining limitation

Support 025 performs strict server-side format/signature validation and preserves explicit scanning/validation states, but it does **not** add a third-party malware scanning provider. The existing schema is prepared for Processing/Scanning/Available/Rejected states. If ESB Games later connects a malware scanner, change newly uploaded evidence from format-validated availability into the asynchronous scanner workflow before broader evidence access.

## Suggested GitHub Desktop commit

**Summary**

`Simplify support workspace, sync ticket counts and harden ticket security`

**Description**

`Refines the ESB Games Support Operations and customer ticket experience with a fixed desktop workspace, compact ticket controls, realtime-aware Supabase ticket counts, improved attachment previews, secure customer ticket verification, stronger RBAC/RLS checks, internal-note isolation, safer evidence handling, typing/presence indicators and improved support error states.`
