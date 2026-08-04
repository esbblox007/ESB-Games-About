# Vercel Support ticket type fix v2

This package fixes the Vercel error:

`Property ticketId does not exist on type { accessToken: string }`

Both files below must be present in the same Git commit:

- `app/api/support/tickets/route.ts`
- `lib/server/support.ts`

The route now has its own explicit `CreatedTicketResult` contract, while the helper also returns `Promise<CreatedSupportTicket>`. This makes the build safe even if TypeScript encounters a stale or partially replaced helper implementation.

No SQL or environment variable changes are required.
