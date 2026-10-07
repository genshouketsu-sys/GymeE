-- The coach could see a completed task, but only by reopening that
-- member's detail dialog and looking -- there was no push in the other
-- direction at all. Mirrors 0011 (coach -> member) but the other way:
-- a member may notify only their own coach, scoped through member_profiles
-- exactly like "coach assigns a task to their own member" is.
create policy "member notifies their own coach" on public.notifications
  for insert
  with check (
    exists (
      select 1 from public.member_profiles mp
      where mp.user_id = auth.uid() and mp.coach_id = notifications.user_id
    )
  );
