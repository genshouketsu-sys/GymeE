-- The member's home screen "開始" button starts a workout the member is
-- doing right now -- record when they actually pressed it (day + time),
-- not just flip a client-side flag with nothing persisted.
--
-- Members have no INSERT/UPDATE grant on session_logs today (only coaches
-- do, via "coach manages session logs for own sessions"). A raw grant would
-- also let a member's UPDATE rewrite the coach's own notes/ended_at on that
-- same row. A narrow SECURITY DEFINER RPC is the standard fix instead: it
-- only ever touches started_at, verifies the session actually belongs to
-- the caller, and needs no new table-level RLS policy.
create or replace function public.start_my_session(p_session_id uuid)
returns public.session_logs
language plpgsql security definer set search_path = public
as $$
declare
  v_member_id uuid;
  v_row public.session_logs;
begin
  select member_id into v_member_id from public.sessions where id = p_session_id;
  if v_member_id is null or v_member_id <> auth.uid() then
    raise exception 'not your session' using errcode = '42501';
  end if;

  insert into public.session_logs (session_id, started_at)
  values (p_session_id, now())
  on conflict (session_id) do update set started_at = excluded.started_at
  returning * into v_row;

  return v_row;
end;
$$;

-- No explicit `grant ... to authenticated` here: this codebase (like real
-- Supabase) hands out that role's broad "execute on all functions in
-- schema public" grant as a one-time bootstrap step run after migrations,
-- not per-migration -- see the pglite test stub's AUTHENTICATED_ROLE block
-- (supabase/tests/_stub.mjs), which already covers any function a migration
-- defines. The local dev DB has been granted this by hand to match.
