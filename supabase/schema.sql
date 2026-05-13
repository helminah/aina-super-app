-- AINA — Supabase schema snapshot
-- Canonical history lives in supabase/migrations.
-- Apply migrations in order when creating a new Supabase project.

\i ./migrations/202604300001_prepare_aina_core_schema_and_fix_rls.sql
\i ./migrations/202604300002_fix_set_updated_at_search_path.sql
