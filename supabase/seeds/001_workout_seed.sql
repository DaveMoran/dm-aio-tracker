-- Queens Marathon Training Plan seed
-- Idempotent: re-running clears and reseeds

do $$
declare
  plan_id uuid := 'aaaaaaaa-0000-0000-0000-000000000001';
begin
  delete from workout_schedule_items where workout_schedule_items.plan_id = plan_id;
  delete from workout_plans where id = plan_id;

  insert into workout_plans (id, name, start_date, total_weeks, active)
  values (plan_id, 'Queens Marathon Training', '2026-06-01', 27, true);

  -- ── Week 0: Pre-plan (May 25–31) ────────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 0, 5, 0, '🏁 RACE: Ridgewood Runners 5K', 'single', 'race', 'Zero stakes baseline — just run');

  -- ── Week 1: Jun 1–7 ──────────────────────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 1, 0, 0, 'CWCW Chest & Back (Tempo Strength)', 'single', 'strength', null),
  (plan_id, 1, 1, 0, 'Track meet', 'single', 'run', 'Run club'),
  (plan_id, 1, 2, 0, 'Easy 3 mi', 'single', 'run', 'Conversational pace'),
  (plan_id, 1, 2, 1, 'CWCW Shoulders', 'single', 'strength', null),
  (plan_id, 1, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 1, 4, 0, 'CWCW Arms & Flow', 'single', 'strength', 'Upper only'),
  (plan_id, 1, 5, 0, 'Long run 5 mi', 'single', 'run', 'Run club');

  -- ── Week 2: Jun 8–14 · Elmhurst Mile (Sun) ───────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 2, 0, 0, 'CWCW Chest & Back (EMOM Circuit)', 'single', 'strength', null),
  (plan_id, 2, 1, 0, 'Track meet', 'single', 'run', 'Easy effort this week'),
  (plan_id, 2, 2, 0, 'Strides 3 mi', 'single', 'run', 'Easy + 4×20-sec strides'),
  (plan_id, 2, 2, 1, 'CWCW Shoulders', 'single', 'strength', null),
  (plan_id, 2, 3, 0, 'Social run ~3 mi', 'single', 'run', 'Keep it short'),
  (plan_id, 2, 4, 0, 'CWCW Arms & Flow', 'single', 'strength', 'Upper only — legs fresh'),
  (plan_id, 2, 6, 0, '🏃 RACE: Elmhurst Mile', 'single', 'race', 'All out — have fun!');

  -- ── Week 3: Jun 15–21 ────────────────────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 3, 1, 0, 'Track meet', 'single', 'run', 'Run club — easy'),
  (plan_id, 3, 2, 0, 'Easy 3 mi', 'single', 'run', null),
  (plan_id, 3, 2, 1, 'CWCW Chest & Back', 'single', 'strength', null),
  (plan_id, 3, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 3, 4, 0, 'CWCW Shoulders', 'single', 'strength', null),
  (plan_id, 3, 5, 0, 'Long run 6 mi', 'single', 'run', 'Run club'),
  (plan_id, 3, 6, 0, 'CWCW Arms & Flow', 'single', 'strength', 'Light upper');

  -- ── Week 4: Jun 22–28 ────────────────────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 4, 0, 0, 'CWCW Chest & Back (Hot Start)', 'single', 'strength', null),
  (plan_id, 4, 1, 0, 'Track meet', 'single', 'run', 'Run club'),
  (plan_id, 4, 2, 0, 'Tempo 4 mi', 'single', 'run', '1 mi warm-up, 2 mi @ 9:00/mi, 1 cool-down'),
  (plan_id, 4, 2, 1, 'CWCW Shoulders', 'single', 'strength', null),
  (plan_id, 4, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 4, 4, 0, 'CWCW Arms & Flow', 'single', 'strength', 'Upper only'),
  (plan_id, 4, 5, 0, 'Long run 7 mi', 'single', 'run', 'Run club');

  -- ── Week 5: Jun 29–Jul 5 · Cutback ───────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 5, 0, 0, 'CWCW Chest & Back (light)', 'single', 'strength', null),
  (plan_id, 5, 1, 0, 'Track meet', 'single', 'run', 'Take it easy'),
  (plan_id, 5, 2, 0, 'Easy 3 mi', 'single', 'run', 'Very easy'),
  (plan_id, 5, 2, 1, 'CWCW Shoulders', 'single', 'strength', null),
  (plan_id, 5, 3, 0, 'Social run ~3 mi', 'single', 'run', 'Cut it short if tired'),
  (plan_id, 5, 4, 0, 'CWCW Arms & Flow', 'single', 'strength', 'Light'),
  (plan_id, 5, 5, 0, 'Long run 5 mi', 'single', 'run', 'Run club — pull back');

  -- ── Week 6: Jul 6–12 ─────────────────────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 6, 0, 0, 'CWCW Chest & Back (Tempo Strength)', 'single', 'strength', null),
  (plan_id, 6, 1, 0, 'Track meet', 'single', 'run', 'Run club'),
  (plan_id, 6, 2, 0, 'Easy 3 mi', 'single', 'run', null),
  (plan_id, 6, 2, 1, 'CWCW Shoulders', 'single', 'strength', null),
  (plan_id, 6, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 6, 4, 0, 'CWCW Arms & Flow', 'single', 'strength', 'Upper only'),
  (plan_id, 6, 5, 0, 'Long run 8 mi', 'single', 'run', 'Run club — biggest long run yet'),
  (plan_id, 6, 6, 0, 'CWCW Legs', 'single', 'strength', 'Light legs at home');

  -- ── Week 7: Jul 13–19 · Bayside 5K (Sun) ────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 7, 0, 0, 'CWCW Chest & Back (EMOM Circuit)', 'single', 'strength', null),
  (plan_id, 7, 1, 0, 'Track meet', 'single', 'run', 'Easy this week'),
  (plan_id, 7, 2, 0, 'Strides 3 mi', 'single', 'run', 'Easy + 4 strides'),
  (plan_id, 7, 2, 1, 'CWCW Shoulders', 'single', 'strength', null),
  (plan_id, 7, 3, 0, 'Social run ~3 mi', 'single', 'run', 'Keep it short'),
  (plan_id, 7, 4, 0, 'CWCW Arms & Flow', 'single', 'strength', 'Upper only'),
  (plan_id, 7, 6, 0, '🏁 RACE: Bayside 5K', 'single', 'race', 'Fitness check — compare to May 30!');

  -- ── Week 8: Jul 20–26 ────────────────────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 8, 1, 0, 'Track meet', 'single', 'run', 'Run club'),
  (plan_id, 8, 2, 0, 'Easy 4 mi', 'single', 'run', null),
  (plan_id, 8, 2, 1, 'CWCW Chest & Back', 'single', 'strength', null),
  (plan_id, 8, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 8, 4, 0, 'CWCW Shoulders', 'single', 'strength', 'Upper only'),
  (plan_id, 8, 5, 0, 'Long run 10 mi', 'single', 'run', 'Run club — first double-digit! Fuel at mi 7'),
  (plan_id, 8, 6, 0, 'CWCW Arms & Flow', 'single', 'strength', 'Rest legs, light upper');

  -- ── Week 9: Jul 27–Aug 2 · CWCW Pause ───────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 9, 0, 0, 'Maintenance: upper body', 'single', 'strength', 'Bench, rows, shoulder press — simple'),
  (plan_id, 9, 1, 0, 'Track meet', 'single', 'run', 'Use for quality'),
  (plan_id, 9, 2, 0, 'Tempo 6 mi', 'single', 'run', '1 warm-up, 4 @ 9:00/mi, 1 cool-down'),
  (plan_id, 9, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 9, 4, 0, 'Maintenance: core', 'single', 'strength', 'Planks, dead bugs, single-leg work'),
  (plan_id, 9, 5, 0, 'Long run 11 mi', 'single', 'run', 'Run club');

  -- ── Week 10: Aug 3–9 ─────────────────────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 10, 0, 0, 'Maintenance: upper', 'single', 'strength', null),
  (plan_id, 10, 1, 0, 'Track meet', 'single', 'run', 'Run club'),
  (plan_id, 10, 2, 0, 'Easy 4 mi', 'single', 'run', null),
  (plan_id, 10, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 10, 4, 0, 'Maintenance: core', 'single', 'strength', null),
  (plan_id, 10, 5, 0, 'Long run 13.1 mi', 'single', 'run', '🎉 First half marathon distance! Easy pace.');

  -- ── Week 11: Aug 10–16 · CWCW 6-Day begins ──────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 11, 0, 0, 'Cross-train 30 min', 'single', 'cross', 'Bike or swim'),
  (plan_id, 11, 0, 1, 'CWCW Chest & Back', 'single', 'strength', null),
  (plan_id, 11, 1, 0, '5 mi easy', 'single', 'run', 'Run club track'),
  (plan_id, 11, 2, 0, '5 mi easy', 'single', 'run', 'Midweek — 3 days from long run ✓'),
  (plan_id, 11, 2, 1, 'CWCW Legs', 'single', 'strength', null),
  (plan_id, 11, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 11, 3, 1, 'CWCW Arms & Flow', 'single', 'strength', null),
  (plan_id, 11, 4, 0, 'CWCW Shoulders', 'single', 'strength', 'Upper only — rest legs'),
  (plan_id, 11, 5, 0, 'Long run 12 mi', 'single', 'run', 'Run club'),
  (plan_id, 11, 6, 0, 'CWCW Total Body + Recovery', 'single', 'strength', null);

  -- ── Week 12: Aug 17–23 ───────────────────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 12, 0, 0, 'Cross-train 30 min', 'single', 'cross', null),
  (plan_id, 12, 0, 1, 'CWCW Chest & Back', 'single', 'strength', null),
  (plan_id, 12, 1, 0, '5 mi easy', 'single', 'run', 'Run club track'),
  (plan_id, 12, 2, 0, '6 mi easy', 'single', 'run', null),
  (plan_id, 12, 2, 1, 'CWCW Legs', 'single', 'strength', null),
  (plan_id, 12, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 12, 3, 1, 'CWCW Arms & Flow', 'single', 'strength', null),
  (plan_id, 12, 4, 0, 'CWCW Shoulders', 'single', 'strength', null),
  (plan_id, 12, 5, 0, 'Long run 13 mi', 'single', 'run', 'Run club'),
  (plan_id, 12, 6, 0, 'CWCW Total Body + Recovery', 'single', 'strength', null);

  -- ── Week 13: Aug 24–29 · Jackson Heights Mile (Sat) ─────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 13, 0, 0, 'Cross-train 20 min', 'single', 'cross', 'Easy cross + light upper'),
  (plan_id, 13, 0, 1, 'CWCW Chest & Back', 'single', 'strength', null),
  (plan_id, 13, 1, 0, '4 mi easy', 'single', 'run', 'Easy this week'),
  (plan_id, 13, 2, 0, 'Strides 2 mi', 'single', 'run', 'Easy + 6 strides'),
  (plan_id, 13, 4, 0, 'Shakeout 1.5 mi', 'single', 'run', 'Easy + 4 strides'),
  (plan_id, 13, 5, 0, '🏃 RACE: Jackson Heights Mile', 'single', 'race', 'All out!'),
  (plan_id, 13, 6, 0, '6 mi easy recovery', 'single', 'run', 'Easy shakeout'),
  (plan_id, 13, 6, 1, 'CWCW Total Body + Recovery', 'single', 'strength', null);

  -- ── Week 14: Aug 31–Sep 6 ────────────────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 14, 0, 0, 'Cross-train 30 min', 'single', 'cross', null),
  (plan_id, 14, 0, 1, 'CWCW Chest & Back', 'single', 'strength', null),
  (plan_id, 14, 1, 0, '5 mi easy', 'single', 'run', 'Run club track'),
  (plan_id, 14, 2, 0, '7 mi easy', 'single', 'run', null),
  (plan_id, 14, 2, 1, 'CWCW Legs', 'single', 'strength', null),
  (plan_id, 14, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 14, 3, 1, 'CWCW Arms & Flow', 'single', 'strength', null),
  (plan_id, 14, 4, 0, 'CWCW Shoulders', 'single', 'strength', 'Upper only'),
  (plan_id, 14, 5, 0, 'Long run 15 mi', 'single', 'run', 'Bring 2 gels'),
  (plan_id, 14, 6, 0, 'CWCW Total Body + Recovery', 'single', 'strength', null);

  -- ── Week 15: Sep 7–13 · CWCW 6-Day final ────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 15, 0, 0, 'Cross-train 30 min', 'single', 'cross', null),
  (plan_id, 15, 0, 1, 'CWCW Chest & Back', 'single', 'strength', null),
  (plan_id, 15, 1, 0, '5 mi easy', 'single', 'run', 'Run club track'),
  (plan_id, 15, 2, 0, '7 mi easy', 'single', 'run', null),
  (plan_id, 15, 2, 1, 'CWCW Legs', 'single', 'strength', null),
  (plan_id, 15, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 15, 3, 1, 'CWCW Arms & Flow', 'single', 'strength', null),
  (plan_id, 15, 4, 0, 'CWCW Shoulders', 'single', 'strength', null),
  (plan_id, 15, 5, 0, 'Long run 16 mi', 'single', 'run', 'Run club'),
  (plan_id, 15, 6, 0, 'CWCW Total Body + Recovery', 'single', 'strength', '🎓 Final 6-day week — you earned this');

  -- ── Week 16: Sep 14–20 · Cutback ─────────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 16, 0, 0, 'Cross-train 30 min', 'single', 'cross', null),
  (plan_id, 16, 0, 1, 'CWCW Chest & Back', 'single', 'strength', null),
  (plan_id, 16, 1, 0, '5 mi easy', 'single', 'run', 'Run club track'),
  (plan_id, 16, 2, 0, '6 mi easy', 'single', 'run', 'No strength — cutback week'),
  (plan_id, 16, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 16, 4, 0, 'CWCW Arms & Flow', 'single', 'strength', 'Light upper'),
  (plan_id, 16, 5, 0, 'Long run 12 mi', 'single', 'run', 'Run club — pull back');

  -- ── Week 17: Sep 21–27 ───────────────────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 17, 0, 0, 'Cross-train 30 min', 'single', 'cross', null),
  (plan_id, 17, 0, 1, 'CWCW Chest & Back', 'single', 'strength', null),
  (plan_id, 17, 1, 0, '6 mi easy', 'single', 'run', 'Run club track'),
  (plan_id, 17, 2, 0, '8 mi easy', 'single', 'run', 'Single-leg focus — lunges, step-ups'),
  (plan_id, 17, 2, 1, 'CWCW Legs', 'single', 'strength', null),
  (plan_id, 17, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 17, 4, 0, 'CWCW Arms & Flow', 'single', 'strength', null),
  (plan_id, 17, 5, 0, 'Long run 17 mi', 'single', 'run', 'Break it into thirds mentally');

  -- ── Week 18: Sep 28–Oct 4 ────────────────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 18, 0, 0, 'Cross-train 30 min', 'single', 'cross', null),
  (plan_id, 18, 0, 1, 'CWCW Chest & Back', 'single', 'strength', null),
  (plan_id, 18, 1, 0, '6 mi easy', 'single', 'run', 'Run club track'),
  (plan_id, 18, 2, 0, '8 mi easy', 'single', 'run', null),
  (plan_id, 18, 2, 1, 'CWCW Legs', 'single', 'strength', null),
  (plan_id, 18, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 18, 4, 0, 'CWCW Arms & Flow', 'single', 'strength', null),
  (plan_id, 18, 5, 0, 'Long run 18 mi', 'single', 'run', 'Try race pace miles 14–16');

  -- ── Week 19: Oct 5–11 ────────────────────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 19, 0, 0, 'Cross-train 30 min', 'single', 'cross', null),
  (plan_id, 19, 0, 1, 'CWCW Chest & Back', 'single', 'strength', null),
  (plan_id, 19, 1, 0, '6 mi easy', 'single', 'run', 'Run club track'),
  (plan_id, 19, 2, 0, '9 mi easy', 'single', 'run', null),
  (plan_id, 19, 2, 1, 'CWCW Legs', 'single', 'strength', null),
  (plan_id, 19, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 19, 4, 0, 'CWCW Arms & Flow', 'single', 'strength', null),
  (plan_id, 19, 5, 0, 'Long run 18 mi', 'single', 'run', 'Run club');

  -- ── Week 20: Oct 12–18 · Cutback, Core/Yoga ─────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 20, 0, 0, 'Cross-train 30 min', 'single', 'cross', 'Transition begins'),
  (plan_id, 20, 0, 1, 'Core / Yoga', 'single', 'strength', null),
  (plan_id, 20, 1, 0, '5 mi easy', 'single', 'run', 'Run club track'),
  (plan_id, 20, 2, 0, '6 mi easy', 'single', 'run', null),
  (plan_id, 20, 2, 1, 'Core / Yoga', 'single', 'strength', null),
  (plan_id, 20, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 20, 5, 0, 'Long run 13 mi', 'single', 'run', 'Run club'),
  (plan_id, 20, 6, 0, 'Core / Yoga', 'single', 'strength', 'Gentle flow + foam roll');

  -- ── Week 21: Oct 19–25 · First 20-Miler ─────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 21, 0, 0, 'Cross-train 30 min', 'single', 'cross', null),
  (plan_id, 21, 0, 1, 'Core / Yoga', 'single', 'strength', null),
  (plan_id, 21, 1, 0, '6 mi easy', 'single', 'run', 'Run club track'),
  (plan_id, 21, 2, 0, '10 mi easy', 'single', 'run', null),
  (plan_id, 21, 2, 1, 'Core / Yoga', 'single', 'strength', null),
  (plan_id, 21, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 21, 5, 0, 'Long run 20 mi', 'single', 'run', 'Bring 4 gels. Fuel every 45 min.'),
  (plan_id, 21, 6, 0, 'Yoga only', 'single', 'strength', 'Gentle stretch, foam roll everything');

  -- ── Week 22: Oct 26–Nov 1 ────────────────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 22, 0, 0, 'Walk only', 'single', 'run', 'No running — legs earned this'),
  (plan_id, 22, 1, 0, '5 mi very easy', 'single', 'run', 'Run club — truly easy'),
  (plan_id, 22, 2, 0, '7 mi easy', 'single', 'run', null),
  (plan_id, 22, 2, 1, 'Core / Yoga', 'single', 'strength', null),
  (plan_id, 22, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 22, 5, 0, 'Long run 15 mi', 'single', 'run', 'Run club'),
  (plan_id, 22, 6, 0, 'Yoga', 'single', 'strength', 'Recovery flow');

  -- ── Week 23: Nov 2–8 · Second 20-Miler ──────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 23, 0, 0, 'Cross-train 30 min', 'single', 'cross', null),
  (plan_id, 23, 0, 1, 'Core / Yoga', 'single', 'strength', null),
  (plan_id, 23, 1, 0, '6 mi easy', 'single', 'run', 'Run club track'),
  (plan_id, 23, 2, 0, '10 mi easy', 'single', 'run', null),
  (plan_id, 23, 2, 1, 'Core / Yoga', 'single', 'strength', null),
  (plan_id, 23, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 23, 5, 0, 'Long run 20 mi', 'single', 'run', 'You know what to do now.'),
  (plan_id, 23, 6, 0, 'Yoga only', 'single', 'strength', 'Foam roll, stretch, celebrate');

  -- ── Week 24: Nov 9–15 · Taper begins ────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 24, 0, 0, 'Cross-train 20 min', 'single', 'cross', 'Easy only'),
  (plan_id, 24, 0, 1, 'Core / Yoga', 'single', 'strength', null),
  (plan_id, 24, 1, 0, '5 mi easy', 'single', 'run', 'Run club track'),
  (plan_id, 24, 2, 0, '7 mi easy + 4 strides', 'single', 'run', null),
  (plan_id, 24, 2, 1, 'Core / Yoga', 'single', 'strength', null),
  (plan_id, 24, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 24, 5, 0, 'Long run 14 mi', 'single', 'run', 'Run club'),
  (plan_id, 24, 6, 0, 'Yoga', 'single', 'strength', 'Recovery flow');

  -- ── Week 25: Nov 16–22 ───────────────────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 25, 0, 0, 'Cross-train 20 min', 'single', 'cross', 'Easy'),
  (plan_id, 25, 0, 1, 'Core / Yoga', 'single', 'strength', null),
  (plan_id, 25, 1, 0, '4 mi easy', 'single', 'run', 'Run club track'),
  (plan_id, 25, 2, 0, '6 mi + 4 strides', 'single', 'run', null),
  (plan_id, 25, 2, 1, 'Core / Yoga', 'single', 'strength', null),
  (plan_id, 25, 3, 0, 'Social run ~4 mi', 'single', 'run', 'Run club'),
  (plan_id, 25, 5, 0, 'Long run 12 mi', 'single', 'run', 'Run club'),
  (plan_id, 25, 6, 0, 'Yoga', 'single', 'strength', 'Gentle flow');

  -- ── Week 26: Nov 23–29 ───────────────────────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 26, 0, 0, 'Cross-train 15 min', 'single', 'cross', 'Very light'),
  (plan_id, 26, 0, 1, 'Core / Yoga', 'single', 'strength', null),
  (plan_id, 26, 1, 0, '4 mi easy', 'single', 'run', 'Run club track'),
  (plan_id, 26, 2, 0, '5 mi + 4 strides', 'single', 'run', 'Stay loose'),
  (plan_id, 26, 2, 1, 'Core / Yoga', 'single', 'strength', null),
  (plan_id, 26, 3, 0, 'Social run ~3 mi', 'single', 'run', 'Cut it short'),
  (plan_id, 26, 5, 0, '8 mi very easy', 'single', 'run', 'Conversational only'),
  (plan_id, 26, 6, 0, 'Yoga', 'single', 'strength', 'Gentle stretch');

  -- ── Week 27: Nov 30–Dec 6 · Race week 🏅 ────────────────────────────────────
  insert into workout_schedule_items (plan_id, week_number, day_of_week, sort_order, label, type, category, notes) values
  (plan_id, 27, 0, 0, 'Walk only', 'single', 'run', 'Stay off feet'),
  (plan_id, 27, 1, 0, '3 mi easy + strides', 'single', 'run', 'Keep the legs awake'),
  (plan_id, 27, 2, 0, '3 mi easy', 'single', 'run', 'Gentle flow only'),
  (plan_id, 27, 2, 1, 'Yoga — 20 min', 'single', 'strength', null),
  (plan_id, 27, 5, 0, '🎽 Queens 5K/10K', 'single', 'race', 'Shakeout only — easy effort'),
  (plan_id, 27, 6, 0, '🏅 QUEENS MARATHON', 'single', 'race', 'Go get it. Sub-4:30. You''re ready.');
end;
$$;
