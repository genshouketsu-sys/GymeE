-- Demo data matching exactly what coach/dist and member/dist currently show
-- as hardcoded JS (see coach/dist/app.js and member/dist/app.js). Load this
-- into a fresh project so the current UI's numbers are checkable against
-- real rows instead of the JS literals -- not meant as a rigorously
-- cross-referenced dataset (the original static prototype's demo copy isn't
-- internally consistent either, e.g. the "残り3回" alert doesn't correspond
-- to any one specific member's actual remaining count).
--
-- Every row below has an explicit id and an "on conflict (id) do update/
-- nothing" clause, specifically so this file is safe to re-run: without a
-- stable id, "on conflict do nothing" has no real target (a fresh
-- gen_random_uuid() default never collides with anything) and every re-run
-- silently duplicates the row -- which is exactly what happened the first
-- time this was tested against a real, re-seeded Postgres instance.
--
-- Auth users must exist before public.users can reference them; inserting
-- into auth.users directly (rather than through Supabase's sign-up flow) is
-- fine for seeding, but these accounts have no password set -- create real
-- credentials via the Supabase dashboard or `supabase auth` before logging
-- in as them.

insert into auth.users (id, email, raw_user_meta_data) values
  ('11111111-1111-1111-1111-111111111101', 'kenta@gyme.jp', '{"role":"coach","display_name":"健太"}'),
  ('11111111-1111-1111-1111-111111111111', 'tanaka@example.com', '{"role":"member","display_name":"田中 健"}'),
  ('11111111-1111-1111-1111-111111111112', 'sato@example.com', '{"role":"member","display_name":"佐藤 由紀"}'),
  ('11111111-1111-1111-1111-111111111113', 'wang@example.com', '{"role":"member","display_name":"王 明"}')
on conflict (id) do nothing;

insert into public.organizations (id, name) values
  ('11111111-1111-1111-1111-111111111100', 'Gyme')
on conflict (id) do nothing;

update public.users set org_id = '11111111-1111-1111-1111-111111111100'
where id in (
  '11111111-1111-1111-1111-111111111101',
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111112',
  '11111111-1111-1111-1111-111111111113'
);

insert into public.coach_profiles (user_id, bio) values
  ('11111111-1111-1111-1111-111111111101', 'Gyme トレーナー')
on conflict (user_id) do nothing;

insert into public.member_profiles (user_id, coach_id, membership_status) values
  ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111101', 'active'),
  ('11111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111101', 'active'),
  ('11111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111101', 'active')
on conflict (user_id) do nothing;

-- exercise library (global, org_id null) -- the 3 exercises 田中's today plan shows
insert into public.exercises (id, name, muscle_group) values
  ('22222222-2222-2222-2222-222222222201', 'ベンチプレス', '胸'),
  ('22222222-2222-2222-2222-222222222202', 'インクラインダンベルプレス', '胸'),
  ('22222222-2222-2222-2222-222222222203', 'ケーブルフライ', '胸')
on conflict (id) do nothing;

-- 田中健's plan: "胸 ＋ 上腕三頭筋", 52分 / 7種目 (member app home screen)
insert into public.training_plans (id, member_id, coach_id, name, status) values
  ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111101', '胸 ＋ 上腕三頭筋', 'active')
on conflict (id) do nothing;

insert into public.workouts (id, plan_id, name, scheduled_date, order_index) values
  ('33333333-3333-3333-3333-333333333311', '33333333-3333-3333-3333-333333333301', '胸 ＋ 上腕三頭筋', current_date, 0)
on conflict (id) do update set scheduled_date = excluded.scheduled_date;

-- 佐藤由紀・王明 の today's focus text (coach home's "今日のセッション" list) --
-- no exercise breakdown seeded for these two, only the plan name coach/dist shows.
insert into public.training_plans (id, member_id, coach_id, name, status) values
  ('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111101', 'お尻・脚', 'active'),
  ('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111101', '脂肪燃焼', 'active')
on conflict (id) do nothing;

insert into public.workouts (id, plan_id, name, scheduled_date, order_index) values
  ('33333333-3333-3333-3333-333333333312', '33333333-3333-3333-3333-333333333302', 'お尻・脚', current_date, 0),
  ('33333333-3333-3333-3333-333333333313', '33333333-3333-3333-3333-333333333303', '脂肪燃焼', current_date, 0)
on conflict (id) do update set scheduled_date = excluded.scheduled_date;

insert into public.workout_exercises (id, workout_id, exercise_id, order_index, target_sets, target_reps) values
  ('77777777-7777-7777-7777-777777777771', '33333333-3333-3333-3333-333333333311', '22222222-2222-2222-2222-222222222201', 0, 4, 8),
  ('77777777-7777-7777-7777-777777777772', '33333333-3333-3333-3333-333333333311', '22222222-2222-2222-2222-222222222202', 1, 3, 10),
  ('77777777-7777-7777-7777-777777777773', '33333333-3333-3333-3333-333333333311', '22222222-2222-2222-2222-222222222203', 2, 3, 12)
on conflict (id) do nothing;

-- coach's "今日のセッション": 10:00 田中健, 11:30 佐藤由紀, 15:00 王明, all 60分
insert into public.sessions (id, coach_id, member_id, workout_id, scheduled_at, duration_min, status) values
  ('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333311', current_date + time '10:00', 60, 'scheduled'),
  ('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111112', '33333333-3333-3333-3333-333333333312', current_date + time '11:30', 60, 'scheduled'),
  ('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111113', '33333333-3333-3333-3333-333333333313', current_date + time '15:00', 60, 'scheduled')
on conflict (id) do update set
  workout_id = excluded.workout_id, scheduled_at = excluded.scheduled_at;

-- "18 / 24回", "6 / 16回", "11 / 24回" next to each member -- their current PT package.
insert into public.membership_plans (id, org_id, name, session_count, price_cents) values
  ('55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111100', 'PT 24回パッケージ', 24, 240000),
  ('55555555-5555-5555-5555-555555555502', '11111111-1111-1111-1111-111111111100', 'PT 16回パッケージ', 16, 160000)
on conflict (id) do nothing;

insert into public.member_subscriptions (id, member_id, plan_id, sessions_remaining, status) values
  ('88888888-8888-8888-8888-888888888881', '11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555501', 24 - 18, 'active'), -- 田中: 18/24
  ('88888888-8888-8888-8888-888888888882', '11111111-1111-1111-1111-111111111112', '55555555-5555-5555-5555-555555555502', 16 - 6, 'active'),  -- 佐藤: 6/16
  ('88888888-8888-8888-8888-888888888883', '11111111-1111-1111-1111-111111111113', '55555555-5555-5555-5555-555555555501', 24 - 11, 'active') -- 王: 11/24
on conflict (id) do update set sessions_remaining = excluded.sessions_remaining;

-- member home: 1,420/2,200 kcal, 108/160g P, 172/260g C, 43/65g F
insert into public.nutrition_targets (id, member_id, calories, protein_g, carbs_g, fat_g) values
  ('99999999-9999-9999-9999-999999999991', '11111111-1111-1111-1111-111111111111', 2200, 160, 260, 65)
on conflict (id) do update set calories = excluded.calories, protein_g = excluded.protein_g, carbs_g = excluded.carbs_g, fat_g = excluded.fat_g;

insert into public.meal_logs (id, member_id, logged_at, description, calories, protein_g, carbs_g, fat_g) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', now(), '今日の食事（朝食+昼食）', 1420, 108, 172, 43)
on conflict (id) do update set logged_at = excluded.logged_at;

-- weekly card: 体重 72.4 kg
insert into public.body_metrics (id, member_id, recorded_at, weight_kg) values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '11111111-1111-1111-1111-111111111111', now(), 72.4)
on conflict (id) do update set recorded_at = excluded.recorded_at;

