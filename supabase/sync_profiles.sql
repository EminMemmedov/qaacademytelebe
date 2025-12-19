-- SYNC AUTH USERS TO PROFILES
-- This script inserts any user from auth.users that is missing in public.profiles

insert into public.profiles (id, email, full_name, role)
select 
    id, 
    email, 
    coalesce(raw_user_meta_data->>'full_name', email) as full_name,
    'student'::user_role -- Default role
from auth.users
where id not in (select id from public.profiles);

-- Also, let's confirm it worked by selecting
select count(*) as new_profiles_count from public.profiles;
