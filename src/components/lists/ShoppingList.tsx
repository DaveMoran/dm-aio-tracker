import { useState, useEffect, useCallback } from 'react'
import type { ShoppingItem, ShoppingCategory } from '../../types'
import {
  fetchShoppingItems,
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
} from '../../lib/listsStorage'
import ShoppingSheet from './ShoppingSheet'

const CATEGORIES: ShoppingCategory[] = ['Groceries', 'Productivity', 'Gifts']

const CATEGORY_EMOJI: Record<ShoppingCategory, string> = {
  Groceries: '🛒',
  Productivity: '📦',
  Gifts: '🎁',
}

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ShoppingCategory | 'All'>('All')
  const [sheet, setSheet] = useState<{ open: boolean; item?: ShoppingItem }>({ open: false })

  const load = useCallback(async () => {
    try {
      setItems(await fetchShoppingItems())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleToggle = async (item: ShoppingItem) => {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, completed: !i.completed } : i))
    await updateShoppingItem(item.id, { completed: !item.completed })
  }

  const handleSave = async (name: string, category: ShoppingCategory) => {
    if (sheet.item) {
      setItems(prev => prev.map(i => i.id === sheet.item!.id ? { ...i, name, category } : i))
      await updateShoppingItem(sheet.item.id, { name, category })
    } else {
      const newItem = await addShoppingItem(name, category)
      setItems(prev => [...prev, newItem])
    }
  }

  const handleDelete = async (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
    await deleteShoppingItem(id)
  }

  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter)
  const active = filtered.filter(i => !i.completed)
  const completed = filtered.filter(i => i.completed)

  if (loading) {
    return <div className="flex-1 flex items-center justify-center">
      <div className="w-7 h-7 rounded-full border-2 border-[#E8E0D5] border-t-[#5A8A6A] animate-spin" />
    </div>
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32">
      {/* Category filter */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        {(['All', ...CATEGORIES] as const).map(c => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={[
              'flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors',
              filter === c
                ? 'bg-[#5A8A6A] text-white'
                : 'bg-white text-[#8B7355] border border-[#E8E0D5]',
            ].join(' ')}
          >
            {c !== 'All' ? `${CATEGORY_EMOJI[c]} ` : ''}{c}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="px-4 flex flex-col gap-2">
        {active.length === 0 && completed.length === 0 && (
          <div className="text-center py-16 text-[#B8A89A] text-[14px]">
            No items yet — tap + to add one
          </div>
        )}

        {active.map(item => (
          <ItemRow
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
              <ItemRow
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
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#5A8A6A] rounded-full shadow-lg flex items-center justify-center"
        style={{ boxShadow: '0 4px 16px rgba(90,138,106,0.4)' }}
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {sheet.open && (
        <ShoppingSheet
          item={sheet.item}
          onSave={handleSave}
          onDelete={sheet.item ? () => handleDelete(sheet.item!.id) : undefined}
          onClose={() => setSheet({ open: false })}
        />
      )}
    </div>
  )
}

function ItemRow({ item, onToggle, onEdit }: { item: ShoppingItem; onToggle: () => void; onEdit: () => void }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 border border-[#E8E0D5]">
      <button type="button" onClick={onToggle} className="flex-shrink-0">
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
        <p className={['text-[15px]', item.completed ? 'text-[#B8A89A] line-through' : 'text-[#2C1810]'].join(' ')}>
          {item.name}
        </p>
        <p className="text-[11px] text-[#B8A89A] mt-0.5">{item.category}</p>
      </button>
    </div>
  )
}
