import { useEffect, useState } from 'react'
import type { TabId } from '../types'
import {
  todayString, formatDisplayDate, dowForDate,
  fetchAllTargets, fetchLogForDate,
} from '../lib/mealStorage'
import { fetchChecklist } from '../lib/checklistApi'
import { fetchShoppingItems, fetchTodoItems } from '../lib/listsStorage'
import { fetchWeekSummaries, getWeekAndDay, weekLabel } from '../lib/workoutStorage'
import { getWeekForDate, getNearestWeek } from '../data/bootcampData'
import { fetchBootcampState } from '../lib/bootcampStorage'
import ProgressRing from './checklist/ProgressRing'
import DashboardWidget from './dashboard/DashboardWidget'

type Loadable<T> = { status: 'loading' } | { status: 'ok'; data: T } | { status: 'error' }

const LOADING = { status: 'loading' } as const

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
  return (
    <div className="h-2 rounded-full bg-[#E8E0D5] overflow-hidden">
      <div className="h-full rounded-full bg-[#5A8A6A] transition-all" style={{ width: `${pct}%` }} />
    </div>
  )
}

function Skeleton() {
  return <div className="h-12 rounded-xl bg-[#F0EBE3] animate-pulse" />
}

function Unavailable() {
  return <p className="text-[13px] text-[#B8A89A]">Not available right now</p>
}

interface Props {
  onNavigate: (tab: TabId) => void
}

