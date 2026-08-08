-- ESB Games — Support Operations 022
-- Direct ticket reply links, customer presence-aware email notifications,
-- management escalation queue, attachment-friendly messaging and transcript separation.
-- Run after 20260807_021_support_dm_transcripts_and_unclaim_FIXED.sql.

begin;

alter table public.support_tickets
  add column if not exists customer_active_until timestamptz,
  add column if not exists customer_last_seen_at timestamptz,
  add column if not exists customer_last_reply_at timestamptz,
  add column if not exists last_staff_reply_at timestamptz,
  add column if not exists escalation_target_type text,
  add column if not exists escalated_to_team text;

create index if not exists support_tickets_customer_presence_idx
  on public.support_tickets(customer_active_until)
  where customer_active_until is not null;

-- Extra ticket-specific access links can be issued by Support without replacing the
-- original private access token. Only SHA-256 hashes are stored.
create table if not exists public.support_ticket_access_tokens (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  token_hash text not null unique,
  purpose text not null default 'Staff Reply Email',
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  last_accessed_at timestamptz
);
create index if not exists support_ticket_access_tokens_ticket_idx
  on public.support_ticket_access_tokens(ticket_id, created_at desc);
create index if not exists support_ticket_access_tokens_active_idx
  on public.support_ticket_access_tokens(token_hash)
  where revoked_at is null;
alter table public.support_ticket_access_tokens enable row level security;
revoke all on public.support_ticket_access_tokens from anon, authenticated;
grant select, insert, update on public.support_ticket_access_tokens to service_role;

