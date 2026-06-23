import { useState, useEffect } from 'react'
import type { TabId } from './types'
import type { Session } from './lib/auth'
import { onAuthStateChange, signOut } from './lib/auth'
import { setAccessToken } from './lib/checklistApi'
import { setBootcampAccessToken } from './lib/bootcampApi'
import { setNutritionAccessToken } from './lib/mealStorage'
import { TABLET_QUERY } from './lib/useMediaQuery'
import BottomNav from './components/BottomNav'
import Sidebar from './components/Sidebar'
import LoginPage from './components/auth/LoginPage'
import DashboardPage from './components/DashboardPage'
import RoutinePage from './components/routine/RoutinePage'
import ListsPage from './components/lists/ListsPage'
import WorkoutPage from './components/workout/WorkoutPage'
import FoodPage from './components/food/FoodPage'
import BootcampPage from './components/bootcamp/BootcampPage'

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  // Land on the dashboard on tablet/desktop; keep phones on the routine they're
  // used to. This is the initial default only — switching tabs works everywhere.
  const [activeTab, setActiveTab] = useState<TabId>(() =>
    window.matchMedia(TABLET_QUERY).matches ? 'dashboard' : 'routine',
  )

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((s) => {
      setSession(s)
      setAccessToken(s?.access_token ?? null)
      setBootcampAccessToken(s?.access_token ?? null)
      setNutritionAccessToken(s?.access_token ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Still resolving initial session
  if (session === undefined) return null

  if (!session) return <LoginPage />

  return (
    <div className="flex flex-col md:flex-row min-h-dvh bg-[#F7F3EE]">
      <Sidebar className="hidden md:flex" active={activeTab} onChange={setActiveTab} onSignOut={signOut} />
      <main className="flex-1 min-w-0 flex flex-col w-full max-w-[430px] mx-auto md:max-w-none md:mx-0">
        {activeTab === 'dashboard' && <DashboardPage onNavigate={setActiveTab} />}
        {activeTab === 'routine' && <RoutinePage />}
        {activeTab === 'lists' && <ListsPage />}
        {activeTab === 'workout' && <WorkoutPage />}
        {activeTab === 'food' && <FoodPage />}
        {activeTab === 'bootcamp' && <BootcampPage />}
        <BottomNav className="md:hidden" active={activeTab} onChange={setActiveTab} onSignOut={signOut} />
      </main>
    </div>
  )
}
