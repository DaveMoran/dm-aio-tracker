import { useState, useEffect, useRef, useCallback } from 'react'
import type { WeekSummary } from '../../types'
import {
  todayString, getWeekAndDay, weekLabel, formatDateRange, fetchWeekSummaries,
} from '../../lib/workoutStorage'
import { PLAN_START } from '../../data/workoutPlanData'

interface Props {
  onSelectWeek: (weekNumber: number) => void
  /** Week currently shown in the detail pane (tablet dual-pane only). */
  selectedWeek?: number | null
}

export default function WeeklyOverviewPage({ onSelectWeek, selectedWeek }: Props) {
  const [summaries, setSummaries] = useState<WeekSummary[]>([])
  const [loading, setLoading] = useState(true)
  const currentWeekRef = useRef<HTMLButtonElement>(null)

  const today = todayString()
  const planStartDate = new Date(PLAN_START + 'T00:00:00')
  const todayDate = new Date(today + 'T00:00:00')
  const planHasStarted = todayDate >= planStartDate
  const { week: currentWeek } = planHasStarted ? getWeekAndDay(today) : { week: -1 }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchWeekSummaries()
      setSummaries(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!loading && currentWeekRef.current) {
      currentWeekRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [loading])

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-5 pt-14 pb-3 md:pt-8">
        <p className="text-[13px] font-medium text-[#8B7355] uppercase tracking-widest">Fitness</p>
        <p className="text-[20px] font-semibold text-[#2C1810] mt-1">Weekly Overview</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-28 md:pb-8">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-7 h-7 rounded-full border-2 border-[#E8E0D5] border-t-[#5A8A6A] animate-spin" />
          </div>
        ) : (
          <div className="px-4 flex flex-col gap-2.5">
            {summaries.map(s => {
              const isCurrent = s.week_number === currentWeek
              const isSelected = s.week_number === selectedWeek
              const isPast = s.week_number < currentWeek
              const allDone = s.total > 0 && s.completed >= s.total
              const pct = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0

              return (
                <button
                  key={s.week_number}
                  ref={isCurrent ? currentWeekRef : undefined}
                  type="button"
                  onClick={() => onSelectWeek(s.week_number)}
                  className={[
                    'w-full text-left rounded-2xl border px-4 py-3.5 transition-colors',
                    isSelected
                      ? 'bg-[#EBF3ED] border-[#5A8A6A]'
                      : isCurrent
                        ? 'bg-white border-[#5A8A6A] border-l-4'
                        : 'bg-white border-[#E8E0D5]',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[15px] font-semibold text-[#2C1810]">
                        {weekLabel(s.week_number)}
                      </p>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold text-[#5A8A6A] bg-[#EAF2EC] px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                      {isPast && allDone && (
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                          <circle cx="8" cy="8" r="8" fill="#5A8A6A" />
                          <path d="M4.5 8L7 10.5L11.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <svg viewBox="0 0 8 14" fill="none" className="w-2 h-3.5 flex-shrink-0">
                      <path d="M1 1l6 6-6 6" stroke="#B8A89A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <p className="text-[12px] text-[#8B7355] mb-2">
                    {formatDateRange(s.week_number)}
                  </p>

                  {s.goal && (
                    <p className="text-[12px] text-[#B8A89A] mb-2.5 leading-snug">{s.goal}</p>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-[#F0EBE3] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#5A8A6A] transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[12px] font-medium text-[#8B7355] whitespace-nowrap">
                      {s.completed}/{s.total}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
