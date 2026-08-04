# ESB Games — Support, News and Careers Integration

This package connects the current **About website** and **Backend website** to the same Supabase Production project.

## What is included

### Support

- The six approved support categories.
- Option A1 guest access only: private ticket link plus an on-demand six-digit email code that expires after three minutes.
- Logged-in account linking when the About website receives a valid Supabase access token.
- Conversation-style ticket messages, staff replies and private internal notes.
- Private evidence uploads for images, video, audio, PDFs, text, JSON and ZIP files.
- Backend queues for Trust & Safety and Creator Operations.
- Email acknowledgements and reply notifications through Resend.
- Notification outbox records for future Play Platform notifications and official direct messages.

### News and Blogs

- Backend rich article editor with headings, paragraphs, bold, italic, underline, embedded links, lists, quotes, images, galleries, uploaded videos, YouTube/Vimeo links, callouts, buttons, tables, code blocks and dividers.
- Title, subtitle, listing excerpt/sub-description, cover media, categories, tags, featured state, SEO, related articles and scheduled publishing.
- Public-safe `cms_articles` view used by the About website.
- Published/scheduled article rendering, RSS and sitemap integration.

### Careers

- Live published roles loaded from the existing recruitment schema.
- Dedicated public role pages and dynamic application forms.
- Private CV/supporting-file uploads.
- Applications written into the existing candidate, application, answer, consent and recruitment history tables.
- Backend role publishing with versioning.
- Executive reporting-line selection limited visually to **Chief Operating Officer** or **Managing Director**.

## Migration order

The existing Supabase migrations must already have been applied, especially:

1. `20260720_platform_content_management_phase3.sql`
2. `20260720_hr_recruitment_hiring_phase3.sql`

Then run these new migrations separately in this exact order:

1. `20260804_001_public_news_and_rich_editor.sql`
2. `20260804_002_support_chat_ticket_system.sql`
3. `20260804_003_careers_public_integration_hardening.sql`
4. `20260804_004_notifications_and_storage_notes.sql`

Use Supabase Dashboard → **SQL Editor** → **New query**. Run one migration at a time and confirm that it completes before continuing.

Do not paste production secrets into the SQL Editor.

## About website environment variables

Set these in the About website Vercel project:

```env
NEXT_PUBLIC_SITE_URL=https://about.esbgames.com
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
RESEND_API_KEY=YOUR_RESEND_KEY
SUPPORT_FROM_EMAIL=ESB Games Support <support@esbgames.com>
SUPPORT_REPLY_TO_EMAIL=support@esbgames.com
CAREERS_FROM_EMAIL=ESB Games Careers <careers@esbgames.com>
CAREERS_REPLY_TO_EMAIL=careers@esbgames.com
SUPPORT_EVIDENCE_BUCKET=support-ticket-evidence
RECRUITMENT_STORAGE_BUCKET=recruitment-candidate-files
NEXT_PUBLIC_CONTENT_PREVIEW=false
NEXT_PUBLIC_CAREERS_PREVIEW=false
```

`SUPABASE_SECRET_KEY` is supported as an alternative server-only variable name, but only one server secret is required.

## Backend environment variables

