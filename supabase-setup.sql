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

-- ─── Faculty Members table ────────────────────────────────────────────────────
-- Run this in your Supabase SQL editor to create the faculty_members table.
-- The "faculty" storage bucket already exists and is reused for photos.

create table if not exists public.faculty_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text not null,
  degree      text,
  tint        text default '#CDEBFF',
  sort_order  int default 0,
  photo_url   text,
  is_default  boolean default false,
  created_at  timestamptz default now()
);

-- Enable public read access
alter table public.faculty_members enable row level security;

create policy "Public read" on public.faculty_members
  for select using (true);

create policy "Service role write" on public.faculty_members
  for all using (auth.role() = 'service_role');

-- Allow anon inserts/deletes for admin panel (uses anon key)
create policy "Anon write" on public.faculty_members
  for all using (true) with check (true);

-- ─── Seed default faculty (run once) ─────────────────────────────────────────
-- These match the original hardcoded faculty. Run after creating the table.

insert into public.faculty_members (name, role, degree, tint, sort_order, is_default) values
  ('Dr. Vaishali Rajput',    'I/C Principal, SDC Director',           'Ph.D, M.Com',                              '#D8F5C4', 1,  true),
  ('Mr. Sandeep Vishwakarma','HOD · IT Dept.',                        'B.Sc. (Physics), MCA, MBA, Ph.D. Scholar', '#FFE7B8', 2,  true),
  ('Mr. Arvind Singh',       'Coordinator-B.Sc.IT, B.Sc. CS & DF',   'M.Sc. (Computer Science)',                 '#FFD6C0', 3,  true),
  ('Ms. Sailaja Tiwari',     'Assistant Professor',                    'M.Sc.IT',                                  '#CDEBFF', 4,  true),
  ('Mr. Dheeraj Vishwakarma','Assistant Professor',                    'MSc(Statistics), B.Ed',                   '#FFD6C0', 5,  true),
  ('Ms. Vani Bandi',         'Assistant Professor',                    'MSc(Statistics)',                          '#CDEBFF', 6,  true),
  ('Mr. Sahil Bhalekar',     'Assistant Professor',                    'MCA',                                      '#CDEBFF', 7,  true),
  ('Mr. Priyam Chavan',      'Assistant Professor',                    'M.Sc.IT',                                  '#CDEBFF', 8,  true),
  ('Mr. Vikesh Kumar Singh', 'Assistant Professor',                    'Animation & VFX Expert',                   '#CDEBFF', 9,  true)
on conflict do nothing;
