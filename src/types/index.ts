export type Period = 'AM' | 'PM'

export interface Task {
  id: string
  name: string
  period: Period
  sort_order: number
  created_at: string
}

export interface TaskCompletion {
  id: string
  task_id: string
  date: string
  completed_at: string
}

export type TabId = 'checklist' | 'shopping' | 'workout' | 'food' | 'bootcamp'

export interface Tab {
  id: TabId
  label: string
  icon: string
}