The Backend already has a large `.env.example`. Confirm these values in its Vercel project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SECRET_KEY=YOUR_SERVICE_ROLE_KEY
NEXT_PUBLIC_ABOUT_SITE_URL=https://about.esbgames.com
ABOUT_SITE_URL=https://about.esbgames.com
SUPABASE_NEWS_MEDIA_BUCKET=public-news-media
SUPPORT_EVIDENCE_BUCKET=support-ticket-evidence
RECRUITMENT_STORAGE_BUCKET=recruitment-candidate-files
RESEND_API_KEY=YOUR_RESEND_KEY
SUPPORT_FROM_EMAIL=ESB Games Support <support@esbgames.com>
SUPPORT_REPLY_TO_EMAIL=support@esbgames.com
CAREERS_FROM_EMAIL=ESB Games Careers <careers@esbgames.com>
CAREERS_REPLY_TO_EMAIL=careers@esbgames.com
```

## Resend setup

Before testing email delivery:

1. Verify the `esbgames.com` sending domain in Resend.
2. Add the DNS records Resend supplies.
3. Confirm that `support@esbgames.com` and `careers@esbgames.com` can be used as senders/reply-to addresses.
4. Add `RESEND_API_KEY` only in Vercel server-side environment variables.

Without Resend, database submissions can still persist, but guest support users cannot complete Option A1 verification. The code returns a clear email-delivery error rather than pretending the code was sent.

## Storage and evidence handling

The migrations create:

- Public bucket: `public-news-media`
- Private bucket: `support-ticket-evidence`
- Private bucket: `recruitment-candidate-files`

Support evidence is deliberately **not rejected because it contains inappropriate material being reported**. It remains private and is labelled with technical scan and evidence-review states.

A malware/file-safety scanning worker is not included in this ZIP. Before broad public use, connect a scanning service or isolated worker that updates `support_ticket_attachments.scan_state` and `candidate_files.scan_state`. Do not automatically delete legitimate Safety & Abuse evidence because of content classification.

## Important production requirements

### Backend staff identity

The supplied Backend still contains its pre-existing prototype `lib/current-user.ts`, which grants a hard-coded development staff identity. The new pages use the existing permission framework, but true staff-by-staff security requires replacing that prototype identity with the Backend's authenticated Supabase staff session and permission claims before multi-user production use.

### Cross-subdomain account recognition

The About website validates a Supabase access token server-side when one is supplied. Browser local storage is not shared between `esbgames.com` and `about.esbgames.com`. For seamless automatic recognition across subdomains, the main Play Platform should later provide a secure shared HttpOnly session or a short-lived token bridge. Guest Option A1 tickets work without this bridge.

### Platform notifications and direct messages

Support replies add records to `public_site_notification_outbox`. A Play Platform worker must consume the `Platform Notification` and `Direct Message` channels to deliver them inside the platform. Email delivery works directly through Resend once configured.

### Abandoned uploads

Candidate uploads expire in the database after 24 hours. Add a scheduled cleanup task that deletes unconsumed objects from `recruitment-candidate-files`. Support evidence should follow the organisation's safeguarding, legal-hold and retention policies rather than a generic deletion schedule.

## Smoke-test checklist

### News

1. Open Backend → Platform Systems → News & Blogs.
2. Create a draft with bold text, an embedded link, an image and a gallery.
3. Save it as Draft and confirm it does not appear publicly.
4. Publish it and confirm it appears on `/news` and `/news/[slug]`.
5. Schedule an article five minutes ahead and confirm it appears only after the time passes.
6. Confirm excerpt/sub-description, cover media, metadata, RSS and sitemap behaviour.

### Careers

1. Open Backend → Human Resources → Recruitment & Hiring → Job Postings.
2. Create or edit a role, choose COO or Managing Director as the reporting line, and publish it.
3. Confirm the role appears on `/careers` and its dedicated role page.
4. Submit an application with a CV.
5. Confirm the application, candidate, answers, consent and file records appear in Backend/Supabase.
6. Confirm the acknowledgement email arrives from `careers@esbgames.com`.

### Support

1. Submit a guest Account & Access ticket.
2. Confirm the ticket persists before any success screen is shown.
3. Open the private link, request a code and confirm the code expires after three minutes.
4. Verify the code and continue the chat.
5. Reply from the Backend and confirm the email notification is sent.
6. Submit a Safety & Abuse ticket with restricted evidence and confirm the file remains private.
7. Confirm internal notes never appear in the public ticket conversation.
8. Test logged-in ticket linking with a valid account access token.

## Deployment order

1. Back up the Supabase project or confirm point-in-time recovery.
2. Apply the four SQL migrations in order.
3. Add Vercel environment variables to both projects.
4. Deploy the Backend first.
5. Test creating News and Careers records from the Backend.
6. Deploy the About website.
7. Complete the smoke tests above.
8. Only then enable public promotion of the forms.

## Rollback approach

These migrations are additive. Do not drop the new tables during an incident unless you have exported their data. Safer rollback steps are:

1. Roll back the two Vercel deployments.
2. Disable public Support/Careers links temporarily.
3. Pause publishing in the Backend.
4. Preserve all submitted tickets, evidence and applications.
5. Correct the migration with a new forward-only SQL migration.
