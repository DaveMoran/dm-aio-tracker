import type { TabId } from '../types'
import { navItems } from '../lib/navItems'
import SignOutIcon from './SignOutIcon'

interface Props {
  active: TabId
  onChange: (tab: TabId) => void
  onSignOut?: () => void
  className?: string
}

export default function BottomNav({ active, onChange, onSignOut, className = '' }: Props) {
  return (
    <nav
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#E8E0D5] ${className}`}
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
    >
      <div className="flex">
        {navItems.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className="flex-1 flex flex-col items-center gap-0.5 pt-2 pb-1"
            >
              {tab.icon(isActive)}
              <span
                className={[
                  'text-[10px] font-medium',
                  isActive ? 'text-[#5A8A6A]' : 'text-[#B8A89A]',
                ].join(' ')}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
        {onSignOut && (
          <button
            type="button"
            onClick={onSignOut}
            title="Sign out"
            className="flex flex-col items-center gap-0.5 pt-2 pb-1 px-2"
          >
            <SignOutIcon />
            <span className="text-[10px] font-medium text-[#B8A89A]">Out</span>
          </button>
        )}
      </div>
    </nav>
  )
}
