import { useState, useEffect, useCallback } from 'react'
import type { ChecklistTask } from '../../lib/checklistApi'
import {
  fetchChecklist,
  toggleTask,
  createTask,
  deleteTask,
} from '../../lib/checklistApi'
import ProgressRing from '../checklist/ProgressRing'

// ── Main page ──────────────────────────────────────────────────────────────

export default function RoutinePage() {
  const [morning, setMorning] = useState<ChecklistTask[]>([])
  const [evening, setEvening] = useState<ChecklistTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const data = await fetchChecklist()
      setMorning(data.morning)
      setEvening(data.evening)
    } catch (e) {
      console.error(e)
      setError('Could not reach the checklist API. Check your connection or try again later.')
    } finally {
      setLoading(false)
    }
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load() }, [load])

  // Toggle a task — optimistic update, revert on error
  const handleToggle = async (task: ChecklistTask) => {
    const newVal = !task.completed
    const setList = task.period === 'AM' ? setMorning : setEvening

    // Optimistic
    setList(prev => prev.map(t => t.id === task.id ? { ...t, completed: newVal } : t))

    try {
      const updated = await toggleTask(task.id, newVal)
      setList(prev => prev.map(t => t.id === task.id ? updated : t))
    } catch {
      // Revert
      setList(prev => prev.map(t => t.id === task.id ? { ...t, completed: task.completed } : t))
    }
  }

  // Add a task to a section
  const handleAdd = async (name: string, period: 'AM' | 'PM') => {
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

  // Delete a task
  const handleDelete = async (task: ChecklistTask) => {
    const setList = task.period === 'AM' ? setMorning : setEvening

    // Optimistic removal
    setList(prev => prev.filter(t => t.id !== task.id))

    try {
      await deleteTask(task.id)
    } catch {
      // Revert
      setList(prev => {
        const already = prev.find(t => t.id === task.id)
        if (already) return prev
        return [...prev, task].sort((a, b) => a.sort_order - b.sort_order)
      })
    }
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
          onClick={() => { setLoading(true); load() }}
          className="mt-2 px-5 py-2.5 bg-[#5A8A6A] text-white text-[14px] font-semibold rounded-full"
        >
          Try Again
        </button>
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Header */}
      <div className="px-5 pt-14 pb-5">
        <p className="text-[13px] font-medium text-[#8B7355] uppercase tracking-widest mb-1">
          Routine
        </p>
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-semibold text-[#2C1810] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Morning &amp; Evening
          </h1>
          <ProgressRing completed={totalCompleted} total={totalTasks} />
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
      />

      <RoutineSection
        label="Evening"
        emoji="🌙"
        period="PM"
        tasks={evening}
        onToggle={handleToggle}
        onAdd={handleAdd}
        onDelete={handleDelete}
      />
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
}

function RoutineSection({ label, emoji, period, tasks, onToggle, onAdd, onDelete }: SectionProps) {
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
        </div>
      </div>

      {/* Task list */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8E0D5]">
        {tasks.length === 0 && !adding && (
          <p className="px-4 py-5 text-center text-[13px] text-[#B8A89A]">
            No tasks yet — tap + to add one
          </p>
        )}

        {tasks.map((task, i) => (
          <div key={task.id}>
            <RoutineTaskRow
              task={task}
              onToggle={() => onToggle(task)}
              onDelete={() => onDelete(task)}
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
              style={{ fontSize: '16px' }} // prevent iOS auto-zoom
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
}

function RoutineTaskRow({ task, onToggle, onDelete }: TaskRowProps) {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-[#F7F3EE]"
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={onToggle}
        className="flex-shrink-0"
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
        onClick={() => setShowDelete(v => !v)}
      >
        {task.name}
      </span>

      {/* Delete button — revealed on tap */}
      {showDelete ? (
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
        // Spacer to keep layout stable
        <span className="w-7" />
      )}
    </div>
  )
}
