import { useState, useEffect, useCallback } from 'react'
import type { BootcampDay, BootcampWeek } from '../../data/bootcampData'
import { getWeekForDate, getNearestWeek, defaultDateForWeek } from '../../data/bootcampData'
import { fetchCompletions, toggleCompletion } from '../../lib/bootcampStorage'

// ── helpers ──────────────────────────────────────────────────────────────────

function todayString() {
  return new Date().toISOString().split('T')[0]
}

function addDays(d: string, n: number): string {
  const date = new Date(d + 'T00:00:00')
  date.setDate(date.getDate() + n)
  return date.toISOString().split('T')[0]
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

// ── section header styles ────────────────────────────────────────────────────

const BLOCK_STYLES: Record<string, { bg: string; text: string }> = {
  'Morning Block':   { bg: 'bg-[#FFF8EE]', text: 'text-[#C8903A]' },
  'Evening Block':   { bg: 'bg-[#EEF3FF]', text: 'text-[#5A7A9A]' },
  'Afternoon Block': { bg: 'bg-[#F5F0FF]', text: 'text-[#7A5A9A]' },
}

// ── small reusable checkbox row ───────────────────────────────────────────────

function CheckRow({
  id, text, subtext, done, onToggle,
}: {
  id: string; text: string; subtext?: string; done: boolean; onToggle: (id: string, v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(id, !done)}
      className="flex items-start gap-3 text-left w-full py-2"
    >
      <span className={[
        'w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all',
        done ? 'bg-[#5A8A6A] border-[#5A8A6A]' : 'border-[#C8B8A8]',
      ].join(' ')}>
        {done && (
          <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="flex-1 min-w-0">
        <span className={['text-[14px] leading-snug', done ? 'text-[#B8A89A] line-through' : 'text-[#2C1810]'].join(' ')}>
          {text}
        </span>
        {subtext && <span className="block text-[11px] text-[#B8A89A] mt-0.5">{subtext}</span>}
      </span>
    </button>
  )
}

// ── acceptance criteria panel ─────────────────────────────────────────────────

function AcPanel({
  week, completions, onToggle, expanded, onToggleExpand,
}: {
  week: BootcampWeek; completions: Set<string>; onToggle: (id: string, v: boolean) => void;
  expanded: boolean; onToggleExpand: () => void;
}) {
  const total = week.acceptanceCriteria.length
  const done = week.acceptanceCriteria.filter(a => completions.has(a.id)).length

  return (
    <div className="bg-white border-b border-[#E8E0D5]">
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between px-5 py-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-[#2C1810]">Week {week.weekNumber} Acceptance Criteria</span>
          <span className={[
            'text-[11px] font-bold px-2 py-0.5 rounded-full',
            done === total ? 'bg-[#EAF2EC] text-[#5A8A6A]' : 'bg-[#F0EBE3] text-[#8B7355]',
          ].join(' ')}>
            {done}/{total}
          </span>
        </div>
        <svg viewBox="0 0 10 6" fill="none" className={['w-3 h-3 transition-transform', expanded ? 'rotate-180' : ''].join(' ')}>
          <path d="M1 1l4 4 4-4" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {expanded && (
        <div className="px-5 pb-3 flex flex-col gap-0.5 border-t border-[#F0EBE3] pt-2">
          {week.acceptanceCriteria.map(ac => (
            <CheckRow key={ac.id} id={ac.id} text={ac.text} done={completions.has(ac.id)} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── day content ───────────────────────────────────────────────────────────────

function DayContent({
  day, completions, onToggle,
}: {
  day: BootcampDay; completions: Set<string>; onToggle: (id: string, v: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-3 px-4 pt-2 pb-28">
      {/* Learning focus */}
      {day.learningFocus && (
        <div className="bg-[#FDF8F3] border border-[#E8E0D5] rounded-2xl px-4 py-3">
          <p className="text-[12px] text-[#8B7355] italic">💡 {day.learningFocus}</p>
        </div>
      )}

      {/* Evening note (e.g. Run Club) */}
      {day.eveningNote && (
        <div className="bg-[#EAF2EC] rounded-xl px-3 py-2">
          <p className="text-[12px] text-[#5A8A6A] font-medium">🏃 Evening: {day.eveningNote}</p>
        </div>
      )}

      {/* Schedule blocks */}
      {day.blocks.map((block, bi) => {
        const style = BLOCK_STYLES[block.name] ?? { bg: 'bg-[#F7F3EE]', text: 'text-[#8B7355]' }
        return (
          <div key={bi} className="bg-white border border-[#E8E0D5] rounded-2xl overflow-hidden">
            <div className={['flex items-center justify-between px-4 py-2.5', style.bg].join(' ')}>
              <span className={['text-[12px] font-semibold uppercase tracking-wide', style.text].join(' ')}>
                {block.name}
              </span>
              <span className="text-[11px] text-[#B8A89A]">{block.timeRange}</span>
            </div>
            <div className="px-4 divide-y divide-[#F5F0EB]">
              {block.tasks.map(task => (
                <CheckRow
                  key={task.id}
                  id={task.id}
                  text={task.text}
                  subtext={task.timeRange}
                  done={completions.has(task.id)}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </div>
        )
      })}

      {/* Homework */}
      {day.homework && (
        <div className="bg-white border border-[#E8E0D5] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#EEF7EE]">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-[#5A8A6A]">
              Homework
              {day.homework.optional && (
                <span className="ml-2 text-[10px] font-normal normal-case text-[#8B7355] bg-[#F0EBE3] px-1.5 py-0.5 rounded-full">
                  optional
                </span>
              )}
            </span>
            {day.homework.note && (
              <span className="text-[11px] text-[#B8A89A] italic">{day.homework.note}</span>
            )}
          </div>
          <div className="px-4 divide-y divide-[#F5F0EB]">
            {day.homework.questions.map((q, qi) => (
              <CheckRow
                key={q.id}
                id={q.id}
                text={`Q${qi + 1}: ${q.text}`}
                done={completions.has(q.id)}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      )}

      {/* Exercises */}
      {day.exercises?.map(ex => (
        <div key={ex.number} className="bg-white border border-[#E8E0D5] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#FFF3EE]">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-[#B86A3A]">
              Exercise {ex.number}: {ex.title}
            </span>
            <span className="text-[11px] text-[#B8A89A]">{ex.difficulty} · {ex.timeEstimate}</span>
          </div>
          <div className="px-4 divide-y divide-[#F5F0EB]">
            {ex.acceptanceCriteria.map(ac => (
              <CheckRow
                key={ac.id}
                id={ac.id}
                text={ac.text}
                done={completions.has(ac.id)}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function BootcampPage() {
  const today = todayString()

  const [date, setDate] = useState(() => {
    const w = getWeekForDate(today) ?? getNearestWeek(today)
    return defaultDateForWeek(w, today)
  })

  const [completions, setCompletions] = useState<Set<string>>(new Set())
  const [acExpanded, setAcExpanded] = useState(false)
  const [loading, setLoading] = useState(true)

  const week: BootcampWeek = getWeekForDate(date) ?? getNearestWeek(today)
  const day: BootcampDay | undefined = week.days.find(d => d.fullDate === date)

  const canGoPrev = date > week.startDate
  const canGoNext = date < week.endDate
  const isToday = date === today

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setCompletions(await fetchCompletions())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleToggle = async (itemKey: string, complete: boolean) => {
    setCompletions(prev => {
      const next = new Set(prev)
      if (complete) next.add(itemKey)
      else next.delete(itemKey)
      return next
    })
    await toggleCompletion(itemKey, complete)
  }

  const acDone = week.acceptanceCriteria.filter(a => completions.has(a.id)).length

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Acceptance criteria panel — always visible at top */}
      <div className="pt-14">
        <AcPanel
          week={week}
          completions={completions}
          onToggle={handleToggle}
          expanded={acExpanded}
          onToggleExpand={() => setAcExpanded(e => !e)}
        />
      </div>

      {/* Date navigation */}
      <div className="px-5 py-3 border-b border-[#F0EBE3]">
        <div className="flex items-center justify-between">
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
            <p className="text-[17px] font-semibold text-[#2C1810]">{formatDate(date)}</p>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              {isToday && <span className="text-[11px] text-[#5A8A6A] font-medium">Today</span>}
              {day && (
                <span className="text-[11px] text-[#B8A89A]">{day.hours}h</span>
              )}
              {acDone === week.acceptanceCriteria.length && (
                <span className="text-[11px] text-[#5A8A6A] font-semibold">Week complete 🎉</span>
              )}
            </div>
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
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-7 h-7 rounded-full border-2 border-[#E8E0D5] border-t-[#5A8A6A] animate-spin" />
          </div>
        ) : day ? (
          <DayContent day={day} completions={completions} onToggle={handleToggle} />
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="text-3xl mb-3">📅</p>
            <p className="text-[15px] font-semibold text-[#2C1810]">No content for this day</p>
            <p className="text-[13px] text-[#B8A89A] mt-1">Week {week.weekNumber} runs {week.dates}</p>
          </div>
        )}
      </div>
    </div>
  )
}
