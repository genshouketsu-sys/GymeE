-- The coach's "タスクを割り当てる" (assign a task) button sends the member a
-- notification -- but public.notifications has no INSERT policy at all
-- today (every seeded row was written directly by seed.sql as superuser,
-- bypassing RLS). Without this, the button would 403 the moment a real
-- coach pressed it.
--
-- Scoped the same way "coach starts a conversation with their member"
-- already scopes conversations: the coach may only address a notification
-- to a user_id that is actually one of their own members.
create policy "coach assigns a task to their own member" on public.notifications
  for insert
  with check (
    exists (
      select 1 from public.member_profiles mp
      where mp.user_id = notifications.user_id and mp.coach_id = auth.uid()
    )
  );
