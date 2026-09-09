-- Execution: what actually happened in a session, as opposed to what was planned
-- (that's workout_exercises, from the previous migration). set_logs optionally
-- links back to the workout_exercise it was scored against.

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.users (id) on delete cascade,
  member_id uuid not null references public.users (id) on delete cascade,
  workout_id uuid references public.workouts (id) on delete set null,
  scheduled_at timestamptz not null,
  duration_min int not null default 60,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'checked_in', 'completed', 'cancelled', 'no_show')),
  location text,
  created_at timestamptz not null default now()
);
create index sessions_coach_id_idx on public.sessions (coach_id);
create index sessions_member_id_idx on public.sessions (member_id);
create index sessions_scheduled_at_idx on public.sessions (scheduled_at);

create table public.session_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.sessions (id) on delete cascade,
  started_at timestamptz,
  ended_at timestamptz,
  notes text
);

create table public.set_logs (
  id uuid primary key default gen_random_uuid(),
  session_log_id uuid not null references public.session_logs (id) on delete cascade,
  workout_exercise_id uuid references public.workout_exercises (id) on delete set null,
  set_number int not null,
  actual_reps int,
  actual_weight_kg numeric(6, 2),
  rpe numeric(3, 1),
  completed_at timestamptz not null default now()
);
create index set_logs_session_log_id_idx on public.set_logs (session_log_id);
create index set_logs_workout_exercise_id_idx on public.set_logs (workout_exercise_id);

alter table public.sessions enable row level security;
alter table public.session_logs enable row level security;
alter table public.set_logs enable row level security;

create policy "member/coach read own sessions" on public.sessions
  for select using (member_id = auth.uid() or coach_id = auth.uid());

create policy "coach manages own sessions" on public.sessions
  for all using (coach_id = auth.uid()) with check (coach_id = auth.uid());

create policy "member checks in to own session" on public.sessions
  for update using (member_id = auth.uid()) with check (member_id = auth.uid());

create policy "member/coach read own session logs" on public.session_logs
  for select using (
    exists (
      select 1 from public.sessions s
      where s.id = session_logs.session_id and (s.member_id = auth.uid() or s.coach_id = auth.uid())
    )
  );

create policy "coach manages session logs for own sessions" on public.session_logs
  for all using (
    exists (select 1 from public.sessions s where s.id = session_logs.session_id and s.coach_id = auth.uid())
  ) with check (
    exists (select 1 from public.sessions s where s.id = session_logs.session_id and s.coach_id = auth.uid())
  );

create policy "member/coach read own set logs" on public.set_logs
  for select using (
    exists (
      select 1 from public.session_logs sl
      join public.sessions s on s.id = sl.session_id
      where sl.id = set_logs.session_log_id and (s.member_id = auth.uid() or s.coach_id = auth.uid())
    )
  );

create policy "coach manages set logs for own sessions" on public.set_logs
  for all using (
    exists (
      select 1 from public.session_logs sl
      join public.sessions s on s.id = sl.session_id
      where sl.id = set_logs.session_log_id and s.coach_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.session_logs sl
      join public.sessions s on s.id = sl.session_id
      where sl.id = set_logs.session_log_id and s.coach_id = auth.uid()
    )
  );
