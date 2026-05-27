/**
 * checklistApi.ts
 *
 * Thin fetch wrapper for the morning/evening checklist REST API.
 * Base URL is read from VITE_API_URL — swap the .env.local value once the
 * real Railway URL is available; no code changes required.
 */

const BASE = import.meta.env.VITE_API_URL ?? ''

export interface ChecklistTask {
  id: string
  name: string
  period: 'AM' | 'PM'
  sort_order: number
  completed: boolean
  created_at: string
}

interface ApiResponse<T> {
  data: T
}

// ── Helpers ────────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`)
  }
  // 204 No Content — return undefined cast to T
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

// ── Public API ─────────────────────────────────────────────────────────────

/** GET /api/v1/checklist — returns tasks grouped by period */
export async function fetchChecklist(): Promise<{ morning: ChecklistTask[]; evening: ChecklistTask[] }> {
  const body = await request<ApiResponse<{ morning: ChecklistTask[]; evening: ChecklistTask[] }>>(
    '/api/v1/checklist',
  )
  return body.data
}

/** PATCH /api/v1/checklist/:id — toggle completed state */
export async function toggleTask(id: string, completed: boolean): Promise<ChecklistTask> {
  const body = await request<ApiResponse<ChecklistTask>>(
    `/api/v1/checklist/${id}`,
    { method: 'PATCH', body: JSON.stringify({ completed }) },
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

/** DELETE /api/v1/checklist/:id — delete a task */
export async function deleteTask(id: string): Promise<void> {
  await request<void>(`/api/v1/checklist/${id}`, { method: 'DELETE' })
}
