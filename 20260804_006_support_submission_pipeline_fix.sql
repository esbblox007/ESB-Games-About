-- ESB Games — Support submission pipeline compatibility fix
-- Additive migration. Run after 20260804_005_support_data_api_permissions_fix.sql.
--
-- This migration introduces versioned Support RPCs that rely on PostgreSQL
-- EXECUTE privileges rather than runtime auth.role() checks. Supabase secret
-- keys are authorised as the service_role database role by the Data API, and
-- the functions below are executable only by service_role.

begin;

create extension if not exists pgcrypto;
create extension if not exists citext;

grant usage on schema public to service_role;

-- Deep readiness check used by the About website. A successful call proves
-- that PostgREST can resolve and execute Support RPCs and that the essential
-- database objects and private evidence bucket are present.
create or replace function public.support_submission_preflight_v2()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, storage
as $$
declare
  v_category_count integer;
  v_bucket_exists boolean;
begin
  select count(*)::integer
    into v_category_count
    from public.support_categories
   where active;

  select exists(
    select 1
      from storage.buckets
     where id = 'support-ticket-evidence'
       and public = false
  ) into v_bucket_exists;

  return jsonb_build_object(
    'ready',
      v_category_count > 0
      and to_regclass('public.support_tickets') is not null
      and to_regclass('public.support_ticket_messages') is not null
      and to_regclass('public.support_rate_limits') is not null
      and to_regclass('public.support_notification_outbox') is not null
      and v_bucket_exists,
    'categoryCount', v_category_count,
    'evidenceBucketReady', v_bucket_exists
  );
end;
$$;

revoke all on function public.support_submission_preflight_v2() from public, anon, authenticated;
grant execute on function public.support_submission_preflight_v2() to service_role;

