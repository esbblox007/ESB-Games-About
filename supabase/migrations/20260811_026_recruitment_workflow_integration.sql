-- ESB Games — Recruitment workflow integration and live Careers hand-off
-- Apply after 20260804_003_careers_public_integration_hardening.sql.
-- Additive/replace-only migration: no recruitment data is dropped.

begin;

create extension if not exists pgcrypto;

-- Keep the existing job directory, but expose the already-existing public-safe
-- fields needed by the Backend editor so changing tabs never resets them.
create or replace view public.backend_job_posting_directory with (security_invoker = true) as
select jp.id, 'job'::text as kind, jp.job_posting_id as "jobId", jv.title,
  jv.short_description as "shortDescription", jv.department_name_snapshot as department,
  jv.category_name_snapshot as category, jv.location_label as location, jv.location_type as "locationType",
  jv.employment_type as "employmentType", jp.status, count(a.id)::integer as applications,
  coalesce(to_char(jp.publish_at at time zone 'Europe/London','DD Mon YYYY'),'—') as "publishDate",
  coalesce(to_char(jp.close_at at time zone 'Europe/London','DD Mon YYYY'),'—') as "closingDate",
  jp.hiring_manager_staff_id as "hiringManager", array_to_string(jp.assigned_recruiter_staff_ids, ', ') as recruiter,
  jv.featured, jp.approval_state as "approvalState", jp.vacancy_count as vacancies, jp.priority,
  coalesce(jv.compensation_public->>'display','Hidden') as "compensationDisplay", jv.public_slug as "publicSlug",
  concat('v',jv.version_number,' · ',jv.status) as version,
  coalesce(afv.id::text,'Not configured') as "formVersion", coalesce(array_length(jv.consent_version_ids,1),0)::text as "consentVersion",
  100::integer as progress, 'Low'::text as risk, to_char(jp.updated_at,'DD Mon YYYY HH24:MI') as updated,
  jv.content_blocks as "contentBlocks", coalesce(afv.fields,'[]'::jsonb) as "applicationFields",
  '[]'::jsonb as consents, jv.media, '[]'::jsonb as timeline,
  coalesce(nullif(jv.reports_to,''),'Chief Operating Officer') as "reportsTo",
  coalesce(jv.eligibility,'') as eligibility,
  coalesce(jv.application_prompt,'') as "applicationPrompt",
  coalesce(jv.public_working_note,'') as "publicWorkingNote",
  coalesce(to_char(jp.close_at at time zone 'Europe/London','YYYY-MM-DD'),'') as "closingDateInput"
from public.job_postings jp
join public.job_posting_versions jv on jv.id = coalesce(jp.current_draft_version_id,jp.current_live_version_id)
left join public.application_form_versions afv on afv.id = jv.application_form_version_id
left join public.applications a on a.job_posting_id = jp.id
group by jp.id,jv.id,afv.id;

