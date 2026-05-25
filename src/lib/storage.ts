import { supabase, isSupabaseConfigured } from './supabase'
import type { Task, TaskCompletion } from '../types'

const LOCAL_TASKS_KEY = 'dm_tracker_tasks'
const LOCAL_COMPLETIONS_KEY = 'dm_tracker_completions'

const DEFAULT_TASKS: Omit<Task, 'created_at'>[] = [
  { id: 'am-1', name: 'Hydrate (16oz water)', period: 'AM', sort_order: 1 },
  { id: 'am-2', name: 'Morning stretch / movement', period: 'AM', sort_order: 2 },
  { id: 'am-3', name: 'Healthy breakfast', period: 'AM', sort_order: 3 },
  { id: 'am-4', name: 'Journal / set intentions', period: 'AM', sort_order: 4 },
  { id: 'am-5', name: 'Review goals for the day', period: 'AM', sort_order: 5 },
  { id: 'am-6', name: 'Meditate (5 min)', period: 'AM', sort_order: 6 },
  { id: 'pm-1', name: 'Evening walk', period: 'PM', sort_order: 1 },
  { id: 'pm-2', name: 'Gratitude journal', period: 'PM', sort_order: 2 },
  { id: 'pm-3', name: 'Read (30 min)', period: 'PM', sort_order: 3 },
  { id: 'pm-4', name: 'Prep for tomorrow', period: 'PM', sort_order: 4 },
  { id: 'pm-5', name: 'Screen-free wind down', period: 'PM', sort_order: 5 },
  { id: 'pm-6', name: 'In bed by target time', period: 'PM', sort_order: 6 },
]

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

// ── Local storage helpers ──────────────────────────────────────────────────

function getLocalTasks(): Task[] {
  const raw = localStorage.getItem(LOCAL_TASKS_KEY)
  if (raw) return JSON.parse(raw)
  const tasks = DEFAULT_TASKS.map(t => ({ ...t, created_at: new Date().toISOString() }))
  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks))
  return tasks
}

function getLocalCompletions(date: string): TaskCompletion[] {
  const raw = localStorage.getItem(`${LOCAL_COMPLETIONS_KEY}_${date}`)
  return raw ? JSON.parse(raw) : []
}

function saveLocalCompletions(date: string, completions: TaskCompletion[]) {
  localStorage.setItem(`${LOCAL_COMPLETIONS_KEY}_${date}`, JSON.stringify(completions))
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function fetchTasks(): Promise<Task[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('sort_order')
    if (error) throw error
    return data as Task[]
  }
  return getLocalTasks()
}

export async function fetchCompletions(date: string): Promise<TaskCompletion[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('task_completions')
      .select('*')
      .eq('date', date)
    if (error) throw error
    return data as TaskCompletion[]
  }
  return getLocalCompletions(date)
}

export async function toggleCompletion(
  taskId: string,
  date: string,
  currentlyComplete: boolean,
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    if (currentlyComplete) {
      await supabase
        .from('task_completions')
        .delete()
        .eq('task_id', taskId)
        .eq('date', date)
    } else {
      await supabase
        .from('task_completions')
        .upsert({ task_id: taskId, date }, { onConflict: 'task_id,date' })
    }
    return
  }

  const completions = getLocalCompletions(date)
  if (currentlyComplete) {
    saveLocalCompletions(date, completions.filter(c => c.task_id !== taskId))
  } else {
    const newEntry: TaskCompletion = {
      id: `${taskId}-${date}`,
      task_id: taskId,
      date,
      completed_at: new Date().toISOString(),
    }
    saveLocalCompletions(date, [...completions.filter(c => c.task_id !== taskId), newEntry])
  }
}

export { todayStr }
