-- Identity & tenancy: organizations, users (extends Supabase auth.users),
-- coach/member profiles. See the "Gyme 后端蓝图" design doc for rationale.

create extension if not exists pgcrypto;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timezone text not null default 'Asia/Tokyo',
  locale text not null default 'ja',
  plan text not null default 'trial',
  created_at timestamptz not null default now()
);

create type public.user_role as enum ('org_admin', 'coach', 'member');

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  org_id uuid references public.organizations (id) on delete set null,
  email text not null,
  phone text,
  role public.user_role not null,
  display_name text not null,
  avatar_url text,
  status text not null default 'active' check (status in ('invited', 'active', 'suspended')),
  created_at timestamptz not null default now()
);
create index users_org_id_idx on public.users (org_id);

create table public.coach_profiles (
  user_id uuid primary key references public.users (id) on delete cascade,
  bio text,
  specialties text[] not null default '{}',
  certifications jsonb not null default '[]'
);

create table public.member_profiles (
  user_id uuid primary key references public.users (id) on delete cascade,
  coach_id uuid references public.users (id) on delete set null,
  birth_date date,
  gender text,
  height_cm numeric(5, 1),
  goals text,
  medical_notes text,
  joined_at timestamptz not null default now(),
  membership_status text not null default 'active' check (membership_status in ('active', 'paused', 'ended'))
);
create index member_profiles_coach_id_idx on public.member_profiles (coach_id);

-- Bridge Supabase Auth -> our own users table. New sign-ups default to 'member';
-- invite a coach/org_admin by setting raw_user_meta_data.role when creating the auth user.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, role, display_name)
  values (
    new.id,
    new.email,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'member'),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Small read-only helpers so RLS policies (here and in every later migration)
-- stay readable instead of repeating this subquery in every policy.
--
-- security definer is not optional here: these are used inside public.users's
-- own select policies, so without it the policy check on public.users would
-- recursively re-trigger RLS on public.users to evaluate the same policy,
-- which Postgres cannot resolve. security definer runs the lookup as the
-- function owner, bypassing RLS for just this one lookup, before the outer
-- policy check continues.
create or replace function public.current_role()
returns public.user_role
language sql stable security definer set search_path = public
as $$ select role from public.users where id = auth.uid() $$;

create or replace function public.current_org()
returns uuid
language sql stable security definer set search_path = public
as $$ select org_id from public.users where id = auth.uid() $$;

alter table public.organizations enable row level security;
alter table public.users enable row level security;
alter table public.coach_profiles enable row level security;
alter table public.member_profiles enable row level security;

create policy "read own organization" on public.organizations
  for select using (id = public.current_org());

create policy "read own user row" on public.users
  for select using (id = auth.uid());

create policy "coach/org_admin read same-org users" on public.users
  for select using (public.current_role() in ('coach', 'org_admin') and org_id = public.current_org());

create policy "org_admin manages same-org users" on public.users
  for update using (public.current_role() = 'org_admin' and org_id = public.current_org())
  with check (public.current_role() = 'org_admin' and org_id = public.current_org());

create policy "read own coach profile" on public.coach_profiles
  for select using (user_id = auth.uid());

create policy "members read their assigned coach's profile" on public.coach_profiles
  for select using (
    exists (
      select 1 from public.member_profiles mp
      where mp.user_id = auth.uid() and mp.coach_id = coach_profiles.user_id
    )
  );

create policy "coach manages own coach profile" on public.coach_profiles
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "org_admin creates coach profiles" on public.coach_profiles
  for insert with check (public.current_role() = 'org_admin');

create policy "member reads own profile" on public.member_profiles
  for select using (user_id = auth.uid());

create policy "member updates own profile" on public.member_profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "coach reads assigned members" on public.member_profiles
  for select using (coach_id = auth.uid());

create policy "coach updates assigned members" on public.member_profiles
  for update using (coach_id = auth.uid()) with check (coach_id = auth.uid());

create policy "coach/org_admin create member profiles in their org" on public.member_profiles
  for insert with check (
    public.current_role() in ('coach', 'org_admin')
    and exists (
      select 1 from public.users u
      where u.id = member_profiles.user_id and u.org_id = public.current_org()
    )
  );
