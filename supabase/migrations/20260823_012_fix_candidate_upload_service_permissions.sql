-- Careers application uploads are created by the trusted About-site server.
-- The private upload registry must therefore be writable by service_role while
-- remaining unavailable to public browser roles.

revoke all privileges on table public.candidate_uploads from anon, authenticated;
grant select, insert, update, delete on table public.candidate_uploads to service_role;

comment on table public.candidate_uploads is
  'Private pre-application upload registry. Accessible only through trusted server/service-role flows; public applicants receive opaque references only.';
