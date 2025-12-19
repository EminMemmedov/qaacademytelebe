-- FORCE ENABLE UPDATES ON PROFILES
-- This allows ANY authenticated user to update ANY profile.
-- WARNING: This is for MVP development speed only. In production, add 'is_admin()' check.

alter table public.profiles enable row level security;

-- Drop any conflicting policy
drop policy if exists "Enable update for users based on email" on public.profiles;
drop policy if exists "Admins can update any profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

-- Create the PERMISSIVE policy
create policy "Enable update for all authenticated users"
on public.profiles
for update
to authenticated
using (true)
with check (true);

-- Also ensure SELECT is open
drop policy if exists "Enable read access for all authenticated users" on public.profiles;
create policy "Enable read access for all authenticated users"
on public.profiles for select
to authenticated
using (true);
