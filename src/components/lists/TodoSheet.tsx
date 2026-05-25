import { useState } from 'react'
import type { Priority, TodoItem } from '../../types'
import Sheet from './Sheet'

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Med' },
  { value: 'low', label: 'Low' },
]

const PRIORITY_COLORS: Record<Priority, string> = {
  high: 'bg-[#D4433A] text-white',
  medium: 'bg-[#C8903A] text-white',
  low: 'bg-[#8B7355] text-white',
}

interface Props {
  item?: TodoItem
  onSave: (name: string, priority: Priority | null, due_date: string | null) => void
  onDelete?: () => void
  onClose: () => void
}

export default function TodoSheet({ item, onSave, onDelete, onClose }: Props) {
  const [name, setName] = useState(item?.name ?? '')
  const [priority, setPriority] = useState<Priority | null>(item?.priority ?? null)
  const [dueDate, setDueDate] = useState(item?.due_date ?? '')

  const handleSave = () => {
    if (!name.trim()) return
    onSave(name.trim(), priority, dueDate || null)
    onClose()
  }

  return (
    <Sheet title={item ? 'Edit Task' : 'Add Task'} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-[12px] font-semibold text-[#8B7355] uppercase tracking-wider mb-1.5 block">
            Task
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="What needs to get done?"
            className="w-full px-4 py-3 rounded-xl bg-[#F7F3EE] text-[15px] text-[#2C1810] placeholder-[#B8A89A] outline-none focus:ring-2 focus:ring-[#5A8A6A]/30"
          />
        </div>

        <div>
          <label className="text-[12px] font-semibold text-[#8B7355] uppercase tracking-wider mb-1.5 block">
            Priority
          </label>
          <div className="flex gap-2">
            {PRIORITIES.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(priority === p.value ? null : p.value)}
                className={[
                  'flex-1 py-2 rounded-xl text-[13px] font-medium transition-colors',
                  priority === p.value ? PRIORITY_COLORS[p.value] : 'bg-[#F7F3EE] text-[#8B7355]',
                ].join(' ')}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[12px] font-semibold text-[#8B7355] uppercase tracking-wider mb-1.5 block">
            Due Date <span className="text-[#B8A89A] normal-case font-normal">(optional)</span>
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#F7F3EE] text-[15px] text-[#2C1810] outline-none focus:ring-2 focus:ring-[#5A8A6A]/30"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full py-3.5 bg-[#5A8A6A] text-white font-semibold rounded-xl text-[15px] disabled:opacity-40 mt-1"
        >
          {item ? 'Save Changes' : 'Add Task'}
        </button>

        {onDelete && (
          <button
            type="button"
            onClick={() => { onDelete(); onClose() }}
            className="w-full py-3 text-[#C0392B] text-[14px] font-medium"
          >
            Delete Task
          </button>
        )}
      </div>
    </Sheet>
  )
}
