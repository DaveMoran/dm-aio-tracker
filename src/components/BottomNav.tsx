import type { ReactElement } from 'react'
import type { TabId } from '../types'

interface TabDef {
  id: TabId
  label: string
  icon: (active: boolean) => ReactElement
}

const tabs: TabDef[] = [
  {
    id: 'checklist',
    label: 'Daily',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
          stroke={active ? '#5A8A6A' : '#B8A89A'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <rect x="9" y="3" width="6" height="4" rx="1" stroke={active ? '#5A8A6A' : '#B8A89A'} strokeWidth="1.8" />
        <path d="M9 12l2 2 4-4" stroke={active ? '#5A8A6A' : '#B8A89A'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'routine',
    label: 'Routine',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        {/* Sun + moon split icon representing morning/evening */}
        <circle cx="12" cy="12" r="4" stroke={active ? '#5A8A6A' : '#B8A89A'} strokeWidth="1.8" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          stroke={active ? '#5A8A6A' : '#B8A89A'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'lists',
    label: 'Lists',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M8 6h13" stroke={active ? '#5A8A6A' : '#B8A89A'} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 12h13" stroke={active ? '#5A8A6A' : '#B8A89A'} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 18h13" stroke={active ? '#5A8A6A' : '#B8A89A'} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="3.5" cy="6" r="1" fill={active ? '#5A8A6A' : '#B8A89A'} />
        <circle cx="3.5" cy="12" r="1" fill={active ? '#5A8A6A' : '#B8A89A'} />
        <circle cx="3.5" cy="18" r="1" fill={active ? '#5A8A6A' : '#B8A89A'} />
      </svg>
    ),
  },
  {
    id: 'workout',
    label: 'Workout',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
          stroke={active ? '#5A8A6A' : '#B8A89A'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'food',
    label: 'Food',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M18 8h1a4 4 0 010 8h-1"
          stroke={active ? '#5A8A6A' : '#B8A89A'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"
          stroke={active ? '#5A8A6A' : '#B8A89A'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M6 1v3M10 1v3M14 1v3" stroke={active ? '#5A8A6A' : '#B8A89A'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'bootcamp',
    label: 'Bootcamp',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <polyline
          points="16 18 22 12 16 6"
          stroke={active ? '#5A8A6A' : '#B8A89A'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="8 6 2 12 8 18"
          stroke={active ? '#5A8A6A' : '#B8A89A'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

interface Props {
  active: TabId
  onChange: (tab: TabId) => void
}

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#E8E0D5] pb-safe"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
    >
      <div className="flex">
        {tabs.map((tab) => {
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
      </div>
    </nav>
  )
}
