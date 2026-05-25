import { useState, useEffect, useCallback } from 'react'
import type { DayTargets } from '../../types'
import {
  todayString, addDays, formatDisplayDate, dowForDate,
  fetchAllTargets, fetchLogForDate, saveLog, saveAllTargets,
} from '../../lib/mealStorage'
import MacroInputRow from './MacroInputRow'
import EditTargetsSheet from './EditTargetsSheet'

interface LogValues {
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
}

export default function FoodPage() {
  const [date, setDate] = useState(todayString())
  const [allTargets, setAllTargets] = useState<DayTargets[]>([])
  const [log, setLog] = useState<LogValues>({ calories: null, protein: null, carbs: null, fat: null })
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  const isToday = date === todayString()
  const dow = dowForDate(date)
  const targets = allTargets.find(t => t.day_of_week === dow)

  const load = useCallback(async (d: string) => {
    setLoading(true)
    try {
      const [rawTargets, rawLog] = await Promise.all([
        fetchAllTargets(),
        fetchLogForDate(d),
      ])
      setAllTargets(rawTargets)
      setLog(rawLog
        ? { calories: rawLog.calories, protein: rawLog.protein, carbs: rawLog.carbs, fat: rawLog.fat }
        : { calories: null, protein: null, carbs: null, fat: null }
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(date) }, [date, load])

  const handleBlur = async (field: keyof LogValues, value: number | null) => {
    const next = { ...log, [field]: value }
    setLog(next)
    await saveLog(date, next)
  }

  const handleSaveTargets = async (updated: DayTargets[]) => {
    setAllTargets(updated)
    setEditing(false)
    await saveAllTargets(updated)
  }

  return (
    <>
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="px-5 pt-14 pb-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[13px] font-medium text-[#8B7355] uppercase tracking-widest">Nutrition</p>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-[12px] font-medium text-[#8B7355] bg-[#F0EBE3] px-2.5 py-1 rounded-full"
            >
              Edit targets
            </button>
          </div>

          {/* Date navigation */}
          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              onClick={() => setDate(d => addDays(d, -1))}
              className="w-9 h-9 rounded-full bg-white border border-[#E8E0D5] flex items-center justify-center"
            >
              <svg viewBox="0 0 8 14" fill="none" className="w-2 h-3.5">
                <path d="M7 1L1 7l6 6" stroke="#8B7355" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="text-center">
              <p className="text-[17px] font-semibold text-[#2C1810]">{formatDisplayDate(date)}</p>
              {isToday && <p className="text-[11px] text-[#5A8A6A] font-medium mt-0.5">Today</p>}
            </div>

            <button
              type="button"
              onClick={() => setDate(d => addDays(d, 1))}
              className="w-9 h-9 rounded-full bg-white border border-[#E8E0D5] flex items-center justify-center"
            >
              <svg viewBox="0 0 8 14" fill="none" className="w-2 h-3.5">
                <path d="M1 1l6 6-6 6" stroke="#8B7355" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Macro inputs */}
        <div className="flex-1 overflow-y-auto pb-28 px-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-7 h-7 rounded-full border-2 border-[#E8E0D5] border-t-[#5A8A6A] animate-spin" />
            </div>
          ) : targets ? (
            <div className="flex flex-col gap-3 mt-1">
              <MacroInputRow
                label="Calories"
                unit="kcal"
                value={log.calories}
                min={targets.calories_min}
                max={targets.calories_max}
                onBlur={v => handleBlur('calories', v)}
              />
              <MacroInputRow
                label="Protein"
                unit="g"
                value={log.protein}
                min={targets.protein_min}
                max={targets.protein_max}
                onBlur={v => handleBlur('protein', v)}
              />
              <MacroInputRow
                label="Carbs"
                unit="g"
                value={log.carbs}
                min={targets.carbs_min}
                max={targets.carbs_max}
                onBlur={v => handleBlur('carbs', v)}
              />
              <MacroInputRow
                label="Fat"
                unit="g"
                value={log.fat}
                min={targets.fat_min}
                max={targets.fat_max}
                onBlur={v => handleBlur('fat', v)}
              />

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 pt-1 pb-2">
                <span className="flex items-center gap-1.5 text-[11px] text-[#C8903A]">
                  <span className="w-2 h-2 rounded-full bg-[#C8903A]" /> Under
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-[#5A8A6A]">
                  <span className="w-2 h-2 rounded-full bg-[#5A8A6A]" /> On target
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-[#D4433A]">
                  <span className="w-2 h-2 rounded-full bg-[#D4433A]" /> Over
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {editing && allTargets.length > 0 && (
        <EditTargetsSheet
          targets={allTargets}
          onSave={handleSaveTargets}
          onCancel={() => setEditing(false)}
        />
      )}
    </>
  )
}
