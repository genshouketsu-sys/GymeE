-- Bug fix (code review): member/dist's home screen used to show a workout
-- duration ("52分") that had nowhere to come from once real data replaced
-- the hardcoded literal -- there was no duration field anywhere on
-- workouts. Add one instead of leaving that information silently dropped.
alter table public.workouts add column duration_min int;
