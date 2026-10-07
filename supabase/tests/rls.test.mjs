// Seeds a realistic multi-coach, multi-member scenario and checks the access
// control matrix the blueprint promises actually holds: a coach sees only
// their own members, a member sees only themselves, and a progress photo
// stays private unless the member explicitly shared it.
//
// This is here because RLS bugs are exactly the kind that a schema-only
// smoke test (schema.test.mjs) cannot catch: the SQL is valid, RLS is
// "enabled", and it still leaks data if a policy's USING clause is wrong.
import { freshDb, asUser, asAnon } from './_stub.mjs';

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

  insert into public.sessions (id, coach_id, member_id, scheduled_at) values
    ('00000000-0000-0000-0000-0000000000e1', '${KENTA}', '${TANAKA}', now()),
    ('00000000-0000-0000-0000-0000000000e2', '${KENTA}', '${SATO}', now());

  insert into public.notifications (id, user_id, type, payload) values
    ('00000000-0000-0000-0000-0000000000f0', '${TANAKA}', 'session_reminder', '{"title":"reminder","detail":"d"}');

  update auth.users set encrypted_password = crypt('correct-horse', gen_salt('bf')) where id = '${KENTA}';
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

  // start_my_session: a member has no direct INSERT/UPDATE grant on
  // session_logs (only the coach does), so pressing "開始" goes through this
  // SECURITY DEFINER RPC instead. Check both that it actually records a
  // started_at for the member's own session, and that it refuses to touch a
  // session belonging to someone else.
  const started = await asUser(
    db, TANAKA,
    `select session_id, (started_at is not null) as has_started_at from public.start_my_session('00000000-0000-0000-0000-0000000000e1')`
  );
  check('member 田中 starting his own session records started_at', started, [
    { session_id: '00000000-0000-0000-0000-0000000000e1', has_started_at: true },
  ]);

  let deniedError = null;
  try {
    await asUser(db, TANAKA, `select public.start_my_session('00000000-0000-0000-0000-0000000000e2')`);
  } catch (e) {
    deniedError = e;
    // pglite is a single persistent session, not a connection pool -- the
    // raised exception aborted asUser's begin/commit block before it reached
    // `commit`, so the underlying transaction is left open and aborted.
    // Roll it back explicitly or every later query on `db` fails too.
    await db.query('rollback');
  }
  check("member 田中 cannot start 佐藤's session", deniedError !== null, true);

  // Pressing "開始" a second time (e.g. after reopening the app) should
  // update the existing row's started_at, not fail on the unique
  // session_id constraint or create a second row for the same session.
  await asUser(db, TANAKA, `select public.start_my_session('00000000-0000-0000-0000-0000000000e1')`);
  const logCount = await asUser(
    db, TANAKA,
    `select count(*)::int as n from public.session_logs where session_id = '00000000-0000-0000-0000-0000000000e1'`
  );
  check('starting the same session twice updates in place (no duplicate log row)', logCount, [{ n: 1 }]);

  // notifications had NO insert policy at all before this: every seeded row
  // was written as superuser, bypassing RLS entirely, so a coach's own
  // "assign a task" button would have 403'd on the first real click.
  //
  // No `returning` here: a coach can insert a notification for their member,
  // but only the member can SELECT it back ("user reads own notifications"
  // is `user_id = auth.uid()`) -- INSERT ... RETURNING re-reads the new row
  // under the table's SELECT policy, so asking for it back paradoxically
  // fails RLS even though the insert itself is allowed. The client must POST
  // with Prefer: return=minimal, not the representation-returning default.
  await asUser(
    db, KENTA,
    `insert into public.notifications (user_id, type, payload) values ('${TANAKA}', 'coach_task', '{"title":"タスクのテスト","detail":"詳細"}')`
  );
  const taskRow = await db.query(`select user_id, type from public.notifications where type = 'coach_task' and user_id = '${TANAKA}'`);
  check('coach 健太 can assign a task to his own member', taskRow.rows, [{ user_id: TANAKA, type: 'coach_task' }]);

  let taskDeniedError = null;
  try {
    await asUser(
      db, KENTA,
      `insert into public.notifications (user_id, type, payload) values ('${OTHERS_MEMBER}', 'coach_task', '{"title":"x","detail":"y"}')`
    );
  } catch (e) {
    taskDeniedError = e;
    await db.query('rollback');
  }
  check("coach 健太 cannot assign a task to the other coach's member", taskDeniedError !== null, true);

  // 0012: closes the loop the other way -- the member marks the assigned
  // task done, and the coach can read that back. The member's update goes
  // through the existing "user marks own notifications read" policy (no
  // column restriction, so completed_at isn't special-cased); the coach's
  // read goes through the new type = 'coach_task' policy from 0012.
  const taskId = '00000000-0000-0000-0000-0000000000f1';
  await db.exec(`insert into public.notifications (id, user_id, type, payload) values ('${taskId}', '${TANAKA}', 'coach_task', '{"title":"腕立て20回","detail":"寝る前に腕立てを20回"}')`);

  const markedDone = await asUser(
    db, TANAKA,
    `update public.notifications set completed_at = now() where id = '${taskId}' returning (completed_at is not null) as done`
  );
  check('member 田中 can mark his own assigned task complete', markedDone, [{ done: true }]);

  const coachSeesCompletion = await asUser(db, KENTA, `select (completed_at is not null) as done from public.notifications where id = '${taskId}'`);
  check('coach 健太 can see that the task he assigned is now complete', coachSeesCompletion, [{ done: true }]);

  const otherCoachCannotSeeTask = await asUser(db, OTHER_COACH, `select id from public.notifications where id = '${taskId}'`);
  check("a coach who didn't assign it cannot read another coach's task", otherCoachCannotSeeTask, []);

  const coachCannotReadNonTaskNotification = await asUser(db, KENTA, `select id from public.notifications where id = '00000000-0000-0000-0000-0000000000f0'`);
  check("the coach_task read policy doesn't also expose other notification types (e.g. session_reminder)", coachCannotReadNonTaskNotification, []);

  // 0013: the push the other way -- a member notifying their own coach that
  // a task is done (the coach could otherwise only find out by reopening
  // that member's detail dialog and looking).
  await asUser(db, TANAKA, `insert into public.notifications (user_id, type, payload) values ('${KENTA}', 'task_completed', '{"title":"田中健さんがタスクを完了しました","detail":"腕立て20回"}')`);
  const coachNotifiedRow = await db.query(`select user_id, type from public.notifications where type = 'task_completed' and user_id = '${KENTA}'`);
  check('member 田中 can notify his own coach that a task is done', coachNotifiedRow.rows, [{ user_id: KENTA, type: 'task_completed' }]);

  let crossCoachNotifyError = null;
  try {
    await asUser(db, TANAKA, `insert into public.notifications (user_id, type, payload) values ('${OTHER_COACH}', 'task_completed', '{"title":"x","detail":"y"}')`);
  } catch (e) {
    crossCoachNotifyError = e;
    await db.query('rollback');
  }
  check("member 田中 cannot notify a coach who isn't his own", crossCoachNotifyError !== null, true);

  // 0015: a coach has no direct insert grant on auth.users or public.users
  // (same as real Supabase -- only an Admin API/service role could), so
  // "add a member" has to go through this SECURITY DEFINER RPC. Check it
  // actually links the new member to the CALLING coach, that a member can't
  // call it, and that the new member ends up visible via the coach's
  // already-existing "coach reads assigned members" policy.
  const added = await asUser(db, KENTA, `select id, display_name, role, org_id from public.coach_add_member('new-member@example.com', '新しい会員')`);
  check('coach 健太 can add a new member', added.map(r => ({ display_name: r.display_name, role: r.role, org_id: r.org_id })), [
    { display_name: '新しい会員', role: 'member', org_id: ORG },
  ]);
  const newMemberId = added[0].id;

  const linkedToCoach = await db.query(`select coach_id from public.member_profiles where user_id = '${newMemberId}'`);
  check('the new member is linked to 健太 via member_profiles', linkedToCoach.rows, [{ coach_id: KENTA }]);

  const coachSeesNewMember = await asUser(db, KENTA, `select display_name from public.member_profiles mp join public.users u on u.id = mp.user_id where mp.user_id = '${newMemberId}'`);
  check('coach 健太 can immediately read the member he just added', coachSeesNewMember, [{ display_name: '新しい会員' }]);

  let memberAddMemberError = null;
  try {
    await asUser(db, TANAKA, `select public.coach_add_member('sneaky@example.com', 'Sneaky')`);
  } catch (e) {
    memberAddMemberError = e;
    await db.query('rollback');
  }
  check('a member (not a coach) cannot call coach_add_member', memberAddMemberError !== null, true);

  // 0016: login() has to hand-assemble and sign a real JWT in SQL (no
  // separate auth server exists in this stack) -- check it actually
  // round-trips: a correct password returns a token whose payload decodes
  // to the right sub/role, a wrong password or wrong required role is
  // rejected, and the token has no raw newline in it (encode(bytea,
  // 'base64') wraps at 76 chars by default -- a literal newline inside a
  // token is illegal the moment it's sent in an Authorization header).
  const loginOk = await asAnon(db, `select public.login('kenta@gyme.jp', 'correct-horse', 'coach') as token`);
  const token = loginOk[0]?.token;
  check('login() with the right password returns a token', typeof token === 'string' && token.length > 20, true);
  check('the token has no embedded newline (base64 -> base64url was done right)', token?.includes('\n'), false);

  const payloadJson = JSON.parse(Buffer.from(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
  check("the token's sub claim is the logged-in user", payloadJson.sub, KENTA);
  check("the token's role claim is 'authenticated'", payloadJson.role, 'authenticated');

  let wrongPasswordError = null;
  try {
    await asAnon(db, `select public.login('kenta@gyme.jp', 'wrong-password', 'coach')`);
  } catch (e) {
    wrongPasswordError = e;
    await db.query('rollback');
  }
  check('login() rejects a wrong password', wrongPasswordError !== null, true);

  let wrongRoleError = null;
  try {
    await asAnon(db, `select public.login('kenta@gyme.jp', 'correct-horse', 'member')`);
  } catch (e) {
    wrongRoleError = e;
    await db.query('rollback');
  }
  check('login() rejects the right password with the wrong required role', wrongRoleError !== null, true);

  // 0017: self-registration is a new write path into auth.users/public.users
  // (previously only coach_add_member() could create one) -- check it
  // actually produces a usable account (auto-logs in, is linked to a coach
  // in this single-location gym's org, same as coach_add_member() links
  // one), rejects a too-short password, and rejects a duplicate email
  // (the unique constraint, not just app-level logic, since two concurrent
  // signups could both pass a plain existence check).
  const registerToken = (await asAnon(db, `select public.register_member('new-signup@example.com', 'a-real-password', '新規会員') as token`))[0]?.token;
  check('register_member() returns a token for a brand-new account', typeof registerToken === 'string' && registerToken.length > 20, true);
  const registerPayload = JSON.parse(Buffer.from(registerToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
  const newMemberId2 = registerPayload.sub;

  const newMemberLinked = await db.query(`select coach_id from public.member_profiles where user_id = '${newMemberId2}'`);
  check('a self-registered member is linked to a coach in the org, not left unmanaged', newMemberLinked.rows, [{ coach_id: KENTA }]);

  let shortPasswordError = null;
  try {
    await asAnon(db, `select public.register_member('too-short@example.com', 'abc', 'X')`);
  } catch (e) {
    shortPasswordError = e;
    await db.query('rollback');
  }
  check('register_member() rejects a password under 6 characters', shortPasswordError !== null, true);

  let duplicateEmailError = null;
  try {
    await asAnon(db, `select public.register_member('new-signup@example.com', 'another-password', 'Duplicate')`);
  } catch (e) {
    duplicateEmailError = e;
    await db.query('rollback');
  }
  check('register_member() rejects an email that already has an account', duplicateEmailError !== null, true);

  // Forgot password: request -> reset -> the token is consumed (can't be
  // replayed) -> the new password actually works for a real login().
  const resetToken = (await asAnon(db, `select public.request_password_reset('new-signup@example.com') as token`))[0]?.token;
  check('request_password_reset() returns a token for a known email', typeof resetToken === 'string' && resetToken.length > 10, true);

  let unknownEmailError = null;
  try {
    await asAnon(db, `select public.request_password_reset('nobody-here@example.com')`);
  } catch (e) {
    unknownEmailError = e;
    await db.query('rollback');
  }
  check('request_password_reset() rejects an email with no account', unknownEmailError !== null, true);

  const resetLoginToken = (await asAnon(db, `select public.reset_password('${resetToken}', 'brand-new-password') as token`))[0]?.token;
  check('reset_password() with a valid token returns a token (auto-login)', typeof resetLoginToken === 'string' && resetLoginToken.length > 20, true);

  let reusedTokenError = null;
  try {
    await asAnon(db, `select public.reset_password('${resetToken}', 'yet-another-password')`);
  } catch (e) {
    reusedTokenError = e;
    await db.query('rollback');
  }
  check('reset_password() rejects a token that was already used once', reusedTokenError !== null, true);

  const loginWithNewPassword = await asAnon(db, `select public.login('new-signup@example.com', 'brand-new-password', 'member') as token`);
  check('the member can actually log in with the password reset_password() set', typeof loginWithNewPassword[0]?.token === 'string', true);

  const passCount = results.filter(Boolean).length;
  console.log(`\n${passCount}/${results.length} RLS behavior checks passed.`);
  if (passCount !== results.length) process.exitCode = 1;
};

main().catch((e) => {
  console.error('RLS TEST FAILED:', e);
  process.exitCode = 1;
});
