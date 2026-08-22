-- ESB Games — Enterprise Support Operations, ownership controls and Resend delivery audit
-- Run after migrations 001–007. Additive and safe for the shared Production Supabase project.

create extension if not exists pgcrypto;

alter table public.backend_staff_accounts
  add column if not exists support_access_enabled boolean not null default false,
  add column if not exists support_authority_level integer,
  add column if not exists support_team text;

update public.backend_staff_accounts
set support_access_enabled = true
where archived_at is null
  and (
    lower(coalesce(department_id,'')) similar to '%(trust|safety|support|creator|executive|operations)%'
    or lower(coalesce(position_title,'')) similar to '%(chief|director|head|manager|support|trust|safety)%'
  );

alter table public.backend_staff_accounts
  drop constraint if exists backend_staff_support_authority_check;
alter table public.backend_staff_accounts
  add constraint backend_staff_support_authority_check
  check (support_authority_level is null or support_authority_level between 1 and 100);

alter table public.support_tickets
  add column if not exists assigned_staff_name text,
  add column if not exists assigned_staff_authority_level integer,
  add column if not exists claimed_at timestamptz,
  add column if not exists escalated_from_staff_id text,
  add column if not exists escalated_from_staff_name text,
  add column if not exists escalated_to_staff_id text,
  add column if not exists escalated_to_staff_name text,
  add column if not exists escalated_at timestamptz,
  add column if not exists escalation_reason text,
  add column if not exists ownership_version bigint not null default 0,
  add column if not exists sla_due_at timestamptz;

alter table public.support_ticket_assignments
  add column if not exists assigned_staff_name text,
  add column if not exists assigned_staff_authority_level integer,
  add column if not exists assignment_type text not null default 'Claim';

