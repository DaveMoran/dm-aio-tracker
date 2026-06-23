import { useState, useEffect, useCallback } from 'react'
import type { WorkoutScheduleItem, WorkoutProgramExercise } from '../../types'
import {
  weekLabel, getWeekNote, formatDateRange, getDateForWeekDay,
  fetchWeekItems, fetchCompletionsForWeek, fetchExerciseCompletionsForWeek,
  toggleItemCompletion, fetchExercisesForItem,
} from '../../lib/workoutStorage'
import WorkoutItemRow from './WorkoutItemRow'

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface Props {
  weekNumber: number
  onBack: () => void
}

interface DayGroup {
  dayOfWeek: number
  dateStr: string
  items: WorkoutScheduleItem[]
}

export default function WeekDetailPage({ weekNumber, onBack }: Props) {
  const [dayGroups, setDayGroups] = useState<DayGroup[]>([])
  const [exercisesByItem, setExercisesByItem] = useState<Record<string, WorkoutProgramExercise[]>>({})
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [exCompletedIds, setExCompletedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const note = getWeekNote(weekNumber)
  const wLabel = weekLabel(weekNumber)
  const dateRange = formatDateRange(weekNumber)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [items, completions, exerciseCompletions] = await Promise.all([
        fetchWeekItems(weekNumber),
        fetchCompletionsForWeek(weekNumber),
        fetchExerciseCompletionsForWeek(weekNumber),
      ])

      setCompletedIds(new Set(completions.map(c => c.schedule_item_id)))
      setExCompletedIds(new Set(exerciseCompletions.map(c => c.exercise_id)))

      const grouped = new Map<number, WorkoutScheduleItem[]>()
      for (const item of items) {
        const list = grouped.get(item.day_of_week) ?? []
        list.push(item)
        grouped.set(item.day_of_week, list)
      }

      const groups: DayGroup[] = Array.from(grouped.entries())
        .sort(([a], [b]) => a - b)
        .map(([dayOfWeek, dayItems]) => ({
          dayOfWeek,
          dateStr: getDateForWeekDay(weekNumber, dayOfWeek),
          items: dayItems.sort((a, b) => a.sort_order - b.sort_order),
        }))
      setDayGroups(groups)

      const programs = items.filter(i => i.type === 'program')
      if (programs.length > 0) {
        const exerciseLists = await Promise.all(programs.map(p => fetchExercisesForItem(p.id)))
        const map: Record<string, WorkoutProgramExercise[]> = {}
        programs.forEach((p, idx) => { map[p.id] = exerciseLists[idx] })
        setExercisesByItem(map)
      } else {
        setExercisesByItem({})
      }
    } finally {
      setLoading(false)
    }
  }, [weekNumber])

  useEffect(() => { load() }, [load])

  const handleToggle = async (itemId: string, complete: boolean, dayOfWeek: number) => {
    setCompletedIds(prev => {
      const next = new Set(prev)
      if (complete) next.add(itemId)
      else next.delete(itemId)
      return next
    })
    const date = getDateForWeekDay(weekNumber, dayOfWeek)
    await toggleItemCompletion(itemId, date, complete)
  }

  const formatDayHeader = (dayOfWeek: number, dateStr: string): string => {
    const d = new Date(dateStr + 'T00:00:00')
    const month = d.toLocaleDateString('en-US', { month: 'short' })
    return `${DAY_NAMES[dayOfWeek]}, ${month} ${d.getDate()}`
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="px-5 pt-14 pb-3">
        <div className="flex items-center gap-3 mb-2">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-[#E8E0D5] flex items-center justify-center"
          >
            <svg viewBox="0 0 8 14" fill="none" className="w-2 h-3.5">
              <path d="M7 1L1 7l6 6" stroke="#8B7355" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div>
            <p className="text-[17px] font-semibold text-[#2C1810]">{wLabel}</p>
            <p className="text-[12px] text-[#8B7355]">{dateRange}</p>
          </div>
        </div>

        {note && (
          <p className="text-[12px] text-[#8B7355] italic mt-1">{note.goal}</p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-7 h-7 rounded-full border-2 border-[#E8E0D5] border-t-[#5A8A6A] animate-spin" />
          </div>
        ) : dayGroups.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-4xl mb-3">😴</p>
            <p className="text-[16px] font-semibold text-[#2C1810]">Rest week</p>
            <p className="text-[13px] text-[#B8A89A] mt-1">No workouts scheduled this week.</p>
          </div>
        ) : (
          <div className="px-4 flex flex-col gap-4">
            {dayGroups.map(group => (
              <div key={group.dayOfWeek}>
                <p className="text-[13px] font-semibold text-[#8B7355] mb-2 px-1">
                  {formatDayHeader(group.dayOfWeek, group.dateStr)}
                </p>
                <div className="flex flex-col gap-2">
                  {group.items.map(item => (
                    <WorkoutItemRow
                      key={item.id}
                      item={item}
                      completed={completedIds.has(item.id)}
                      exercises={exercisesByItem[item.id] ?? []}
                      exerciseCompletions={exCompletedIds}
                      date={group.dateStr}
                      onToggle={(id, complete) => handleToggle(id, complete, group.dayOfWeek)}
                      onExerciseCompletionsChange={setExCompletedIds}
                    />
                  ))}
                </div>
              </div>
            ))}

            {note && (
              <div className="bg-[#FDF8F3] border border-[#E8E0D5] rounded-2xl px-4 py-3 mt-1">
                <p className="text-[12px] text-[#8B7355] italic">{note.tip}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
