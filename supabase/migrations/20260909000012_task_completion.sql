-- 0011 let a coach assign a task (a coach_task notification) to their
-- member, but the connection only ran one way: the member had no way to
-- signal they'd done it, and the coach had no way to read any notification
-- addressed to their member at all (only the recipient could, via
-- "user reads own notifications") -- so even if the member somehow marked
-- it done, the coach could never see that. Closing the loop needs both a
-- place to record completion and a way for the coach to read it back.
alter table public.notifications add column completed_at timestamptz;

-- Scoped to type = 'coach_task' specifically, not every notification --
-- this should not also hand the coach read access to e.g. session_reminder
-- rows they have no reason to see.
create policy "coach reads tasks they assigned to their own member" on public.notifications
  for select using (
    type = 'coach_task'
    and exists (
      select 1 from public.member_profiles mp
      where mp.user_id = notifications.user_id and mp.coach_id = auth.uid()
    )
  );

-- The member marking their own task complete already works through the
-- existing "user marks own notifications read" policy (user_id = auth.uid(),
-- no column restriction) -- no new policy needed for that direction.
