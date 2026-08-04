-- Run only if all Support migrations succeeded but the Supabase Data API still
-- reports that support tables or functions cannot be found.
-- This refreshes PostgREST's schema and configuration cache.

notify pgrst, 'reload schema';
notify pgrst, 'reload config';
