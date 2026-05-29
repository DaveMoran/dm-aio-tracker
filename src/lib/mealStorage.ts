import type { DayTargets, MacroLog } from '../types'

const BASE = import.meta.env.VITE_API_URL ?? ''

// ── Date helpers ──────────────────────────────────────────────────────────────

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

// ── Helpers ────────────────────────────────────────────────────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  return res.json() as Promise<T>
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchAllTargets(): Promise<DayTargets[]> {
  const body = await request<{ data: DayTargets[] }>('/api/v1/nutrition/targets')
  return body.data
}

export async function saveAllTargets(targets: DayTargets[]): Promise<void> {
  await request('/api/v1/nutrition/targets', {
    method: 'PUT',
    body: JSON.stringify(targets),
  })
}

export async function fetchLogForDate(date: string): Promise<MacroLog | null> {
  const body = await request<{ data: MacroLog | null }>(`/api/v1/nutrition/logs/${date}`)
  return body.data
}

export async function saveLog(
  date: string,
  values: { calories: number | null; protein: number | null; carbs: number | null; fat: number | null },
): Promise<void> {
  await request(`/api/v1/nutrition/logs/${date}`, {
    method: 'PUT',
    body: JSON.stringify(values),
  })
}
