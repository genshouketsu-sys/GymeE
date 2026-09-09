// Seeds a realistic multi-coach, multi-member scenario and checks the access
// control matrix the blueprint promises actually holds: a coach sees only
// their own members, a member sees only themselves, and a progress photo
// stays private unless the member explicitly shared it.
//
// This is here because RLS bugs are exactly the kind that a schema-only
// smoke test (schema.test.mjs) cannot catch: the SQL is valid, RLS is
// "enabled", and it still leaks data if a policy's USING clause is wrong.
import { freshDb, asUser } from './_stub.mjs';

const ORG = '00000000-0000-0000-0000-000000000001';
const KENTA = '00000000-0000-0000-0000-0000000000a1'; // coach
const OTHER_COACH = '00000000-0000-0000-0000-0000000000a2';
const TANAKA = '00000000-0000-0000-0000-0000000000b1'; // member, coached by Kenta
const SATO = '00000000-0000-0000-0000-0000000000b2'; // member, coached by Kenta
const OTHERS_MEMBER = '00000000-0000-0000-0000-0000000000b3'; // member, coached by Other Coach

const seed = `
  insert into public.organizations (id, name) values ('${ORG}', 'Gyme 渋谷店');

  insert into auth.users (id, email) values
    ('${KENTA}', 'kenta@gyme.jp'),
    ('${OTHER_COACH}', 'other-coach@gyme.jp'),
    ('${TANAKA}', 'tanaka@example.com'),
    ('${SATO}', 'sato@example.com'),
    ('${OTHERS_MEMBER}', 'other-coachs-member@example.com');

  -- the on_auth_user_created trigger already created stub public.users rows
  -- (role defaulted to 'member') the instant auth.users was seeded above --
  -- that alone confirms the trigger works. Upsert the real test values.
  insert into public.users (id, org_id, email, role, display_name) values
    ('${KENTA}', '${ORG}', 'kenta@gyme.jp', 'coach', '健太'),
    ('${OTHER_COACH}', '${ORG}', 'other-coach@gyme.jp', 'coach', '別のコーチ'),
    ('${TANAKA}', '${ORG}', 'tanaka@example.com', 'member', '田中 健'),
    ('${SATO}', '${ORG}', 'sato@example.com', 'member', '佐藤 由紀'),
    ('${OTHERS_MEMBER}', '${ORG}', 'other-coachs-member@example.com', 'member', '他コーチの会員')
  on conflict (id) do update set org_id = excluded.org_id, role = excluded.role, display_name = excluded.display_name;

  insert into public.coach_profiles (user_id) values ('${KENTA}'), ('${OTHER_COACH}');

  insert into public.member_profiles (user_id, coach_id) values
    ('${TANAKA}', '${KENTA}'),
    ('${SATO}', '${KENTA}'),
    ('${OTHERS_MEMBER}', '${OTHER_COACH}');

  insert into public.body_metrics (member_id, weight_kg) values
    ('${TANAKA}', 72.4), ('${SATO}', 55.2), ('${OTHERS_MEMBER}', 58.0);

  insert into public.progress_photos (member_id, photo_url, visibility) values
    ('${TANAKA}', 'https://x/private.jpg', 'private'),
    ('${SATO}', 'https://x/shared.jpg', 'shared_with_coach');

  insert into public.conversations (id, coach_id, member_id) values
    ('00000000-0000-0000-0000-0000000000c1', '${KENTA}', '${TANAKA}');
  insert into public.messages (id, conversation_id, sender_id, body) values
    ('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-0000000000c1', '${KENTA}', '元のメッセージ');
`;

const main = async () => {
  const { db } = await freshDb();
  await db.exec(seed);

  const results = [];
  const check = (label, actual, expected) => {
    const pass = JSON.stringify(actual) === JSON.stringify(expected);
    results.push(pass);
    console.log((pass ? 'PASS' : 'FAIL') + '  ' + label + (pass ? '' : `\n      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`));
  };

  const allAsSuperuser = await db.query(`select count(*)::int as n from public.member_profiles`);
  check('sanity: unscoped superuser session bypasses RLS (sees all 3)', allAsSuperuser.rows, [{ n: 3 }]);

  const names = (
    await asUser(db, KENTA, `select display_name from public.member_profiles mp join public.users u on u.id = mp.user_id order by display_name`)
  ).map((r) => r.display_name);
  check('coach 健太 sees only his own members', names, ['佐藤 由紀', '田中 健']);

  const selfRows = await asUser(db, TANAKA, `select user_id from public.member_profiles`);
  check('member 田中 sees only his own member_profiles row', selfRows.map((r) => r.user_id), [TANAKA]);

  const cross = await asUser(db, TANAKA, `select weight_kg from public.body_metrics where member_id = '${SATO}'`);
  check("member 田中 cannot read another member's body metrics", cross, []);

  const ownMetricAsCoach = await asUser(db, KENTA, `select weight_kg from public.body_metrics where member_id = '${TANAKA}'`);
  check("coach 健太 can read his member 田中's body metrics", ownMetricAsCoach, [{ weight_kg: '72.4' }]);

  const otherCoachsMetric = await asUser(db, KENTA, `select weight_kg from public.body_metrics where member_id = '${OTHERS_MEMBER}'`);
  check("coach 健太 cannot read the other coach's member's body metrics", otherCoachsMetric, []);

  const privatePhoto = await asUser(db, KENTA, `select photo_url from public.progress_photos where member_id = '${TANAKA}'`);
  check("coach cannot see a member's PRIVATE progress photo", privatePhoto, []);

  const sharedPhoto = await asUser(db, KENTA, `select photo_url from public.progress_photos where member_id = '${SATO}'`);
  check("coach CAN see a member's SHARED progress photo", sharedPhoto, [{ photo_url: 'https://x/shared.jpg' }]);

  const ownMetricAsMember = await asUser(db, TANAKA, `select weight_kg from public.body_metrics where member_id = '${TANAKA}'`);
  check('member 田中 can read his OWN body metrics', ownMetricAsMember, [{ weight_kg: '72.4' }]);

  const coachViaMember = await asUser(db, TANAKA, `select display_name from public.users where id = '${KENTA}'`);
  check("member 田中 can read his own coach's display_name (needed to show the coach's name in the chat header)", coachViaMember, [{ display_name: '健太' }]);

  const otherCoachViaMember = await asUser(db, TANAKA, `select display_name from public.users where id = '${OTHER_COACH}'`);
  check("member 田中 cannot read a coach who isn't his own", otherCoachViaMember, []);

  // Regression test for a real bug: the "mark read" UPDATE policy's
  // `with check (sender_id = messages.sender_id)` was a tautology (both
  // sides resolve to the NEW row under RLS), so a participant "marking a
  // message read" could actually rewrite its body/sender_id too. A trigger
  // now pins every column but read_at back to its old value.
  const tampered = await asUser(
    db, TANAKA,
    `update public.messages set read_at = now(), body = '田中が書き換えた', sender_id = '${TANAKA}'
     where id = '00000000-0000-0000-0000-0000000000d1'
     returning body, sender_id, (read_at is not null) as was_marked_read`
  );
  check('marking a message read cannot also rewrite its body/sender_id', tampered, [
    { body: '元のメッセージ', sender_id: KENTA, was_marked_read: true },
  ]);

  const passCount = results.filter(Boolean).length;
  console.log(`\n${passCount}/${results.length} RLS behavior checks passed.`);
  if (passCount !== results.length) process.exitCode = 1;
};

main().catch((e) => {
  console.error('RLS TEST FAILED:', e);
  process.exitCode = 1;
});
