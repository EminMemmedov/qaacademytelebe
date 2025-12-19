-- Trigger to automatically create a profile for new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Yeni Tələbə'), -- Gets name from metadata or default
    'student' -- Default role is always student
  );
  return new;
end;
$$;

-- Drop trigger if exists to allow re-running script
drop trigger if exists on_auth_user_created on auth.users;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger for deleting profile (optional, usually handled by FK cascade, but good for cleanup)
-- Note: profiles table has "on delete cascade" on the ID foreign key, so deleting user from Auth auto-deletes profile.
