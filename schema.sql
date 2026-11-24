-- ============================================================
-- GRAMMARIN - Supabase Schema + RLS Policies
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Grammar lessons table
create table public.grammars (
  id uuid primary key default uuid_generate_v4(),
  order_number integer not null unique,
  title text not null,                     -- e.g. "是…的 (shì…de)"
  pinyin text not null,                    -- e.g. "shì…de"
  hsk_level integer not null default 2,
  category text not null,                  -- e.g. "Emphasis", "Time", "Comparison"
  short_description text not null,
  explanation jsonb not null,              -- structured explanation blocks
  created_at timestamptz default now()
);

-- Quiz questions for each grammar
create table public.quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  grammar_id uuid not null references public.grammars(id) on delete cascade,
  question_number integer not null,        -- 1, 2, 3
  words text[] not null,                   -- array of draggable words
  correct_answer text not null,            -- the correct sentence
  hint text,
  created_at timestamptz default now(),
  unique(grammar_id, question_number)
);

-- User progress tracking
create table public.user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  grammar_id uuid not null references public.grammars(id) on delete cascade,
  is_learn_completed boolean default false,
  quiz_question_1_completed boolean default false,
  quiz_question_2_completed boolean default false,
  quiz_question_3_completed boolean default false,
  quiz_completed boolean default false,
  started_at timestamptz default now(),
  completed_at timestamptz,
  updated_at timestamptz default now(),
  unique(user_id, grammar_id)
);

-- User profiles (extended from auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  total_grammars_completed integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_user_progress_user_id on public.user_progress(user_id);
create index idx_user_progress_grammar_id on public.user_progress(grammar_id);
create index idx_quiz_questions_grammar_id on public.quiz_questions(grammar_id);
create index idx_grammars_order on public.grammars(order_number);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Update total grammars completed count
create or replace function public.update_grammar_count()
returns trigger as $$
begin
  if new.quiz_completed = true and old.quiz_completed = false then
    update public.profiles
    set total_grammars_completed = total_grammars_completed + 1
    where id = new.user_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- ============================================================
-- TRIGGERS
-- ============================================================

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger on_user_progress_updated
  before update on public.user_progress
  for each row execute function public.handle_updated_at();

create trigger on_quiz_completed
  after update on public.user_progress
  for each row execute function public.update_grammar_count();

create trigger on_profile_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
alter table public.grammars enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.user_progress enable row level security;
alter table public.profiles enable row level security;

-- GRAMMARS: public read, admin write
create policy "Anyone can read grammars"
  on public.grammars for select
  using (true);

create policy "Only service role can insert grammars"
  on public.grammars for insert
  with check (auth.role() = 'service_role');

create policy "Only service role can update grammars"
  on public.grammars for update
  using (auth.role() = 'service_role');

-- QUIZ QUESTIONS: public read, admin write
create policy "Anyone can read quiz questions"
  on public.quiz_questions for select
  using (true);

create policy "Only service role can insert quiz questions"
  on public.quiz_questions for insert
  with check (auth.role() = 'service_role');

-- USER PROGRESS: users manage their own data
create policy "Users can read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

-- PROFILES: users read/update their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);