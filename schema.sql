-- ============================================================
-- Kinora database schema (Phase 5)
-- Paste this whole file into: Supabase dashboard -> SQL Editor -> New query -> Run
-- Safe to re-run (uses "if not exists" / "or replace").
-- ============================================================

-- 1) PROFILES: one row per user, auto-created on signup ------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  whatsapp   text,
  plan       text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, whatsapp)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'whatsapp')
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) QUIZ RESULTS: the onboarding answers, per user ----------------------------
create table if not exists public.quiz_results (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade default auth.uid(),
  answers    jsonb,
  created_at timestamptz default now()
);
alter table public.quiz_results enable row level security;
drop policy if exists "own quiz" on public.quiz_results;
create policy "own quiz" on public.quiz_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3) BOOKINGS: upcoming / past live sessions, per user -------------------------
create table if not exists public.bookings (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade default auth.uid(),
  coach        text,
  session_date date,
  session_time text,
  status       text default 'upcoming',
  created_at   timestamptz default now()
);
alter table public.bookings enable row level security;
drop policy if exists "own bookings" on public.bookings;
create policy "own bookings" on public.bookings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
