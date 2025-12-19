-- STORAGE SETUP FOR MATERIALS
-- Create a public bucket named 'materials' if it doesn't exist

insert into storage.buckets (id, name, public)
values ('materials', 'materials', true)
on conflict (id) do nothing;

-- POLICY: Allow Authenticated Users (Teachers/Admins) to UPLOAD files
drop policy if exists "Allow authenticated uploads" on storage.objects;
create policy "Allow authenticated uploads"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'materials' );

-- POLICY: Allow Anyone to DOWNLOAD (Public access for students)
drop policy if exists "Allow public downloads" on storage.objects;
create policy "Allow public downloads"
on storage.objects for select
to public
using ( bucket_id = 'materials' );

-- POLICY: Allow Owners to DELETE (Optional, for teachers to remove)
drop policy if exists "Allow owners to delete" on storage.objects;
create policy "Allow owners to delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'materials' );
