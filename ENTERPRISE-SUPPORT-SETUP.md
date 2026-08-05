# ESB Games Enterprise Support — installation guide

This package upgrades the About website and Backend to use one live Supabase-backed support system with private customer conversations, staff ownership, controlled escalation and Resend email verification.

## 1. Run the new SQL migration

The existing migrations `001` through `007` must already be installed. Run this file once in the same shared Production Supabase project:

```text
20260804_008_enterprise_support_operations_and_resend.sql
```

The migration is additive. It creates the live queue metrics, ownership controls, staff support directory, delivery audit records and controlled claim/escalation RPCs.

At the bottom of the SQL result, every readiness value should be `true`.

## 2. Configure staff accounts

Each moderator must have:

1. A Supabase Auth user using their ESB Games work email.
2. A matching row in `public.backend_staff_accounts` where `work_email` is the same email.
3. `support_access_enabled = true`.
4. A suitable `support_authority_level`.

Suggested authority levels:

| Level | Typical responsibility |
|---:|---|
| 10 | Support Moderator |
| 30 | Senior Moderator / Specialist |
| 50 | Team Lead / Manager |
| 65 | Senior Manager |
| 80 | Head / Director |
| 100 | Chief Officer / Managing Director / Executive override |

Example—replace the placeholder email and level:

```sql
update public.backend_staff_accounts
set
  support_access_enabled = true,
  support_authority_level = 10,
  support_team = 'Support Operations',
  updated_at = now()
where lower(work_email) = lower('moderator@esbgames.com');
```

The first successful Backend sign-in links `auth_user_id` automatically when the work email matches.

## 3. Backend Vercel environment variables

Set these in the **ESB Games Backend** Production environment:

```env
AUTH_SECRET=<long-random-server-secret>
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
SUPABASE_SECRET_KEY=<server-only-secret-key>
NEXT_PUBLIC_ABOUT_SITE_URL=https://about.esbgames.com
SUPPORT_EVIDENCE_BUCKET=support-ticket-evidence

RESEND_API_KEY=<re_...>
SUPPORT_FROM_EMAIL=ESB Games Support <support@mail.esbgames.com>
SUPPORT_REPLY_TO_EMAIL=support@esbgames.com
```

Redeploy after saving the variables.

The legacy `ADMIN_EMAIL` and `ADMIN_PASSWORD` login remains as an emergency fallback. Remove it after all staff accounts have been tested.

## 4. About Vercel environment variables

Set these in the **ESB Games About** Production environment:

```env
NEXT_PUBLIC_SITE_URL=https://about.esbgames.com
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
SUPABASE_SECRET_KEY=<server-only-secret-key>
SUPPORT_EVIDENCE_BUCKET=support-ticket-evidence

RESEND_API_KEY=<the-same-Resend-account-key>
SUPPORT_FROM_EMAIL=ESB Games Support <support@mail.esbgames.com>
SUPPORT_REPLY_TO_EMAIL=support@esbgames.com
```

The secret key must never use a `NEXT_PUBLIC_` name.

## 5. Verify the Resend sender domain

In Resend:

1. Add the sending domain or subdomain, for example `mail.esbgames.com`.
2. Add the DNS records Resend supplies.
3. Wait until the domain status is **Verified**.
4. Ensure `SUPPORT_FROM_EMAIL` uses that exact verified domain.
5. Use `support@esbgames.com` as the reply-to address if that is the inbox your team reads.

After redeploying the About site, open:

```text
https://about.esbgames.com/api/support/email-health
```

The expected result is:

```json
{
  "available": true,
  "state": "verified",
  "configured": true,
  "domainVerified": true
}
```

The existing database health endpoint should also remain ready:

```text
https://about.esbgames.com/api/support/health
```

## 6. Ownership rules now enforced

- Any authorised moderator can claim an unclaimed ticket.
- Once claimed, only that owner can reply, add internal notes or change status/priority.
- Other moderators can read the ticket when their category permissions allow, but the composer is locked.
- A claimed ticket cannot be unclaimed.
- Ownership can only move through a recorded escalation.
- Normal moderators can only escalate to someone with a higher authority level.
- The database trigger blocks direct unclaiming and unrecorded transfers.

## 7. Test order

1. Create a guest ticket without an attachment.
2. Confirm that the creation email arrives.
3. Open the private link and request a verification code.
4. Confirm that `/api/support/email-health` reports `verified`.
5. Enter the code and open the conversation.
6. Sign in to the Backend as Moderator A and claim the ticket.
7. Sign in as Moderator B in another browser profile and confirm the composer is locked.
8. Escalate from Moderator A to a higher-authority account.
9. Confirm that Moderator A becomes read-only and the superior becomes the owner.
10. Reply from the new owner and confirm the customer receives a Resend email notification.
11. Test one image attachment and verify that it stays in the private `support-ticket-evidence` bucket.

## Important evidence note

Safety evidence is not rejected merely because it contains inappropriate material being reported. It remains private and access-restricted. The included code records scan and moderation states, but an external malware-scanning worker must still be connected before broad public file uploads are treated as fully security-scanned.
