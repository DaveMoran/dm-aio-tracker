import { useState, useEffect, useCallback } from 'react'
import type { WorkoutScheduleItem, WorkoutProgramExercise, WorkoutCompletion, WorkoutExerciseCompletion } from '../../types'
import {
  todayString, getWeekAndDay, addDays, formatDisplayDate, weekLabel, getWeekNote,
  fetchScheduleForDay, fetchCompletionsForDate, toggleItemCompletion,
  fetchExercisesForItem, fetchExerciseCompletionsForDate,
} from '../../lib/workoutStorage'
import { PLAN_BROWSE_MIN, PLAN_BROWSE_MAX } from '../../data/workoutPlanData'
import WorkoutItemRow from './WorkoutItemRow'

export default function WorkoutPage() {
  const [date, setDate] = useState(todayString())
  const [items, setItems] = useState<WorkoutScheduleItem[]>([])
  const [exercisesByItem, setExercisesByItem] = useState<Record<string, WorkoutProgramExercise[]>>({})
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [exCompletedIds, setExCompletedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const { week } = getWeekAndDay(date)
  const note = getWeekNote(week)
  const isToday = date === todayString()
  const canGoPrev = date > PLAN_BROWSE_MIN
  const canGoNext = date < PLAN_BROWSE_MAX

  const allDone = items.length > 0 && items.every(item => {
    if (item.type === 'program' && exercisesByItem[item.id]?.length > 0) {
      return exercisesByItem[item.id].some(e => exCompletedIds.has(e.id))
    }
    return completedIds.has(item.id)
  })

  const load = useCallback(async (d: string) => {
    setLoading(true)
    try {
      const { week: w, dow: dow_ } = getWeekAndDay(d)
      const [schedule, rawCompletions, rawExCompletions] = await Promise.all([
        fetchScheduleForDay(w, dow_),
        fetchCompletionsForDate(d),
        fetchExerciseCompletionsForDate(d),
      ])
      setItems(schedule)
      setCompletedIds(new Set((rawCompletions as WorkoutCompletion[]).map(c => c.schedule_item_id)))
      setExCompletedIds(new Set((rawExCompletions as WorkoutExerciseCompletion[]).map(c => c.exercise_id)))

      // Fetch program exercises for any program-type items
      const programs = schedule.filter(i => i.type === 'program')
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
  }, [])

  useEffect(() => { load(date) }, [date, load])

  const handleToggle = async (itemId: string, complete: boolean) => {
    setCompletedIds(prev => {
      const next = new Set(prev)
      if (complete) next.add(itemId)
      else next.delete(itemId)
      return next
    })
    await toggleItemCompletion(itemId, date, complete)
  }

  const wLabel = weekLabel(week)
  const hasWorkouts = items.length > 0

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="px-5 pt-14 pb-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[13px] font-medium text-[#8B7355] uppercase tracking-widest">Workout</p>
          {wLabel && (
            <span className="text-[11px] font-semibold text-[#5A8A6A] bg-[#EAF2EC] px-2.5 py-0.5 rounded-full">
              {wLabel}
            </span>
          )}
        </div>

        {/* Date navigation */}
        <div className="flex items-center justify-between mt-2">
          <button
            type="button"
            onClick={() => setDate(d => addDays(d, -1))}
            disabled={!canGoPrev}
            className="w-9 h-9 rounded-full bg-white border border-[#E8E0D5] flex items-center justify-center disabled:opacity-30"
          >
            <svg viewBox="0 0 8 14" fill="none" className="w-2 h-3.5">
              <path d="M7 1L1 7l6 6" stroke="#8B7355" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="text-center">
            <p className="text-[17px] font-semibold text-[#2C1810]">{formatDisplayDate(date)}</p>
            {isToday && <p className="text-[11px] text-[#5A8A6A] font-medium mt-0.5">Today</p>}
          </div>

          <button
            type="button"
            onClick={() => setDate(d => addDays(d, 1))}
            disabled={!canGoNext}
            className="w-9 h-9 rounded-full bg-white border border-[#E8E0D5] flex items-center justify-center disabled:opacity-30"
          >
            <svg viewBox="0 0 8 14" fill="none" className="w-2 h-3.5">
              <path d="M1 1l6 6-6 6" stroke="#8B7355" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Week goal strip */}
        {note && wLabel && (
          <p className="text-[12px] text-[#8B7355] mt-2 text-center italic">{note.goal}</p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-7 h-7 rounded-full border-2 border-[#E8E0D5] border-t-[#5A8A6A] animate-spin" />
          </div>
        ) : !hasWorkouts ? (
          <div className="px-5 py-10 text-center">
            <p className="text-4xl mb-3">😴</p>
            <p className="text-[16px] font-semibold text-[#2C1810]">Rest day</p>
            <p className="text-[13px] text-[#B8A89A] mt-1">Nothing scheduled — enjoy the recovery.</p>
          </div>
        ) : allDone ? (
          <div className="px-5 py-10 text-center">
            <p className="text-4xl mb-3">💪</p>
            <p className="text-[17px] font-semibold text-[#2C1810]">All done with workouts for today!</p>
            {note && (
              <p className="text-[13px] text-[#8B7355] mt-3 italic px-4">
                💬 {note.tip}
              </p>
            )}
          </div>
        ) : (
          <div className="px-4 flex flex-col gap-2.5">
            {items.map(item => (
              <WorkoutItemRow
                key={item.id}
                item={item}
                completed={completedIds.has(item.id)}
                exercises={exercisesByItem[item.id] ?? []}
                exerciseCompletions={exCompletedIds}
                date={date}
                onToggle={handleToggle}
                onExerciseCompletionsChange={setExCompletedIds}
              />
            ))}

            {/* Coach tip */}
            {note && (
              <div className="bg-[#FDF8F3] border border-[#E8E0D5] rounded-2xl px-4 py-3 mt-1">
                <p className="text-[12px] text-[#8B7355] italic">💬 {note.tip}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
