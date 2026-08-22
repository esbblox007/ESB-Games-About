# ESB Games About — Header / Translator / Purple CTA fix

## Root cause
The blank area appearing above the header was not normal browser overscroll. Google Translate can asynchronously inject a top banner and reserve page space after the initial render or after a Next.js client-side route change. Because the ESB header is `position: sticky`, any injected element before it moves the header's natural start position down and exposes the site background above it.

## Fix
- Remove only Google Translate banner chrome injected directly under `body` (the hidden translator host remains intact).
- Reset `body` / `html` top, margin-top and padding-top offsets.
- Re-run the cleanup after route changes and at short intervals while Google Translate initialises.
- Observe body/html style and direct-child mutations to catch late banner injection.
- Keep the header pinned at a zero top offset.

## Purple CTA audit
- Primary purple buttons are now single-line controls.
- Primary-button icons cannot shrink the label.
- The desktop `Explore Platform` CTA is given enough width for the icon and full label.
- The compact newsletter and authentication purple actions use the same no-wrap rule.
