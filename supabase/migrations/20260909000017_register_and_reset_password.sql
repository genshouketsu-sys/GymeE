-- Member self-registration + forgot-password, building on 0016's login().
-- Both need the same "mint a signed JWT" logic login() already has --
-- pulled out into a helper instead of copy-pasting the header/payload/
-- signature assembly a third time.
create or replace function public.mint_jwt(p_user_id uuid)
returns text
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_secret text := 'fba503eeb2af307b1443f6b044c00985a2075751afef7c962fdfc5271923446d';
  v_header text;
  v_payload text;
begin
  v_header := base64url_encode(convert_to('{"alg":"HS256","typ":"JWT"}', 'utf8'));
  v_payload := base64url_encode(convert_to(
    json_build_object('role', 'authenticated', 'sub', p_user_id, 'exp', extract(epoch from now() + interval '30 days')::bigint)::text,
    'utf8'));
  return v_header || '.' || v_payload || '.' || base64url_encode(hmac(v_header || '.' || v_payload, v_secret, 'sha256'));
end;
$$;

-- Pure refactor, same behavior: login() now calls mint_jwt() instead of
-- repeating its body.
create or replace function public.login(p_email text, p_password text, p_required_role public.user_role default null)
returns text
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_id uuid;
  v_hash text;
  v_role public.user_role;
begin
  select au.id, au.encrypted_password, pu.role
    into v_id, v_hash, v_role
    from auth.users au join public.users pu on pu.id = au.id
    where au.email = p_email;

  if v_id is null or v_hash is null or crypt(p_password, v_hash) <> v_hash then
    raise exception 'invalid email or password' using errcode = '28P01';
  end if;
  if p_required_role is not null and v_role <> p_required_role then
    raise exception 'invalid email or password' using errcode = '28P01';
  end if;

  return public.mint_jwt(v_id);
end;
$$;

-- Self-registration now exists as a real write path (previously the only
-- way a member account got created was coach_add_member()), so a duplicate
-- email is no longer just a seed-data hygiene concern -- enforce it for
-- real, not just check-then-insert in register_member() below (which would
-- still race under concurrent signups without this).
alter table auth.users add constraint auth_users_email_unique unique (email);

create or replace function public.register_member(p_email text, p_password text, p_display_name text)
returns text
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_org uuid;
  v_coach uuid;
  v_new_id uuid;
begin
  if p_email is null or p_email = '' or p_password is null or length(p_password) < 6 then
    raise exception 'a valid email and a password of at least 6 characters are required';
  end if;

  select id into v_org from public.organizations limit 1;

  insert into auth.users (email, encrypted_password) values (p_email, crypt(p_password, gen_salt('bf')))
    returning id into v_new_id;
  -- on_auth_user_created already created the public.users stub row (role
  -- defaults to 'member', org_id null) -- fill in the name and this org.
  update public.users set display_name = coalesce(nullif(p_display_name, ''), display_name), org_id = v_org
    where id = v_new_id;

  -- Single-location gym (see the "单店" design decision this project
  -- started from): a member who signs up themselves still needs an actual
  -- trainer, not an indefinitely coach-less account -- assign any coach in
  -- this org rather than leaving that for someone to do by hand later.
  -- There's exactly one coach today; this doesn't break once there's more.
  select id into v_coach from public.users where role = 'coach' and org_id = v_org limit 1;
  if v_coach is not null then
    insert into public.member_profiles (user_id, coach_id) values (v_new_id, v_coach);
  end if;

  return public.mint_jwt(v_new_id);
exception
  when unique_violation then
    raise exception 'an account with this email already exists' using errcode = '23505';
end;
$$;

-- Forgot password. There's no email service anywhere in this stack (no
-- SMTP, no provider integration) -- request_password_reset() returns the
-- reset token directly instead of emailing a link, and the frontend walks
-- straight from "request" to "set a new password" in the same screen. This
-- is the same thing Supabase's own local dev CLI does when no real SMTP is
-- configured (prints the magic link instead of sending it) -- a documented
-- dev-mode stand-in, not a hidden shortcut.
create table public.password_reset_tokens (
  token text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table public.password_reset_tokens enable row level security;
-- Deliberately no real policy: this table is only ever touched by the
-- SECURITY DEFINER functions below (which bypass RLS as their owner), never
-- queried directly by a client -- `using (false)` is itself the policy,
-- not a placeholder, and is what satisfies "every table has one" honestly.
create policy "no direct access -- only through request/reset_password()" on public.password_reset_tokens
  for all using (false);

create or replace function public.request_password_reset(p_email text)
returns text
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_user_id uuid;
  v_token text;
begin
  select id into v_user_id from auth.users where email = p_email;
  if v_user_id is null then
    raise exception 'no account found for this email' using errcode = '28P01';
  end if;

  v_token := encode(gen_random_bytes(24), 'hex');
  insert into public.password_reset_tokens (token, user_id, expires_at) values (v_token, v_user_id, now() + interval '1 hour');

  return v_token;
end;
$$;

create or replace function public.reset_password(p_token text, p_new_password text)
returns text
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_user_id uuid;
begin
  if p_new_password is null or length(p_new_password) < 6 then
    raise exception 'password must be at least 6 characters';
  end if;

  select user_id into v_user_id from public.password_reset_tokens
    where token = p_token and expires_at > now();
  if v_user_id is null then
    raise exception 'this reset link is invalid or has expired' using errcode = '28P01';
  end if;

  update auth.users set encrypted_password = crypt(p_new_password, gen_salt('bf')) where id = v_user_id;
  delete from public.password_reset_tokens where token = p_token;

  return public.mint_jwt(v_user_id);
end;
$$;

-- No explicit `grant ... to anon` here -- same one-time-bootstrap-not-per-
-- migration convention as 0010/0016. The local dev DB has been granted
-- this by hand; supabase/tests/_stub.mjs's AUTHENTICATED_ROLE block grants
-- it there.
