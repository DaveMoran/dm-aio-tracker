-- Tasks: the fixed list of AM/PM recurring daily tasks
create table if not exists tasks (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  period      text not null check (period in ('AM', 'PM')),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Task completions: one row per task per calendar date when completed
create table if not exists task_completions (
  id           uuid primary key default gen_random_uuid(),
  task_id      uuid not null references tasks(id) on delete cascade,
  date         date not null,
  completed_at timestamptz not null default now(),
  unique (task_id, date)
);

-- Indexes for common queries
create index if not exists task_completions_date_idx on task_completions (date);

-- Enable Row Level Security (configure policies to match your auth strategy)
alter table tasks enable row level security;
alter table task_completions enable row level security;

-- Permissive policies for personal use (single user, no auth required)
-- Replace with user-scoped policies when you add authentication
create policy "allow_all_tasks" on tasks for all using (true) with check (true);
create policy "allow_all_completions" on task_completions for all using (true) with check (true);

-- Seed default task list
insert into tasks (name, period, sort_order) values
  ('Hydrate (16oz water)',       'AM', 1),
  ('Morning stretch / movement', 'AM', 2),
  ('Healthy breakfast',          'AM', 3),
  ('Journal / set intentions',   'AM', 4),
  ('Review goals for the day',   'AM', 5),
  ('Meditate (5 min)',           'AM', 6),
  ('Evening walk',               'PM', 1),
  ('Gratitude journal',          'PM', 2),
  ('Read (30 min)',              'PM', 3),
  ('Prep for tomorrow',          'PM', 4),
  ('Screen-free wind down',      'PM', 5),
  ('In bed by target time',      'PM', 6)
on conflict do nothing;
