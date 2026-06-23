import { fetchWeekList, fetchWeek, type WeekListItem } from '../lib/bootcampApi'

export type BootcampItemType = 'read' | 'write' | 'code'

export interface BootcampItem {
  id: string
  text: string
  type: BootcampItemType
}

export interface BootcampTask {
  id: string
  text: string
  timeRange?: string
  type: BootcampItemType
}

export interface BootcampBlock {
  name: string
  timeRange: string
  tasks: BootcampTask[]
}

export interface BootcampHomework {
  optional?: boolean
  note?: string
  questions: BootcampItem[]
}

export interface BootcampExercise {
  number: number
  title: string
  timeEstimate: string
  difficulty: string
  acceptanceCriteria: BootcampItem[]
}

export interface BootcampDay {
  dow: number // 0=Mon … 6=Sun
  name: string
  shortName: string
  fullDate: string // YYYY-MM-DD
  hours: number
  eveningNote?: string
  learningFocus?: string
  blocks: BootcampBlock[]
  homework?: BootcampHomework
  exercises?: BootcampExercise[]
}

export interface BootcampWeek {
  weekNumber: number
  title: string
  focus: string
  totalHours: number
  dates: string
  startDate: string
  endDate: string
  deliverable: string
  acceptanceCriteria: BootcampItem[]
  days: BootcampDay[]
}

let _weekListCache: WeekListItem[] | null = null

export async function loadWeekList(): Promise<WeekListItem[]> {
  if (_weekListCache) return _weekListCache
  _weekListCache = await fetchWeekList()
  return _weekListCache
}

export function invalidateWeekListCache() {
  _weekListCache = null
}

export async function loadWeek(weekNumber: number): Promise<BootcampWeek> {
  return fetchWeek(weekNumber)
}

export async function getWeekForDate(dateStr: string): Promise<BootcampWeek | null> {
  const weeks = await loadWeekList()
  const match = weeks.find(w => dateStr >= w.start_date && dateStr <= w.end_date)
  if (!match) return null
  return loadWeek(match.week_number)
}

export async function getNearestWeek(dateStr: string): Promise<BootcampWeek> {
  const weeks = await loadWeekList()
  if (weeks.length === 0) throw new Error('No curriculum weeks available')
  if (dateStr < weeks[0].start_date) return loadWeek(weeks[0].week_number)
  return loadWeek(weeks[weeks.length - 1].week_number)
}

export function defaultDateForWeek(week: BootcampWeek, todayStr: string): string {
  if (todayStr >= week.startDate && todayStr <= week.endDate) return todayStr
  return week.startDate
}