-- Alias-aware verification keeps the same six-digit security flow for reply-email
-- links without replacing the ticket's original private access token.
create or replace function public.support_verify_guest_code_v2(
  p_access_token_hash text,
  p_code_hash text,
  p_session_token_hash text,
  p_user_agent_hash text default null,
  p_ip_hash text default null
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ticket public.support_tickets%rowtype;
  v_code public.support_ticket_verification_codes%rowtype;
  v_alias public.support_ticket_access_tokens%rowtype;
begin
  if auth.role() <> 'service_role' then raise exception 'service role required'; end if;

  select * into v_ticket
    from public.support_tickets
   where access_token_hash = p_access_token_hash
   limit 1;

  if not found then
    select * into v_alias
      from public.support_ticket_access_tokens
     where token_hash = p_access_token_hash
       and revoked_at is null
       and (expires_at is null or expires_at > now())
     limit 1;
    if not found then raise exception 'invalid ticket link'; end if;
    select * into v_ticket from public.support_tickets where id = v_alias.ticket_id limit 1;
    if not found then raise exception 'invalid ticket link'; end if;
    update public.support_ticket_access_tokens set last_accessed_at = now() where id = v_alias.id;
  end if;

  select * into v_code
  from public.support_ticket_verification_codes
  where ticket_id = v_ticket.id and consumed_at is null and revoked_at is null
  order by sent_at desc limit 1 for update;

  if not found or v_code.expires_at <= now() then raise exception 'verification code expired'; end if;
  if v_code.attempts >= v_code.max_attempts then raise exception 'too many attempts'; end if;

  update public.support_ticket_verification_codes set attempts = attempts + 1 where id = v_code.id;
  if v_code.code_hash <> p_code_hash then raise exception 'incorrect verification code'; end if;

  update public.support_ticket_verification_codes set consumed_at = now() where id = v_code.id;
  update public.support_tickets
     set requester_email_verified = true,
         verified_at = coalesce(verified_at, now()),
         status = case when status = 'Pending Email Verification' then 'New' else status end,
         updated_at = now(),
         customer_last_seen_at = now(),
         customer_active_until = now() + interval '75 seconds'
   where id = v_ticket.id;

  insert into public.support_ticket_guest_sessions(ticket_id,session_token_hash,user_agent_hash,ip_hash,expires_at)
  values(v_ticket.id,p_session_token_hash,p_user_agent_hash,p_ip_hash,now()+interval '14 days');

  insert into public.support_ticket_events(ticket_id,event_type,actor_type,actor_id)
  values(v_ticket.id,'guest_email_verified','Guest',v_ticket.requester_email::text);

  return jsonb_build_object('ticketId',v_ticket.id,'ticketReference',v_ticket.ticket_reference,'verified',true);
end $$;
grant execute on function public.support_verify_guest_code_v2(text,text,text,text,text) to service_role;

-- Notification jobs make staff replies behave like a messaging service rather than
-- sending an email for every message. Jobs are cancelled when the customer replies.
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

-- Track when the user replies so any pending email for a staff reply can be cancelled.
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

-- Called only after the About server has authorised the ticket request.
create or replace function public.support_touch_ticket_view_v1(p_ticket_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.support_tickets
     set customer_last_seen_at = now(),
         customer_active_until = now() + interval '75 seconds',
         user_last_read_at = now(),
         unread_by_user = 0
   where id = p_ticket_id;
  if not found then raise exception 'ticket not found'; end if;
  return jsonb_build_object('ok', true, 'ticketId', p_ticket_id, 'activeUntil', now() + interval '75 seconds');
end $$;
grant execute on function public.support_touch_ticket_view_v1(uuid) to service_role;

-- Extend the ownership guard so a deliberate management escalation can release a
-- claimed ticket into an upper-management queue without looking like an unclaim.
create or replace function public.support_enforce_ticket_ownership()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.assigned_staff_id is not null and new.assigned_staff_id is null then
    if coalesce(current_setting('app.support_allow_unclaim', true), '') = 'on'
       or coalesce(current_setting('app.support_allow_management_escalation', true), '') = 'on' then
      return new;
    end if;
    raise exception 'claimed support tickets cannot be released outside the controlled workflow';
  end if;

  if old.assigned_staff_id is not null
     and new.assigned_staff_id is distinct from old.assigned_staff_id
     and not (
       new.status = 'Escalated'
       and new.escalated_at is not null
       and new.escalated_at is distinct from old.escalated_at
       and new.escalated_to_staff_id = new.assigned_staff_id
       and nullif(trim(coalesce(new.escalation_reason,'')),'') is not null
     ) then
    raise exception 'ticket ownership can only be transferred through a recorded escalation';
  end if;
  return new;
end $$;

create or replace function public.support_escalate_ticket_to_management_v1(
  p_ticket_id uuid,
  p_acting_staff_id text,
  p_acting_staff_name text,
  p_acting_authority_level integer,
  p_reason text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ticket public.support_tickets%rowtype;
  v_previous_status text;
begin
  if nullif(trim(p_reason),'') is null or char_length(trim(p_reason)) < 10 then
    raise exception 'a detailed escalation reason is required';
  end if;

  select * into v_ticket from public.support_tickets where id = p_ticket_id for update;
  if not found then raise exception 'ticket not found'; end if;
  if v_ticket.assigned_staff_id is distinct from p_acting_staff_id then
    raise exception 'only the current ticket owner can escalate this ticket';
  end if;
  if v_ticket.status in ('Resolved','Closed','Spam') then
    raise exception 'completed tickets cannot be escalated';
  end if;

  v_previous_status := v_ticket.status;

  update public.support_ticket_assignments
     set ended_at = coalesce(ended_at, now())
   where ticket_id = p_ticket_id
     and ended_at is null;

  perform set_config('app.support_allow_management_escalation', 'on', true);

  update public.support_tickets
     set assigned_staff_id = null,
         assigned_staff_name = null,
         assigned_staff_authority_level = null,
         assigned_at = null,
         claimed_at = null,
         status = 'Escalated',
         escalated_from_staff_id = p_acting_staff_id,
         escalated_from_staff_name = trim(p_acting_staff_name),
         escalated_to_staff_id = null,
         escalated_to_staff_name = null,
         escalated_to_team = 'Upper Management',
         escalation_target_type = 'Management Queue',
         escalated_at = now(),
         escalation_reason = trim(p_reason),
         team = 'Upper Management',
         ownership_version = ownership_version + 1,
         updated_at = now()
   where id = p_ticket_id;

  insert into public.support_ticket_assignments(
    ticket_id, assigned_staff_id, assigned_staff_name, assigned_staff_authority_level,
    assigned_team, assigned_by_staff_id, reason, assignment_type
  ) values (
    p_ticket_id, null, null, null,
    'Upper Management', p_acting_staff_id, trim(p_reason), 'Management Escalation'
  );

  insert into public.support_ticket_status_history(ticket_id, previous_status, new_status, acting_staff_id, reason)
  values(p_ticket_id, v_previous_status, 'Escalated', p_acting_staff_id, trim(p_reason));

  insert into public.support_ticket_events(ticket_id,event_type,actor_type,actor_id,metadata)
  values(p_ticket_id,'ticket_escalated_to_management','Staff',p_acting_staff_id,
    jsonb_build_object(
      'actingStaffName', trim(p_acting_staff_name),
      'actingAuthorityLevel', p_acting_authority_level,
      'targetTeam', 'Upper Management',
      'reason', trim(p_reason)
    ));

  return jsonb_build_object(
    'ok', true,
    'ticketId', p_ticket_id,
    'status', 'Escalated',
    'targetType', 'Management Queue',
    'targetTeam', 'Upper Management'
  );
end $$;
grant execute on function public.support_escalate_ticket_to_management_v1(uuid,text,text,integer,text) to service_role;

notify pgrst, 'reload schema';

commit;

select
  to_regclass('public.support_ticket_access_tokens') is not null as direct_ticket_links_ready,
  to_regclass('public.support_reply_notification_jobs') is not null as reply_notification_jobs_ready,
  to_regprocedure('public.support_touch_ticket_view_v1(uuid)') is not null as customer_presence_ready,
  to_regprocedure('public.support_verify_guest_code_v2(text,text,text,text,text)') is not null as direct_link_verification_ready,
  to_regprocedure('public.support_escalate_ticket_to_management_v1(uuid,text,text,integer,text)') is not null as management_escalation_ready;
