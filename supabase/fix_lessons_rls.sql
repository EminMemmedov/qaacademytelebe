-- FIX LESSONS INSERT POLICY
-- Allow authenticated users (Teachers/Admins) to create lessons.

alter table public.lessons enable row level security;

-- Drop generic policies just in case
drop policy if exists "Enable insert for lessons" on public.lessons;
drop policy if exists "Enable read access for lessons" on public.lessons;
drop policy if exists "Enable update for lessons" on public.lessons;

-- 1. READ (All authenticated)
create policy "Enable read access for lessons"
on public.lessons for select
to authenticated
using (true);

-- 2. INSERT (All authenticated) - CRITICAL FIX
create policy "Enable insert for lessons"
on public.lessons for insert
to authenticated
with check (true);

-- 3. UPDATE (All authenticated)
create policy "Enable update for lessons"
on public.lessons for update
to authenticated
using (true);
