-- 1. Add duration columns to courses table
alter table public.courses add column if not exists duration_months integer default 2;
alter table public.courses add column if not exists lessons_per_month integer default 8;

-- 2. Insert the specific courses requested
-- First, clean up previous entries to avoid duplicates if they exist with same names
delete from public.courses where title in ('QA Manual', 'QA Automation');

insert into public.courses (title, description, duration_months, lessons_per_month)
values 
(
  'QA Manual', 
  'Manual Testləşdirmənin əsasları, SDLC, STLC, Bug Reportlar və Test Planlama. Müddət: 2 ay (16 Dərs)', 
  2, 
  8
),
(
  'QA Automation', 
  'Java və Selenium ilə testlərin avtomatlaşdırılması. API və UI testləri. Müddət: 4 ay (32 Dərs)', 
  4, 
  8
);
