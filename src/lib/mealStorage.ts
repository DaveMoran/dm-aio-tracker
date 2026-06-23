import type { DayTargets, MacroLog } from '../types'

const BASE = import.meta.env.VITE_API_URL ?? ''

let _accessToken: string | null = null

export function setNutritionAccessToken(token: string | null) {
  _accessToken = token
}

interface ApiResponse<T> {
  data: T
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (_accessToken) headers['Authorization'] = `Bearer ${_accessToken}`

  const res = await fetch(`${BASE}${path}`, { headers, ...options })
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

// ── Date helpers ─────────────────────────────────────────────────────────────

export function todayString(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
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

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchAllTargets(): Promise<DayTargets[]> {
  const body = await request<ApiResponse<DayTargets[]>>('/api/v1/nutrition/targets')
  return body.data
}

export async function saveAllTargets(targets: DayTargets[]): Promise<void> {
  await request<ApiResponse<DayTargets[]>>('/api/v1/nutrition/targets', {
    method: 'PUT',
    body: JSON.stringify(targets),
  })
}

export async function fetchLogForDate(date: string): Promise<MacroLog | null> {
  const body = await request<ApiResponse<MacroLog | null>>(`/api/v1/nutrition/logs/${date}`)
  return body.data
}

export async function saveLog(
  date: string,
  values: { calories: number | null; protein: number | null; carbs: number | null; fat: number | null },
): Promise<void> {
  await request<ApiResponse<unknown>>(`/api/v1/nutrition/logs/${date}`, {
    method: 'PUT',
    body: JSON.stringify(values),
  })
}
