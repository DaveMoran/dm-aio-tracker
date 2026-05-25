import { useState, useEffect, useCallback } from 'react'
import type { TodoItem, Priority } from '../../types'
import {
  fetchTodoItems,
  addTodoItem,
  updateTodoItem,
  deleteTodoItem,
} from '../../lib/listsStorage'
import TodoSheet from './TodoSheet'

type PriorityFilter = 'All' | Priority
type SortKey = 'due_date' | 'priority' | 'created_at'

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
const PRIORITY_LABEL: Record<Priority, string> = { high: 'High', medium: 'Med', low: 'Low' }
const PRIORITY_COLOR: Record<Priority, string> = {
  high: 'bg-[#FDECEA] text-[#D4433A]',
  medium: 'bg-[#FDF3E3] text-[#C8903A]',
  low: 'bg-[#F0EBE3] text-[#8B7355]',
}

function formatDueDate(dateStr: string): { label: string; overdue: boolean } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr + 'T00:00:00')
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000)

  if (diffDays < 0) return { label: `${Math.abs(diffDays)}d overdue`, overdue: true }
  if (diffDays === 0) return { label: 'Today', overdue: false }
  if (diffDays === 1) return { label: 'Tomorrow', overdue: false }
  if (diffDays <= 6) return { label: `In ${diffDays} days`, overdue: false }
  return {
    label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    overdue: false,
  }
}

export default function TodoList() {
  const [items, setItems] = useState<TodoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<PriorityFilter>('All')
  const [sort, setSort] = useState<SortKey>('created_at')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [sheet, setSheet] = useState<{ open: boolean; item?: TodoItem }>({ open: false })

  const load = useCallback(async () => {
    try {
      setItems(await fetchTodoItems())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleToggle = async (item: TodoItem) => {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, completed: !i.completed } : i))
    await updateTodoItem(item.id, { completed: !item.completed })
  }

  const handleSave = async (name: string, priority: Priority | null, due_date: string | null) => {
    if (sheet.item) {
      setItems(prev => prev.map(i => i.id === sheet.item!.id ? { ...i, name, priority, due_date } : i))
      await updateTodoItem(sheet.item.id, { name, priority, due_date })
    } else {
      const newItem = await addTodoItem(name, priority, due_date)
      setItems(prev => [...prev, newItem])
    }
  }

  const handleDelete = async (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
    await deleteTodoItem(id)
  }

  const filtered = (filter === 'All' ? items : items.filter(i => i.priority === filter))
    .slice()
    .sort((a, b) => {
      if (sort === 'priority') {
        const pa = a.priority ? PRIORITY_ORDER[a.priority] : 99
        const pb = b.priority ? PRIORITY_ORDER[b.priority] : 99
        return pa - pb
      }
      if (sort === 'due_date') {
        if (!a.due_date && !b.due_date) return 0
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        return a.due_date.localeCompare(b.due_date)
      }
      return a.created_at.localeCompare(b.created_at)
    })

  const active = filtered.filter(i => !i.completed)
  const completed = filtered.filter(i => i.completed)

  const sortLabel = sort === 'due_date' ? 'Due Date' : sort === 'priority' ? 'Priority' : 'Newest'

  if (loading) {
    return <div className="flex-1 flex items-center justify-center">
      <div className="w-7 h-7 rounded-full border-2 border-[#E8E0D5] border-t-[#5A8A6A] animate-spin" />
    </div>
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32">
      {/* Filters + sort */}
      <div className="px-4 py-3 flex items-center gap-2">
        <div className="flex gap-2 flex-1 overflow-x-auto no-scrollbar">
          {(['All', 'high', 'medium', 'low'] as PriorityFilter[]).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setFilter(p)}
              className={[
                'flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors',
                filter === p
                  ? 'bg-[#5A8A6A] text-white'
                  : 'bg-white text-[#8B7355] border border-[#E8E0D5]',
              ].join(' ')}
            >
              {p === 'All' ? 'All' : PRIORITY_LABEL[p]}
            </button>
          ))}
        </div>

        {/* Sort button */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowSortMenu(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8E0D5] text-[13px] text-[#8B7355] font-medium"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
              <path d="M2 4h12M4 8h8M6 12h4" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {sortLabel}
          </button>
          {showSortMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
              <div className="absolute right-0 top-9 z-20 bg-white rounded-2xl border border-[#E8E0D5] shadow-lg overflow-hidden w-36">
                {([['created_at', 'Newest'], ['due_date', 'Due Date'], ['priority', 'Priority']] as [SortKey, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setSort(key); setShowSortMenu(false) }}
                    className={[
                      'w-full text-left px-4 py-3 text-[14px]',
                      sort === key ? 'text-[#5A8A6A] font-semibold' : 'text-[#2C1810]',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="px-4 flex flex-col gap-2">
        {active.length === 0 && completed.length === 0 && (
          <div className="text-center py-16 text-[#B8A89A] text-[14px]">
            No tasks yet — tap + to add one
          </div>
        )}

        {active.map(item => (
          <TodoItemRow
            key={item.id}
            item={item}
            onToggle={() => handleToggle(item)}
            onEdit={() => setSheet({ open: true, item })}
          />
        ))}

        {completed.length > 0 && (
          <>
            <p className="text-[11px] font-semibold text-[#B8A89A] uppercase tracking-widest mt-2 px-1">
              Completed
            </p>
            {completed.map(item => (
              <TodoItemRow
                key={item.id}
                item={item}
                onToggle={() => handleToggle(item)}
                onEdit={() => setSheet({ open: true, item })}
              />
            ))}
          </>
        )}
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={() => setSheet({ open: true })}
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#5A8A6A] rounded-full flex items-center justify-center"
        style={{ boxShadow: '0 4px 16px rgba(90,138,106,0.4)' }}
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {sheet.open && (
        <TodoSheet
          item={sheet.item}
          onSave={handleSave}
          onDelete={sheet.item ? () => handleDelete(sheet.item!.id) : undefined}
          onClose={() => setSheet({ open: false })}
        />
      )}
    </div>
  )
}

function TodoItemRow({ item, onToggle, onEdit }: { item: TodoItem; onToggle: () => void; onEdit: () => void }) {
  const due = item.due_date ? formatDueDate(item.due_date) : null

  return (
    <div className="flex items-start gap-3 bg-white rounded-2xl px-4 py-3.5 border border-[#E8E0D5]">
      <button type="button" onClick={onToggle} className="flex-shrink-0 mt-0.5">
        <span className={[
          'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
          item.completed ? 'bg-[#5A8A6A] border-[#5A8A6A]' : 'border-[#B8A89A]',
        ].join(' ')}>
          {item.completed && (
            <svg viewBox="0 0 12 9" fill="none" className="w-3 h-3">
              <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </button>

      <button type="button" onClick={onEdit} className="flex-1 text-left">
        <p className={['text-[15px] leading-snug', item.completed ? 'text-[#B8A89A] line-through' : 'text-[#2C1810]'].join(' ')}>
          {item.name}
        </p>
        {(item.priority || due) && (
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {item.priority && (
              <span className={['text-[11px] font-semibold px-2 py-0.5 rounded-full', PRIORITY_COLOR[item.priority]].join(' ')}>
                {PRIORITY_LABEL[item.priority]}
              </span>
            )}
            {due && (
              <span className={['text-[11px] font-medium', due.overdue ? 'text-[#D4433A]' : 'text-[#B8A89A]'].join(' ')}>
                {due.overdue ? '⚠ ' : ''}{due.label}
              </span>
            )}
          </div>
        )}
      </button>
    </div>
  )
}
