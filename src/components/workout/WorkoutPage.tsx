import { useState } from 'react'
import WeeklyOverviewPage from './WeeklyOverviewPage'
import WeekDetailPage from './WeekDetailPage'

export default function WorkoutPage() {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)

  if (selectedWeek !== null) {
    return <WeekDetailPage weekNumber={selectedWeek} onBack={() => setSelectedWeek(null)} />
  }
  return <WeeklyOverviewPage onSelectWeek={setSelectedWeek} />
}
