-- ESB Games About — newsletter confirmation email / unsubscribe support
-- Safe to run after 20260822_010_newsletter_subscriptions.sql.
-- This migration does not delete subscriber records.

create extension if not exists pgcrypto;

alter table public.newsletter_subscriptions
  add column if not exists unsubscribe_token text;

update public.newsletter_subscriptions
set unsubscribe_token = gen_random_uuid()::text
where unsubscribe_token is null or btrim(unsubscribe_token) = '';

create unique index if not exists newsletter_subscriptions_unsubscribe_token_idx
  on public.newsletter_subscriptions (unsubscribe_token)
  where unsubscribe_token is not null;

grant select, insert, update on table public.newsletter_subscriptions to service_role;

notify pgrst, 'reload schema';
