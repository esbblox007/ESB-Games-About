# ESB Games Support enterprise interface update

## Interface

- Replaces the oversized single-page intake form with a three-step guided workflow.
- Keeps all category-specific questions and submits them in the initial ticket message.
- Provides clear hierarchy, larger controls, stronger spacing and responsive layouts.
- Uses a fixed-height desktop workspace with a dedicated scrolling content area.
- Uses a near-full-screen mobile layout without shrinking labels and controls.
- Adds client-side step validation and attachment limits before submission.
- Keeps private evidence, guest verification and support-conversation behaviour unchanged.

## Connection behaviour

- The separate health request no longer disables ticket creation.
- The real POST request is the source of truth, preventing false preflight failures from
  locking the form.
- The health endpoint now reports `ready`, `configuration_missing` or
  `database_unavailable` and logs database failures to Vercel.
- Supabase environment values are trimmed and common server-key aliases are accepted.
- `SUPABASE-POSTGREST-REFRESH.sql` is included for a stale Supabase Data API schema
  cache after migrations.

## Required production configuration

The About Vercel project still requires a server-only Supabase secret or legacy
service-role key. Database migrations do not add Vercel environment variables.
See `VERCEL-SUPPORT-CONNECTION.md`.
