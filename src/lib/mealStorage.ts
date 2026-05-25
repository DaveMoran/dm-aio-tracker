import { supabase, isSupabaseConfigured } from './supabase'
import type { DayTargets, MacroLog } from '../types'
import { DEFAULT_TARGETS, MEAL_PLAN_ID } from '../data/mealPlanData'

// ── Date helpers ─────────────────────────────────────────────────────────────

export function todayString(): string {
  return new Date().toISOString().split('T')[0]
}

export function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

export function dowForDate(dateStr: string): number {
  return (new Date(dateStr + 'T00:00:00').getDay() + 6) % 7
}

export function formatDisplayDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

// ── Local fallback ────────────────────────────────────────────────────────────

const TARGETS_KEY = 'dm_meal_targets'
const LOGS_KEY = 'dm_macro_logs'

function getLocalTargets(): DayTargets[] {
  const raw = localStorage.getItem(TARGETS_KEY)
  return raw ? JSON.parse(raw) : DEFAULT_TARGETS
}

function setLocalTargets(targets: DayTargets[]) {
  localStorage.setItem(TARGETS_KEY, JSON.stringify(targets))
}

function getLocalLogs(): MacroLog[] {
  const raw = localStorage.getItem(LOGS_KEY)
  return raw ? JSON.parse(raw) : []
}

function setLocalLogs(logs: MacroLog[]) {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs))
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchAllTargets(): Promise<DayTargets[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('meal_plan_targets')
      .select('*')
      .eq('plan_id', MEAL_PLAN_ID)
      .order('day_of_week')
    if (error) throw error
    return (data as DayTargets[]) ?? DEFAULT_TARGETS
  }
  return getLocalTargets()
}

export async function saveAllTargets(targets: DayTargets[]): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const rows = targets.map(t => ({ ...t, plan_id: MEAL_PLAN_ID }))
    const { error } = await supabase
      .from('meal_plan_targets')
      .upsert(rows, { onConflict: 'plan_id,day_of_week' })
    if (error) throw error
    return
  }
  setLocalTargets(targets)
}

export async function fetchLogForDate(date: string): Promise<MacroLog | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('macro_logs')
      .select('*')
      .eq('date', date)
      .maybeSingle()
    if (error) throw error
    return data as MacroLog | null
  }
  return getLocalLogs().find(l => l.date === date) ?? null
}

export async function saveLog(
  date: string,
  values: { calories: number | null; protein: number | null; carbs: number | null; fat: number | null },
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('macro_logs').upsert({ date, ...values, logged_at: new Date().toISOString() }, { onConflict: 'date' })
    return
  }
  const logs = getLocalLogs().filter(l => l.date !== date)
  logs.push({ id: crypto.randomUUID(), date, ...values, logged_at: new Date().toISOString() })
  setLocalLogs(logs)
}
