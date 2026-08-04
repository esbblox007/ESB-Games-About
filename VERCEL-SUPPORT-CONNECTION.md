# Connect ESB Games Support to Supabase on Vercel

The SQL migrations create the database objects. The About website still needs
server credentials in its own Vercel project before it can create private tickets,
call the protected support functions, or upload evidence.

## 1. Add the production environment variables

Open the **ESB Games About** Vercel project, then go to:

**Settings → Environment Variables**

Add these variables to **Production**. Add them to Preview as well when Preview
deployments should use the shared project.

```text
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR-PUBLISHABLE-KEY
SUPABASE_SECRET_KEY=YOUR-SERVER-ONLY-SECRET-KEY
NEXT_PUBLIC_SITE_URL=https://about.esbgames.com
```

Legacy equivalents are also supported:

```text
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_SERVICE_KEY
SUPABASE_SERVER_KEY
SUPABASE_URL
```

Use one server-only secret/service-role variable. Never put that value in a
variable whose name begins with `NEXT_PUBLIC_`.

Do not add quotation marks around values in Vercel. This update trims accidental
whitespace and surrounding quotation marks, but correctly entered values are best.

## 2. Redeploy after saving variables

Environment-variable changes do not alter an already-built deployment. Trigger a
new deployment after saving them and make sure the variables are assigned to the
environment you are testing, especially **Production** for about.esbgames.com.

## 3. Check the connection

Open:

```text
https://about.esbgames.com/api/support/health
```

Ready:

```json
{"available":true,"state":"ready"}
```

Missing URL or server secret:

```json
{"available":false,"state":"configuration_missing"}
```

Database or Data API problem:

```json
{"available":false,"state":"database_unavailable"}
```

For `database_unavailable`, first confirm that `support_categories` exists. If it
does, run `SUPABASE-POSTGREST-REFRESH.sql` once in the Supabase SQL Editor and
redeploy the About site.

## 4. Confirm the required database objects

```sql
select
  to_regclass('public.support_categories') as support_categories,
  to_regclass('public.support_tickets') as support_tickets,
  to_regclass('public.support_ticket_messages') as support_ticket_messages,
  to_regprocedure(
    'public.support_create_ticket(uuid,text,text,text,text,text,text,text,text)'
  ) as support_create_ticket;
```

None of the four results should be `null`.

## Interface behaviour

The ticket wizard no longer blocks the user because a separate readiness request
failed. The real submission request is the source of truth. A failed submission
still produces a clear user-safe message and records detailed diagnostics in the
Vercel function logs.
