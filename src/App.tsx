import { useState, useEffect } from 'react'
import type { TabId } from './types'
import BottomNav from './components/BottomNav'
import RoutinePage from './components/routine/RoutinePage'
import ListsPage from './components/lists/ListsPage'
import WorkoutPage from './components/workout/WorkoutPage'
import FoodPage from './components/food/FoodPage'
import BootcampPage from './components/bootcamp/BootcampPage'
import { initCapacitor } from './lib/capacitor'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('routine')

  useEffect(() => {
    initCapacitor()
  }, [])

  return (
    <div
      className="flex flex-col bg-[#F7F3EE]"
      style={{
        height: '100dvh',
        // Push content below the Dynamic Island / status bar
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'routine' && <RoutinePage />}
        {activeTab === 'lists' && <ListsPage />}
        {activeTab === 'workout' && <WorkoutPage />}
        {activeTab === 'food' && <FoodPage />}
        {activeTab === 'bootcamp' && <BootcampPage />}
      </div>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