-- coach's "フォローが必要な会員" alerts
insert into public.notifications (id, user_id, type, payload) values
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1', '11111111-1111-1111-1111-111111111101', 'declining_trend', '{"title":"ベンチプレスの記録が低下","detail":"直近3回のセッションで記録が低下しています。次回のセッションでフォーム、疲労感、負荷設定を確認しましょう。","member_id":"11111111-1111-1111-1111-111111111111"}'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc2', '11111111-1111-1111-1111-111111111101', 'missing_meal_logs', '{"title":"食事の記録が未提出","detail":"7日間、食事の投稿がありません。次回の面談時に、食事記録の状況を確認しましょう。","member_id":"11111111-1111-1111-1111-111111111112"}'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc3', '11111111-1111-1111-1111-111111111101', 'renewal_due', '{"title":"パーソナルトレーニング残り3回","detail":"継続の目標とご希望を確認して、次のプランをご案内しましょう。","member_id":"11111111-1111-1111-1111-111111111113"}')
on conflict (id) do nothing;

-- member home "コーチメモ" / coach's memo feature
insert into public.conversations (id, coach_id, member_id) values
  ('66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111')
on conflict (id) do nothing;

insert into public.messages (id, conversation_id, sender_id, body) values
  ('dddddddd-dddd-dddd-dddd-ddddddddddd1', '66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111101', '昨日のベンチは好調でした。今日は最後のセットを丁寧に。')
on conflict (id) do nothing;
