// Loads seed.sql on top of the migrations and checks it lands the exact
// numbers the current static UI hardcodes -- so "does the seed data match
// what coach/dist and member/dist show today" is a re-runnable check, not
// something eyeballed once while writing seed.sql.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { freshDb, asUser } from './_stub.mjs';

const KENTA = '11111111-1111-1111-1111-111111111101';
const TANAKA = '11111111-1111-1111-1111-111111111111';
const SATO = '11111111-1111-1111-1111-111111111112';
const WANG = '11111111-1111-1111-1111-111111111113';

const seedPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'seed.sql');

const main = async () => {
  const { db } = await freshDb();
  await db.exec(fs.readFileSync(seedPath, 'utf8'));

  const results = [];
  const check = (label, actual, expected) => {
    const pass = JSON.stringify(actual) === JSON.stringify(expected);
    results.push(pass);
    console.log((pass ? 'PASS' : 'FAIL') + '  ' + label + (pass ? '' : `\n      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`));
  };

  // coach/dist's "18 / 24回" / "6 / 16回" / "11 / 24回" per member
  const remaining = await asUser(
    db, KENTA,
    `select u.display_name, s.sessions_remaining, p.session_count
     from public.member_subscriptions s
     join public.users u on u.id = s.member_id
     join public.membership_plans p on p.id = s.plan_id
     order by u.display_name`
  );
  check('member package counts match coach home screen', remaining, [
    { display_name: '佐藤 由紀', sessions_remaining: 10, session_count: 16 },
    { display_name: '王 明', sessions_remaining: 13, session_count: 24 },
    { display_name: '田中 健', sessions_remaining: 6, session_count: 24 },
  ]);

  // coach/dist's 3 "フォローが必要な会員" alert titles
  const alertTitles = (await asUser(db, KENTA, `select payload->>'title' as t from public.notifications order by created_at`))
    .map((r) => r.t)
    .sort();
  check('coach notification titles match home screen alerts', alertTitles, [
    'パーソナルトレーニング残り3回',
    'ベンチプレスの記録が低下',
    '食事の記録が未提出',
  ].sort());

  // member/dist home: 1,420/2,200 kcal etc., 72.4kg, workout plan name + exercises
  const nutrition = await asUser(db, TANAKA, `select calories, protein_g, carbs_g, fat_g from public.nutrition_targets where member_id = '${TANAKA}'`);
  check("田中's nutrition target matches member home screen", nutrition, [{ calories: 2200, protein_g: 160, carbs_g: 260, fat_g: 65 }]);

  const meal = await asUser(db, TANAKA, `select calories, protein_g, carbs_g, fat_g from public.meal_logs where member_id = '${TANAKA}'`);
  check("田中's logged meal totals match member home screen", meal, [{ calories: 1420, protein_g: 108, carbs_g: 172, fat_g: 43 }]);

  const weight = await asUser(db, TANAKA, `select weight_kg from public.body_metrics where member_id = '${TANAKA}'`);
  check("田中's weight matches member home screen (72.4 kg)", weight, [{ weight_kg: '72.4' }]);

  const exercises = await asUser(
    db, TANAKA,
    `select e.name, we.target_sets, we.target_reps from public.workout_exercises we
     join public.exercises e on e.id = we.exercise_id
     join public.workouts w on w.id = we.workout_id
     join public.training_plans p on p.id = w.plan_id
     where p.member_id = '${TANAKA}' order by we.order_index`
  );
  check("田中's exercise list matches member home screen", exercises, [
    { name: 'ベンチプレス', target_sets: 4, target_reps: 8 },
    { name: 'インクラインダンベルプレス', target_sets: 3, target_reps: 10 },
    { name: 'ケーブルフライ', target_sets: 3, target_reps: 12 },
  ]);

  // cross-check RLS still holds with real seed data: 佐藤 must not see 田中's nutrition target.
  const crossCheck = await asUser(db, SATO, `select 1 from public.nutrition_targets where member_id = '${TANAKA}'`);
  check("seed data still respects RLS: 佐藤 cannot read 田中's nutrition target", crossCheck, []);

  const passCount = results.filter(Boolean).length;
  console.log(`\n${passCount}/${results.length} seed-data checks passed.`);
  if (passCount !== results.length) process.exitCode = 1;
};

main().catch((e) => {
  console.error('SEED TEST FAILED:', e);
  process.exitCode = 1;
});
