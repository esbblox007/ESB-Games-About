# ESB Games About Website — Cleanup Update

This package removes unsupported public claims and prepares the About website for a more honest pre-launch presentation.

## Main changes

- Replaced unverified player, game, creator, country, press, rating and payout statistics with verified development metrics.
- Removed the early-access page, API and browser-storage flow.
- Redirected `/login`, `/signup` and `/sign-up` to the main ESB Games account website.
- Rebuilt Support as a frontend-only preview without fake ticket IDs, localStorage records or false submission success.
- Rebuilt Careers with dedicated role routes at `/careers/[slug]` and a backend-ready visual application form.
- Added working legal and accessibility route placeholders for the documents currently under final management review.
- Corrected subscription plan order to Member, Plus, Pro and Max and labelled all pricing as provisional.
- Removed unsupported compliance badges, creator ratings, performance promises, press claims and global-scale claims.
- Added security response headers and removed client-side account-state guessing from the public header.
- Updated the sitemap, footer, download messaging and Creator Hub wording.

## Backend status

Support and Careers are intentionally frontend-only in this package. No support ticket or job application is submitted, stored or assigned a reference. Their components are structured for a later Supabase and ESB Games Backend connection.

## Follow-up layout corrections

- Locked the desktop and mobile header to a consistent height and added protection against Google Translate pushing the page downward.
- Restored the preferred three-card Support layout while keeping ticket submission and tracking safely frontend-only.
- Replaced the former community/Discord prompt with the official `status.esbgames.com` website.
- Fixed overlapping Careers result text and the role-page breadcrumb/department label.
- Updated reporting lines so vacancies no longer report to the Chief Executive Officer; executive and operational roles now report to the Managing Director or Chief Operating Officer as appropriate.
- Reworked the Parental Controls page into wider, separated sections with three-column feature cards and more vertical breathing room.
