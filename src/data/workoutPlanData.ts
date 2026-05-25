import type { WorkoutCategory, WorkoutItemType } from '../types'

export const PLAN_ID = 'queens-marathon-2026'
/** Monday of Week 1 */
export const PLAN_START = '2026-06-01'
/** Earliest browsable date (Sunday of pre-plan week) */
export const PLAN_BROWSE_MIN = '2026-05-25'
/** Race day */
export const PLAN_BROWSE_MAX = '2026-12-06'

export interface RawScheduleItem {
  week_number: number
  day_of_week: number
  sort_order: number
  label: string
  type: WorkoutItemType
  category: WorkoutCategory
  notes: string | null
}

export interface RawWeekNote {
  week_number: number
  goal: string
  tip: string
}

export const SCHEDULE_ITEMS: RawScheduleItem[] = [
  // ─── Week 0: Pre-plan (May 25–31) ───────────────────────────────────────────
  { week_number: 0, day_of_week: 5, sort_order: 0, label: '🏁 RACE: Ridgewood Runners 5K', type: 'single', category: 'race', notes: 'Zero stakes baseline — just run' },

  // ─── Week 1: Jun 1–7 ────────────────────────────────────────────────────────
  { week_number: 1, day_of_week: 0, sort_order: 0, label: 'CWCW Chest & Back (Tempo Strength)', type: 'single', category: 'strength', notes: null },
  { week_number: 1, day_of_week: 1, sort_order: 0, label: 'Track meet', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 1, day_of_week: 2, sort_order: 0, label: 'Easy 3 mi', type: 'single', category: 'run', notes: 'Conversational pace' },
  { week_number: 1, day_of_week: 2, sort_order: 1, label: 'CWCW Shoulders', type: 'single', category: 'strength', notes: null },
  { week_number: 1, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 1, day_of_week: 4, sort_order: 0, label: 'CWCW Arms & Flow', type: 'single', category: 'strength', notes: 'Upper only' },
  { week_number: 1, day_of_week: 5, sort_order: 0, label: 'Long run 5 mi', type: 'single', category: 'run', notes: 'Run club' },

  // ─── Week 2: Jun 8–14 · Elmhurst Mile (Sun Jun 14) ──────────────────────────
  { week_number: 2, day_of_week: 0, sort_order: 0, label: 'CWCW Chest & Back (EMOM Circuit)', type: 'single', category: 'strength', notes: null },
  { week_number: 2, day_of_week: 1, sort_order: 0, label: 'Track meet', type: 'single', category: 'run', notes: 'Easy effort this week' },
  { week_number: 2, day_of_week: 2, sort_order: 0, label: 'Strides 3 mi', type: 'single', category: 'run', notes: 'Easy + 4×20-sec strides' },
  { week_number: 2, day_of_week: 2, sort_order: 1, label: 'CWCW Shoulders', type: 'single', category: 'strength', notes: null },
  { week_number: 2, day_of_week: 3, sort_order: 0, label: 'Social run ~3 mi', type: 'single', category: 'run', notes: 'Keep it short' },
  { week_number: 2, day_of_week: 4, sort_order: 0, label: 'CWCW Arms & Flow', type: 'single', category: 'strength', notes: 'Upper only — legs fresh' },
  { week_number: 2, day_of_week: 6, sort_order: 0, label: '🏃 RACE: Elmhurst Mile', type: 'single', category: 'race', notes: 'All out — have fun!' },

  // ─── Week 3: Jun 15–21 ──────────────────────────────────────────────────────
  { week_number: 3, day_of_week: 1, sort_order: 0, label: 'Track meet', type: 'single', category: 'run', notes: 'Run club — easy' },
  { week_number: 3, day_of_week: 2, sort_order: 0, label: 'Easy 3 mi', type: 'single', category: 'run', notes: null },
  { week_number: 3, day_of_week: 2, sort_order: 1, label: 'CWCW Chest & Back', type: 'single', category: 'strength', notes: null },
  { week_number: 3, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 3, day_of_week: 4, sort_order: 0, label: 'CWCW Shoulders', type: 'single', category: 'strength', notes: null },
  { week_number: 3, day_of_week: 5, sort_order: 0, label: 'Long run 6 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 3, day_of_week: 6, sort_order: 0, label: 'CWCW Arms & Flow', type: 'single', category: 'strength', notes: 'Light upper' },

  // ─── Week 4: Jun 22–28 ──────────────────────────────────────────────────────
  { week_number: 4, day_of_week: 0, sort_order: 0, label: 'CWCW Chest & Back (Hot Start)', type: 'single', category: 'strength', notes: null },
  { week_number: 4, day_of_week: 1, sort_order: 0, label: 'Track meet', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 4, day_of_week: 2, sort_order: 0, label: 'Tempo 4 mi', type: 'single', category: 'run', notes: '1 mi warm-up, 2 mi @ 9:00/mi, 1 cool-down' },
  { week_number: 4, day_of_week: 2, sort_order: 1, label: 'CWCW Shoulders', type: 'single', category: 'strength', notes: null },
  { week_number: 4, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 4, day_of_week: 4, sort_order: 0, label: 'CWCW Arms & Flow', type: 'single', category: 'strength', notes: 'Upper only' },
  { week_number: 4, day_of_week: 5, sort_order: 0, label: 'Long run 7 mi', type: 'single', category: 'run', notes: 'Run club' },

  // ─── Week 5: Jun 29–Jul 5 · Cutback ─────────────────────────────────────────
  { week_number: 5, day_of_week: 0, sort_order: 0, label: 'CWCW Chest & Back (light)', type: 'single', category: 'strength', notes: null },
  { week_number: 5, day_of_week: 1, sort_order: 0, label: 'Track meet', type: 'single', category: 'run', notes: 'Take it easy' },
  { week_number: 5, day_of_week: 2, sort_order: 0, label: 'Easy 3 mi', type: 'single', category: 'run', notes: 'Very easy' },
  { week_number: 5, day_of_week: 2, sort_order: 1, label: 'CWCW Shoulders', type: 'single', category: 'strength', notes: null },
  { week_number: 5, day_of_week: 3, sort_order: 0, label: 'Social run ~3 mi', type: 'single', category: 'run', notes: 'Cut it short if tired' },
  { week_number: 5, day_of_week: 4, sort_order: 0, label: 'CWCW Arms & Flow', type: 'single', category: 'strength', notes: 'Light' },
  { week_number: 5, day_of_week: 5, sort_order: 0, label: 'Long run 5 mi', type: 'single', category: 'run', notes: 'Run club — pull back' },

  // ─── Week 6: Jul 6–12 ───────────────────────────────────────────────────────
  { week_number: 6, day_of_week: 0, sort_order: 0, label: 'CWCW Chest & Back (Tempo Strength)', type: 'single', category: 'strength', notes: null },
  { week_number: 6, day_of_week: 1, sort_order: 0, label: 'Track meet', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 6, day_of_week: 2, sort_order: 0, label: 'Easy 3 mi', type: 'single', category: 'run', notes: null },
  { week_number: 6, day_of_week: 2, sort_order: 1, label: 'CWCW Shoulders', type: 'single', category: 'strength', notes: null },
  { week_number: 6, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 6, day_of_week: 4, sort_order: 0, label: 'CWCW Arms & Flow', type: 'single', category: 'strength', notes: 'Upper only' },
  { week_number: 6, day_of_week: 5, sort_order: 0, label: 'Long run 8 mi', type: 'single', category: 'run', notes: 'Run club — biggest long run yet' },
  { week_number: 6, day_of_week: 6, sort_order: 0, label: 'CWCW Legs', type: 'single', category: 'strength', notes: 'Light legs at home' },

  // ─── Week 7: Jul 13–19 · Bayside 5K (Sun Jul 19) ────────────────────────────
  { week_number: 7, day_of_week: 0, sort_order: 0, label: 'CWCW Chest & Back (EMOM Circuit)', type: 'single', category: 'strength', notes: null },
  { week_number: 7, day_of_week: 1, sort_order: 0, label: 'Track meet', type: 'single', category: 'run', notes: 'Easy this week' },
  { week_number: 7, day_of_week: 2, sort_order: 0, label: 'Strides 3 mi', type: 'single', category: 'run', notes: 'Easy + 4 strides' },
  { week_number: 7, day_of_week: 2, sort_order: 1, label: 'CWCW Shoulders', type: 'single', category: 'strength', notes: null },
  { week_number: 7, day_of_week: 3, sort_order: 0, label: 'Social run ~3 mi', type: 'single', category: 'run', notes: 'Keep it short' },
  { week_number: 7, day_of_week: 4, sort_order: 0, label: 'CWCW Arms & Flow', type: 'single', category: 'strength', notes: 'Upper only' },
  { week_number: 7, day_of_week: 6, sort_order: 0, label: '🏁 RACE: Bayside 5K', type: 'single', category: 'race', notes: 'Fitness check — compare to May 30!' },

  // ─── Week 8: Jul 20–26 ──────────────────────────────────────────────────────
  { week_number: 8, day_of_week: 1, sort_order: 0, label: 'Track meet', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 8, day_of_week: 2, sort_order: 0, label: 'Easy 4 mi', type: 'single', category: 'run', notes: null },
  { week_number: 8, day_of_week: 2, sort_order: 1, label: 'CWCW Chest & Back', type: 'single', category: 'strength', notes: null },
  { week_number: 8, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 8, day_of_week: 4, sort_order: 0, label: 'CWCW Shoulders', type: 'single', category: 'strength', notes: 'Upper only' },
  { week_number: 8, day_of_week: 5, sort_order: 0, label: 'Long run 10 mi', type: 'single', category: 'run', notes: 'Run club — first double-digit! Fuel at mi 7' },
  { week_number: 8, day_of_week: 6, sort_order: 0, label: 'CWCW Arms & Flow', type: 'single', category: 'strength', notes: 'Rest legs, light upper' },

  // ─── Week 9: Jul 27–Aug 2 · CWCW Pause ──────────────────────────────────────
  { week_number: 9, day_of_week: 0, sort_order: 0, label: 'Maintenance: upper body', type: 'single', category: 'strength', notes: 'Bench, rows, shoulder press — simple' },
  { week_number: 9, day_of_week: 1, sort_order: 0, label: 'Track meet', type: 'single', category: 'run', notes: 'Use for quality' },
  { week_number: 9, day_of_week: 2, sort_order: 0, label: 'Tempo 6 mi', type: 'single', category: 'run', notes: '1 warm-up, 4 @ 9:00/mi, 1 cool-down' },
  { week_number: 9, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 9, day_of_week: 4, sort_order: 0, label: 'Maintenance: core', type: 'single', category: 'strength', notes: 'Planks, dead bugs, single-leg work' },
  { week_number: 9, day_of_week: 5, sort_order: 0, label: 'Long run 11 mi', type: 'single', category: 'run', notes: 'Run club' },

  // ─── Week 10: Aug 3–9 ───────────────────────────────────────────────────────
  { week_number: 10, day_of_week: 0, sort_order: 0, label: 'Maintenance: upper', type: 'single', category: 'strength', notes: null },
  { week_number: 10, day_of_week: 1, sort_order: 0, label: 'Track meet', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 10, day_of_week: 2, sort_order: 0, label: 'Easy 4 mi', type: 'single', category: 'run', notes: null },
  { week_number: 10, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 10, day_of_week: 4, sort_order: 0, label: 'Maintenance: core', type: 'single', category: 'strength', notes: null },
  { week_number: 10, day_of_week: 5, sort_order: 0, label: 'Long run 13.1 mi', type: 'single', category: 'run', notes: '🎉 First half marathon distance! Easy pace.' },

  // ─── Week 11: Aug 10–16 · CWCW 6-Day begins ─────────────────────────────────
  { week_number: 11, day_of_week: 0, sort_order: 0, label: 'Cross-train 30 min', type: 'single', category: 'cross', notes: 'Bike or swim' },
  { week_number: 11, day_of_week: 0, sort_order: 1, label: 'CWCW Chest & Back', type: 'single', category: 'strength', notes: null },
  { week_number: 11, day_of_week: 1, sort_order: 0, label: '5 mi easy', type: 'single', category: 'run', notes: 'Run club track' },
  { week_number: 11, day_of_week: 2, sort_order: 0, label: '5 mi easy', type: 'single', category: 'run', notes: 'Midweek — 3 days from long run ✓' },
  { week_number: 11, day_of_week: 2, sort_order: 1, label: 'CWCW Legs', type: 'single', category: 'strength', notes: null },
  { week_number: 11, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 11, day_of_week: 3, sort_order: 1, label: 'CWCW Arms & Flow', type: 'single', category: 'strength', notes: null },
  { week_number: 11, day_of_week: 4, sort_order: 0, label: 'CWCW Shoulders', type: 'single', category: 'strength', notes: 'Upper only — rest legs' },
  { week_number: 11, day_of_week: 5, sort_order: 0, label: 'Long run 12 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 11, day_of_week: 6, sort_order: 0, label: 'CWCW Total Body + Recovery', type: 'single', category: 'strength', notes: null },

  // ─── Week 12: Aug 17–23 ─────────────────────────────────────────────────────
  { week_number: 12, day_of_week: 0, sort_order: 0, label: 'Cross-train 30 min', type: 'single', category: 'cross', notes: null },
  { week_number: 12, day_of_week: 0, sort_order: 1, label: 'CWCW Chest & Back', type: 'single', category: 'strength', notes: null },
  { week_number: 12, day_of_week: 1, sort_order: 0, label: '5 mi easy', type: 'single', category: 'run', notes: 'Run club track' },
  { week_number: 12, day_of_week: 2, sort_order: 0, label: '6 mi easy', type: 'single', category: 'run', notes: null },
  { week_number: 12, day_of_week: 2, sort_order: 1, label: 'CWCW Legs', type: 'single', category: 'strength', notes: null },
  { week_number: 12, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 12, day_of_week: 3, sort_order: 1, label: 'CWCW Arms & Flow', type: 'single', category: 'strength', notes: null },
  { week_number: 12, day_of_week: 4, sort_order: 0, label: 'CWCW Shoulders', type: 'single', category: 'strength', notes: null },
  { week_number: 12, day_of_week: 5, sort_order: 0, label: 'Long run 13 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 12, day_of_week: 6, sort_order: 0, label: 'CWCW Total Body + Recovery', type: 'single', category: 'strength', notes: null },

  // ─── Week 13: Aug 24–29 · Jackson Heights Mile (Sat Aug 29) ─────────────────
  { week_number: 13, day_of_week: 0, sort_order: 0, label: 'Cross-train 20 min', type: 'single', category: 'cross', notes: 'Easy cross + light upper' },
  { week_number: 13, day_of_week: 0, sort_order: 1, label: 'CWCW Chest & Back', type: 'single', category: 'strength', notes: null },
  { week_number: 13, day_of_week: 1, sort_order: 0, label: '4 mi easy', type: 'single', category: 'run', notes: 'Easy this week' },
  { week_number: 13, day_of_week: 2, sort_order: 0, label: 'Strides 2 mi', type: 'single', category: 'run', notes: 'Easy + 6 strides' },
  { week_number: 13, day_of_week: 4, sort_order: 0, label: 'Shakeout 1.5 mi', type: 'single', category: 'run', notes: 'Easy + 4 strides' },
  { week_number: 13, day_of_week: 5, sort_order: 0, label: '🏃 RACE: Jackson Heights Mile', type: 'single', category: 'race', notes: 'All out!' },
  { week_number: 13, day_of_week: 6, sort_order: 0, label: '6 mi easy recovery', type: 'single', category: 'run', notes: 'Easy shakeout' },
  { week_number: 13, day_of_week: 6, sort_order: 1, label: 'CWCW Total Body + Recovery', type: 'single', category: 'strength', notes: null },

  // ─── Week 14: Aug 31–Sep 6 ──────────────────────────────────────────────────
  { week_number: 14, day_of_week: 0, sort_order: 0, label: 'Cross-train 30 min', type: 'single', category: 'cross', notes: null },
  { week_number: 14, day_of_week: 0, sort_order: 1, label: 'CWCW Chest & Back', type: 'single', category: 'strength', notes: null },
  { week_number: 14, day_of_week: 1, sort_order: 0, label: '5 mi easy', type: 'single', category: 'run', notes: 'Run club track' },
  { week_number: 14, day_of_week: 2, sort_order: 0, label: '7 mi easy', type: 'single', category: 'run', notes: null },
  { week_number: 14, day_of_week: 2, sort_order: 1, label: 'CWCW Legs', type: 'single', category: 'strength', notes: null },
  { week_number: 14, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 14, day_of_week: 3, sort_order: 1, label: 'CWCW Arms & Flow', type: 'single', category: 'strength', notes: null },
  { week_number: 14, day_of_week: 4, sort_order: 0, label: 'CWCW Shoulders', type: 'single', category: 'strength', notes: 'Upper only' },
  { week_number: 14, day_of_week: 5, sort_order: 0, label: 'Long run 15 mi', type: 'single', category: 'run', notes: 'Bring 2 gels' },
  { week_number: 14, day_of_week: 6, sort_order: 0, label: 'CWCW Total Body + Recovery', type: 'single', category: 'strength', notes: null },

  // ─── Week 15: Sep 7–13 · CWCW 6-Day final ───────────────────────────────────
  { week_number: 15, day_of_week: 0, sort_order: 0, label: 'Cross-train 30 min', type: 'single', category: 'cross', notes: null },
  { week_number: 15, day_of_week: 0, sort_order: 1, label: 'CWCW Chest & Back', type: 'single', category: 'strength', notes: null },
  { week_number: 15, day_of_week: 1, sort_order: 0, label: '5 mi easy', type: 'single', category: 'run', notes: 'Run club track' },
  { week_number: 15, day_of_week: 2, sort_order: 0, label: '7 mi easy', type: 'single', category: 'run', notes: null },
  { week_number: 15, day_of_week: 2, sort_order: 1, label: 'CWCW Legs', type: 'single', category: 'strength', notes: null },
  { week_number: 15, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 15, day_of_week: 3, sort_order: 1, label: 'CWCW Arms & Flow', type: 'single', category: 'strength', notes: null },
  { week_number: 15, day_of_week: 4, sort_order: 0, label: 'CWCW Shoulders', type: 'single', category: 'strength', notes: null },
  { week_number: 15, day_of_week: 5, sort_order: 0, label: 'Long run 16 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 15, day_of_week: 6, sort_order: 0, label: 'CWCW Total Body + Recovery', type: 'single', category: 'strength', notes: '🎓 Final 6-day week — you earned this' },

  // ─── Week 16: Sep 14–20 · Cutback ───────────────────────────────────────────
  { week_number: 16, day_of_week: 0, sort_order: 0, label: 'Cross-train 30 min', type: 'single', category: 'cross', notes: null },
  { week_number: 16, day_of_week: 0, sort_order: 1, label: 'CWCW Chest & Back', type: 'single', category: 'strength', notes: null },
  { week_number: 16, day_of_week: 1, sort_order: 0, label: '5 mi easy', type: 'single', category: 'run', notes: 'Run club track' },
  { week_number: 16, day_of_week: 2, sort_order: 0, label: '6 mi easy', type: 'single', category: 'run', notes: 'No strength — cutback week' },
  { week_number: 16, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 16, day_of_week: 4, sort_order: 0, label: 'CWCW Arms & Flow', type: 'single', category: 'strength', notes: 'Light upper' },
  { week_number: 16, day_of_week: 5, sort_order: 0, label: 'Long run 12 mi', type: 'single', category: 'run', notes: 'Run club — pull back' },

  // ─── Week 17: Sep 21–27 ─────────────────────────────────────────────────────
  { week_number: 17, day_of_week: 0, sort_order: 0, label: 'Cross-train 30 min', type: 'single', category: 'cross', notes: null },
  { week_number: 17, day_of_week: 0, sort_order: 1, label: 'CWCW Chest & Back', type: 'single', category: 'strength', notes: null },
  { week_number: 17, day_of_week: 1, sort_order: 0, label: '6 mi easy', type: 'single', category: 'run', notes: 'Run club track' },
  { week_number: 17, day_of_week: 2, sort_order: 0, label: '8 mi easy', type: 'single', category: 'run', notes: 'Single-leg focus — lunges, step-ups' },
  { week_number: 17, day_of_week: 2, sort_order: 1, label: 'CWCW Legs', type: 'single', category: 'strength', notes: null },
  { week_number: 17, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 17, day_of_week: 4, sort_order: 0, label: 'CWCW Arms & Flow', type: 'single', category: 'strength', notes: null },
  { week_number: 17, day_of_week: 5, sort_order: 0, label: 'Long run 17 mi', type: 'single', category: 'run', notes: 'Break it into thirds mentally' },

  // ─── Week 18: Sep 28–Oct 4 ──────────────────────────────────────────────────
  { week_number: 18, day_of_week: 0, sort_order: 0, label: 'Cross-train 30 min', type: 'single', category: 'cross', notes: null },
  { week_number: 18, day_of_week: 0, sort_order: 1, label: 'CWCW Chest & Back', type: 'single', category: 'strength', notes: null },
  { week_number: 18, day_of_week: 1, sort_order: 0, label: '6 mi easy', type: 'single', category: 'run', notes: 'Run club track' },
  { week_number: 18, day_of_week: 2, sort_order: 0, label: '8 mi easy', type: 'single', category: 'run', notes: null },
  { week_number: 18, day_of_week: 2, sort_order: 1, label: 'CWCW Legs', type: 'single', category: 'strength', notes: null },
  { week_number: 18, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 18, day_of_week: 4, sort_order: 0, label: 'CWCW Arms & Flow', type: 'single', category: 'strength', notes: null },
  { week_number: 18, day_of_week: 5, sort_order: 0, label: 'Long run 18 mi', type: 'single', category: 'run', notes: 'Try race pace miles 14–16' },

  // ─── Week 19: Oct 5–11 ──────────────────────────────────────────────────────
  { week_number: 19, day_of_week: 0, sort_order: 0, label: 'Cross-train 30 min', type: 'single', category: 'cross', notes: null },
  { week_number: 19, day_of_week: 0, sort_order: 1, label: 'CWCW Chest & Back', type: 'single', category: 'strength', notes: null },
  { week_number: 19, day_of_week: 1, sort_order: 0, label: '6 mi easy', type: 'single', category: 'run', notes: 'Run club track' },
  { week_number: 19, day_of_week: 2, sort_order: 0, label: '9 mi easy', type: 'single', category: 'run', notes: null },
  { week_number: 19, day_of_week: 2, sort_order: 1, label: 'CWCW Legs', type: 'single', category: 'strength', notes: null },
  { week_number: 19, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 19, day_of_week: 4, sort_order: 0, label: 'CWCW Arms & Flow', type: 'single', category: 'strength', notes: null },
  { week_number: 19, day_of_week: 5, sort_order: 0, label: 'Long run 18 mi', type: 'single', category: 'run', notes: 'Run club' },

  // ─── Week 20: Oct 12–18 · Cutback, Core/Yoga ────────────────────────────────
  { week_number: 20, day_of_week: 0, sort_order: 0, label: 'Cross-train 30 min', type: 'single', category: 'cross', notes: 'Transition begins' },
  { week_number: 20, day_of_week: 0, sort_order: 1, label: 'Core / Yoga', type: 'single', category: 'strength', notes: null },
  { week_number: 20, day_of_week: 1, sort_order: 0, label: '5 mi easy', type: 'single', category: 'run', notes: 'Run club track' },
  { week_number: 20, day_of_week: 2, sort_order: 0, label: '6 mi easy', type: 'single', category: 'run', notes: null },
  { week_number: 20, day_of_week: 2, sort_order: 1, label: 'Core / Yoga', type: 'single', category: 'strength', notes: null },
  { week_number: 20, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 20, day_of_week: 5, sort_order: 0, label: 'Long run 13 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 20, day_of_week: 6, sort_order: 0, label: 'Core / Yoga', type: 'single', category: 'strength', notes: 'Gentle flow + foam roll' },

  // ─── Week 21: Oct 19–25 · First 20-Miler ────────────────────────────────────
  { week_number: 21, day_of_week: 0, sort_order: 0, label: 'Cross-train 30 min', type: 'single', category: 'cross', notes: null },
  { week_number: 21, day_of_week: 0, sort_order: 1, label: 'Core / Yoga', type: 'single', category: 'strength', notes: null },
  { week_number: 21, day_of_week: 1, sort_order: 0, label: '6 mi easy', type: 'single', category: 'run', notes: 'Run club track' },
  { week_number: 21, day_of_week: 2, sort_order: 0, label: '10 mi easy', type: 'single', category: 'run', notes: null },
  { week_number: 21, day_of_week: 2, sort_order: 1, label: 'Core / Yoga', type: 'single', category: 'strength', notes: null },
  { week_number: 21, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 21, day_of_week: 5, sort_order: 0, label: 'Long run 20 mi', type: 'single', category: 'run', notes: 'Bring 4 gels. Fuel every 45 min.' },
  { week_number: 21, day_of_week: 6, sort_order: 0, label: 'Yoga only', type: 'single', category: 'strength', notes: 'Gentle stretch, foam roll everything' },

  // ─── Week 22: Oct 26–Nov 1 ──────────────────────────────────────────────────
  { week_number: 22, day_of_week: 0, sort_order: 0, label: 'Walk only', type: 'single', category: 'run', notes: 'No running — legs earned this' },
  { week_number: 22, day_of_week: 1, sort_order: 0, label: '5 mi very easy', type: 'single', category: 'run', notes: 'Run club — truly easy' },
  { week_number: 22, day_of_week: 2, sort_order: 0, label: '7 mi easy', type: 'single', category: 'run', notes: null },
  { week_number: 22, day_of_week: 2, sort_order: 1, label: 'Core / Yoga', type: 'single', category: 'strength', notes: null },
  { week_number: 22, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 22, day_of_week: 5, sort_order: 0, label: 'Long run 15 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 22, day_of_week: 6, sort_order: 0, label: 'Yoga', type: 'single', category: 'strength', notes: 'Recovery flow' },

  // ─── Week 23: Nov 2–8 · Second 20-Miler ─────────────────────────────────────
  { week_number: 23, day_of_week: 0, sort_order: 0, label: 'Cross-train 30 min', type: 'single', category: 'cross', notes: null },
  { week_number: 23, day_of_week: 0, sort_order: 1, label: 'Core / Yoga', type: 'single', category: 'strength', notes: null },
  { week_number: 23, day_of_week: 1, sort_order: 0, label: '6 mi easy', type: 'single', category: 'run', notes: 'Run club track' },
  { week_number: 23, day_of_week: 2, sort_order: 0, label: '10 mi easy', type: 'single', category: 'run', notes: null },
  { week_number: 23, day_of_week: 2, sort_order: 1, label: 'Core / Yoga', type: 'single', category: 'strength', notes: null },
  { week_number: 23, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 23, day_of_week: 5, sort_order: 0, label: 'Long run 20 mi', type: 'single', category: 'run', notes: 'You know what to do now.' },
  { week_number: 23, day_of_week: 6, sort_order: 0, label: 'Yoga only', type: 'single', category: 'strength', notes: 'Foam roll, stretch, celebrate' },

  // ─── Week 24: Nov 9–15 · Taper begins ───────────────────────────────────────
  { week_number: 24, day_of_week: 0, sort_order: 0, label: 'Cross-train 20 min', type: 'single', category: 'cross', notes: 'Easy only' },
  { week_number: 24, day_of_week: 0, sort_order: 1, label: 'Core / Yoga', type: 'single', category: 'strength', notes: null },
  { week_number: 24, day_of_week: 1, sort_order: 0, label: '5 mi easy', type: 'single', category: 'run', notes: 'Run club track' },
  { week_number: 24, day_of_week: 2, sort_order: 0, label: '7 mi easy + 4 strides', type: 'single', category: 'run', notes: null },
  { week_number: 24, day_of_week: 2, sort_order: 1, label: 'Core / Yoga', type: 'single', category: 'strength', notes: null },
  { week_number: 24, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 24, day_of_week: 5, sort_order: 0, label: 'Long run 14 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 24, day_of_week: 6, sort_order: 0, label: 'Yoga', type: 'single', category: 'strength', notes: 'Recovery flow' },

  // ─── Week 25: Nov 16–22 ─────────────────────────────────────────────────────
  { week_number: 25, day_of_week: 0, sort_order: 0, label: 'Cross-train 20 min', type: 'single', category: 'cross', notes: 'Easy' },
  { week_number: 25, day_of_week: 0, sort_order: 1, label: 'Core / Yoga', type: 'single', category: 'strength', notes: null },
  { week_number: 25, day_of_week: 1, sort_order: 0, label: '4 mi easy', type: 'single', category: 'run', notes: 'Run club track' },
  { week_number: 25, day_of_week: 2, sort_order: 0, label: '6 mi + 4 strides', type: 'single', category: 'run', notes: null },
  { week_number: 25, day_of_week: 2, sort_order: 1, label: 'Core / Yoga', type: 'single', category: 'strength', notes: null },
  { week_number: 25, day_of_week: 3, sort_order: 0, label: 'Social run ~4 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 25, day_of_week: 5, sort_order: 0, label: 'Long run 12 mi', type: 'single', category: 'run', notes: 'Run club' },
  { week_number: 25, day_of_week: 6, sort_order: 0, label: 'Yoga', type: 'single', category: 'strength', notes: 'Gentle flow' },

  // ─── Week 26: Nov 23–29 ─────────────────────────────────────────────────────
  { week_number: 26, day_of_week: 0, sort_order: 0, label: 'Cross-train 15 min', type: 'single', category: 'cross', notes: 'Very light' },
  { week_number: 26, day_of_week: 0, sort_order: 1, label: 'Core / Yoga', type: 'single', category: 'strength', notes: null },
  { week_number: 26, day_of_week: 1, sort_order: 0, label: '4 mi easy', type: 'single', category: 'run', notes: 'Run club track' },
  { week_number: 26, day_of_week: 2, sort_order: 0, label: '5 mi + 4 strides', type: 'single', category: 'run', notes: 'Stay loose' },
  { week_number: 26, day_of_week: 2, sort_order: 1, label: 'Core / Yoga', type: 'single', category: 'strength', notes: null },
  { week_number: 26, day_of_week: 3, sort_order: 0, label: 'Social run ~3 mi', type: 'single', category: 'run', notes: 'Cut it short' },
  { week_number: 26, day_of_week: 5, sort_order: 0, label: '8 mi very easy', type: 'single', category: 'run', notes: 'Conversational only' },
  { week_number: 26, day_of_week: 6, sort_order: 0, label: 'Yoga', type: 'single', category: 'strength', notes: 'Gentle stretch' },

  // ─── Week 27: Nov 30–Dec 6 · Race week 🏅 ────────────────────────────────────
  { week_number: 27, day_of_week: 0, sort_order: 0, label: 'Walk only', type: 'single', category: 'run', notes: 'Stay off feet' },
  { week_number: 27, day_of_week: 1, sort_order: 0, label: '3 mi easy + strides', type: 'single', category: 'run', notes: 'Keep the legs awake' },
  { week_number: 27, day_of_week: 2, sort_order: 0, label: '3 mi easy', type: 'single', category: 'run', notes: 'Gentle flow only' },
  { week_number: 27, day_of_week: 2, sort_order: 1, label: 'Yoga — 20 min', type: 'single', category: 'strength', notes: null },
  { week_number: 27, day_of_week: 5, sort_order: 0, label: '🎽 Queens 5K/10K', type: 'single', category: 'race', notes: 'Shakeout only — easy effort' },
  { week_number: 27, day_of_week: 6, sort_order: 0, label: '🏅 QUEENS MARATHON', type: 'single', category: 'race', notes: "Go get it. Sub-4:30. You're ready." },
]

export const WEEK_NOTES: RawWeekNote[] = [
  { week_number: 0, goal: 'Pre-plan baseline', tip: "Zero stakes. Run the 5K for fun — it's just a fitness snapshot before training officially begins." },
  { week_number: 1, goal: 'Establish rhythm. Easy miles, meet your new schedule.', tip: "Every run should be fully conversational. If you can't speak in sentences, slow down." },
  { week_number: 2, goal: 'First race of the plan. Mile race replaces the long run this week.', tip: "The mile race is pure speed. Don't overthink it — just go fast and enjoy it." },
  { week_number: 3, goal: 'Recover from mile, add a mile to the long run.', tip: "Add 4×20-sec strides at the end of Wednesday's easy run — just a taste of speed." },
  { week_number: 4, goal: 'First tempo taste. Build to 7-mile long run.', tip: "9:00/mi tempo should feel 'comfortably hard' — you can speak a word, not a sentence." },
  { week_number: 5, goal: 'Recover and adapt.', tip: "Adaptation happens during rest. This week is training — don't add miles out of guilt." },
  { week_number: 6, goal: 'Step up to CWCW 5-day. Cap the base phase strong.', tip: 'First week of CWCW 5-day. The extra session is legs on Sunday — keep it light.' },
  { week_number: 7, goal: 'Bayside 5K fitness check. Race replaces long run.', tip: 'Seven weeks of training will show. Compare this time directly to your May 30 baseline.' },
  { week_number: 8, goal: 'Resume building. First double-digit long run.', tip: 'First 10-miler. Bring a gel and take it at mile 7 — practice your race-day fueling.' },
  { week_number: 9, goal: 'Peak bridge week.', tip: "CWCW on pause — keep strength maintenance simple and protect your run quality." },
  { week_number: 10, goal: 'First half marathon distance. Bridge peaks.', tip: "Half marathon distance. Run the whole thing at easy pace — this is a fitness milestone, not a race." },
  { week_number: 11, goal: 'Hal Higdon begins. CWCW graduates to 6-day.', tip: "If a CWCW session feels like too much on a given day, swap it for Range & Repair." },
  { week_number: 12, goal: 'Build consistency across both programs.', tip: 'Second straight 13-mile long run. Your aerobic engine is solidifying fast.' },
  { week_number: 13, goal: 'Speed day! Race week.', tip: 'Your mile time here will be dramatically faster than you expect. 3 months of training will show.' },
  { week_number: 14, goal: 'Resume post-race. First 15-miler.', tip: "15 miles. If your run club goes shorter, do the extra miles solo before they start or after." },
  { week_number: 15, goal: '16 miles. CWCW 6-day graduation.', tip: "Last week of CWCW 6-day. You completed the program while marathon training. That's serious work." },
  { week_number: 16, goal: 'Mandatory cutback. Strength drops to maintenance.', tip: 'Mandatory cutback. Sleep extra this week. Your body is making huge adaptations right now.' },
  { week_number: 17, goal: 'Back to building. 17-mile long run.', tip: '17 miles is a landmark. Miles 1–6: easy. Miles 7–12: settle in. Miles 13–17: just finish.' },
  { week_number: 18, goal: 'First 18-miler.', tip: 'First 18-miler. Try running miles 14–16 at goal pace (~10:18/mi). Everything else easy.' },
  { week_number: 19, goal: 'Second 18-miler. Peak training block.', tip: "Back-to-back 18s is massive confidence building. Keep both easy — pace doesn't matter yet." },
  { week_number: 20, goal: 'Cutback. Strength transitions to recovery-focused.', tip: 'Cutback + strength transition. Core and yoga from here on — legs need everything for the 20-milers ahead.' },
  { week_number: 21, goal: 'Crown jewel of marathon training.', tip: "You will not feel great at mile 16. That's the point — learning to push through is the training." },
  { week_number: 22, goal: "Recover from 20. Don't rush back.", tip: 'Monday is a walk only. You just ran 20 miles — your legs earned a real day off.' },
  { week_number: 23, goal: 'After this, the hay is in the barn.', tip: 'Second 20 seals the deal. After Saturday you are ready for the marathon. Trust it.' },
  { week_number: 24, goal: 'Taper begins. Mileage drops, sharpness stays.', tip: "Taper is training. The drop in mileage feels wrong — that's normal. Your body is charging up." },
  { week_number: 25, goal: 'Deeper taper. Legs getting fresher.', tip: "You may feel sluggish or restless — classic taper madness. Your fitness is there. Trust the process." },
  { week_number: 26, goal: 'Final light week. Nothing heroic.', tip: "Focus on sleep, nutrition, and hydration. Nothing new — no new foods, no new gear." },
  { week_number: 27, goal: 'Arrive at the start line ready.', tip: "The work is done. Race week is just about showing up rested and confident. You've run 20 miles twice. 26.2 is just 6.2 more." },
]
