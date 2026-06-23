import { useState, type ReactNode } from 'react'
import { useMediaQuery, TABLET_QUERY } from '../../lib/useMediaQuery'
import ShoppingList from './ShoppingList'
import TodoList from './TodoList'

type ListTab = 'shopping' | 'todo'

function ListColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-0">
      <p className="text-[14px] font-semibold text-[#2C1810] px-1 pb-2 flex-shrink-0">{title}</p>
      {children}
    </div>
  )
}

export default function ListsPage() {
  const isTablet = useMediaQuery(TABLET_QUERY)
  const [active, setActive] = useState<ListTab>('shopping')

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Page header */}
      <div className="px-5 pt-14 pb-3 md:pt-8">
        <p className="text-[13px] font-medium text-[#8B7355] uppercase tracking-widest mb-1">Lists</p>
        {/* Segmented control — mobile only; tablet shows both lists at once */}
        {!isTablet && (
          <div className="flex bg-[#E8E0D5] rounded-xl p-1 mt-3">
            <button
              type="button"
              onClick={() => setActive('shopping')}
              className={[
                'flex-1 py-2 rounded-lg text-[14px] font-semibold transition-all',
                active === 'shopping' ? 'bg-white text-[#2C1810] shadow-sm' : 'text-[#8B7355]',
              ].join(' ')}
            >
              🛒 Shopping
            </button>
            <button
              type="button"
              onClick={() => setActive('todo')}
              className={[
                'flex-1 py-2 rounded-lg text-[14px] font-semibold transition-all',
                active === 'todo' ? 'bg-white text-[#2C1810] shadow-sm' : 'text-[#8B7355]',
              ].join(' ')}
            >
              ✅ To-Do
            </button>
          </div>
        )}
      </div>

      {isTablet ? (
        <div className="grid grid-cols-2 gap-5 px-4 pb-4 flex-1 min-h-0">
          <ListColumn title="🛒 Shopping"><ShoppingList /></ListColumn>
          <ListColumn title="✅ To-Do"><TodoList /></ListColumn>
        </div>
      ) : (
        active === 'shopping' ? <ShoppingList /> : <TodoList />
      )}
    </div>
  )
}
