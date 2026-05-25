import type { DayTargets } from '../types'

export const MEAL_PLAN_ID = 'queens-marathon-meals'

export const DEFAULT_TARGETS: DayTargets[] = [
  { day_of_week: 0, calories_min: 2100, calories_max: 2200, protein_min: 160, protein_max: 170, carbs_min: 190, carbs_max: 210, fat_min: 65, fat_max: 75 },
  { day_of_week: 1, calories_min: 2300, calories_max: 2400, protein_min: 165, protein_max: 175, carbs_min: 220, carbs_max: 240, fat_min: 65, fat_max: 75 },
  { day_of_week: 2, calories_min: 2200, calories_max: 2300, protein_min: 160, protein_max: 170, carbs_min: 200, carbs_max: 220, fat_min: 65, fat_max: 75 },
  { day_of_week: 3, calories_min: 2300, calories_max: 2400, protein_min: 165, protein_max: 175, carbs_min: 220, carbs_max: 240, fat_min: 65, fat_max: 75 },
  { day_of_week: 4, calories_min: 2100, calories_max: 2200, protein_min: 160, protein_max: 170, carbs_min: 190, carbs_max: 210, fat_min: 65, fat_max: 75 },
  { day_of_week: 5, calories_min: 2400, calories_max: 2500, protein_min: 165, protein_max: 175, carbs_min: 230, carbs_max: 250, fat_min: 65, fat_max: 75 },
  { day_of_week: 6, calories_min: 2000, calories_max: 2100, protein_min: 155, protein_max: 165, carbs_min: 175, carbs_max: 195, fat_min: 65, fat_max: 75 },
]

export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
