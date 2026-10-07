-- nutrition_targets had no uniqueness guarantee on (member_id,
-- effective_date) -- seed.sql worked around it with a fixed row id, but
-- nothing stopped a real write path (the coach's new "set nutrition
-- targets" feature) from creating another row for the same member/day,
-- making "the member's current target" ambiguous: a plain
-- `order by effective_date desc limit 1` has no defined winner among ties,
-- so two different reads of "today's target" could disagree.
--
-- Clean up whatever duplicates already accumulated (keep one row per
-- member/day, arbitrarily by id -- these are targets, not history, so which
-- physical row survives doesn't matter) before the constraint can be added.
delete from public.nutrition_targets a
using public.nutrition_targets b
where a.member_id = b.member_id
  and a.effective_date = b.effective_date
  and a.id > b.id;

alter table public.nutrition_targets
  add constraint nutrition_targets_member_date_unique unique (member_id, effective_date);