export default function DashboardPage({ onNavigate }: Props) {
  // The dashboard aggregates across sections, so it standardises "today" on the
  // nutrition module's timezone-aware value (America/New_York). The workout
  // widget derives its week from this same string; the underlying plan helpers
  // use UTC dates, so there can be a one-day skew at the very edge of midnight.
  const today = todayString()

  const [routine, setRoutine] = useState<Loadable<{ completed: number; total: number }>>(LOADING)
  const [lists, setLists] = useState<Loadable<{ shopping: number; todos: number }>>(LOADING)
  const [workout, setWorkout] = useState<Loadable<{ label: string; completed: number; total: number }>>(LOADING)
  const [macros, setMacros] = useState<Loadable<{ calories: number | null; min: number; max: number }>>(LOADING)
  const [bootcamp, setBootcamp] = useState<Loadable<{ label: string; completed: number; total: number }>>(LOADING)

  useEffect(() => {
    let cancelled = false

    fetchChecklist(today)
      .then(({ morning, evening }) => {
        if (cancelled) return
        const all = [...morning, ...evening]
        setRoutine({ status: 'ok', data: { completed: all.filter(t => t.completed).length, total: all.length } })
      })
      .catch(() => { if (!cancelled) setRoutine({ status: 'error' }) })

    Promise.all([fetchShoppingItems(), fetchTodoItems()])
      .then(([shop, todo]) => {
        if (cancelled) return
        setLists({ status: 'ok', data: { shopping: shop.filter(i => !i.completed).length, todos: todo.filter(i => !i.completed).length } })
      })
      .catch(() => { if (!cancelled) setLists({ status: 'error' }) })

    fetchWeekSummaries()
      .then(summaries => {
        if (cancelled) return
        const { week } = getWeekAndDay(today)
        const wk = summaries.find(s => s.week_number === week)
        setWorkout({ status: 'ok', data: { label: weekLabel(week) || 'Off plan', completed: wk?.completed ?? 0, total: wk?.total ?? 0 } })
      })
      .catch(() => { if (!cancelled) setWorkout({ status: 'error' }) })

    Promise.all([fetchAllTargets(), fetchLogForDate(today)])
      .then(([targets, log]) => {
        if (cancelled) return
        const t = targets.find(x => x.day_of_week === dowForDate(today))
        setMacros({ status: 'ok', data: { calories: log?.calories ?? null, min: t?.calories_min ?? 0, max: t?.calories_max ?? 0 } })
      })
      .catch(() => { if (!cancelled) setMacros({ status: 'error' }) })

    Promise.all([
      getWeekForDate(today).then(w => w ?? getNearestWeek(today)),
      fetchBootcampState(),
    ])
      .then(([week, state]) => {
        if (cancelled) return
        const total = week.acceptanceCriteria.length
        const completed = week.acceptanceCriteria.filter(a => state.completed.has(a.id)).length
        setBootcamp({ status: 'ok', data: { label: `Week ${week.weekNumber}`, completed, total } })
      })
      .catch(() => { if (!cancelled) setBootcamp({ status: 'error' }) })

    return () => { cancelled = true }
  }, [today])

  const calorieColor = (v: number | null, min: number, max: number) => {
    if (v === null) return 'text-[#B8A89A]'
    if (v < min) return 'text-[#C8903A]'
    if (v > max) return 'text-[#D4433A]'
    return 'text-[#5A8A6A]'
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
      <div className="px-5 pt-14 pb-6 md:px-8 md:pt-8 w-full md:max-w-6xl md:mx-auto">
        {/* Greeting */}
        <header className="mb-5 md:mb-7">
          <p className="text-[13px] font-medium text-[#8B7355]">{greeting()}</p>
          <h1 className="text-[26px] md:text-[30px] font-semibold text-[#2C1810] font-display leading-tight">
            {formatDisplayDate(today)}
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Routine */}
          <DashboardWidget title="Today's Routine" onClick={() => onNavigate('routine')}>
            {routine.status === 'loading' && <Skeleton />}
            {routine.status === 'error' && <Unavailable />}
            {routine.status === 'ok' && (
              <div className="flex items-center gap-4">
                <ProgressRing completed={routine.data.completed} total={routine.data.total} size={64} />
                <div>
                  <p className="text-[16px] font-semibold text-[#2C1810]">
                    {routine.data.total === 0 ? 'No tasks yet' : `${routine.data.completed} of ${routine.data.total} done`}
                  </p>
                  <p className="text-[13px] text-[#8B7355]">Morning &amp; evening</p>
                </div>
              </div>
            )}
          </DashboardWidget>

          {/* Lists */}
          <DashboardWidget title="Lists" onClick={() => onNavigate('lists')}>
            {lists.status === 'loading' && <Skeleton />}
            {lists.status === 'error' && <Unavailable />}
            {lists.status === 'ok' && (
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-[28px] font-bold text-[#2C1810] leading-none">{lists.data.shopping}</p>
                  <p className="text-[13px] text-[#8B7355] mt-1">shopping</p>
                </div>
                <div>
                  <p className="text-[28px] font-bold text-[#2C1810] leading-none">{lists.data.todos}</p>
                  <p className="text-[13px] text-[#8B7355] mt-1">to-do</p>
                </div>
              </div>
            )}
          </DashboardWidget>

          {/* Workout */}
          <DashboardWidget title="Workout" onClick={() => onNavigate('workout')}>
            {workout.status === 'loading' && <Skeleton />}
            {workout.status === 'error' && <Unavailable />}
            {workout.status === 'ok' && (
              <div className="flex flex-col gap-2.5">
                <p className="text-[16px] font-semibold text-[#2C1810]">{workout.data.label}</p>
                {workout.data.total === 0 ? (
                  <p className="text-[13px] text-[#8B7355]">Rest week — nothing scheduled</p>
                ) : (
                  <>
                    <ProgressBar completed={workout.data.completed} total={workout.data.total} />
                    <p className="text-[13px] text-[#8B7355]">{workout.data.completed}/{workout.data.total} complete</p>
                  </>
                )}
              </div>
            )}
          </DashboardWidget>

          {/* Macros */}
          <DashboardWidget title="Today's Macros" onClick={() => onNavigate('food')}>
            {macros.status === 'loading' && <Skeleton />}
            {macros.status === 'error' && <Unavailable />}
            {macros.status === 'ok' && (
              <div>
                <p className={['text-[28px] font-bold leading-none', calorieColor(macros.data.calories, macros.data.min, macros.data.max)].join(' ')}>
                  {macros.data.calories ?? '—'}
                </p>
                <p className="text-[13px] text-[#8B7355] mt-1.5">
                  {macros.data.max > 0 ? `/ ${macros.data.min.toLocaleString()}–${macros.data.max.toLocaleString()} kcal` : 'calories logged'}
                </p>
              </div>
            )}
          </DashboardWidget>

          {/* Bootcamp */}
          <DashboardWidget title="Bootcamp" onClick={() => onNavigate('bootcamp')}>
            {bootcamp.status === 'loading' && <Skeleton />}
            {bootcamp.status === 'error' && <Unavailable />}
            {bootcamp.status === 'ok' && (
              <div className="flex flex-col gap-2.5">
                <p className="text-[16px] font-semibold text-[#2C1810]">{bootcamp.data.label}</p>
                {bootcamp.data.total === 0 ? (
                  <p className="text-[13px] text-[#8B7355]">No acceptance criteria</p>
                ) : (
                  <>
                    <ProgressBar completed={bootcamp.data.completed} total={bootcamp.data.total} />
                    <p className="text-[13px] text-[#8B7355]">{bootcamp.data.completed}/{bootcamp.data.total} criteria met</p>
                  </>
                )}
              </div>
            )}
          </DashboardWidget>
        </div>
      </div>
    </div>
  )
}
