-- ESB Games Support 025 — workspace, privacy, evidence and presence hardening
-- Additive migration. Does not reset or replace existing support tables/data.
begin;

alter table public.support_tickets
  add column if not exists retention_classification text not null default 'Routine Support',
  add column if not exists legal_hold boolean not null default false,
  add column if not exists retention_review_at timestamptz,
  add column if not exists customer_active_until timestamptz,
  add column if not exists customer_last_seen_at timestamptz,
  add column if not exists customer_last_reply_at timestamptz,
  add column if not exists last_staff_reply_at timestamptz;

alter table public.support_tickets drop constraint if exists support_ticket_retention_classification_check;
alter table public.support_tickets add constraint support_ticket_retention_classification_check
  check (retention_classification in ('Routine Support','Account/Security Investigation','Payment Dispute','Trust & Safety','Legal Hold'));

alter table public.support_ticket_attachments
  add column if not exists customer_visible boolean not null default true,
  add column if not exists detected_mime_type text,
  add column if not exists validation_state text not null default 'Pending',
  add column if not exists rejected_reason text,
  add column if not exists available_at timestamptz,
  add column if not exists sensitive_reveal_required boolean not null default false;

-- IMPORTANT: normalise existing rows BEFORE enforcing the new validation-state
-- constraint. Support 024 stored attachment safety in scan_state and did not have
-- validation_state, so newly-added rows initially inherit the temporary 'Pending'
-- default. 'Pending' is intentionally not part of the Support 025 state machine.
alter table public.support_ticket_attachments
  drop constraint if exists support_attachment_validation_state_check;

update public.support_ticket_attachments
set validation_state = case
      when lower(coalesce(scan_state,'')) in ('quarantined','failed','rejected') then 'Rejected'
      when lower(coalesce(scan_state,'')) in ('available','clean') then 'Available'
      when lower(coalesce(scan_state,'')) = 'scanning' then 'Scanning'
      when lower(coalesce(validation_state,'')) = 'uploading' then 'Uploading'
      when lower(coalesce(validation_state,'')) = 'scanning' then 'Scanning'
      when lower(coalesce(validation_state,'')) = 'available' then 'Available'
      when lower(coalesce(validation_state,'')) = 'rejected' then 'Rejected'
      when lower(coalesce(validation_state,'')) = 'processing' then 'Processing'
      else 'Processing'
    end
where validation_state is null
   or validation_state not in ('Uploading','Processing','Scanning','Available','Rejected');

-- Apply the evidence-visibility metadata independently so rerunning this migration
-- also repairs rows where the validation state was already valid.
update public.support_ticket_attachments
set customer_visible = case
      when message_id is null and lower(coalesce(uploader_type,'')) = 'staff' then false
      else coalesce(customer_visible,true)
    end,
    sensitive_reveal_required = case
      when coalesce(safety_sensitive,false) then true
      else coalesce(sensitive_reveal_required,false)
    end,
    detected_mime_type = coalesce(nullif(detected_mime_type,''),mime_type);

-- Keep older application nodes compatible during a rolling deployment. Any code
-- path that does not yet supply validation_state will now safely enter Processing
-- instead of inserting the no-longer-valid legacy value Pending.
alter table public.support_ticket_attachments
  alter column validation_state set default 'Processing';

alter table public.support_ticket_attachments
  add constraint support_attachment_validation_state_check
  check (validation_state in ('Uploading','Processing','Scanning','Available','Rejected'));

create table if not exists public.support_ticket_typing (
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  actor_type text not null,
  actor_key text not null,
  display_name text not null,
  is_typing boolean not null default false,
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '12 seconds'),
  primary key(ticket_id, actor_type, actor_key),
  check (actor_type in ('Customer','Staff'))
);
create index if not exists support_ticket_typing_expiry_idx on public.support_ticket_typing(ticket_id, expires_at desc);
alter table public.support_ticket_typing enable row level security;
revoke all on public.support_ticket_typing from anon, authenticated;
grant select, insert, update, delete on public.support_ticket_typing to service_role;

