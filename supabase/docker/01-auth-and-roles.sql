-- Bootstraps what a real Supabase project provides automatically (the
-- `auth` schema, and the anon/authenticated/authenticator roles PostgREST
-- switches between per-request) -- this stack has no real Supabase, just
-- plain Postgres, so migrations/0001 onward assume this already exists,
-- the same way it assumes it on supabase.com.
--
-- This file mirrors, verbatim, what was applied by hand to the project's
-- local (non-Docker) dev database across auth_stub.sql, auth_uid_fix.sql
-- and grants.sql -- consolidated here as the single source of truth for a
-- from-scratch database, Docker or not.
create schema if not exists auth;
create table auth.users (
  id uuid primary key default gen_random_uuid(),
  email text,
  encrypted_password text,
  raw_user_meta_data jsonb not null default '{}'
);
create extension if not exists pgcrypto;
create publication supabase_realtime;

-- Real Supabase's auth.uid() reads the `sub` claim PostgREST puts in the
-- request.jwt.claims GUC from the caller's JWT.
create or replace function auth.uid() returns uuid
language sql stable
as $$
  select
    coalesce(
      nullif(current_setting('request.jwt.claim.sub', true), ''),
      (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
$$;

-- The role PostgREST assumes for a request with no (or an invalid) JWT.
create role anon nologin;
grant usage on schema public to anon;
grant usage on schema auth to anon;

-- The role PostgREST assumes for a request with a valid JWT (role claim
-- "authenticated"). Table-level grants here are what makes every RLS
-- policy in migrations/ meaningful at all -- RLS restricts rows, but this
-- role still needs the underlying SQL privilege to touch the table.
create role authenticated nologin;
grant usage on schema auth to authenticated;
grant execute on all functions in schema auth to authenticated;
grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant execute on all functions in schema public to authenticated;

-- The actual DB role PostgREST's own connection (db-uri) authenticates as;
-- it then switches to anon/authenticated per-request via `set role`, which
-- is why it needs both granted to it, not because it uses them directly.
create role authenticator noinherit login password :'authenticator_password';
grant anon to authenticator;
grant authenticated to authenticator;