-- Versioned rate limiter. Access is restricted by EXECUTE grants rather than a
-- deprecated auth.role() assertion inside the function.
create or replace function public.support_take_rate_limit_v2(
  p_scope text,
  p_key_hash text,
  p_window_seconds integer,
  p_max_requests integer,
  p_block_seconds integer default 900
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_window_seconds integer := greatest(coalesce(p_window_seconds, 60), 60);
  v_max_requests integer := greatest(coalesce(p_max_requests, 1), 1);
  v_block_seconds integer := greatest(coalesce(p_block_seconds, 60), 60);
  v_window_started_at timestamptz;
  v_count integer;
  v_blocked_until timestamptz;
begin
  if nullif(trim(p_scope), '') is null or nullif(trim(p_key_hash), '') is null then
    raise exception 'rate-limit scope and key are required';
  end if;

  v_window_started_at := to_timestamp(
    floor(extract(epoch from v_now) / v_window_seconds) * v_window_seconds
  );

  insert into public.support_rate_limits(
    scope,
    key_hash,
    window_started_at,
    request_count,
    updated_at
  ) values (
    trim(p_scope),
    trim(p_key_hash),
    v_window_started_at,
    1,
    v_now
  )
  on conflict(scope, key_hash, window_started_at) do update
    set request_count = public.support_rate_limits.request_count + 1,
        updated_at = excluded.updated_at
  returning request_count, blocked_until
       into v_count, v_blocked_until;

  if v_blocked_until is not null and v_blocked_until > v_now then
    return jsonb_build_object(
      'allowed', false,
      'retryAfterSeconds', greatest(1, ceil(extract(epoch from (v_blocked_until - v_now)))::integer),
      'requestCount', v_count
    );
  end if;

  if v_count > v_max_requests then
    v_blocked_until := v_now + make_interval(secs => v_block_seconds);
    update public.support_rate_limits
       set blocked_until = v_blocked_until,
           updated_at = v_now
     where scope = trim(p_scope)
       and key_hash = trim(p_key_hash)
       and window_started_at = v_window_started_at;

    return jsonb_build_object(
      'allowed', false,
      'retryAfterSeconds', v_block_seconds,
      'requestCount', v_count
    );
  end if;

  return jsonb_build_object(
    'allowed', true,
    'retryAfterSeconds', 0,
    'requestCount', v_count
  );
end;
$$;

revoke all on function public.support_take_rate_limit_v2(text,text,integer,integer,integer) from public, anon, authenticated;
grant execute on function public.support_take_rate_limit_v2(text,text,integer,integer,integer) to service_role;

-- Versioned atomic ticket creator. The raw private access token is returned
-- once to the trusted About server; only its SHA-256 hash is stored.
create or replace function public.support_create_ticket_v2(
  p_requester_account_id uuid,
  p_requester_name text,
  p_requester_email text,
  p_category_id text,
  p_subject text,
  p_description text,
  p_requester_locale text default 'en-GB',
  p_requester_region text default null,
  p_source text default 'About Website'
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_category public.support_categories%rowtype;
  v_ticket public.support_tickets%rowtype;
  v_access_token text;
  v_sender_type text;
  v_requester_email citext;
begin
  if nullif(trim(p_requester_name), '') is null then
    raise exception 'name required';
  end if;

  if char_length(trim(p_requester_name)) > 120 then
    raise exception 'valid name required';
  end if;

  if nullif(trim(p_subject), '') is null or char_length(trim(p_subject)) > 160 then
    raise exception 'valid subject required';
  end if;

  if nullif(trim(p_description), '') is null or char_length(trim(p_description)) > 20000 then
    raise exception 'valid description required';
  end if;

  v_requester_email := nullif(lower(trim(coalesce(p_requester_email, ''))), '')::citext;

  if p_requester_account_id is null and (
    v_requester_email is null
    or v_requester_email::text !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  ) then
    raise exception 'valid email required';
  end if;

  select *
    into v_category
    from public.support_categories
   where category_id = p_category_id
     and active
   limit 1;

  if not found then
    raise exception 'invalid support category';
  end if;

  v_access_token := encode(gen_random_bytes(32), 'hex');
  v_sender_type := case when p_requester_account_id is null then 'Guest' else 'Account' end;

  insert into public.support_tickets(
    access_token_hash,
    requester_account_id,
    requester_name,
    requester_email,
    requester_email_verified,
    requester_locale,
    requester_region,
    category_id,
    team,
    subject,
    description,
    status,
    priority,
    source,
    verified_at
  ) values (
    encode(digest(v_access_token, 'sha256'), 'hex'),
    p_requester_account_id,
    trim(p_requester_name),
    v_requester_email,
    p_requester_account_id is not null,
    coalesce(nullif(trim(p_requester_locale), ''), 'en-GB'),
    nullif(trim(coalesce(p_requester_region, '')), ''),
    v_category.category_id,
    v_category.default_team,
    trim(p_subject),
    trim(p_description),
    case when p_requester_account_id is null then 'Pending Email Verification' else 'New' end,
    v_category.default_priority,
    coalesce(nullif(trim(p_source), ''), 'About Website'),
    case when p_requester_account_id is null then null else now() end
  ) returning * into v_ticket;

  insert into public.support_ticket_participants(
    ticket_id,
    participant_type,
    account_id,
    display_name,
    email
  ) values (
    v_ticket.id,
    v_sender_type,
    p_requester_account_id,
    trim(p_requester_name),
    v_requester_email
  );

  insert into public.support_ticket_messages(
    ticket_id,
    sender_type,
    sender_account_id,
    sender_name,
    body
  ) values (
    v_ticket.id,
    v_sender_type,
    p_requester_account_id,
    trim(p_requester_name),
    trim(p_description)
  );

  insert into public.support_ticket_status_history(
    ticket_id,
    previous_status,
    new_status,
    acting_account_id,
    reason
  ) values (
    v_ticket.id,
    null,
    v_ticket.status,
    p_requester_account_id,
    'Ticket created'
  );

  insert into public.support_ticket_events(
    ticket_id,
    event_type,
    actor_type,
    actor_id,
    metadata
  ) values (
    v_ticket.id,
    'ticket_created',
    v_sender_type,
    coalesce(p_requester_account_id::text, v_requester_email::text),
    jsonb_build_object(
      'source', coalesce(nullif(trim(p_source), ''), 'About Website'),
      'category', p_category_id
    )
  );

  return jsonb_build_object(
    'ticketId', v_ticket.id,
    'ticketReference', v_ticket.ticket_reference,
    'accessToken', v_access_token,
    'requesterEmail', v_ticket.requester_email,
    'requesterAccountId', v_ticket.requester_account_id,
    'status', v_ticket.status,
    'requiresEmailVerification', p_requester_account_id is null
  );
end;
$$;

revoke all on function public.support_create_ticket_v2(uuid,text,text,text,text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.support_create_ticket_v2(uuid,text,text,text,text,text,text,text,text) to service_role;

-- Reconfirm the supporting object permissions used after ticket creation.
grant select on table public.support_categories to service_role;
grant select, insert, update, delete on table
  public.support_tickets,
  public.support_ticket_participants,
  public.support_ticket_messages,
  public.support_ticket_internal_notes,
  public.support_ticket_attachments,
  public.support_ticket_assignments,
  public.support_ticket_status_history,
  public.support_ticket_verification_codes,
  public.support_ticket_guest_sessions,
  public.support_ticket_events,
  public.support_saved_replies,
  public.support_notification_outbox,
  public.support_rate_limits,
  public.public_site_notification_outbox,
  public.public_api_rate_limits
  to service_role;

grant usage, select, update on sequence public.support_ticket_reference_seq to service_role;

notify pgrst, 'reload schema';

commit;

-- Verification output. Every value should be true after the migration.
select
  to_regprocedure('public.support_submission_preflight_v2()') is not null as preflight_exists,
  to_regprocedure('public.support_take_rate_limit_v2(text,text,integer,integer,integer)') is not null as rate_limit_v2_exists,
  to_regprocedure('public.support_create_ticket_v2(uuid,text,text,text,text,text,text,text,text)') is not null as create_ticket_v2_exists,
  has_function_privilege('service_role', 'public.support_submission_preflight_v2()', 'EXECUTE') as preflight_execute,
  has_function_privilege('service_role', 'public.support_take_rate_limit_v2(text,text,integer,integer,integer)', 'EXECUTE') as rate_limit_v2_execute,
  has_function_privilege('service_role', 'public.support_create_ticket_v2(uuid,text,text,text,text,text,text,text,text)', 'EXECUTE') as create_ticket_v2_execute;
