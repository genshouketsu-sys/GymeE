-- Every session so far has been a hardcoded JWT baked into app.js at build
-- time -- there was never an actual login. auth.users (the local dev stub;
-- see supabase/tests/_stub.mjs for the identical shape used in tests) has
-- no password field at all, and nothing here can mint a JWT except
-- Postgres itself (there's no separate auth server in this stack), so a
-- real login has to happen as a SQL function: verify a password with
-- pgcrypto, then hand-assemble and HMAC-sign a JWT using the same secret
-- PostgREST itself is configured with (postgrest.conf's jwt-secret).
alter table auth.users add column if not exists encrypted_password text;

-- encode(bytea, 'base64') wraps its output at 76 chars with embedded
-- newlines (RFC 2045 MIME-style), not the single-line base64url a JWT
-- segment needs -- a raw newline inside a token breaks it the moment it's
-- sent in an Authorization header. Strip whitespace before the
-- base64 -> base64url translation, not after (translate/rtrim don't touch
-- \n since it's neither in '+/' nor '=').
create or replace function public.base64url_encode(data bytea)
returns text
language sql immutable
as $$
  select rtrim(translate(replace(encode(data, 'base64'), chr(10), ''), '+/', '-_'), '=')
$$;

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
  -- Dev-only secret, matching postgrest.conf's jwt-secret verbatim -- there
  -- is no secrets manager in this local stack, same as DEV_JWT was already
  -- a hardcoded token committed to the frontend before this migration.
  v_secret text := 'fba503eeb2af307b1443f6b044c00985a2075751afef7c962fdfc5271923446d';
  v_header text;
  v_payload text;
  v_signature text;
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

  v_header := base64url_encode(convert_to('{"alg":"HS256","typ":"JWT"}', 'utf8'));
  v_payload := base64url_encode(convert_to(
    json_build_object('role', 'authenticated', 'sub', v_id, 'exp', extract(epoch from now() + interval '30 days')::bigint)::text,
    'utf8'));
  v_signature := base64url_encode(hmac(v_header || '.' || v_payload, v_secret, 'sha256'));

  return v_header || '.' || v_payload || '.' || v_signature;
end;
$$;

-- No explicit `grant ... to anon` here: like every other function in this
-- codebase, role grants are a one-time bootstrap step run after migrations,
-- not per-migration (see 0010's note, and supabase/tests/_stub.mjs's
-- AUTHENTICATED_ROLE block, which grants this function to anon there).
-- The local dev DB has been granted this by hand to match. This one is
-- unusual only in that anon (not authenticated) is the role that needs it,
-- since whoever calls it isn't logged in yet.
