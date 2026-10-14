-- Run this once in Supabase Dashboard > SQL Editor.
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(question) between 1 and 140),
  answer text not null check (char_length(answer) between 1 and 800),
  category text not null,
  keywords text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'New conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  owner_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) between 1 and 2000),
  fallback boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_chat_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  window_start timestamptz not null,
  request_count smallint not null default 0,
  primary key (user_id, window_start)
);

insert into public.faqs (id, question, answer, category, keywords) values
  ('10000000-0000-4000-8000-000000000001', 'How do I apply for admission?', 'Check the current admission information and confirm required documents and dates with the college office. The prospectus listed in the information reviewed is for 2022–23 and may be out of date.', 'Admissions', array['apply', 'application', 'admission', 'enrol', 'enroll', 'documents', 'deadline']),
  ('10000000-0000-4000-8000-000000000002', 'When is the application deadline?', 'I could not verify a current admission deadline. Please check the latest admission notice or confirm the date with the college office.', 'Admissions', array['deadline', 'date', 'last date', 'apply', 'application', 'intake']),
  ('10000000-0000-4000-8000-000000000003', 'What are the admission eligibility requirements?', 'Eligibility depends on the program and current university rules. Please confirm the criteria for your chosen subject with the college office.', 'Admissions', array['eligibility', 'eligible', 'requirements', 'qualification', 'marks', 'criteria']),
  ('10000000-0000-4000-8000-000000000004', 'What courses and programs do you offer?', 'Sitabai College''s information lists Arts undergraduate and postgraduate subject areas and B.Sc. subject areas including Botany, Chemistry, Computer Science, Mathematics, Microbiology, Physics, and Zoology. It also has a Commerce department. Confirm current course titles and combinations with the college.', 'Academics', array['course', 'courses', 'program', 'programs', 'degree', 'subjects', 'study']),
  ('10000000-0000-4000-8000-000000000005', 'When does the semester start?', 'Semester start dates are published in the academic calendar. Please check the latest college calendar or ask the academic office for your program''s confirmed schedule.', 'Academics', array['semester', 'start', 'term', 'calendar', 'class', 'schedule', 'academic']),
  ('10000000-0000-4000-8000-000000000006', 'How much are the tuition fees?', 'I could not verify a current fee schedule. Please ask the college office for the fees for your course and intake, including any additional charges.', 'Fees & Aid', array['fee', 'fees', 'tuition', 'cost', 'price', 'payment', 'accounts']),
  ('10000000-0000-4000-8000-000000000007', 'Are scholarships or financial aid available?', 'Please ask the college office to confirm current scholarship and financial assistance options, eligibility, and deadlines.', 'Fees & Aid', array['scholarship', 'scholarships', 'financial aid', 'financial', 'grant', 'bursary', 'aid']),
  ('10000000-0000-4000-8000-000000000008', 'Is hostel accommodation available?', 'The college profile mentions a girls'' hostel. Ask the college office to confirm current availability, application steps, and fees.', 'Campus Life', array['hostel', 'housing', 'accommodation', 'room', 'dorm', 'residence', 'stay']),
  ('10000000-0000-4000-8000-000000000009', 'What clubs and activities are available on campus?', 'The college profile mentions sports, games, cultural activities, NCC, and NSS. Check with the college to confirm current activities and schedules.', 'Campus Life', array['club', 'clubs', 'activity', 'activities', 'events', 'sports', 'student life']),
  ('10000000-0000-4000-8000-000000000010', 'What are the library opening hours?', 'I could not verify the current library hours. Please check today''s schedule with the college office.', 'Student Services', array['library', 'hours', 'opening', 'open', 'close', 'books', 'study']),
  ('10000000-0000-4000-8000-000000000011', 'Where is Sitabai College located?', 'Sitabai Arts, Commerce & Science College is located in Civil Lines, Akola 444001, Maharashtra.', 'Student Services', array['address', 'location', 'where', 'Akola', 'Civil Lines']),
  ('10000000-0000-4000-8000-000000000012', 'Does the college provide placement or career support?', 'Please ask the college office to confirm the current career guidance, internship, or placement support available for your course.', 'Student Services', array['placement', 'career', 'internship', 'job', 'employment', 'counselling'])
on conflict (id) do update set
  question = excluded.question,
  answer = excluded.answer,
  category = excluded.category,
  keywords = excluded.keywords,
  updated_at = now();

create index if not exists conversations_owner_updated_idx
  on public.conversations (owner_id, updated_at desc);
create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at);

alter table public.faqs enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.ai_chat_usage enable row level security;

revoke all on public.ai_chat_usage from anon, authenticated;

create or replace function public.consume_ai_chat_quota()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_window timestamptz := date_trunc('hour', now());
  updated_count smallint;
begin
  if current_user_id is null then
    return false;
  end if;

  insert into public.ai_chat_usage (user_id, window_start, request_count)
  values (current_user_id, current_window, 1)
  on conflict (user_id, window_start)
  do update set request_count = public.ai_chat_usage.request_count + 1
  where public.ai_chat_usage.request_count < 30
  returning request_count into updated_count;

  return updated_count is not null;
end;
$$;

revoke all on function public.consume_ai_chat_quota() from public, anon;
grant execute on function public.consume_ai_chat_quota() to authenticated;

drop policy if exists "Anyone can read FAQs" on public.faqs;
create policy "Anyone can read FAQs"
  on public.faqs for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert FAQs" on public.faqs;
create policy "Admins can insert FAQs"
  on public.faqs for insert
  to authenticated
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update FAQs" on public.faqs;
create policy "Admins can update FAQs"
  on public.faqs for update
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can delete FAQs" on public.faqs;
create policy "Admins can delete FAQs"
  on public.faqs for delete
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Students can read their conversations" on public.conversations;
create policy "Students can read their conversations"
  on public.conversations for select
  to authenticated
  using (owner_id = (select auth.uid()));

drop policy if exists "Students can create their conversations" on public.conversations;
create policy "Students can create their conversations"
  on public.conversations for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

drop policy if exists "Students can update their conversations" on public.conversations;
create policy "Students can update their conversations"
  on public.conversations for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

drop policy if exists "Students can delete their conversations" on public.conversations;
create policy "Students can delete their conversations"
  on public.conversations for delete
  to authenticated
  using (owner_id = (select auth.uid()));

drop policy if exists "Students can read their messages" on public.messages;
create policy "Students can read their messages"
  on public.messages for select
  to authenticated
  using (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
        and conversations.owner_id = (select auth.uid())
    )
  );

drop policy if exists "Students can create their messages" on public.messages;
create policy "Students can create their messages"
  on public.messages for insert
  to authenticated
  with check (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
        and conversations.owner_id = (select auth.uid())
    )
  );

drop policy if exists "Students can update their messages" on public.messages;
create policy "Students can update their messages"
  on public.messages for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
        and conversations.owner_id = (select auth.uid())
    )
  );

drop policy if exists "Students can delete their messages" on public.messages;
create policy "Students can delete their messages"
  on public.messages for delete
  to authenticated
  using (owner_id = (select auth.uid()));

grant select on public.faqs to anon, authenticated;
grant insert, update, delete on public.faqs to authenticated;
grant select, insert, update, delete on public.conversations, public.messages to authenticated;

-- Enable table changes for the live FAQ refresh subscription.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'faqs'
  ) then
    alter publication supabase_realtime add table public.faqs;
  end if;
end
$$;

-- Optional: after creating the admin in Authentication > Users, run:
-- update auth.users
-- set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
-- where email = 'your-admin-email@example.com';
-- Replace the example email. Never grant an admin role from browser/user-editable metadata.
