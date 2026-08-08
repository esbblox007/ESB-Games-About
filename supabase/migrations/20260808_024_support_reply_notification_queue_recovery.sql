-- ESB Games — Support Operations 024
-- Recovery migration for reply notification queue + customer presence tracking.
-- Safe to run even if Support 022 was already applied successfully.

begin;

alter table public.support_tickets
  add column if not exists customer_active_until timestamptz,
  add column if not exists customer_last_seen_at timestamptz,
  add column if not exists customer_last_reply_at timestamptz,
  add column if not exists last_staff_reply_at timestamptz;

create table if not exists public.support_reply_notification_jobs (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  message_id uuid not null references public.support_ticket_messages(id) on delete cascade,
  recipient_email citext not null,
  staff_name text not null,
  ticket_reference text not null,
  ticket_subject text not null,
  message_preview text not null,
  status text not null default 'Pending',
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  hard_reminder_at timestamptz not null,
  sent_at timestamptz,
  cancelled_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  unique(message_id),
  check (status in ('Pending','Sent','Cancelled'))
);

create index if not exists support_reply_notification_due_idx
  on public.support_reply_notification_jobs(status, next_attempt_at)
  where status = 'Pending';
create index if not exists support_reply_notification_ticket_idx
  on public.support_reply_notification_jobs(ticket_id, created_at desc);

alter table public.support_reply_notification_jobs enable row level security;
revoke all on public.support_reply_notification_jobs from anon, authenticated;
grant select, insert, update on public.support_reply_notification_jobs to service_role;

create or replace function public.support_track_customer_conversation_activity()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.sender_type in ('Account','Guest') then
    update public.support_tickets
       set customer_last_reply_at = new.created_at,
           customer_last_seen_at = new.created_at,
           customer_active_until = greatest(coalesce(customer_active_until, new.created_at), new.created_at + interval '75 seconds'),
           updated_at = now()
     where id = new.ticket_id;

    update public.support_reply_notification_jobs
       set status = 'Cancelled',
           cancelled_at = now(),
           last_error = 'Customer replied before notification was required'
     where ticket_id = new.ticket_id
       and status = 'Pending'
       and message_id in (
         select m.id
           from public.support_ticket_messages m
          where m.ticket_id = new.ticket_id
            and m.sender_type = 'Staff'
            and m.created_at < new.created_at
       );
  elsif new.sender_type = 'Staff' then
    update public.support_tickets
       set last_staff_reply_at = new.created_at,
           updated_at = now()
     where id = new.ticket_id;
  end if;
  return new;
end $$;

drop trigger if exists support_track_customer_conversation_activity_trigger on public.support_ticket_messages;
create trigger support_track_customer_conversation_activity_trigger
after insert on public.support_ticket_messages
for each row execute function public.support_track_customer_conversation_activity();

-- Force PostgREST/Supabase to refresh its schema cache immediately after creation.
notify pgrst, 'reload schema';

commit;

-- Verification. Every value should return true / the table name.
select
  to_regclass('public.support_reply_notification_jobs') as support_reply_notification_jobs,
  to_regclass('public.support_ticket_messages') is not null as support_ticket_messages_ready,
  to_regclass('public.support_tickets') is not null as support_tickets_ready;