create or replace function public.support_set_typing_v1(
  p_ticket_id uuid,
  p_actor_type text,
  p_actor_key text,
  p_display_name text,
  p_is_typing boolean
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_actor_type not in ('Customer','Staff') then raise exception 'invalid typing actor'; end if;
  if nullif(trim(p_actor_key),'') is null then raise exception 'typing actor required'; end if;
  insert into public.support_ticket_typing(ticket_id,actor_type,actor_key,display_name,is_typing,updated_at,expires_at)
  values(p_ticket_id,p_actor_type,trim(p_actor_key),left(trim(coalesce(p_display_name,'')),160),p_is_typing,now(),now()+interval '12 seconds')
  on conflict(ticket_id,actor_type,actor_key) do update
    set display_name=excluded.display_name,is_typing=excluded.is_typing,updated_at=now(),expires_at=now()+interval '12 seconds';

  if p_actor_type='Customer' then
    update public.support_tickets
       set customer_last_seen_at=now(),
           customer_active_until=now()+interval '90 seconds',
           user_last_read_at=now(),
           unread_by_user=0,
           updated_at=updated_at
     where id=p_ticket_id;
  end if;
  return jsonb_build_object('ok',true);
end $$;
revoke all on function public.support_set_typing_v1(uuid,text,text,text,boolean) from public, anon, authenticated;
grant execute on function public.support_set_typing_v1(uuid,text,text,text,boolean) to service_role;

create or replace function public.support_touch_ticket_view_v1(p_ticket_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.support_tickets
     set customer_last_seen_at=now(),
         customer_active_until=now()+interval '90 seconds',
         user_last_read_at=now(),
         unread_by_user=0
   where id=p_ticket_id;
  if not found then raise exception 'ticket not found'; end if;
  return jsonb_build_object('ok',true,'ticketId',p_ticket_id,'activeUntil',now()+interval '90 seconds');
end $$;
revoke all on function public.support_touch_ticket_view_v1(uuid) from public, anon, authenticated;
grant execute on function public.support_touch_ticket_view_v1(uuid) to service_role;

-- Keep support tables in the Supabase realtime publication where the project
-- supports postgres_changes. RLS/server APIs remain the security boundary.
do $$
begin
  if exists(select 1 from pg_publication where pubname='supabase_realtime') then
    begin alter publication supabase_realtime add table public.support_tickets; exception when duplicate_object then null; end;
    begin alter publication supabase_realtime add table public.support_ticket_messages; exception when duplicate_object then null; end;
    begin alter publication supabase_realtime add table public.support_ticket_attachments; exception when duplicate_object then null; end;
    begin alter publication supabase_realtime add table public.support_ticket_typing; exception when duplicate_object then null; end;
  end if;
end $$;

-- Force customer and staff access through the server-side support APIs. This
-- prevents a browser Supabase session from bypassing ticket-level RBAC or reading
-- internal notes through an overly broad direct SELECT policy. The trusted server
-- uses service_role after separately validating the customer session/staff RBAC.
do $$
declare t text;
begin
  foreach t in array array[
    'support_tickets','support_ticket_messages','support_ticket_internal_notes',
    'support_ticket_attachments','support_ticket_assignments','support_ticket_status_history',
    'support_ticket_guest_sessions','support_ticket_verification_codes','support_ticket_events',
    'support_ticket_transcript_tokens','support_ticket_access_tokens','support_reply_notification_jobs'
  ] loop
    if to_regclass('public.'||t) is not null then
      execute format('alter table public.%I enable row level security',t);
      execute format('revoke all on table public.%I from anon, authenticated',t);
    end if;
  end loop;
end $$;

-- Remove the old browser-authenticated evidence policies. Evidence is served only
-- after a server-side ticket permission check and through a short-lived signed URL.
drop policy if exists backend_support_evidence_read on storage.objects;
drop policy if exists backend_support_evidence_insert on storage.objects;

create index if not exists support_ticket_attachments_customer_visible_idx
  on public.support_ticket_attachments(ticket_id,message_id,customer_visible,created_at);
create index if not exists support_tickets_retention_review_idx
  on public.support_tickets(retention_classification,legal_hold,retention_review_at)
  where retention_review_at is not null;

-- Private support evidence bucket: explicitly keep it non-public.
update storage.buckets set public=false where id='support-ticket-evidence';

notify pgrst, 'reload schema';
commit;
