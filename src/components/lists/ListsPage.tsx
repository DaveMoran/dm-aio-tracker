import { useState } from 'react'
import ShoppingList from './ShoppingList'
import TodoList from './TodoList'

type ListTab = 'shopping' | 'todo'

export default function ListsPage() {
  const [active, setActive] = useState<ListTab>('shopping')

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Page header */}
      <div className="px-5 pt-14 pb-3">
        <p className="text-[13px] font-medium text-[#8B7355] uppercase tracking-widest mb-1">Lists</p>
        {/* Segmented control */}
        <div className="flex bg-[#E8E0D5] rounded-xl p-1 mt-3">
          <button
            type="button"
            onClick={() => setActive('shopping')}
            className={[
              'flex-1 py-2 rounded-lg text-[14px] font-semibold transition-all',
              active === 'shopping'
                ? 'bg-white text-[#2C1810] shadow-sm'
                : 'text-[#8B7355]',
            ].join(' ')}
          >
            🛒 Shopping
          </button>
          <button
            type="button"
            onClick={() => setActive('todo')}
            className={[
              'flex-1 py-2 rounded-lg text-[14px] font-semibold transition-all',
              active === 'todo'
                ? 'bg-white text-[#2C1810] shadow-sm'
                : 'text-[#8B7355]',
            ].join(' ')}
          >
            ✅ To-Do
          </button>
        </div>
      </div>

      {active === 'shopping' ? <ShoppingList /> : <TodoList />}
    </div>
  )
}
