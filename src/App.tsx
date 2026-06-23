import { useState, useEffect } from 'react'
import type { TabId } from './types'
import type { Session } from './lib/auth'
import { onAuthStateChange, signOut } from './lib/auth'
import { setAccessToken } from './lib/checklistApi'
import { setBootcampAccessToken } from './lib/bootcampApi'
import BottomNav from './components/BottomNav'
import LoginPage from './components/auth/LoginPage'
import RoutinePage from './components/routine/RoutinePage'
import ListsPage from './components/lists/ListsPage'
import WorkoutPage from './components/workout/WorkoutPage'
import FoodPage from './components/food/FoodPage'
import BootcampPage from './components/bootcamp/BootcampPage'

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<TabId>('routine')

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((s) => {
      setSession(s)
      setAccessToken(s?.access_token ?? null)
      setBootcampAccessToken(s?.access_token ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Still resolving initial session
  if (session === undefined) return null

  if (!session) return <LoginPage />

  return (
    <div className="flex flex-col min-h-dvh bg-[#F7F3EE]">
      {activeTab === 'routine' && <RoutinePage />}
      {activeTab === 'lists' && <ListsPage />}
      {activeTab === 'workout' && <WorkoutPage />}
      {activeTab === 'food' && <FoodPage />}
      {activeTab === 'bootcamp' && <BootcampPage />}
      <BottomNav active={activeTab} onChange={setActiveTab} onSignOut={signOut} />
    </div>
  )
}
