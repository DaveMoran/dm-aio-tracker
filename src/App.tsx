import { useState } from 'react'
import type { TabId } from './types'
import BottomNav from './components/BottomNav'
import ChecklistPage from './components/checklist/ChecklistPage'
import ComingSoon from './components/placeholder/ComingSoon'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('checklist')

  return (
    <div className="flex flex-col min-h-dvh bg-[#F7F3EE]">
      {activeTab === 'checklist' && <ChecklistPage />}
      {activeTab === 'shopping' && (
        <ComingSoon
          phase={2}
          title="Shopping List"
          description="A smart grocery and shopping list to keep you organized."
          icon="🛒"
        />
      )}
      {activeTab === 'workout' && (
        <ComingSoon
          phase={3}
          title="Workout Tracker"
          description="Track your marathon training runs, mileage, and weekly plans."
          icon="🏃"
        />
      )}
      {activeTab === 'food' && (
        <ComingSoon
          phase={4}
          title="Food Tracker"
          description="Log meals, track macros, and build healthy eating habits."
          icon="🥗"
        />
      )}
      {activeTab === 'bootcamp' && (
        <ComingSoon
          phase={5}
          title="Coding Bootcamp"
          description="Track your curriculum progress, projects, and coding streaks."
          icon="💻"
        />
      )}
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
