-- ADD COHORT_ID TO PROFILES (Simpler Relation for MVP)

-- 1. Add column
alter table public.profiles 
add column if not exists cohort_id uuid references public.cohorts(id) on delete set null;

-- 2. Create Index for performance
create index if not exists idx_profiles_cohort_id on public.profiles(cohort_id);

-- 3. Update RLS to allow reading this column (already covered by "select * using true", but good to know)
