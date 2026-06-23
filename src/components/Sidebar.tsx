import type { TabId } from '../types'
import { navItems } from '../lib/navItems'
import SignOutIcon from './SignOutIcon'

interface Props {
  active: TabId
  onChange: (tab: TabId) => void
  onSignOut?: () => void
  className?: string
}

/**
 * Labeled vertical navigation rail for tablet/desktop widths. Hidden on mobile
 * (the caller passes `hidden md:flex`); the mobile BottomNav covers phones.
 */
export default function Sidebar({ active, onChange, onSignOut, className = '' }: Props) {
  return (
    <aside
      className={`w-56 shrink-0 flex-col bg-white border-r border-[#E8E0D5] ${className}`}
      style={{ paddingTop: 'max(env(safe-area-inset-top), 20px)' }}
    >
      {/* App mark */}
      <div className="px-5 pb-6 pt-1">
        <p className="text-[11px] font-medium text-[#B8A89A] uppercase tracking-widest">All-in-one</p>
        <p className="text-[20px] font-semibold text-[#2C1810] font-display leading-tight">Tracker</p>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = item.id === active
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors',
                isActive ? 'bg-[#EBF3ED]' : 'hover:bg-[#F7F3EE]',
              ].join(' ')}
            >
              {item.icon(isActive)}
              <span
                className={[
                  'text-[15px] font-medium',
                  isActive ? 'text-[#5A8A6A]' : 'text-[#8B7355]',
                ].join(' ')}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Sign out, pinned to the bottom */}
      {onSignOut && (
        <div className="px-3 pt-2" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}>
          <button
            type="button"
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[#F7F3EE] transition-colors"
          >
            <SignOutIcon />
            <span className="text-[15px] font-medium text-[#8B7355]">Sign out</span>
          </button>
        </div>
      )}
    </aside>
  )
}
