-- Coach<->member messaging and notifications. messages/notifications are added
-- to the supabase_realtime publication so Postgres's own WAL replication drives
-- the realtime channel described in the blueprint, instead of a hand-rolled
-- broadcast layer.

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.users (id) on delete cascade,
  member_id uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (coach_id, member_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.users (id),
  body text not null,
  attachment_url text,
  sent_at timestamptz not null default now(),
  read_at timestamptz
);
create index messages_conversation_id_idx on public.messages (conversation_id, sent_at);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_id_idx on public.notifications (user_id, created_at desc);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

alter publication supabase_realtime add table public.messages, public.notifications;

create policy "participants read own conversation" on public.conversations
  for select using (coach_id = auth.uid() or member_id = auth.uid());

create policy "coach starts a conversation with their member" on public.conversations
  for insert with check (
    coach_id = auth.uid()
    and exists (select 1 from public.member_profiles mp where mp.user_id = conversations.member_id and mp.coach_id = auth.uid())
  );

create policy "participants read own messages" on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id and (c.coach_id = auth.uid() or c.member_id = auth.uid())
    )
  );

create policy "participants send messages in own conversation" on public.messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id and (c.coach_id = auth.uid() or c.member_id = auth.uid())
    )
  );

create policy "recipient marks a message read" on public.messages
  for update using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id and (c.coach_id = auth.uid() or c.member_id = auth.uid())
    )
  ) with check (sender_id = messages.sender_id);

create policy "user reads own notifications" on public.notifications
  for select using (user_id = auth.uid());

create policy "user marks own notifications read" on public.notifications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
