-- PREPARE TEST USERS
-- 1. Sync any missing profiles
insert into public.profiles (id, email, full_name, role)
select 
    id, 
    email, 
    coalesce(raw_user_meta_data->>'full_name', email) as full_name,
    'student'::user_role
from auth.users
where id not in (select id from public.profiles);

-- 2. Force Roles for Test Scenario
update public.profiles set role = 'admin' where email = 'admin@admin.az';
update public.profiles set role = 'teacher' where email = 'emin@emin.az';
update public.profiles set role = 'student' where email = 'user@user.az';
