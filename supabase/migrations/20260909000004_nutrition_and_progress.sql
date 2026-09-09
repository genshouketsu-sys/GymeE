-- Nutrition & progress tracking. All member-authored; the coach only gets read
-- access, and for progress photos only when the member explicitly shares one.

create table public.nutrition_targets (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.users (id) on delete cascade,
  calories int,
  protein_g int,
  carbs_g int,
  fat_g int,
  effective_date date not null default current_date
);
create index nutrition_targets_member_id_idx on public.nutrition_targets (member_id);

create table public.meal_logs (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.users (id) on delete cascade,
  logged_at timestamptz not null default now(),
  description text,
  photo_url text,
  calories int,
  protein_g int,
  carbs_g int,
  fat_g int
);
create index meal_logs_member_id_idx on public.meal_logs (member_id);

create table public.body_metrics (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.users (id) on delete cascade,
  recorded_at timestamptz not null default now(),
  weight_kg numeric(5, 1),
  body_fat_pct numeric(4, 1),
  custom jsonb not null default '{}'
);
create index body_metrics_member_id_idx on public.body_metrics (member_id);

create table public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.users (id) on delete cascade,
  taken_at timestamptz not null default now(),
  photo_url text not null,
  angle text check (angle in ('front', 'side', 'back')),
  visibility text not null default 'private' check (visibility in ('private', 'shared_with_coach'))
);
create index progress_photos_member_id_idx on public.progress_photos (member_id);

alter table public.nutrition_targets enable row level security;
alter table public.meal_logs enable row level security;
alter table public.body_metrics enable row level security;
alter table public.progress_photos enable row level security;

create policy "member reads own nutrition targets" on public.nutrition_targets
  for select using (member_id = auth.uid());

create policy "coach reads/sets targets for their members" on public.nutrition_targets
  for all using (
    exists (select 1 from public.member_profiles mp where mp.user_id = nutrition_targets.member_id and mp.coach_id = auth.uid())
  ) with check (
    exists (select 1 from public.member_profiles mp where mp.user_id = nutrition_targets.member_id and mp.coach_id = auth.uid())
  );

create policy "member manages own meal logs" on public.meal_logs
  for all using (member_id = auth.uid()) with check (member_id = auth.uid());

create policy "coach reads their members' meal logs" on public.meal_logs
  for select using (
    exists (select 1 from public.member_profiles mp where mp.user_id = meal_logs.member_id and mp.coach_id = auth.uid())
  );

create policy "member manages own body metrics" on public.body_metrics
  for all using (member_id = auth.uid()) with check (member_id = auth.uid());

create policy "coach reads their members' body metrics" on public.body_metrics
  for select using (
    exists (select 1 from public.member_profiles mp where mp.user_id = body_metrics.member_id and mp.coach_id = auth.uid())
  );

create policy "member manages own progress photos" on public.progress_photos
  for all using (member_id = auth.uid()) with check (member_id = auth.uid());

create policy "coach reads only progress photos shared with them" on public.progress_photos
  for select using (
    visibility = 'shared_with_coach'
    and exists (select 1 from public.member_profiles mp where mp.user_id = progress_photos.member_id and mp.coach_id = auth.uid())
  );
