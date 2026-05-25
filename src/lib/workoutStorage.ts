import { supabase, isSupabaseConfigured } from './supabase'
import type { WorkoutScheduleItem, WorkoutCompletion, WorkoutProgramExercise, WorkoutExerciseCompletion } from '../types'
import { SCHEDULE_ITEMS, WEEK_NOTES, PLAN_ID, PLAN_START } from '../data/workoutPlanData'

// ── Date helpers ────────────────────────────────────────────────────────────

export function todayString(): string {
  return new Date().toISOString().split('T')[0]
}

/** Returns week_number and day_of_week (0=Mon…6=Sun) for a given YYYY-MM-DD */
export function getWeekAndDay(dateStr: string): { week: number; dow: number } {
  const date = new Date(dateStr + 'T00:00:00')
  const start = new Date(PLAN_START + 'T00:00:00')
  const diffDays = Math.round((date.getTime() - start.getTime()) / 86400000)
  const week = Math.floor(diffDays / 7) + 1
  const dow = (date.getDay() + 6) % 7
  return { week, dow }
}

export function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

export function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function weekLabel(week: number): string {
  if (week === 0) return 'Pre-Plan'
  if (week >= 1 && week <= 27) return `Week ${week}`
  return ''
}

export function getWeekNote(week: number): { goal: string; tip: string } | null {
  return WEEK_NOTES.find(n => n.week_number === week) ?? null
}

// ── Local fallback ──────────────────────────────────────────────────────────

function localItemId(item: { week_number: number; day_of_week: number; sort_order: number }): string {
  return `${PLAN_ID}_${item.week_number}_${item.day_of_week}_${item.sort_order}`
}

function buildLocalItems(): WorkoutScheduleItem[] {
  return SCHEDULE_ITEMS.map(item => ({
    ...item,
    id: localItemId(item),
    plan_id: PLAN_ID,
    created_at: '2026-05-25T00:00:00Z',
  }))
}

function getLocalCompletions(): WorkoutCompletion[] {
  const raw = localStorage.getItem('dm_workout_completions')
  return raw ? JSON.parse(raw) : []
}

function setLocalCompletions(c: WorkoutCompletion[]) {
  localStorage.setItem('dm_workout_completions', JSON.stringify(c))
}

function getLocalExerciseCompletions(): WorkoutExerciseCompletion[] {
  const raw = localStorage.getItem('dm_workout_exercise_completions')
  return raw ? JSON.parse(raw) : []
}

function setLocalExerciseCompletions(c: WorkoutExerciseCompletion[]) {
  localStorage.setItem('dm_workout_exercise_completions', JSON.stringify(c))
}

// ── Public API ──────────────────────────────────────────────────────────────

export async function fetchScheduleForDay(week: number, dow: number): Promise<WorkoutScheduleItem[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('workout_schedule_items')
      .select('*')
      .eq('week_number', week)
      .eq('day_of_week', dow)
      .order('sort_order')
    if (error) throw error
    return data as WorkoutScheduleItem[]
  }
  return buildLocalItems()
    .filter(i => i.week_number === week && i.day_of_week === dow)
    .sort((a, b) => a.sort_order - b.sort_order)
}

export async function fetchCompletionsForDate(date: string): Promise<WorkoutCompletion[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('workout_completions')
      .select('*')
      .eq('date', date)
    if (error) throw error
    return data as WorkoutCompletion[]
  }
  return getLocalCompletions().filter(c => c.date === date)
}

export async function toggleItemCompletion(scheduleItemId: string, date: string, complete: boolean): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    if (complete) {
      await supabase.from('workout_completions')
        .upsert({ schedule_item_id: scheduleItemId, date }, { onConflict: 'schedule_item_id,date' })
    } else {
      await supabase.from('workout_completions')
        .delete().eq('schedule_item_id', scheduleItemId).eq('date', date)
    }
    return
  }
  let cs = getLocalCompletions()
  if (complete) {
    if (!cs.find(c => c.schedule_item_id === scheduleItemId && c.date === date)) {
      cs.push({ id: crypto.randomUUID(), schedule_item_id: scheduleItemId, date, completed_at: new Date().toISOString() })
    }
  } else {
    cs = cs.filter(c => !(c.schedule_item_id === scheduleItemId && c.date === date))
  }
  setLocalCompletions(cs)
}

export async function fetchExercisesForItem(scheduleItemId: string): Promise<WorkoutProgramExercise[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('workout_program_exercises')
      .select('*')
      .eq('schedule_item_id', scheduleItemId)
      .order('sort_order')
    if (error) throw error
    return data as WorkoutProgramExercise[]
  }
  return []
}

export async function fetchExerciseCompletionsForDate(date: string): Promise<WorkoutExerciseCompletion[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('workout_exercise_completions')
      .select('*')
      .eq('date', date)
    if (error) throw error
    return data as WorkoutExerciseCompletion[]
  }
  return getLocalExerciseCompletions().filter(c => c.date === date)
}

export async function toggleExerciseCompletion(exerciseId: string, date: string, complete: boolean): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    if (complete) {
      await supabase.from('workout_exercise_completions')
        .upsert({ exercise_id: exerciseId, date }, { onConflict: 'exercise_id,date' })
    } else {
      await supabase.from('workout_exercise_completions')
        .delete().eq('exercise_id', exerciseId).eq('date', date)
    }
    return
  }
  let cs = getLocalExerciseCompletions()
  if (complete) {
    if (!cs.find(c => c.exercise_id === exerciseId && c.date === date)) {
      cs.push({ id: crypto.randomUUID(), exercise_id: exerciseId, date, completed_at: new Date().toISOString() })
    }
  } else {
    cs = cs.filter(c => !(c.exercise_id === exerciseId && c.date === date))
  }
  setLocalExerciseCompletions(cs)
}
