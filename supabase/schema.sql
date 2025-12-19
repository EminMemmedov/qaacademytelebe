-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ROLES ENUM (sadəlik üçün text check constraint istifadə edəcəyik və ya enum type)
create type user_role as enum ('student', 'teacher', 'admin');
create type assignment_status as enum ('new', 'submitted', 'changes_requested', 'approved');
create type attendance_status as enum ('present', 'absent', 'late', 'excused');

-- PROFILES (Users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role user_role default 'student'::user_role,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraints
  constraint username_length check (char_length(full_name) >= 3)
);

-- COURSES (Kurslar)
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- COHORTS (Qruplar) - Məs: QA-24, Frontend-10
create table public.cohorts (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  course_id uuid references public.courses(id) on delete set null,
  start_date date,
  end_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- COHORT_MEMBERS (Hansı tələbə hansı qrupdadır)
create table public.cohort_members (
  id uuid default uuid_generate_v4() primary key,
  cohort_id uuid references public.cohorts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(cohort_id, user_id)
);

-- LESSONS (Dərslər)
create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  cohort_id uuid references public.cohorts(id) on delete cascade,
  title text not null,
  content text, -- Dərs haqqında məlumat
  video_url text, -- Youtube/Drive link
  date timestamp with time zone, -- Dərsin vaxtı
  order_index int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MATERIALS (Materiallar)
create table public.materials (
  id uuid default uuid_generate_v4() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  title text not null,
  file_url text not null,
  type text, -- 'pdf', 'slide', 'link'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ASSIGNMENTS (Ev Tapşırıqları - Müəllim yaradır)
create table public.assignments (
  id uuid default uuid_generate_v4() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  title text not null,
  description text,
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SUBMISSIONS (Tələbə tapşırıqları)
create table public.submissions (
  id uuid default uuid_generate_v4() primary key,
  assignment_id uuid references public.assignments(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  content text, -- Link və ya mətn
  status assignment_status default 'new'::assignment_status,
  grade int, -- 0-100 arası
  feedback text, -- Müəllim rəyi
  submitted_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique(assignment_id, student_id)
);

-- ATTENDANCE_RECORDS (Davamiyyət)
create table public.attendance_records (
  id uuid default uuid_generate_v4() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  status attendance_status default 'absent'::attendance_status,
  late_minutes int default 0,
  note text,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(lesson_id, student_id)
);

-- AUDIT LOG
create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  table_name text,
  record_id uuid,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ENABLE RLS
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.cohorts enable row level security;
alter table public.lessons enable row level security;
alter table public.materials enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.attendance_records enable row level security;

-- POLICIES (Simplified for MVP)

-- Profiles: 
-- Public read (for names/avatars), Update own only
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Courses/Cohorts: 
-- Read: Authenticated, Write: Teacher/Admin
create policy "Courses viewable by authenticated" on public.courses for select to authenticated using (true);
create policy "Cohorts viewable by authenticated" on public.cohorts for select to authenticated using (true);

-- Lessons:
-- Read: If member of cohort OR Teacher/Admin
-- Write: Teacher/Admin
create policy "Lessons visible to cohort members" on public.lessons for select using (
  exists (
    select 1 from public.cohort_members 
    where cohort_members.cohort_id = lessons.cohort_id 
    and cohort_members.user_id = auth.uid()
  ) 
  OR 
  exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
);

-- Submissions:
-- Student can see own. Teacher/Admin can see all for valid cohorts.
create policy "View own submissions" on public.submissions for select using (
  student_id = auth.uid() 
  OR 
  exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
);

create policy "Create/Update own submissions" on public.submissions for insert with check (student_id = auth.uid());
create policy "Update own submissions" on public.submissions for update using (student_id = auth.uid());
create policy "Teachers update submissions" on public.submissions for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
);

-- Helpers for RLS
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;
