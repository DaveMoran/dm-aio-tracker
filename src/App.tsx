import { useState } from 'react'
import type { TabId } from './types'
import BottomNav from './components/BottomNav'
import ChecklistPage from './components/checklist/ChecklistPage'
import ListsPage from './components/lists/ListsPage'
import WorkoutPage from './components/workout/WorkoutPage'
import FoodPage from './components/food/FoodPage'
import ComingSoon from './components/placeholder/ComingSoon'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('checklist')

  return (
    <div className="flex flex-col min-h-dvh bg-[#F7F3EE]">
      {activeTab === 'checklist' && <ChecklistPage />}
      {activeTab === 'lists' && <ListsPage />}
      {activeTab === 'workout' && <WorkoutPage />}
      {activeTab === 'food' && <FoodPage />}
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
