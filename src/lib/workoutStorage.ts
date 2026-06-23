import { supabase, isSupabaseConfigured } from './supabase'
import type { WorkoutScheduleItem, WorkoutCompletion, WorkoutProgramExercise, WorkoutExerciseCompletion, WeekSummary } from '../types'
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
        .upsert({ schedule_item_id: scheduleItemId, date }, { onConflict: 'schedule_item_id,date,user_id' })
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
        .upsert({ exercise_id: exerciseId, date }, { onConflict: 'exercise_id,date,user_id' })
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

// ── Week-level queries ─────────────────────────────────────────────────────

export function getDateForWeekDay(weekNumber: number, dayOfWeek: number): string {
  const start = new Date(PLAN_START + 'T00:00:00')
  const offset = (weekNumber - 1) * 7 + dayOfWeek
  const d = new Date(start)
  d.setDate(d.getDate() + offset)
  return d.toISOString().split('T')[0]
}

export function getWeekDateRange(weekNumber: number): { start: string; end: string } {
  return {
    start: getDateForWeekDay(weekNumber, 0),
    end: getDateForWeekDay(weekNumber, 6),
  }
}

export function formatDateRange(weekNumber: number): string {
  const { start, end } = getWeekDateRange(weekNumber)
  const s = new Date(start + 'T00:00:00')
  const e = new Date(end + 'T00:00:00')
  const sMonth = s.toLocaleDateString('en-US', { month: 'short' })
  const eMonth = e.toLocaleDateString('en-US', { month: 'short' })
  if (sMonth === eMonth) {
    return `${sMonth} ${s.getDate()} – ${e.getDate()}`
  }
  return `${sMonth} ${s.getDate()} – ${eMonth} ${e.getDate()}`
}

export async function fetchWeekSummaries(): Promise<WeekSummary[]> {
  let allItems: { id: string; week_number: number }[]
  let completedItemIds: Set<string>

  if (isSupabaseConfigured && supabase) {
    const { data: items, error: itemsError } = await supabase
      .from('workout_schedule_items')
      .select('id, week_number')
    if (itemsError) throw itemsError
    allItems = items ?? []

    const { data: completions, error: compError } = await supabase
      .from('workout_completions')
      .select('schedule_item_id')
    if (compError) throw compError
    completedItemIds = new Set((completions ?? []).map(c => c.schedule_item_id))
  } else {
    const localItems = buildLocalItems()
    allItems = localItems.map(i => ({ id: i.id, week_number: i.week_number }))
    completedItemIds = new Set(getLocalCompletions().map(c => c.schedule_item_id))
  }

  const weekMap = new Map<number, { total: number; completed: number }>()
  for (const item of allItems) {
    const entry = weekMap.get(item.week_number) ?? { total: 0, completed: 0 }
    entry.total++
    if (completedItemIds.has(item.id)) entry.completed++
    weekMap.set(item.week_number, entry)
  }

  return Array.from(weekMap.entries())
    .map(([week_number, counts]) => ({
      week_number,
      ...counts,
      goal: getWeekNote(week_number)?.goal ?? null,
    }))
    .sort((a, b) => a.week_number - b.week_number)
}

export async function fetchWeekItems(weekNumber: number): Promise<WorkoutScheduleItem[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('workout_schedule_items')
      .select('*')
      .eq('week_number', weekNumber)
      .order('day_of_week')
      .order('sort_order')
    if (error) throw error
    return data as WorkoutScheduleItem[]
  }
  return buildLocalItems()
    .filter(i => i.week_number === weekNumber)
    .sort((a, b) => a.day_of_week - b.day_of_week || a.sort_order - b.sort_order)
}

export async function fetchCompletionsForWeek(weekNumber: number): Promise<WorkoutCompletion[]> {
  const { start, end } = getWeekDateRange(weekNumber)
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('workout_completions')
      .select('*')
      .gte('date', start)
      .lte('date', end)
    if (error) throw error
    return data as WorkoutCompletion[]
  }
  return getLocalCompletions().filter(c => c.date >= start && c.date <= end)
}

export async function fetchExerciseCompletionsForWeek(weekNumber: number): Promise<WorkoutExerciseCompletion[]> {
  const { start, end } = getWeekDateRange(weekNumber)
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('workout_exercise_completions')
      .select('*')
      .gte('date', start)
      .lte('date', end)
    if (error) throw error
    return data as WorkoutExerciseCompletion[]
  }
  return getLocalExerciseCompletions().filter(c => c.date >= start && c.date <= end)
}
