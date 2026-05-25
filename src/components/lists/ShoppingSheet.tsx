import { useState } from 'react'
import type { ShoppingCategory, ShoppingItem } from '../../types'
import Sheet from './Sheet'

const CATEGORIES: ShoppingCategory[] = ['Groceries', 'Productivity', 'Gifts']

interface Props {
  item?: ShoppingItem
  onSave: (name: string, category: ShoppingCategory) => void
  onDelete?: () => void
  onClose: () => void
}

export default function ShoppingSheet({ item, onSave, onDelete, onClose }: Props) {
  const [name, setName] = useState(item?.name ?? '')
  const [category, setCategory] = useState<ShoppingCategory>(item?.category ?? 'Groceries')

  const handleSave = () => {
    if (!name.trim()) return
    onSave(name.trim(), category)
    onClose()
  }

  return (
    <Sheet title={item ? 'Edit Item' : 'Add Item'} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-[12px] font-semibold text-[#8B7355] uppercase tracking-wider mb-1.5 block">
            Item Name
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="e.g. Olive oil"
            className="w-full px-4 py-3 rounded-xl bg-[#F7F3EE] text-[15px] text-[#2C1810] placeholder-[#B8A89A] outline-none focus:ring-2 focus:ring-[#5A8A6A]/30"
          />
        </div>

        <div>
          <label className="text-[12px] font-semibold text-[#8B7355] uppercase tracking-wider mb-1.5 block">
            Category
          </label>
          <div className="flex gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={[
                  'flex-1 py-2 rounded-xl text-[13px] font-medium transition-colors',
                  category === c
                    ? 'bg-[#5A8A6A] text-white'
                    : 'bg-[#F7F3EE] text-[#8B7355]',
                ].join(' ')}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full py-3.5 bg-[#5A8A6A] text-white font-semibold rounded-xl text-[15px] disabled:opacity-40 mt-1"
        >
          {item ? 'Save Changes' : 'Add Item'}
        </button>

        {onDelete && (
          <button
            type="button"
            onClick={() => { onDelete(); onClose() }}
            className="w-full py-3 text-[#C0392B] text-[14px] font-medium"
          >
            Delete Item
          </button>
        )}
      </div>
    </Sheet>
  )
}
