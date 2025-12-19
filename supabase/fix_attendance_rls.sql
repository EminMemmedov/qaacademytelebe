-- FIX ATTENDANCE RLS POLICIES
-- Allow authenticated users (Teachers) to manage attendance.

alter table public.attendance_records enable row level security;

-- Drop existing policies
drop policy if exists "Enable read for attendance" on public.attendance_records;
drop policy if exists "Enable insert for attendance" on public.attendance_records;
drop policy if exists "Enable update for attendance" on public.attendance_records;

-- 1. READ (Everyone)
create policy "Enable read for attendance"
on public.attendance_records for select
to authenticated
using (true);

-- 2. INSERT (Teachers)
create policy "Enable insert for attendance"
on public.attendance_records for insert
to authenticated
with check (true);

-- 3. UPDATE (Teachers)
create policy "Enable update for attendance"
on public.attendance_records for update
to authenticated
using (true);
