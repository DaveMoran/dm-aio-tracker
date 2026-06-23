import type { BootcampWeek } from '../data/bootcampData'

const BASE = import.meta.env.VITE_API_URL ?? ''

let _accessToken: string | null = null

export function setBootcampAccessToken(token: string | null) {
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

export interface WeekListItem {
  week_number: number
  title: string
  focus: string
  total_hours: number
  dates: string
  start_date: string
  end_date: string
  deliverable: string
}

interface WeekResponse extends WeekListItem {
  curriculum: {
    acceptanceCriteria: BootcampWeek['acceptanceCriteria']
    days: BootcampWeek['days']
  }
}

export async function fetchWeekList(): Promise<WeekListItem[]> {
  const body = await request<ApiResponse<WeekListItem[]>>('/api/v1/bootcamp/curriculum')
  return body.data
}

export async function fetchWeek(weekNumber: number): Promise<BootcampWeek> {
  const body = await request<ApiResponse<WeekResponse>>(`/api/v1/bootcamp/curriculum/${weekNumber}`)
  const w = body.data
  return {
    weekNumber: w.week_number,
    title: w.title,
    focus: w.focus,
    totalHours: w.total_hours,
    dates: w.dates,
    startDate: w.start_date,
    endDate: w.end_date,
    deliverable: w.deliverable,
    acceptanceCriteria: w.curriculum.acceptanceCriteria,
    days: w.curriculum.days,
  }
}

export interface CompletionRecord {
  id: string
  item_key: string
  completed_at: string
}

export interface ContentRecord {
  item_key: string
  content: string
  updated_at: string
}

export async function fetchCompletions(): Promise<CompletionRecord[]> {
  const body = await request<ApiResponse<CompletionRecord[]>>('/api/v1/bootcamp/completions')
  return body.data
}

export async function toggleCompletion(itemKey: string, complete: boolean): Promise<void> {
  await request('/api/v1/bootcamp/completions', {
    method: 'POST',
    body: JSON.stringify({ itemKey, complete }),
  })
}

export async function fetchContent(): Promise<ContentRecord[]> {
  const body = await request<ApiResponse<ContentRecord[]>>('/api/v1/bootcamp/content')
  return body.data
}

export async function saveContent(itemKey: string, content: string): Promise<void> {
  await request(`/api/v1/bootcamp/content/${encodeURIComponent(itemKey)}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  })
}

export async function fetchReport(weekNumber: number): Promise<string> {
  const headers: Record<string, string> = {}
  if (_accessToken) headers['Authorization'] = `Bearer ${_accessToken}`

  const res = await fetch(`${BASE}/api/v1/bootcamp/report/${weekNumber}`, { headers })
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  return res.text()
}
