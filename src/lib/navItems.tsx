import type { ReactElement } from 'react'
import type { TabId } from '../types'

export interface NavItem {
  id: TabId
  label: string
  icon: (active: boolean) => ReactElement
}

const stroke = (active: boolean) => (active ? '#5A8A6A' : '#B8A89A')

/**
 * Single source of truth for the primary navigation destinations, shared by
 * the mobile BottomNav and the tablet Sidebar so the two stay in lockstep.
 */
export const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Home',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M3 10.5L12 3l9 7.5" stroke={stroke(active)} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 9.5V20a1 1 0 001 1h12a1 1 0 001-1V9.5" stroke={stroke(active)} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 21v-6h5v6" stroke={stroke(active)} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'routine',
    label: 'Routine',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        {/* Sun + moon split icon representing morning/evening */}
        <circle cx="12" cy="12" r="4" stroke={stroke(active)} strokeWidth="1.8" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          stroke={stroke(active)} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'lists',
    label: 'Lists',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M8 6h13" stroke={stroke(active)} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 12h13" stroke={stroke(active)} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 18h13" stroke={stroke(active)} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="3.5" cy="6" r="1" fill={stroke(active)} />
        <circle cx="3.5" cy="12" r="1" fill={stroke(active)} />
        <circle cx="3.5" cy="18" r="1" fill={stroke(active)} />
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
          stroke={stroke(active)}
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
          stroke={stroke(active)}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"
          stroke={stroke(active)}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M6 1v3M10 1v3M14 1v3" stroke={stroke(active)} strokeWidth="1.8" strokeLinecap="round" />
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
          stroke={stroke(active)}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="8 6 2 12 8 18"
          stroke={stroke(active)}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]