create table if not exists public.support_email_delivery_events (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.support_tickets(id) on delete cascade,
  verification_code_id uuid references public.support_ticket_verification_codes(id) on delete set null,
  message_id uuid references public.support_ticket_messages(id) on delete set null,
  provider text not null default 'Resend',
  purpose text not null,
  recipient_email citext not null,
  sender_email text,
  provider_message_id text,
  delivery_state text not null,
  error_code text,
  error_message text,
  request_reference text not null default encode(gen_random_bytes(8),'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (delivery_state in ('Queued','Sent','Failed','Delivered','Bounced','Complained'))
);
create index if not exists support_email_delivery_ticket_idx on public.support_email_delivery_events(ticket_id, created_at desc);
create index if not exists support_email_delivery_reference_idx on public.support_email_delivery_events(request_reference);

create or replace function public.support_default_sla(priority_value text)
returns interval
language sql
immutable
as $$
  select case priority_value
    when 'Urgent' then interval '1 hour'
    when 'High' then interval '4 hours'
    when 'Low' then interval '72 hours'
    else interval '24 hours'
  end;
$$;

create or replace function public.support_apply_sla()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.sla_due_at is null or tg_op = 'INSERT' or new.priority is distinct from old.priority then
    new.sla_due_at := coalesce(new.created_at, now()) + public.support_default_sla(new.priority);
  end if;
  return new;
end $$;

drop trigger if exists support_apply_sla_trigger on public.support_tickets;
create trigger support_apply_sla_trigger
before insert or update of priority on public.support_tickets
for each row execute function public.support_apply_sla();

update public.support_tickets
set sla_due_at = created_at + public.support_default_sla(priority)
where sla_due_at is null;

create or replace function public.support_enforce_ticket_ownership()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.assigned_staff_id is not null and new.assigned_staff_id is null then
    raise exception 'claimed support tickets cannot be unclaimed';
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

drop trigger if exists support_enforce_ticket_ownership_trigger on public.support_tickets;
create trigger support_enforce_ticket_ownership_trigger
before update of assigned_staff_id on public.support_tickets
for each row execute function public.support_enforce_ticket_ownership();

create or replace function public.support_claim_ticket_v1(
  p_ticket_id uuid,
  p_staff_id text,
  p_staff_name text,
  p_authority_level integer,
  p_staff_department text default null
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ticket public.support_tickets%rowtype;
begin
  if nullif(trim(p_staff_id),'') is null or nullif(trim(p_staff_name),'') is null then
    raise exception 'valid staff identity required';
  end if;
  select * into v_ticket from public.support_tickets where id = p_ticket_id for update;
  if not found then raise exception 'ticket not found'; end if;
  if v_ticket.status in ('Pending Email Verification','Resolved','Closed','Spam') then
    raise exception 'ticket cannot be claimed in its current state';
  end if;
  if v_ticket.assigned_staff_id is not null and v_ticket.assigned_staff_id <> p_staff_id then
    raise exception 'ticket already claimed by another staff member';
  end if;
  if v_ticket.assigned_staff_id = p_staff_id then
    return jsonb_build_object('ok',true,'alreadyOwned',true,'ticketId',v_ticket.id,'ownerId',p_staff_id,'ownerName',coalesce(v_ticket.assigned_staff_name,p_staff_name));
  end if;

  update public.support_tickets
  set assigned_staff_id = p_staff_id,
      assigned_staff_name = trim(p_staff_name),
      assigned_staff_authority_level = greatest(1,least(100,coalesce(p_authority_level,10))),
      assigned_at = now(),
      claimed_at = now(),
      status = case when status = 'New' then 'Assigned' else status end,
      team = coalesce(nullif(trim(p_staff_department),''), team),
      ownership_version = ownership_version + 1,
      updated_at = now()
  where id = p_ticket_id;

  insert into public.support_ticket_assignments(
    ticket_id, assigned_staff_id, assigned_staff_name, assigned_staff_authority_level,
    assigned_team, assigned_by_staff_id, reason, assignment_type
  ) values (
    p_ticket_id, p_staff_id, trim(p_staff_name), greatest(1,least(100,coalesce(p_authority_level,10))),
    nullif(trim(p_staff_department),''), p_staff_id, 'Ticket claimed by staff member', 'Claim'
  );

  insert into public.support_ticket_events(ticket_id,event_type,actor_type,actor_id,metadata)
  values(p_ticket_id,'ticket_claimed','Staff',p_staff_id,jsonb_build_object('staffName',trim(p_staff_name),'authorityLevel',p_authority_level));

  return jsonb_build_object('ok',true,'ticketId',p_ticket_id,'ownerId',p_staff_id,'ownerName',trim(p_staff_name),'status','Assigned');
end $$;

create or replace function public.support_escalate_ticket_v1(
  p_ticket_id uuid,
  p_acting_staff_id text,
  p_acting_staff_name text,
  p_acting_authority_level integer,
  p_target_staff_id text,
  p_target_staff_name text,
  p_target_authority_level integer,
  p_reason text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ticket public.support_tickets%rowtype;
begin
  if char_length(trim(coalesce(p_reason,''))) < 10 then raise exception 'a detailed escalation reason is required'; end if;
  if nullif(trim(p_target_staff_id),'') is null or p_target_staff_id = p_acting_staff_id then raise exception 'a different superior must be selected'; end if;
  if coalesce(p_target_authority_level,0) <= coalesce(p_acting_authority_level,0) and coalesce(p_acting_authority_level,0) < 90 then
    raise exception 'the escalation target must have a higher authority level';
  end if;

  select * into v_ticket from public.support_tickets where id = p_ticket_id for update;
  if not found then raise exception 'ticket not found'; end if;
  if v_ticket.assigned_staff_id is distinct from p_acting_staff_id and coalesce(p_acting_authority_level,0) < 90 then
    raise exception 'only the current ticket owner can escalate this ticket';
  end if;
  if v_ticket.status in ('Closed','Spam') then raise exception 'closed or spam tickets cannot be escalated'; end if;

  update public.support_ticket_assignments
  set ended_at = now()
  where ticket_id = p_ticket_id and ended_at is null;

  update public.support_tickets
  set escalated_from_staff_id = coalesce(v_ticket.assigned_staff_id,p_acting_staff_id),
      escalated_from_staff_name = coalesce(v_ticket.assigned_staff_name,p_acting_staff_name),
      escalated_to_staff_id = p_target_staff_id,
      escalated_to_staff_name = trim(p_target_staff_name),
      escalated_at = now(),
      escalation_reason = trim(p_reason),
      assigned_staff_id = p_target_staff_id,
      assigned_staff_name = trim(p_target_staff_name),
      assigned_staff_authority_level = greatest(1,least(100,coalesce(p_target_authority_level,50))),
      assigned_at = now(),
      status = 'Escalated',
      priority = case when priority in ('Low','Normal') then 'High' else priority end,
      ownership_version = ownership_version + 1,
      updated_at = now()
  where id = p_ticket_id;

  insert into public.support_ticket_assignments(
    ticket_id, assigned_staff_id, assigned_staff_name, assigned_staff_authority_level,
    assigned_team, assigned_by_staff_id, reason, assignment_type
  ) values (
    p_ticket_id, p_target_staff_id, trim(p_target_staff_name), greatest(1,least(100,coalesce(p_target_authority_level,50))),
    v_ticket.team, p_acting_staff_id, trim(p_reason), 'Escalation'
  );

  insert into public.support_ticket_status_history(ticket_id,previous_status,new_status,acting_staff_id,reason)
  values(p_ticket_id,v_ticket.status,'Escalated',p_acting_staff_id,trim(p_reason));

  insert into public.support_ticket_events(ticket_id,event_type,actor_type,actor_id,metadata)
  values(p_ticket_id,'ticket_escalated','Staff',p_acting_staff_id,jsonb_build_object(
    'fromStaffId',coalesce(v_ticket.assigned_staff_id,p_acting_staff_id),
    'fromStaffName',coalesce(v_ticket.assigned_staff_name,p_acting_staff_name),
    'toStaffId',p_target_staff_id,
    'toStaffName',trim(p_target_staff_name),
    'reason',trim(p_reason)
  ));

  return jsonb_build_object('ok',true,'ticketId',p_ticket_id,'ownerId',p_target_staff_id,'ownerName',trim(p_target_staff_name),'status','Escalated');
end $$;

create or replace function public.support_staff_update_ticket_v1(
  p_ticket_id uuid,
  p_staff_id text,
  p_status text default null,
  p_priority text default null,
  p_reason text default ''
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ticket public.support_tickets%rowtype;
  v_new_status text;
  v_new_priority text;
begin
  select * into v_ticket from public.support_tickets where id=p_ticket_id for update;
  if not found then raise exception 'ticket not found'; end if;
  if v_ticket.assigned_staff_id is distinct from p_staff_id then raise exception 'only the claimed ticket owner can change this ticket'; end if;
  v_new_status := coalesce(nullif(p_status,''),v_ticket.status);
  v_new_priority := coalesce(nullif(p_priority,''),v_ticket.priority);
  if v_new_status not in ('Assigned','In Progress','Awaiting User','Awaiting Internal Review','Escalated','Resolved','Closed','Spam') then raise exception 'invalid support status'; end if;
  if v_new_priority not in ('Low','Normal','High','Urgent') then raise exception 'invalid priority'; end if;

  update public.support_tickets
  set status=v_new_status, priority=v_new_priority, updated_at=now(),
      resolved_at=case when v_new_status='Resolved' then coalesce(resolved_at,now()) else resolved_at end,
      closed_at=case when v_new_status='Closed' then coalesce(closed_at,now()) else closed_at end
  where id=p_ticket_id;

  if v_new_status is distinct from v_ticket.status then
    insert into public.support_ticket_status_history(ticket_id,previous_status,new_status,acting_staff_id,reason)
    values(p_ticket_id,v_ticket.status,v_new_status,p_staff_id,coalesce(nullif(trim(p_reason),''),'Status updated by ticket owner'));
  end if;
  insert into public.support_ticket_events(ticket_id,event_type,actor_type,actor_id,metadata)
  values(p_ticket_id,'ticket_owner_updated','Staff',p_staff_id,jsonb_build_object('status',v_new_status,'priority',v_new_priority,'reason',p_reason));

  return jsonb_build_object('ok',true,'ticketId',p_ticket_id,'status',v_new_status,'priority',v_new_priority);
end $$;

create or replace function public.support_staff_add_message_v1(
  p_ticket_id uuid,
  p_staff_id text,
  p_staff_name text,
  p_mode text,
  p_body text,
  p_client_message_id text default null
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ticket public.support_tickets%rowtype;
  v_id uuid;
begin
  select * into v_ticket from public.support_tickets where id=p_ticket_id for update;
  if not found then raise exception 'ticket not found'; end if;
  if v_ticket.assigned_staff_id is distinct from p_staff_id then raise exception 'claim this ticket before adding messages'; end if;
  if v_ticket.status in ('Closed','Spam') then raise exception 'this ticket cannot receive new staff messages'; end if;
  if nullif(trim(coalesce(p_body,'')),'') is null then raise exception 'message body required'; end if;
  if char_length(p_body) > 20000 then raise exception 'message too long'; end if;

  if p_mode='Internal Note' then
    insert into public.support_ticket_internal_notes(ticket_id,author_staff_id,author_name,body)
    values(p_ticket_id,p_staff_id,trim(p_staff_name),trim(p_body)) returning id into v_id;
    insert into public.support_ticket_events(ticket_id,event_type,actor_type,actor_id,metadata)
    values(p_ticket_id,'internal_note_added','Staff',p_staff_id,jsonb_build_object('noteId',v_id));
    return jsonb_build_object('type','note','id',v_id);
  end if;

  insert into public.support_ticket_messages(ticket_id,sender_type,sender_staff_id,sender_name,body,client_message_id)
  values(p_ticket_id,'Staff',p_staff_id,trim(p_staff_name),trim(p_body),coalesce(nullif(p_client_message_id,''),gen_random_uuid()::text))
  returning id into v_id;
  return jsonb_build_object('type','message','id',v_id);
end $$;

create or replace view public.backend_support_staff_directory as
select
  a.id::text as "staffId",
  a.staff_name as "staffName",
  a.work_email as "workEmail",
  coalesce(a.position_title,'ESB Games Staff') as title,
  coalesce(a.department_id,'Operations') as department,
  coalesce(a.support_team,a.department_id,'Support Operations') as "supportTeam",
  coalesce(a.support_authority_level,
    case
      when lower(coalesce(a.position_title,'')) similar to '%(chief|managing director|founder|president|vice president)%' then 100
      when lower(coalesce(a.position_title,'')) similar to '%(director|head of)%' then 80
      when lower(coalesce(a.position_title,'')) similar to '%(senior manager|operations manager|trust%manager|safety%manager)%' then 65
      when lower(coalesce(a.position_title,'')) similar to '%(manager|team lead|lead )%' then 50
      when lower(coalesce(a.position_title,'')) similar to '%(senior|specialist)%' then 30
      else 10
    end
  )::integer as "authorityLevel",
  a.support_access_enabled as "supportAccess",
  a.account_state as "accountState"
from public.backend_staff_accounts a
where a.archived_at is null
  and a.support_access_enabled = true
  and lower(coalesce(a.account_state,'')) not similar to '%(suspend|disabled|terminated|archived|locked|revoked)%';

create or replace view public.backend_support_ticket_directory as
select
  t.id,
  t.ticket_reference as "ticketReference",
  t.requester_name as "requesterName",
  t.requester_email::text as "requesterEmail",
  t.requester_account_id as "requesterAccountId",
  c.name as category,
  t.category_id as "categoryId",
  t.team,
  t.subject,
  t.status,
  t.priority,
  t.assigned_staff_id as "assignedStaffId",
  t.assigned_staff_name as "assignedStaffName",
  t.assigned_staff_authority_level as "assignedStaffAuthorityLevel",
  t.claimed_at as "claimedAt",
  t.escalated_from_staff_id as "escalatedFromStaffId",
  t.escalated_from_staff_name as "escalatedFromStaffName",
  t.escalated_to_staff_id as "escalatedToStaffId",
  t.escalated_to_staff_name as "escalatedToStaffName",
  t.escalated_at as "escalatedAt",
  t.escalation_reason as "escalationReason",
  t.ownership_version as "ownershipVersion",
  t.sla_due_at as "slaDueAt",
  case
    when t.status in ('Resolved','Closed','Spam') then 'Stopped'
    when t.sla_due_at < now() then 'Breached'
    when t.sla_due_at < now() + interval '2 hours' then 'At Risk'
    else 'On Track'
  end as "slaState",
  t.unread_by_staff as "unreadByStaff",
  t.unread_by_user as "unreadByUser",
  t.last_message_at as "lastMessageAt",
  t.created_at as "createdAt",
  t.updated_at as "updatedAt",
  t.resolved_at as "resolvedAt",
  t.closed_at as "closedAt",
  extract(epoch from (now()-t.created_at))::bigint as "ageSeconds",
  (select count(*) from public.support_ticket_messages m where m.ticket_id=t.id and m.deleted_at is null) as "messageCount",
  (select count(*) from public.support_ticket_attachments a where a.ticket_id=t.id and a.archived_at is null) as "attachmentCount"
from public.support_tickets t
join public.support_categories c on c.category_id=t.category_id;

create or replace view public.backend_support_queue_metrics as
select
  count(*)::bigint as "totalTickets",
  count(*) filter (where status not in ('Resolved','Closed','Spam'))::bigint as "openTickets",
  count(*) filter (where status='New')::bigint as "newTickets",
  count(*) filter (where assigned_staff_id is not null and status not in ('Resolved','Closed','Spam'))::bigint as "claimedTickets",
  count(*) filter (where assigned_staff_id is null and status not in ('Pending Email Verification','Resolved','Closed','Spam'))::bigint as "unclaimedTickets",
  count(*) filter (where status='Escalated')::bigint as "escalatedTickets",
  count(*) filter (where unread_by_staff > 0)::bigint as "unreadTickets",
  count(*) filter (where status='Awaiting User')::bigint as "awaitingUserTickets",
  count(*) filter (where status='Pending Email Verification')::bigint as "pendingVerificationTickets",
  count(*) filter (where status='Resolved' and resolved_at >= date_trunc('day',now()))::bigint as "resolvedToday",
  count(*) filter (where status not in ('Resolved','Closed','Spam') and sla_due_at < now())::bigint as "slaBreached",
  jsonb_build_object(
    'Pending Email Verification',count(*) filter (where status='Pending Email Verification'),
    'New',count(*) filter (where status='New'),
    'Assigned',count(*) filter (where status='Assigned'),
    'In Progress',count(*) filter (where status='In Progress'),
    'Awaiting User',count(*) filter (where status='Awaiting User'),
    'Awaiting Internal Review',count(*) filter (where status='Awaiting Internal Review'),
    'Escalated',count(*) filter (where status='Escalated'),
    'Resolved',count(*) filter (where status='Resolved'),
    'Closed',count(*) filter (where status='Closed'),
    'Spam',count(*) filter (where status='Spam')
  ) as "statusCounts"
from public.support_tickets;

alter table public.support_email_delivery_events enable row level security;

revoke all on public.support_email_delivery_events from anon, authenticated;
grant select, insert, update on public.support_email_delivery_events to service_role;
grant select on public.backend_support_staff_directory to service_role;
grant select on public.backend_support_queue_metrics to service_role;
grant select on public.backend_support_ticket_directory to service_role;
grant execute on function public.support_claim_ticket_v1(uuid,text,text,integer,text) to service_role;
grant execute on function public.support_escalate_ticket_v1(uuid,text,text,integer,text,text,integer,text) to service_role;
grant execute on function public.support_staff_update_ticket_v1(uuid,text,text,text,text) to service_role;
grant execute on function public.support_staff_add_message_v1(uuid,text,text,text,text,text) to service_role;
grant usage, select on sequence public.support_ticket_reference_seq to service_role;

notify pgrst, 'reload schema';

select
  to_regclass('public.backend_support_queue_metrics') is not null as queue_metrics_ready,
  to_regclass('public.backend_support_staff_directory') is not null as staff_directory_ready,
  to_regclass('public.support_email_delivery_events') is not null as email_delivery_audit_ready,
  to_regprocedure('public.support_claim_ticket_v1(uuid,text,text,integer,text)') is not null as claim_rpc_ready,
  to_regprocedure('public.support_escalate_ticket_v1(uuid,text,text,integer,text,text,integer,text)') is not null as escalation_rpc_ready,
  to_regprocedure('public.support_staff_add_message_v1(uuid,text,text,text,text,text)') is not null as message_guard_ready;
