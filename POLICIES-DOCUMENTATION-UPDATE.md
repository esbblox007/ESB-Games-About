# Policies, Documentation & Header Fix

## Public policy pages
The About site now serves 27 ESB Games policy/guide documents as native website pages under their canonical routes. Source text is rendered inside the ESB Games site rather than embedded from Google Docs.

Internal-only implementation/publication appendices explicitly marked as internal are excluded from the public render. Source documents that still identify themselves as drafts retain their unresolved bracketed fields and are shown with a pre-launch draft notice; no legal details have been invented.

## Short links
- `/tos` redirects permanently to `/terms-of-service`.
- `/docs` redirects permanently to `/documentation`.
- `/doc` redirects permanently to `/documentation`.

## Documentation publishing
Public Documentation uses the same article source as News.
- Tag `documentation` to include an article in Documentation.
- Tag `documentation-only` to remove it from the News index while keeping it in Documentation.
- Documentation-only News URLs redirect to `/documentation/<slug>`.

The Backend editor patch adds toggles that manage these tags without a database migration.

## Header fix
The page now actively prevents Google Translate/banner page offsets and browser vertical overscroll from exposing an empty area above the sticky header. The translator offset reset observes later style/banner mutations so the header remains at `top: 0`.
