# ESB Games Support 025.2 — UX Regression Fix

Focused correction pass only. This does not replace Support 025/025.1 and does not add a Supabase migration.

## Backend repository
Copy the contents of `Backend/` into the root of `ESB-Games-Backend`.

Changed files:
- `components/trust-safety/TrustSafetySupportTicketsPage.tsx`
- `components/PortalShell.tsx`
- `app/globals.css`

## About repository
Copy the contents of `About/` into the root of the About website repository.

Changed files:
- `components/SupportTicketClient.tsx`
- `app/globals.css`

## Corrections
- Removed the extra Customer Reply/Internal Note explanatory banner from the staff composer.
- Kept the existing Customer reply/Internal note mode buttons.
- Support Tickets now uses the same right-aligned purple numeric sidebar badge as Reports/Appeals.
- Quick status counts render as separate pills rather than concatenated labels.
- Customer textarea is full-width, 96px initial height, auto-grows to 160px, and cannot collapse to intrinsic width.
- Customer action button is `Send Message`.
- Customer placeholder is `Write a message...`.
- Enter sends; Shift+Enter inserts a new line on both staff and customer textareas.
- Empty/duplicate submissions are guarded; failed sends preserve the draft.
- Customer evidence controls are compact and selected files only appear after selection.
- Conversation messages use a centred content lane and sensible message max-widths.
- Pending attachments use a compact file card instead of an ellipsis/broken preview treatment.

## Database / environment
No new SQL migration.
No environment variable changes.
No Resend changes.

Support 025 security, verification, RBAC/RLS, private evidence, presence/typing, canonical counts, realtime refresh and notification suppression remain in place.
