-- FIX ASSIGNMENTS RLS POLICIES
-- Allow authenticated users (Teachers) to INSERT and UPDATE assignments.

alter table public.assignments enable row level security;

-- Drop existing policies
drop policy if exists "Enable read for assignments" on public.assignments;
drop policy if exists "Enable insert for assignments" on public.assignments;
drop policy if exists "Enable update for assignments" on public.assignments;
drop policy if exists "Enable delete for assignments" on public.assignments;

-- 1. READ (Everyone/Authenticated)
create policy "Enable read for assignments"
on public.assignments for select
to authenticated
using (true);

-- 2. INSERT (Teachers)
create policy "Enable insert for assignments"
on public.assignments for insert
to authenticated
with check (true);

-- 3. UPDATE (Teachers)
create policy "Enable update for assignments"
on public.assignments for update
to authenticated
using (true);

-- 4. DELETE (Teachers)
create policy "Enable delete for assignments"
on public.assignments for delete
to authenticated
using (true);
