-- Every "act on a member" feature so far (assign task, set nutrition
-- targets, chat) assumes the member already exists in member_profiles --
-- there was no way to actually onboard a new one from the app.
--
-- A coach has no INSERT grant on auth.users or public.users (same as real
-- Supabase: an authenticated client can't create other users directly,
-- only an Admin API/service role can -- confirmed here by the complete
-- absence of any insert policy on public.users), so this has to go through
-- a narrow SECURITY DEFINER RPC rather than opening up those tables.
create or replace function public.coach_add_member(p_email text, p_display_name text)
returns public.users
language plpgsql security definer set search_path = public
as $$
declare
  v_coach_role public.user_role;
  v_coach_org uuid;
  v_new_id uuid;
  v_row public.users;
begin
  select role, org_id into v_coach_role, v_coach_org from public.users where id = auth.uid();
  if v_coach_role is null or v_coach_role not in ('coach', 'org_admin') then
    raise exception 'only a coach or org admin can add a member' using errcode = '42501';
  end if;
  if p_email is null or p_email = '' then
    raise exception 'email is required';
  end if;

  insert into auth.users (email) values (p_email) returning id into v_new_id;
  -- on_auth_user_created already created the public.users stub row (role
  -- defaults to 'member', org_id null since the trigger has no way to know
  -- it) -- fill in what the coach actually provided plus this org.
  update public.users
    set display_name = coalesce(nullif(p_display_name, ''), display_name),
        org_id = v_coach_org
    where id = v_new_id
    returning * into v_row;

  insert into public.member_profiles (user_id, coach_id) values (v_new_id, auth.uid());

  return v_row;
end;
$$;
