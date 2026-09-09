-- Membership plans and PT-session packages. Payments is included per the
-- blueprint's schema even though "handle payments in-app" is still an open
-- question — the table costs nothing to have unused, but there is
-- deliberately no insert/update policy for regular users: real payment writes
-- should go through a service-role webhook handler (see the blueprint's
-- /webhooks/payments/:provider), never directly from a client.

create table public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  session_count int,
  duration_days int,
  price_cents int not null,
  currency text not null default 'JPY'
);
create index membership_plans_org_id_idx on public.membership_plans (org_id);

create table public.member_subscriptions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.users (id) on delete cascade,
  plan_id uuid not null references public.membership_plans (id),
  sessions_remaining int,
  purchased_at timestamptz not null default now(),
  expires_at timestamptz,
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled'))
);
create index member_subscriptions_member_id_idx on public.member_subscriptions (member_id);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.member_subscriptions (id) on delete cascade,
  amount_cents int not null,
  currency text not null default 'JPY',
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed', 'refunded')),
  provider text,
  provider_ref text,
  created_at timestamptz not null default now()
);
create index payments_subscription_id_idx on public.payments (subscription_id);

alter table public.membership_plans enable row level security;
alter table public.member_subscriptions enable row level security;
alter table public.payments enable row level security;

create policy "read plans in own org" on public.membership_plans
  for select using (org_id = public.current_org());

create policy "member/coach read own subscriptions" on public.member_subscriptions
  for select using (
    member_id = auth.uid()
    or exists (select 1 from public.member_profiles mp where mp.user_id = member_subscriptions.member_id and mp.coach_id = auth.uid())
  );

create policy "member/coach read own payments" on public.payments
  for select using (
    exists (
      select 1 from public.member_subscriptions ms
      where ms.id = payments.subscription_id
        and (
          ms.member_id = auth.uid()
          or exists (select 1 from public.member_profiles mp where mp.user_id = ms.member_id and mp.coach_id = auth.uid())
        )
    )
  );
