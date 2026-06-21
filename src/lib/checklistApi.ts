const BASE = import.meta.env.VITE_API_URL ?? ''

let _accessToken: string | null = null

export function setAccessToken(token: string | null) {
  _accessToken = token
}

export interface ChecklistTask {
  id: string
  name: string
  period: 'AM' | 'PM'
  sort_order: number
  completed: boolean
  created_at: string
  deleted_at: string | null
}

interface ApiResponse<T> {
  data: T
}

// ── Helpers ────────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (_accessToken) headers['Authorization'] = `Bearer ${_accessToken}`

  const res = await fetch(`${BASE}${path}`, {
    headers,
    ...options,
  })
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`)
  }
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

// ── Public API ─────────────────────────────────────────────────────────────

/** GET /api/v1/checklist?date=YYYY-MM-DD */
export async function fetchChecklist(date: string): Promise<{ morning: ChecklistTask[]; evening: ChecklistTask[] }> {
  const body = await request<ApiResponse<{ morning: ChecklistTask[]; evening: ChecklistTask[] }>>(
    `/api/v1/checklist?date=${date}`,
  )
  return body.data
}

/** PATCH /api/v1/checklist/:id — toggle completed state for today only */
export async function toggleTask(id: string, completed: boolean, date: string): Promise<ChecklistTask> {
  const body = await request<ApiResponse<ChecklistTask>>(
    `/api/v1/checklist/${id}`,
    { method: 'PATCH', body: JSON.stringify({ completed, date }) },
  )
  return body.data
}

/** POST /api/v1/checklist — create a new task */
export async function createTask(
  name: string,
  period: 'AM' | 'PM',
  sort_order: number,
): Promise<ChecklistTask> {
  const body = await request<ApiResponse<ChecklistTask>>(
    '/api/v1/checklist',
    { method: 'POST', body: JSON.stringify({ name, period, sort_order }) },
  )
  return body.data
}

/** DELETE /api/v1/checklist/:id — soft-delete a task */
export async function deleteTask(id: string): Promise<void> {
  await request<void>(`/api/v1/checklist/${id}`, { method: 'DELETE' })
}
