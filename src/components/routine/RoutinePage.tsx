import { useState, useEffect, useCallback } from 'react'
import type { ChecklistTask } from '../../lib/checklistApi'
import {
  fetchChecklist,
  toggleTask,
  createTask,
  deleteTask,
} from '../../lib/checklistApi'
import { todayString, addDays, formatDisplayDate } from '../../lib/mealStorage'
import ProgressRing from '../checklist/ProgressRing'

const MIN_DATE = addDays(todayString(), -730)

// ── Main page ──────────────────────────────────────────────────────────────

export default function RoutinePage() {
  const [date, setDate] = useState(todayString())
  const [morning, setMorning] = useState<ChecklistTask[]>([])
  const [evening, setEvening] = useState<ChecklistTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)

  const isToday = date === todayString()

  const load = useCallback(async (d: string) => {
    setError(null)
    setLoading(true)
    try {
      const data = await fetchChecklist(d)
      setMorning(data.morning)
      setEvening(data.evening)
    } catch (e) {
      console.error(e)
      setError('Could not reach the checklist API. Check your connection or try again later.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(date) }, [date, load])

  const handleToggle = async (task: ChecklistTask) => {
    if (!isToday) return
    const newVal = !task.completed
    const setList = task.period === 'AM' ? setMorning : setEvening

    setList(prev => prev.map(t => t.id === task.id ? { ...t, completed: newVal } : t))

    try {
      const updated = await toggleTask(task.id, newVal, date)
      setList(prev => prev.map(t => t.id === task.id ? updated : t))
    } catch {
      setList(prev => prev.map(t => t.id === task.id ? { ...t, completed: task.completed } : t))
    }
  }

  const handleAdd = async (name: string, period: 'AM' | 'PM') => {
    if (!isToday) return
    const list = period === 'AM' ? morning : evening
    const nextOrder = list.length > 0 ? Math.max(...list.map(t => t.sort_order)) + 1 : 1

    try {
      const created = await createTask(name, period, nextOrder)
      if (period === 'AM') {
        setMorning(prev => [...prev, created])
      } else {
        setEvening(prev => [...prev, created])
      }
    } catch {
      // No optimistic insert — show nothing on failure, let user retry
    }
  }

  const handleDelete = async (task: ChecklistTask) => {
    if (!isToday) return
    const setList = task.period === 'AM' ? setMorning : setEvening

    setList(prev => prev.filter(t => t.id !== task.id))

    try {
      await deleteTask(task.id)
    } catch {
      setList(prev => {
        const already = prev.find(t => t.id === task.id)
        if (already) return prev
        return [...prev, task].sort((a, b) => a.sort_order - b.sort_order)
      })
    }
  }

  const goBack = () => {
    if (date <= MIN_DATE) return
    setDate(d => addDays(d, -1))
  }

  const goForward = () => {
    if (isToday) return
    setDate(d => addDays(d, 1))
  }

  const handleCalendarChange = (newDate: string) => {
    if (newDate >= MIN_DATE && newDate <= todayString()) {
      setDate(newDate)
    }
    setShowCalendar(false)
  }

  const totalTasks = morning.length + evening.length
  const totalCompleted = morning.filter(t => t.completed).length + evening.filter(t => t.completed).length

  // ── States ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#E8E0D5] border-t-[#5A8A6A] animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-[#FDF3E3] flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
            <path d="M12 8v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="#C8903A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-[#2C1810] font-medium text-[15px]">API Unreachable</p>
        <p className="text-[#8B7355] text-[13px] leading-relaxed">{error}</p>
        <button
          type="button"
          onClick={() => load(date)}
          className="mt-2 px-5 py-2.5 bg-[#5A8A6A] text-white text-[14px] font-semibold rounded-full"
        >
          Try Again
        </button>
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Header */}
        <div className="px-5 pt-14 pb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-medium text-[#8B7355] uppercase tracking-widest">
              Routine
            </p>
            <ProgressRing completed={totalCompleted} total={totalTasks} />
          </div>

          {/* Date navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={date <= MIN_DATE}
              className="w-9 h-9 rounded-full bg-white border border-[#E8E0D5] flex items-center justify-center disabled:opacity-30"
              aria-label="Previous day"
            >
              <svg viewBox="0 0 8 14" fill="none" className="w-2 h-3.5">
                <path d="M7 1L1 7l6 6" stroke="#8B7355" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setShowCalendar(true)}
              className="text-center"
              aria-label="Pick a date"
            >
              <p className="text-[17px] font-semibold text-[#2C1810]">{formatDisplayDate(date)}</p>
              {isToday
                ? <p className="text-[11px] text-[#5A8A6A] font-medium mt-0.5">Today</p>
                : <p className="text-[11px] text-[#B8A89A] font-medium mt-0.5">View only</p>
              }
            </button>

            <button
              type="button"
              onClick={goForward}
              disabled={isToday}
              className="w-9 h-9 rounded-full bg-white border border-[#E8E0D5] flex items-center justify-center disabled:opacity-30"
              aria-label="Next day"
            >
              <svg viewBox="0 0 8 14" fill="none" className="w-2 h-3.5">
                <path d="M1 1l6 6-6 6" stroke="#8B7355" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sections */}
        <RoutineSection
          label="Morning"
          emoji="☀️"
          period="AM"
          tasks={morning}
          onToggle={handleToggle}
          onAdd={handleAdd}
          onDelete={handleDelete}
          readonly={!isToday}
        />

        <RoutineSection
          label="Evening"
          emoji="🌙"
          period="PM"
          tasks={evening}
          onToggle={handleToggle}
          onAdd={handleAdd}
          onDelete={handleDelete}
          readonly={!isToday}
        />
      </div>

      {/* Calendar date picker sheet */}
      {showCalendar && (
        <DatePickerSheet
          value={date}
          min={MIN_DATE}
          max={todayString()}
          onSelect={handleCalendarChange}
          onDismiss={() => setShowCalendar(false)}
        />
      )}
    </>
  )
}

// ── Date picker sheet ──────────────────────────────────────────────────────

interface DatePickerSheetProps {
  value: string
  min: string
  max: string
  onSelect: (date: string) => void
  onDismiss: () => void
}

function DatePickerSheet({ value, min, max, onSelect, onDismiss }: DatePickerSheetProps) {
  const [picked, setPicked] = useState(value)

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onDismiss}
      />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-3xl px-5 pt-5 pb-10 safe-area-bottom shadow-2xl">
        <div className="w-10 h-1 rounded-full bg-[#E8E0D5] mx-auto mb-5" />
        <p className="text-[15px] font-semibold text-[#2C1810] mb-4">Jump to date</p>
        <input
          type="date"
          value={picked}
          min={min}
          max={max}
          onChange={e => setPicked(e.target.value)}
          className="w-full text-[16px] text-[#2C1810] bg-[#F7F3EE] rounded-xl px-4 py-3 outline-none border border-[#E8E0D5]"
        />
        <div className="flex gap-3 mt-5">
          <button
            type="button"
            onClick={onDismiss}
            className="flex-1 py-3 rounded-full border border-[#E8E0D5] text-[14px] font-semibold text-[#8B7355]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => picked && onSelect(picked)}
            className="flex-1 py-3 rounded-full bg-[#5A8A6A] text-[14px] font-semibold text-white"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Section ────────────────────────────────────────────────────────────────

interface SectionProps {
  label: string
  emoji: string
  period: 'AM' | 'PM'
  tasks: ChecklistTask[]
  onToggle: (task: ChecklistTask) => void
  onAdd: (name: string, period: 'AM' | 'PM') => void
  onDelete: (task: ChecklistTask) => void
  readonly: boolean
}

function RoutineSection({ label, emoji, period, tasks, onToggle, onAdd, onDelete, readonly }: SectionProps) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)

  const done = tasks.filter(t => t.completed).length

  const submitNew = async () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    setSaving(true)
    try {
      await onAdd(trimmed, period)
      setNewName('')
      setAdding(false)
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submitNew()
    if (e.key === 'Escape') { setAdding(false); setNewName('') }
  }

  return (
    <div className="mx-4 mb-4">
      {/* Section header */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{emoji}</span>
          <span className="text-[13px] font-semibold text-[#8B7355] uppercase tracking-wider">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#B8A89A]">{done}/{tasks.length}</span>
          {!readonly && (
            <button
              type="button"
              onClick={() => setAdding(v => !v)}
              className="w-6 h-6 rounded-full bg-[#EBF3ED] flex items-center justify-center transition-colors active:bg-[#5A8A6A]/20"
              aria-label={`Add ${label} task`}
            >
              <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none">
                <path d="M7 2v10M2 7h10" stroke="#5A8A6A" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Task list */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8E0D5]">
        {tasks.length === 0 && !adding && (
          <p className="px-4 py-5 text-center text-[13px] text-[#B8A89A]">
            {readonly ? 'No tasks recorded for this day' : 'No tasks yet — tap + to add one'}
          </p>
        )}

        {tasks.map((task, i) => (
          <div key={task.id}>
            <RoutineTaskRow
              task={task}
              onToggle={() => onToggle(task)}
              onDelete={() => onDelete(task)}
              readonly={readonly}
            />
            {(i < tasks.length - 1 || adding) && (
              <div className="mx-4 h-px bg-[#F0EBE3]" />
            )}
          </div>
        ))}

        {/* Inline add form */}
        {adding && (
          <div className="flex items-center gap-2 px-4 py-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-[#E8E0D5]" />
            <input
              autoFocus
              type="text"
              placeholder="New task…"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-[15px] text-[#2C1810] bg-transparent outline-none placeholder:text-[#B8A89A]"
              style={{ fontSize: '16px' }}
            />
            <button
              type="button"
              onClick={submitNew}
              disabled={saving || !newName.trim()}
              className="flex-shrink-0 text-[13px] font-semibold text-[#5A8A6A] disabled:text-[#B8A89A] transition-colors"
            >
              {saving ? '…' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => { setAdding(false); setNewName('') }}
              className="flex-shrink-0 text-[13px] text-[#B8A89A]"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Task row ───────────────────────────────────────────────────────────────

interface TaskRowProps {
  task: ChecklistTask
  onToggle: () => void
  onDelete: () => void
  readonly: boolean
}

function RoutineTaskRow({ task, onToggle, onDelete, readonly }: TaskRowProps) {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-[#F7F3EE]">
      {/* Checkbox */}
      <button
        type="button"
        onClick={readonly ? undefined : onToggle}
        disabled={readonly}
        className="flex-shrink-0 disabled:cursor-default"
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        <span className={[
          'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
          task.completed ? 'bg-[#5A8A6A] border-[#5A8A6A]' : 'border-[#B8A89A] bg-transparent',
        ].join(' ')}>
          {task.completed && (
            <svg viewBox="0 0 12 9" fill="none" className="w-3 h-3">
              <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </button>

      {/* Task name */}
      <span
        className={[
          'flex-1 text-[15px] leading-snug select-none',
          task.completed
            ? 'text-[#B8A89A] line-through decoration-[#B8A89A]'
            : 'text-[#2C1810]',
        ].join(' ')}
        onClick={readonly ? undefined : () => setShowDelete(v => !v)}
      >
        {task.name}
      </span>

      {/* Delete button — only shown on today, revealed on tap */}
      {!readonly && (
        showDelete ? (
          <button
            type="button"
            onClick={() => { setShowDelete(false); onDelete() }}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-[#FDECEA] transition-colors"
            aria-label="Delete task"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
              <path d="M2 4h12M5.5 4V3a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M7 7.5v4M9 7.5v4M3.5 4l.8 8.5a.5.5 0 00.5.5h6.4a.5.5 0 00.5-.5L12.5 4"
                stroke="#D4433A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <span className="w-7" />
        )
      )}
    </div>
  )
}
