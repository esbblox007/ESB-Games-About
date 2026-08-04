# Vercel Support Ticket Type Fix

This update fixes the production build error in `app/api/support/tickets/route.ts`:

`Property 'ticketId' does not exist on type '{ accessToken: string; }'.`

## Cause

`createSupportTicket()` normalised the Supabase RPC response into a generic object and returned it using an object spread. TypeScript could not preserve the RPC fields through that spread, so it inferred only the explicitly added `accessToken` property.

## Fix

- Added an explicit `CreatedSupportTicket` return type.
- Parsed and validated every expected RPC field.
- Returned a fully typed object containing `ticketId`, `ticketReference`, `accessToken`, requester details, verification state, status and pipeline version.
- Kept the v3 Support RPC and database migration unchanged.

No additional SQL migration or environment-variable change is required.
