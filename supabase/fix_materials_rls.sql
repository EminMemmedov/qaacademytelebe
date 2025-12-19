-- FIX MATERIALS RLS POLICIES
-- Allow authenticated users (Teachers) to INSERT and DELETE materials.

alter table public.materials enable row level security;

-- Drop existing policies to avoid conflicts
drop policy if exists "Enable read access for materials" on public.materials;
drop policy if exists "Enable insert for materials" on public.materials;
drop policy if exists "Enable delete for materials" on public.materials;

-- 1. READ (Everyone, including students)
create policy "Enable read access for materials"
on public.materials for select
to authenticated
using (true);

-- 2. INSERT (Teachers/Admins)
create policy "Enable insert for materials"
on public.materials for insert
to authenticated
with check (true);

-- 3. DELETE (Teachers/Admins)
create policy "Enable delete for materials"
on public.materials for delete
to authenticated
using (true);
