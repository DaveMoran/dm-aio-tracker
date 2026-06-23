import { useState } from 'react'
import { useMediaQuery, TABLET_QUERY } from '../../lib/useMediaQuery'
import { todayString, getWeekAndDay } from '../../lib/workoutStorage'
import WeeklyOverviewPage from './WeeklyOverviewPage'
import WeekDetailPage from './WeekDetailPage'

const MAX_WEEK = 27

export default function WorkoutPage() {
  const isTablet = useMediaQuery(TABLET_QUERY)
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)

  if (isTablet) {
    // Dual-pane: the overview stays on the left while the selected week (or the
    // current week by default) fills the detail pane on the right.
    const { week } = getWeekAndDay(todayString())
    const detailWeek = selectedWeek ?? Math.min(Math.max(week, 1), MAX_WEEK)
    return (
      <div className="flex flex-1 min-h-0">
        <div className="w-2/5 max-w-sm shrink-0 border-r border-[#E8E0D5] flex flex-col min-h-0">
          <WeeklyOverviewPage onSelectWeek={setSelectedWeek} selectedWeek={detailWeek} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          <WeekDetailPage key={detailWeek} weekNumber={detailWeek} onBack={() => setSelectedWeek(null)} />
        </div>
      </div>
    )
  }

  if (selectedWeek !== null) {
    return <WeekDetailPage weekNumber={selectedWeek} onBack={() => setSelectedWeek(null)} />
  }
  return <WeeklyOverviewPage onSelectWeek={setSelectedWeek} />
}
