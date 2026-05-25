import { useState, useEffect, useCallback } from 'react'
import type { Task, TaskCompletion } from '../../types'
import { fetchTasks, fetchCompletions, toggleCompletion, todayStr } from '../../lib/storage'
import { isSupabaseConfigured } from '../../lib/supabase'
import TaskItem from './TaskItem'
import ProgressRing from './ProgressRing'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

function formatDate(d: Date) {
  return `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`
}

export default function ChecklistPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [completions, setCompletions] = useState<TaskCompletion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const today = todayStr()

  const load = useCallback(async () => {
    try {
      const [t, c] = await Promise.all([fetchTasks(), fetchCompletions(today)])
      setTasks(t)
      setCompletions(c)
    } catch (e) {
      setError('Failed to load tasks.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [today])

  useEffect(() => {
    load()
  }, [load])

  const handleToggle = async (taskId: string, currentlyComplete: boolean) => {
    // Optimistic update
    setCompletions(prev =>
      currentlyComplete
        ? prev.filter(c => c.task_id !== taskId)
        : [...prev, { id: `${taskId}-${today}`, task_id: taskId, date: today, completed_at: new Date().toISOString() }],
    )
    try {
      await toggleCompletion(taskId, today, currentlyComplete)
    } catch {
      // Revert on failure
      load()
    }
  }

  const completedIds = new Set(completions.map(c => c.task_id))
  const amTasks = tasks.filter(t => t.period === 'AM')
  const pmTasks = tasks.filter(t => t.period === 'PM')
  const totalCompleted = tasks.filter(t => completedIds.has(t.id)).length

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#E8E0D5] border-t-[#5A8A6A] animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <p className="text-[#8B7355] text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Header */}
      <div className="px-5 pt-14 pb-5">
        <p className="text-[13px] font-medium text-[#8B7355] uppercase tracking-widest mb-1">
          Daily Check-in
        </p>
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-semibold text-[#2C1810] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {formatDate(new Date())}
          </h1>
          <ProgressRing completed={totalCompleted} total={tasks.length} />
        </div>

        {!isSupabaseConfigured && (
          <div className="mt-3 px-3 py-2 bg-[#FDF3E3] rounded-xl border border-[#E8D5B0]">
            <p className="text-[12px] text-[#C8903A]">
              Running in offline mode — add Supabase credentials to sync across devices.
            </p>
          </div>
        )}
      </div>

      {/* AM Section */}
      <Section
        label="Morning"
        emoji="☀️"
        tasks={amTasks}
        completedIds={completedIds}
        onToggle={handleToggle}
      />

      {/* PM Section */}
      <Section
        label="Evening"
        emoji="🌙"
        tasks={pmTasks}
        completedIds={completedIds}
        onToggle={handleToggle}
      />
    </div>
  )
}

interface SectionProps {
  label: string
  emoji: string
  tasks: Task[]
  completedIds: Set<string>
  onToggle: (id: string, done: boolean) => void
}

function Section({ label, emoji, tasks, completedIds, onToggle }: SectionProps) {
  const done = tasks.filter(t => completedIds.has(t.id)).length

  return (
    <div className="mx-4 mb-4">
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{emoji}</span>
          <span className="text-[13px] font-semibold text-[#8B7355] uppercase tracking-wider">
            {label}
          </span>
        </div>
        <span className="text-[12px] text-[#B8A89A]">
          {done}/{tasks.length}
        </span>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8E0D5]">
        {tasks.map((task, i) => (
          <div key={task.id}>
            <TaskItem
              task={task}
              completed={completedIds.has(task.id)}
              onToggle={onToggle}
            />
            {i < tasks.length - 1 && (
              <div className="mx-4 h-px bg-[#F0EBE3]" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
