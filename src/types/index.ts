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

export type TabId = 'checklist' | 'lists' | 'workout' | 'food' | 'bootcamp' | 'routine'

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

// Workout
export type WorkoutCategory = 'run' | 'strength' | 'race' | 'cross'
export type WorkoutItemType = 'single' | 'program'

export interface WorkoutPlan {
  id: string
  name: string
  start_date: string
  total_weeks: number
  active: boolean
  created_at: string
}

export interface WorkoutScheduleItem {
  id: string
  plan_id: string
  week_number: number
  day_of_week: number // 0=Mon … 6=Sun
  sort_order: number
  label: string
  type: WorkoutItemType
  category: WorkoutCategory
  notes: string | null
  created_at: string
}

export interface WorkoutProgramExercise {
  id: string
  schedule_item_id: string
  sort_order: number
  label: string
  created_at: string
}

export interface WorkoutCompletion {
  id: string
  schedule_item_id: string
  date: string
  completed_at: string
}

export interface WorkoutExerciseCompletion {
  id: string
  exercise_id: string
  date: string
  completed_at: string
}

// Nutrition
export interface DayTargets {
  day_of_week: number // 0=Mon … 6=Sun
  calories_min: number
  calories_max: number
  protein_min: number
  protein_max: number
  carbs_min: number
  carbs_max: number
  fat_min: number
  fat_max: number
}

export interface MacroLog {
  id: string
  date: string
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  logged_at: string
}
