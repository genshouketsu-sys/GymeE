-- Fix: migration 0001 added "members read their assigned coach's profile"
-- on coach_profiles, but never the matching policy on users itself -- a
-- member had no way to read their own coach's display_name (or any other
-- users column). Invisible until something actually needed to show the
-- coach's name to a member; the chat header does.
create policy "member reads their coach's user row" on public.users
  for select using (
    exists (
      select 1 from public.member_profiles mp
      where mp.user_id = auth.uid() and mp.coach_id = users.id
    )
  );
