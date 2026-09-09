// Applies every migration to a fresh database and checks the result is sane:
// every table landed, and -- the one mistake that's easy to make and easy to
// miss in review -- every table actually has row level security turned on.
import { freshDb } from './_stub.mjs';

const main = async () => {
  const { db, files } = await freshDb();
  console.log(`applied ${files.length} migrations cleanly:\n  ` + files.join('\n  '));

  const tables = await db.query(
    `select table_name from information_schema.tables where table_schema = 'public' order by table_name`
  );
  console.log(`\n${tables.rows.length} public tables: ` + tables.rows.map((r) => r.table_name).join(', '));

  const rlsOff = await db.query(`
    select c.relname from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity = false
  `);
  if (rlsOff.rows.length) {
    console.log('\nFAIL: tables without row level security enabled: ' + rlsOff.rows.map((r) => r.relname).join(', '));
    process.exitCode = 1;
    return;
  }
  console.log('\nPASS: every public table has row level security enabled.');

  const noPolicy = await db.query(`
    select c.relname from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    left join pg_policies p on p.schemaname = n.nspname and p.tablename = c.relname
    where n.nspname = 'public' and c.relkind = 'r'
    group by c.relname having count(p.policyname) = 0
  `);
  if (noPolicy.rows.length) {
    console.log('FAIL: tables with RLS enabled but zero policies (== nobody can read them at all): ' + noPolicy.rows.map((r) => r.relname).join(', '));
    process.exitCode = 1;
    return;
  }
  console.log('PASS: every public table has at least one policy.');
};

main().catch((e) => {
  console.error('SCHEMA TEST FAILED:', e.message);
  process.exitCode = 1;
});
