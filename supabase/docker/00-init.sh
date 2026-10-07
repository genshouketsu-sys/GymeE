#!/bin/bash
# The only file Postgres's own init mechanism auto-discovers (it scans
# /docker-entrypoint-initdb.d/*.sql and *.sh, non-recursively, in name
# order) -- everything else it needs is mounted under /docker-init/
# instead, specifically so it is NOT auto-run a second time by that scan.
set -euo pipefail

run_sql() {
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$1"
}

echo "[gyme-init] bootstrapping auth schema, roles, grants..."
psql -v ON_ERROR_STOP=1 -v authenticator_password="${AUTHENTICATOR_PASSWORD:-gymedev}" \
  --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f /docker-init/01-auth-and-roles.sql

echo "[gyme-init] applying migrations..."
for f in /docker-init/migrations/*.sql; do
  echo "[gyme-init]   $(basename "$f")"
  run_sql "$f"
done

echo "[gyme-init] granting anon access to the pre-auth RPCs (login/register/reset only exist now that migrations have run)..."
run_sql /docker-init/02-post-migration-grants.sql

echo "[gyme-init] loading seed data..."
run_sql /docker-init/seed.sql

echo "[gyme-init] done."
