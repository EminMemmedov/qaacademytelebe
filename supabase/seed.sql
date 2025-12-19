
-- Insert Test Users (Note: In real Supabase, users must exist in auth.users first. This is for schema data only)
-- Assume we have these UUIDs (In a real scenario, you'd create them in Auth first)

INSERT INTO public.courses (title, description) VALUES
('Manual QA', 'Proqram təminatının testlənməsi üzrə fundamental kurs.'),
('Automation QA', 'Java və Selenium istifadə edərək avtomatlaşdırma.');

-- Fetch course ID (Normally we'd use variables, but for seed we assume ID knowledge or just insert)
DO $$
DECLARE
  course_qa_id uuid;
  course_auto_id uuid;
BEGIN
  SELECT id INTO course_qa_id FROM public.courses WHERE title = 'Manual QA' LIMIT 1;
  SELECT id INTO course_auto_id FROM public.courses WHERE title = 'Automation QA' LIMIT 1;

  -- Create Cohorts
  INSERT INTO public.cohorts (name, course_id, start_date) VALUES 
  ('QA-Group-24', course_qa_id, '2024-01-10'),
  ('Auto-Group-05', course_auto_id, '2024-02-15');
  
END $$;
