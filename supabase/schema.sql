-- Flowchart Learning App - database schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists pgcrypto;

create table if not exists problems (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  difficulty_level int not null check (difficulty_level between 1 and 100),
  type text not null check (type in ('sequence', 'condition', 'loop')),
  pseudocode text not null,
  created_at timestamptz not null default now()
);

create index if not exists problems_type_idx on problems (type);
create index if not exists problems_difficulty_idx on problems (difficulty_level);

create table if not exists user_attempts (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  problem_id uuid not null references problems (id) on delete cascade,
  status text not null check (status in ('pass', 'fail')),
  ai_feedback text,
  created_at timestamptz not null default now()
);

create index if not exists user_attempts_problem_idx on user_attempts (problem_id);
create index if not exists user_attempts_session_idx on user_attempts (session_id);

-- Row Level Security
-- All writes (problems CRUD, attempt inserts) go through Next.js API routes using
-- the service role key, which bypasses RLS entirely. Only a public read policy on
-- `problems` is needed for the client to list/read problems directly.
alter table problems enable row level security;
alter table user_attempts enable row level security;

drop policy if exists "Public can read problems" on problems;
create policy "Public can read problems"
  on problems for select
  to anon, authenticated
  using (true);

-- No policies on user_attempts for anon/authenticated: all access is via the
-- service-role server client in API routes (admin stats, attempt recording).
