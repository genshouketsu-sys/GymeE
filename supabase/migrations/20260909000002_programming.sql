-- Programming: the exercise library and how a coach builds a plan out of it.
-- Note the split that matters later: workout_exercises stores the *target*
-- (planned) sets/reps/weight; execution's set_logs stores what *actually* happened.

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations (id) on delete cascade, -- null = shared global library
  name text not null,
  muscle_group text,
  equipment text,
  media_url text,
  instructions text,
  created_at timestamptz not null default now()
);
create index exercises_org_id_idx on public.exercises (org_id);

create table public.training_plans (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.users (id) on delete cascade,
  coach_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  start_date date,
  end_date date,
  status text not null default 'active' check (status in ('draft', 'active', 'completed', 'archived')),
  created_at timestamptz not null default now()
);
create index training_plans_member_id_idx on public.training_plans (member_id);
create index training_plans_coach_id_idx on public.training_plans (coach_id);

create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.training_plans (id) on delete cascade,
  name text not null,
  scheduled_date date,
  order_index int not null default 0
);
create index workouts_plan_id_idx on public.workouts (plan_id);

create table public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id),
  order_index int not null default 0,
  target_sets int,
  target_reps int,
  target_weight_kg numeric(6, 2),
  rest_seconds int,
  notes text
);
create index workout_exercises_workout_id_idx on public.workout_exercises (workout_id);
create index workout_exercises_exercise_id_idx on public.workout_exercises (exercise_id);

alter table public.exercises enable row level security;
alter table public.training_plans enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_exercises enable row level security;

create policy "read exercise library (org + global)" on public.exercises
  for select using (org_id is null or org_id = public.current_org());

create policy "coach adds exercises to their org" on public.exercises
  for insert with check (public.current_role() = 'coach' and org_id = public.current_org());

create policy "coach updates own org exercises" on public.exercises
  for update using (public.current_role() = 'coach' and org_id = public.current_org())
  with check (org_id = public.current_org());

create policy "member/coach read own training plans" on public.training_plans
  for select using (member_id = auth.uid() or coach_id = auth.uid());

create policy "coach manages plans for their members" on public.training_plans
  for all using (coach_id = auth.uid()) with check (coach_id = auth.uid());

create policy "member/coach read own workouts" on public.workouts
  for select using (
    exists (
      select 1 from public.training_plans p
      where p.id = workouts.plan_id and (p.member_id = auth.uid() or p.coach_id = auth.uid())
    )
  );

create policy "coach manages workouts on their plans" on public.workouts
  for all using (
    exists (select 1 from public.training_plans p where p.id = workouts.plan_id and p.coach_id = auth.uid())
  ) with check (
    exists (select 1 from public.training_plans p where p.id = workouts.plan_id and p.coach_id = auth.uid())
  );

create policy "member/coach read own workout_exercises" on public.workout_exercises
  for select using (
    exists (
      select 1 from public.workouts w
      join public.training_plans p on p.id = w.plan_id
      where w.id = workout_exercises.workout_id and (p.member_id = auth.uid() or p.coach_id = auth.uid())
    )
  );

create policy "coach manages workout_exercises on their plans" on public.workout_exercises
  for all using (
    exists (
      select 1 from public.workouts w
      join public.training_plans p on p.id = w.plan_id
      where w.id = workout_exercises.workout_id and p.coach_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.workouts w
      join public.training_plans p on p.id = w.plan_id
      where w.id = workout_exercises.workout_id and p.coach_id = auth.uid()
    )
  );
