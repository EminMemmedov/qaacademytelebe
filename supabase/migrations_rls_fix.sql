-- RLS FIX for Admin Access to Profiles

-- 1. Create a function to check if user is admin (security definer is key here)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 
    from public.profiles 
    where id = auth.uid() 
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 2. Drop existing restrictive policies if any (to be safe)
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;

-- 3. Create Basic Policies

-- Everyone can read Basic Profile info (needed for finding users)
create policy "Public profiles are viewable by everyone" 
on public.profiles for select 
using (true);

-- Users can update only their own profile
create policy "Users can update own profile" 
on public.profiles for update 
using (auth.uid() = id);

-- 4. POWERFUL ADMIN POLICIES (Super Access)
-- Actually, the "Public viewable" covers Admin reading.
-- But Admins need to UPDATE others (change roles, groups).

create policy "Admins can update any profile" 
on public.profiles for update 
using (
  public.is_admin()
);

-- Admins can delete profiles (optional, but good for cleanup)
create policy "Admins can delete any profile" 
on public.profiles for delete 
using (
  public.is_admin()
);
