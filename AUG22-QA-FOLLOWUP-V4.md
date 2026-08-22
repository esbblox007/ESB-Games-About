# ESB Games About — QA follow-up v4

## Header / scaling
- Removed the fixed-header + main-padding combination that created a duplicate dark band under the navigation.
- The header is sticky and remains in normal document flow.
- Existing Google Translate banner cleanup remains active so injected translation chrome cannot reserve space above the header.

## Newsletter confirmation and unsubscribe
- New successful subscriptions now send a confirmation email through the existing Resend server integration.
- The email explains what ESB Games updates contain and links to a dedicated unsubscribe page.
- Added token-based unsubscribe support. Browser roles cannot read the newsletter table directly.
- Run `20260822_011_newsletter_confirmation_unsubscribe.sql` before deploying this code.
- Optional Vercel variables: `NEWSLETTER_FROM_EMAIL` and `NEWSLETTER_REPLY_TO_EMAIL`. If `NEWSLETTER_FROM_EMAIL` is omitted, the existing `SUPPORT_FROM_EMAIL` sender is reused.

## Support / Help Centre
- Increased Quick Help row height and horizontal padding so labels and arrows fit cleanly at browser zoom levels.
- `Browse articles` now routes to `/help`.
- Added a native Help Centre using the supplied ESB Games Global Help Centre content guide: search, category cards, quick actions, popular guides and FAQs.
- Updated footer and sitemap to include `/help`.

## Trust / policy availability
- Public policy resources now show `Available now` in the Trust Centre instead of the inaccurate `In development` state, because the pages are available.
- Source documents that still contain unresolved legal placeholders or explicit draft wording remain identified as published drafts on their document pages. The build does not invent legal entity names, effective dates, regulated contact routes or other missing legal facts.