-- One application row now reflects the linked interview/offer state instead of
-- the old placeholder "Linked records" values. Public submissions therefore
-- appear correctly in the Backend pipeline without a second application table.
create or replace view public.backend_application_directory with (security_invoker = true) as
select a.id, 'application'::text as kind, a.application_id as "applicationId", c.candidate_id as "candidateId",
  c.full_name as "candidateName", upper(left(c.full_name,1)) as initials,
  c.primary_email_normalized::text as "approvedEmail", jp.job_posting_id as "jobId", jv.title as "jobTitle",
  jv.department_name_snapshot as department, to_char(a.submitted_at,'DD Mon YYYY HH24:MI') as submitted,
  case when a.stage='Submitted' then 'New' else a.stage end as stage,
  coalesce(a.assigned_recruiter_staff_id,'Unassigned') as recruiter,
  coalesce(a.assigned_reviewer_staff_id,'Unassigned') as reviewer,
  a.rating, coalesce(a.flags,'[]'::jsonb) as flags,
  coalesce((select case
    when i.status in ('Scheduled','Confirmed','Rescheduled') then 'Scheduled'
    when i.status='Completed' then 'Completed'
    when i.status in ('Requested','Awaiting Availability') then 'Interview Requested'
    else i.status end
    from public.interviews i where i.application_id=a.id order by i.updated_at desc limit 1),'Not scheduled') as "interviewState",
  coalesce((select o.status from public.offers o where o.application_id=a.id order by o.updated_at desc limit 1),'None') as "offerState",
  to_char(a.updated_at,'DD Mon YYYY HH24:MI') as "lastUpdated", a.application_form_version_id::text as "formVersion",
  array_to_string(jv.consent_version_ids, ', ') as "consentVersion",
  coalesce((select jsonb_agg(jsonb_build_object('section',coalesce(aa.section_key,'Application'),'question',aa.question_snapshot,'answer',coalesce(aa.answer#>>'{}',aa.answer::text),'type',aa.field_type_snapshot,'required',aa.required_snapshot,'visible',aa.visible_at_submission) order by aa.created_at) from public.application_answers aa where aa.application_id=a.id),'[]'::jsonb) as responses,
  coalesce((select jsonb_agg(jsonb_build_object('name',cf.file_name,'category',cf.file_category,'type',cf.mime_type,'status',cf.scan_state,'access',cf.access_classification) order by cf.uploaded_at) from public.candidate_files cf where cf.application_id=a.id and cf.archived_at is null),'[]'::jsonb) as files,
  coalesce((select jsonb_agg(jsonb_build_object('reviewer',ar.reviewer_staff_id,'role',ar.reviewer_role,'recommendation',coalesce(ar.recommendation,'Pending'),'rating',coalesce(ar.rating::text,'—'),'submitted',coalesce(to_char(ar.submitted_at,'DD Mon YYYY HH24:MI'),'Draft'),'summary',coalesce(ar.strengths,'') || case when coalesce(ar.concerns,'')<>'' then ' · '||ar.concerns else '' end) order by ar.created_at desc) from public.application_reviews ar where ar.application_id=a.id),'[]'::jsonb) as reviews,
  coalesce((select jsonb_agg(jsonb_build_object('title',acv.title,'version','v'||acv.version_number,'accepted',to_char(ac.accepted_at,'DD Mon YYYY HH24:MI'),'withdrawn',ac.withdrawn_at is not null) order by ac.accepted_at) from public.application_consents ac join public.application_consent_versions acv on acv.id=ac.consent_version_id where ac.application_id=a.id),'[]'::jsonb) as consents,
  coalesce((select jsonb_agg(jsonb_build_object('title',ash.new_stage,'meta',to_char(ash.created_at,'DD Mon YYYY HH24:MI')||' · '||coalesce(ash.reason,'Workflow update'),'tone',case when ash.new_stage in ('Rejected','Withdrawn') then 'red' when ash.new_stage in ('Hired','Shortlisted') then 'green' else 'blue' end) order by ash.created_at desc) from public.application_stage_history ash where ash.application_id=a.id),'[]'::jsonb) as timeline
from public.applications a
join public.candidates c on c.id=a.candidate_id
join public.job_postings jp on jp.id=a.job_posting_id
join public.job_posting_versions jv on jv.id=a.job_version_id;

create or replace view public.backend_candidate_directory with (security_invoker = true) as
select c.id, 'candidate'::text as kind, c.candidate_id as "candidateId", c.full_name as name,
  upper(left(c.full_name,1)) as initials, c.primary_email_normalized::text as email, coalesce(c.primary_phone_normalized,'') as phone,
  coalesce(c.location_label,'') as location, coalesce(c.timezone,'Europe/London') as timezone, c.work_preferences->>'workArrangement' as "workPreference",
  c.work_preferences->>'employmentType' as "employmentPreference", count(a.id) filter (where a.archived_at is null)::integer as "activeApplications",
  coalesce((array_agg(jv.title order by a.updated_at desc) filter (where jv.title is not null))[1],'No active role') as "latestRole",
  coalesce((array_agg(case when a.stage='Submitted' then 'New' else a.stage end order by a.updated_at desc) filter (where a.stage is not null))[1],'New') as "currentStage",
  coalesce((array_agg(a.assigned_recruiter_staff_id order by a.updated_at desc) filter (where a.assigned_recruiter_staff_id is not null))[1],'Unassigned') as recruiter,
  coalesce((select jsonb_agg(tp.name order by tp.name) from public.candidate_talent_pool_memberships m join public.talent_pools tp on tp.id=m.talent_pool_id where m.candidate_id=c.id and m.status='Active'),'[]'::jsonb) as "talentPools",
  c.consent_state as "consentState", coalesce(to_char(c.retention_until,'DD Mon YYYY'),'Policy controlled') as "retentionUntil",
  c.duplicate_review_state as "duplicateRisk", to_char(c.updated_at,'DD Mon YYYY HH24:MI') as "lastActivity",
  coalesce((select jsonb_agg(jsonb_build_object('applicationId',ax.application_id,'job',jvx.title,'stage',case when ax.stage='Submitted' then 'New' else ax.stage end,'submitted',to_char(ax.submitted_at,'DD Mon YYYY')) order by ax.submitted_at desc) from public.applications ax join public.job_posting_versions jvx on jvx.id=ax.job_version_id where ax.candidate_id=c.id),'[]'::jsonb) as applications,
  '[]'::jsonb as experience, '[]'::jsonb as skills,
  coalesce((select jsonb_agg(jsonb_build_object('name',cf.file_name,'category',cf.file_category,'type',cf.mime_type,'status',cf.scan_state,'access',cf.access_classification) order by cf.uploaded_at desc) from public.candidate_files cf where cf.candidate_id=c.id and cf.archived_at is null),'[]'::jsonb) as files,
  '[]'::jsonb as timeline
from public.candidates c
left join public.applications a on a.candidate_id=c.id
left join public.job_posting_versions jv on jv.id=a.job_version_id
group by c.id;

create index if not exists applications_stage_updated_idx on public.applications(stage, updated_at desc);
create index if not exists interviews_application_updated_idx on public.interviews(application_id, updated_at desc);
create index if not exists recruitment_messages_application_created_idx on public.recruitment_messages(application_id, created_at desc);

create or replace function public.backend_manage_application(
  p_action text, p_target_type text, p_target_id text, p_payload jsonb,
  p_actor_staff_user_id text, p_reason text, p_correlation_id uuid
) returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_application public.applications%rowtype;
  v_previous_stage text;
  v_next_stage text;
  v_reviewer text;
begin
  if auth.role() <> 'service_role' and not public.is_backend_recruitment_staff(array['department.hr']) then raise exception 'permission denied'; end if;
  if nullif(trim(p_reason),'') is null then raise exception 'reason required'; end if;
  select * into v_application from public.applications where application_id=p_target_id limit 1 for update;
  if not found then raise exception 'application not found'; end if;
  v_previous_stage := v_application.stage;
  v_next_stage := v_previous_stage;

  if p_action='assign_application_reviewer' then
    v_reviewer := coalesce(nullif(trim(p_payload->>'reviewerStaffId'),''),p_actor_staff_user_id);
    update public.applications set assigned_reviewer_staff_id=v_reviewer,
      stage=case when stage in ('Submitted','New','Screening') then 'Under Review' else stage end,
      updated_at=now() where id=v_application.id returning stage into v_next_stage;
  elsif p_action='shortlist_application' then
    v_next_stage := 'Shortlisted';
    update public.applications set stage=v_next_stage,updated_at=now() where id=v_application.id;
  elsif p_action='request_interview' then
    v_next_stage := 'Interview Requested';
    update public.applications set stage=v_next_stage,updated_at=now() where id=v_application.id;
  elsif p_action='reject_application' then
    if coalesce(p_payload->>'human_reviewed','false') <> 'true' then raise exception 'human review required'; end if;
    v_next_stage := 'Rejected';
    update public.applications set stage=v_next_stage,updated_at=now() where id=v_application.id;
  elsif p_action='hire_application' then
    v_next_stage := 'Hired';
    update public.applications set stage=v_next_stage,updated_at=now() where id=v_application.id;
  elsif p_action='withdraw_application' then
    v_next_stage := 'Withdrawn';
    update public.applications set stage=v_next_stage,withdrawn_at=coalesce(withdrawn_at,now()),updated_at=now() where id=v_application.id;
  elsif p_action='archive_application' then
    update public.applications set archived_at=coalesce(archived_at,now()),updated_at=now() where id=v_application.id;
  elsif p_action='move_application_stage' then
    v_next_stage := nullif(trim(p_payload->>'stage'),'');
    if v_next_stage is null or v_next_stage not in ('Submitted','New','Screening','Under Review','Shortlisted','Interview Requested','Interview Scheduled','Offer Pending','Hired','Rejected','Withdrawn') then
      raise exception 'invalid application stage';
    end if;
    update public.applications set stage=v_next_stage,updated_at=now() where id=v_application.id;
  else
    raise exception 'unsupported application action';
  end if;

  if v_next_stage is distinct from v_previous_stage then
    insert into public.application_stage_history(application_id,previous_stage,new_stage,acting_staff_id,reason,candidate_notification_state,correlation_id)
    values(v_application.id,v_previous_stage,v_next_stage,p_actor_staff_user_id,p_reason,
      case when p_action='request_interview' then 'Pending' else 'Not Required' end,p_correlation_id);
  end if;

  insert into public.recruitment_audit_logs(acting_staff_id,action,target_type,target_id,previous_state,new_state,reason,environment,correlation_id)
  values(p_actor_staff_user_id,p_action,p_target_type,p_target_id,
    jsonb_build_object('stage',v_previous_stage),
    jsonb_build_object('stage',v_next_stage,'reviewerStaffId',coalesce(v_reviewer,v_application.assigned_reviewer_staff_id)),
    p_reason,'production',p_correlation_id);

  return jsonb_build_object('accepted',true,'applicationId',v_application.application_id,'stage',v_next_stage);
end $$;

create or replace function public.backend_manage_interview(
  p_action text, p_target_type text, p_target_id text, p_payload jsonb,
  p_actor_staff_user_id text, p_reason text, p_correlation_id uuid
) returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_application public.applications%rowtype;
  v_interview public.interviews%rowtype;
  v_interview_id text;
  v_starts_at timestamptz;
  v_ends_at timestamptz;
  v_interviewers text[] := array[]::text[];
  v_previous_stage text;
begin
  if auth.role() <> 'service_role' and not public.is_backend_recruitment_staff(array['department.hr']) then raise exception 'permission denied'; end if;
  if nullif(trim(p_reason),'') is null then raise exception 'reason required'; end if;

  if p_action='schedule_interview' then
    select * into v_application from public.applications where application_id=coalesce(nullif(p_payload->>'applicationId',''),p_target_id) limit 1 for update;
    if not found then raise exception 'application not found'; end if;
    v_starts_at := nullif(p_payload->>'startsAt','')::timestamptz;
    v_ends_at := nullif(p_payload->>'endsAt','')::timestamptz;
    if v_starts_at is null or v_ends_at is null or v_ends_at <= v_starts_at then raise exception 'valid interview start and end times are required'; end if;
    if jsonb_typeof(coalesce(p_payload->'interviewerStaffIds','[]'::jsonb))='array' then
      select coalesce(array_agg(value),array[]::text[]) into v_interviewers from jsonb_array_elements_text(coalesce(p_payload->'interviewerStaffIds','[]'::jsonb));
    end if;
    v_interview_id := 'INT-'||to_char(now(),'YYYYMMDD')||'-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
    insert into public.interviews(
      interview_id,candidate_id,application_id,job_posting_id,stage,starts_at,ends_at,timezone,interviewer_staff_ids,
      location_type,location_label,calendar_provider,calendar_event_reference,status,conflict_state,candidate_instructions,created_by_staff_id
    ) values (
      v_interview_id,v_application.candidate_id,v_application.id,v_application.job_posting_id,
      coalesce(nullif(p_payload->>'stage',''),'Recruiter Interview'),v_starts_at,v_ends_at,coalesce(nullif(p_payload->>'timezone',''),'Europe/London'),v_interviewers,
      coalesce(nullif(p_payload->>'locationType',''),'Online'),coalesce(nullif(p_payload->>'locationLabel',''),nullif(p_payload->>'meetingUrl',''),'To be confirmed'),
      coalesce(nullif(p_payload->>'calendarProvider',''),'Manual'),nullif(p_payload->>'calendarEventReference',''),'Scheduled','Not Checked',
      coalesce(p_payload->>'candidateInstructions',''),p_actor_staff_user_id
    ) returning * into v_interview;
    v_previous_stage := v_application.stage;
    update public.applications set stage='Interview Scheduled',updated_at=now() where id=v_application.id;
    insert into public.application_stage_history(application_id,previous_stage,new_stage,acting_staff_id,reason,candidate_notification_state,correlation_id)
    values(v_application.id,v_previous_stage,'Interview Scheduled',p_actor_staff_user_id,p_reason,'Pending',p_correlation_id);

  elsif p_action in ('reschedule_interview','send_interview_instructions','cancel_interview','complete_interview') then
    select * into v_interview from public.interviews where interview_id=p_target_id limit 1 for update;
    if not found then raise exception 'interview not found'; end if;
    if p_action='reschedule_interview' then
      v_starts_at := nullif(p_payload->>'startsAt','')::timestamptz;
      v_ends_at := nullif(p_payload->>'endsAt','')::timestamptz;
      if v_starts_at is null or v_ends_at is null or v_ends_at <= v_starts_at then raise exception 'valid interview start and end times are required'; end if;
      update public.interviews set starts_at=v_starts_at,ends_at=v_ends_at,
        timezone=coalesce(nullif(p_payload->>'timezone',''),timezone),
        location_type=coalesce(nullif(p_payload->>'locationType',''),location_type),
        location_label=coalesce(nullif(p_payload->>'locationLabel',''),nullif(p_payload->>'meetingUrl',''),location_label),
        candidate_instructions=coalesce(p_payload->>'candidateInstructions',candidate_instructions),status='Rescheduled',updated_at=now()
      where id=v_interview.id returning * into v_interview;
    elsif p_action='send_interview_instructions' then
      update public.interviews set candidate_instructions=coalesce(p_payload->>'candidateInstructions',candidate_instructions),updated_at=now() where id=v_interview.id returning * into v_interview;
    elsif p_action='cancel_interview' then
      update public.interviews set status='Cancelled',updated_at=now() where id=v_interview.id returning * into v_interview;
    else
      update public.interviews set status='Completed',updated_at=now() where id=v_interview.id returning * into v_interview;
    end if;
    select * into v_application from public.applications where id=v_interview.application_id limit 1;
    v_interview_id := v_interview.interview_id;
  else
    raise exception 'unsupported interview action';
  end if;

  insert into public.recruitment_audit_logs(acting_staff_id,action,target_type,target_id,new_state,reason,environment,correlation_id)
  values(p_actor_staff_user_id,p_action,p_target_type,coalesce(v_interview_id,p_target_id),
    jsonb_build_object('interviewId',v_interview.interview_id,'startsAt',v_interview.starts_at,'endsAt',v_interview.ends_at,'status',v_interview.status),
    p_reason,'production',p_correlation_id);

  return jsonb_build_object(
    'accepted',true,
    'interviewId',v_interview.interview_id,
    'interviewDbId',v_interview.id::text,
    'applicationId',v_application.application_id,
    'status',v_interview.status,
    'calendarEventReference',v_interview.calendar_event_reference
  );
end $$;

create or replace function public.backend_manage_offer(
  p_action text, p_target_type text, p_target_id text, p_payload jsonb,
  p_actor_staff_user_id text, p_reason text, p_correlation_id uuid
) returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_application public.applications%rowtype;
  v_offer public.offers%rowtype;
  v_offer_version public.offer_versions%rowtype;
  v_offer_id text;
  v_version_number integer;
  v_previous_stage text;
begin
  if auth.role() <> 'service_role' and not public.is_backend_recruitment_staff(array['department.hr']) then raise exception 'permission denied'; end if;
  if nullif(trim(p_reason),'') is null then raise exception 'reason required'; end if;

  if p_action='create_offer' then
    select * into v_application from public.applications where application_id=coalesce(nullif(p_payload->>'applicationId',''),p_target_id) limit 1 for update;
    if not found then raise exception 'application not found'; end if;
    if exists(select 1 from public.offers where application_id=v_application.id and status not in ('Withdrawn','Declined','Expired')) then raise exception 'an active offer already exists for this application'; end if;
    v_offer_id := 'OFR-'||to_char(now(),'YYYY')||'-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
    insert into public.offers(offer_id,candidate_id,application_id,job_posting_id,status,approval_state,owner_staff_id,expires_at)
    values(v_offer_id,v_application.candidate_id,v_application.id,v_application.job_posting_id,'Draft','Draft',p_actor_staff_user_id,nullif(p_payload->>'expiresAt','')::timestamptz)
    returning * into v_offer;
    insert into public.offer_versions(offer_id,version_number,status,offer_details,compensation_summary,benefits_summary,conditions,document_references,created_by_staff_id)
    values(v_offer.id,1,'Draft',jsonb_build_object(
      'employmentType',coalesce(nullif(p_payload->>'employmentType',''),'Full-time'),
      'workArrangement',coalesce(nullif(p_payload->>'workArrangement',''),'Remote'),
      'location',coalesce(nullif(p_payload->>'location',''),'Remote'),
      'startDate',coalesce(p_payload->>'startDate','')
    ),coalesce(p_payload->'compensationSummary','{}'::jsonb),coalesce(p_payload->'benefitsSummary','{}'::jsonb),coalesce(p_payload->'conditions','[]'::jsonb),'[]'::jsonb,p_actor_staff_user_id)
    returning * into v_offer_version;
    update public.offers set current_version_id=v_offer_version.id,updated_at=now() where id=v_offer.id returning * into v_offer;
    v_previous_stage := v_application.stage;
    update public.applications set stage='Offer Pending',updated_at=now() where id=v_application.id;
    insert into public.application_stage_history(application_id,previous_stage,new_stage,acting_staff_id,reason,candidate_notification_state,correlation_id)
    values(v_application.id,v_previous_stage,'Offer Pending',p_actor_staff_user_id,p_reason,'Not Required',p_correlation_id);
  else
    select * into v_offer from public.offers where offer_id=p_target_id limit 1 for update;
    if not found then raise exception 'offer not found'; end if;
    select * into v_application from public.applications where id=v_offer.application_id limit 1;
    if p_action='request_offer_approval' then
      update public.offers set status='Awaiting Approval',approval_state='Awaiting Approval',updated_at=now() where id=v_offer.id returning * into v_offer;
    elsif p_action='approve_offer' then
      update public.offers set status='Approved',approval_state='Approved',updated_at=now() where id=v_offer.id returning * into v_offer;
    elsif p_action='send_offer' then
      if v_offer.approval_state <> 'Approved' and v_offer.status <> 'Approved' then raise exception 'offer approval is required before sending'; end if;
      update public.offers set status='Sent',sent_at=coalesce(sent_at,now()),updated_at=now() where id=v_offer.id returning * into v_offer;
      update public.offer_versions set status='Sent',sent_at=coalesce(sent_at,now()) where id=v_offer.current_version_id;
    elsif p_action='withdraw_offer' then
      update public.offers set status='Withdrawn',withdrawn_at=coalesce(withdrawn_at,now()),updated_at=now() where id=v_offer.id returning * into v_offer;
    elsif p_action='create_onboarding_handover' then
      update public.offers set onboarding_workflow_id=coalesce(onboarding_workflow_id,gen_random_uuid()),updated_at=now() where id=v_offer.id returning * into v_offer;
    else
      raise exception 'unsupported offer action';
    end if;
    select * into v_offer_version from public.offer_versions where id=v_offer.current_version_id limit 1;
    v_offer_id := v_offer.offer_id;
  end if;

  insert into public.recruitment_audit_logs(acting_staff_id,action,target_type,target_id,new_state,reason,environment,correlation_id)
  values(p_actor_staff_user_id,p_action,p_target_type,coalesce(v_offer_id,p_target_id),jsonb_build_object('status',v_offer.status,'approvalState',v_offer.approval_state),p_reason,'production',p_correlation_id);
  return jsonb_build_object('accepted',true,'offerId',v_offer.offer_id,'offerDbId',v_offer.id::text,'applicationId',v_application.application_id,'status',v_offer.status,'approvalState',v_offer.approval_state);
end $$;

revoke all on function public.backend_manage_application(text,text,text,jsonb,text,text,uuid) from public, anon;
revoke all on function public.backend_manage_interview(text,text,text,jsonb,text,text,uuid) from public, anon;
revoke all on function public.backend_manage_offer(text,text,text,jsonb,text,text,uuid) from public, anon;
grant execute on function public.backend_manage_application(text,text,text,jsonb,text,text,uuid) to authenticated, service_role;
grant execute on function public.backend_manage_interview(text,text,text,jsonb,text,text,uuid) to authenticated, service_role;
grant execute on function public.backend_manage_offer(text,text,text,jsonb,text,text,uuid) to authenticated, service_role;

-- Supabase Realtime is optional for these tables; add them once when the
-- project publication exists. The Backend also refetches after local writes.
do $$
begin
  if exists (select 1 from pg_publication where pubname='supabase_realtime') then
    begin alter publication supabase_realtime add table public.job_postings; exception when duplicate_object then null; end;
    begin alter publication supabase_realtime add table public.applications; exception when duplicate_object then null; end;
    begin alter publication supabase_realtime add table public.candidates; exception when duplicate_object then null; end;
    begin alter publication supabase_realtime add table public.interviews; exception when duplicate_object then null; end;
    begin alter publication supabase_realtime add table public.offers; exception when duplicate_object then null; end;
  end if;
end $$;

notify pgrst, 'reload schema';
commit;
