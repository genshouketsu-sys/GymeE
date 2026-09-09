// Minimal Supabase-shaped scaffolding so the migrations (which assume a real
// Supabase project's auth schema) can run against a plain local Postgres --
// here, an embedded WASM one via pglite, so these tests need no Docker/network.
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const migrationsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

const AUTH_STUB = `
create schema if not exists auth;
create table auth.users (
  id uuid primary key default gen_random_uuid(),
  email text,
  raw_user_meta_data jsonb not null default '{}'
);
create or replace function auth.uid() returns uuid language sql stable as $$
  select current_setting('request.jwt.claim.sub', true)::uuid
$$;
create extension if not exists pgcrypto;
create publication supabase_realtime;
`;

// Mirrors the grants Supabase's platform sets up automatically for the
// 'authenticated' role -- needed here because pglite's own session runs as
// the 'postgres' superuser, which bypasses RLS entirely and so cannot be
// used to test that RLS actually restricts anything.
const AUTHENTICATED_ROLE = `
create role authenticated nologin;
grant usage on schema auth to authenticated;
grant execute on all functions in schema auth to authenticated;
grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant execute on all functions in schema public to authenticated;
`;

export async function freshDb() {
  const db = new PGlite({ extensions: { pgcrypto } });
  await db.exec(AUTH_STUB);
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  for (const f of files) {
    await db.exec(fs.readFileSync(path.join(migrationsDir, f), 'utf8'));
  }
  await db.exec(AUTHENTICATED_ROLE);
  return { db, files };
}

// Runs `sql` as the given user id under the low-privilege 'authenticated'
// role, inside its own transaction (SET LOCAL + set_config(..., true) are
// both transaction-scoped, so nothing leaks into the next call -- this also
// mirrors how PostgREST scopes a single request in real Supabase).
export async function asUser(db, userId, sql) {
  const results = await db.exec(
    `begin; set local role authenticated; select set_config('request.jwt.claim.sub', '${userId}', true); ${sql}; commit;`
  );
  return results[3].rows;
}
