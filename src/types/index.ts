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

export type TabId = 'checklist' | 'lists' | 'workout' | 'food' | 'bootcamp'

export interface Tab {
  id: TabId
  label: string
  icon: string
}

// Shopping
export type ShoppingCategory = 'Groceries' | 'Productivity' | 'Gifts'

export interface ShoppingItem {
  id: string
  name: string
  category: ShoppingCategory
  completed: boolean
  created_at: string
}

// Todo
export type Priority = 'high' | 'medium' | 'low'

export interface TodoItem {
  id: string
  name: string
  priority: Priority | null
  due_date: string | null
  completed: boolean
  created_at: string
}
