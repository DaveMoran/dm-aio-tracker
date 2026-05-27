import { useState } from 'react'
import type { TabId } from './types'
import BottomNav from './components/BottomNav'
import ChecklistPage from './components/checklist/ChecklistPage'
import RoutinePage from './components/routine/RoutinePage'
import ListsPage from './components/lists/ListsPage'
import WorkoutPage from './components/workout/WorkoutPage'
import FoodPage from './components/food/FoodPage'
import BootcampPage from './components/bootcamp/BootcampPage'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('checklist')

  return (
    <div className="flex flex-col min-h-dvh bg-[#F7F3EE]">
      {activeTab === 'checklist' && <ChecklistPage />}
      {activeTab === 'routine' && <RoutinePage />}
      {activeTab === 'lists' && <ListsPage />}
      {activeTab === 'workout' && <WorkoutPage />}
      {activeTab === 'food' && <FoodPage />}
      {activeTab === 'bootcamp' && <BootcampPage />}
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
