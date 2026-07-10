-- ─────────────────────────────────────────────────────────────────────────────
-- CSC IT Orientation — Supabase Setup
-- Run this in your Supabase project → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Feedback table
create table if not exists public.feedback (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz default now(),
  name          text,
  phone         text,
  course        text check (course in (
                  'bscit','bscds','bscaiml','bsccsdf','bscvfx','bca',
                  'bcom','baf','bbi','bfm','bammc','bms'
                )),
  orientation   int2 check (orientation between 1 and 5),
  facilities    int2 check (facilities between 1 and 10),
  suggestions   text,
  recommend     text check (recommend in ('yes','maybe','no'))
);

-- If upgrading an existing table from the previous schema, run these migrations:
-- alter table public.feedback drop column if exists faculty;
-- alter table public.feedback drop column if exists lab;
-- alter table public.feedback drop constraint if exists feedback_course_check;
-- alter table public.feedback add constraint feedback_course_check
--   check (course in ('bscit','bscds','bscaiml','bsccsdf','bscvfx','bca','bcom','baf','bbi','bfm','bammc','bms'));

-- Enable Row Level Security
alter table public.feedback enable row level security;

-- Allow anyone to insert (students submitting feedback)
create policy "Allow public insert"
  on public.feedback for insert
  to anon
  with check (true);

-- Allow authenticated users (admin) to read all
create policy "Allow admin read"
  on public.feedback for select
  to anon
  using (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Storage buckets
-- Go to Supabase → Storage → New Bucket and create these 3 buckets:
--   • slideshow   (public)
--   • labs        (public)
--   • faculty     (public)
--
-- Then add these storage policies for each bucket:
-- ─────────────────────────────────────────────────────────────────────────────

-- Allow public read on all 3 buckets (run once per bucket, change bucket name)
-- Storage → Policies → New Policy → "Give users access to own folder" → customize

-- Or run via SQL (repeat for 'labs' and 'faculty'):
insert into storage.buckets (id, name, public)
  values ('slideshow', 'slideshow', true),
         ('labs',      'labs',      true),
         ('faculty',   'faculty',   true)
  on conflict (id) do nothing;

create policy "Public read slideshow"
  on storage.objects for select
  using (bucket_id = 'slideshow');

create policy "Anon upload slideshow"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'slideshow');

create policy "Anon delete slideshow"
  on storage.objects for delete
  to anon
  using (bucket_id = 'slideshow');

create policy "Public read labs"
  on storage.objects for select
  using (bucket_id = 'labs');

create policy "Anon upload labs"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'labs');

create policy "Anon delete labs"
  on storage.objects for delete
  to anon
  using (bucket_id = 'labs');

create policy "Public read faculty"
  on storage.objects for select
  using (bucket_id = 'faculty');

create policy "Anon upload faculty"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'faculty');

create policy "Anon delete faculty"
  on storage.objects for delete
  to anon
  using (bucket_id = 'faculty');
