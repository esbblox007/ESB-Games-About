# Connect the About support system to Supabase on Vercel

Running SQL migrations creates the database tables and functions. It does not add
Supabase credentials to the separate About website Vercel project.

In Vercel, open the ESB Games About project and go to:

**Settings → Environment Variables**

Add the following for Production, Preview and Development as appropriate:

```text
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR-PUBLISHABLE-OR-ANON-KEY
SUPABASE_SECRET_KEY=YOUR-SERVER-ONLY-SECRET-OR-SERVICE-ROLE-KEY
NEXT_PUBLIC_SITE_URL=https://about.esbgames.com
```

The code also accepts these older equivalent names:

```text
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_SERVICE_KEY
SUPABASE_URL
```

Do not place the secret/service-role key in any variable beginning with
`NEXT_PUBLIC_`.

After saving the variables, redeploy the About website. A normal redeploy is
required because server environment variables are read by the deployed functions.

The endpoint below can be opened after deployment to verify the connection:

```text
https://about.esbgames.com/api/support/health
```

A working setup returns:

```json
{"available":true}
```

A `503` response means the About project is missing a URL/secret variable, cannot
reach the shared Supabase project, or cannot read `support_categories`.

No additional SQL migration is required for the structured support questionnaire.
All category-specific answers are assembled into the initial ticket message, so
staff can see every answer in the Backend conversation without changing the schema.
