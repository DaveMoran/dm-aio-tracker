import { useState } from 'react'
import type { DayTargets } from '../../types'
import { DAY_NAMES } from '../../data/mealPlanData'

interface Props {
  targets: DayTargets[]
  onSave: (targets: DayTargets[]) => void
  onCancel: () => void
}

type Field = 'calories_min' | 'calories_max' | 'protein_min' | 'protein_max' | 'carbs_min' | 'carbs_max' | 'fat_min' | 'fat_max'

const MACROS: { label: string; minKey: Field; maxKey: Field; unit: string }[] = [
  { label: 'Calories', minKey: 'calories_min', maxKey: 'calories_max', unit: 'kcal' },
  { label: 'Protein',  minKey: 'protein_min',  maxKey: 'protein_max',  unit: 'g' },
  { label: 'Carbs',    minKey: 'carbs_min',    maxKey: 'carbs_max',    unit: 'g' },
  { label: 'Fat',      minKey: 'fat_min',      maxKey: 'fat_max',      unit: 'g' },
]

export default function EditTargetsSheet({ targets, onSave, onCancel }: Props) {
  const [draft, setDraft] = useState<DayTargets[]>(targets.map(t => ({ ...t })))

  const update = (dow: number, key: Field, raw: string) => {
    const val = parseInt(raw, 10)
    if (isNaN(val)) return
    setDraft(prev => prev.map(t => t.day_of_week === dow ? { ...t, [key]: val } : t))
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FDF6F0]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4 border-b border-[#E8E0D5]">
        <button type="button" onClick={onCancel} className="text-[14px] text-[#8B7355]">
          Cancel
        </button>
        <p className="text-[15px] font-semibold text-[#2C1810]">Edit Targets</p>
        <button type="button" onClick={() => onSave(draft)} className="text-[14px] font-semibold text-[#5A8A6A]">
          Save
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5 pb-12">
        {draft.map(t => (
          <div key={t.day_of_week}>
            <p className="text-[13px] font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
              {DAY_NAMES[t.day_of_week]}
            </p>
            <div className="bg-white border border-[#E8E0D5] rounded-2xl overflow-hidden divide-y divide-[#F0EBE3]">
              {MACROS.map(({ label, minKey, maxKey, unit }) => (
                <div key={label} className="flex items-center px-4 py-3 gap-3">
                  <span className="text-[13px] text-[#2C1810] w-20 flex-shrink-0">{label}</span>
                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="number"
                      inputMode="numeric"
                      defaultValue={t[minKey]}
                      onBlur={e => update(t.day_of_week, minKey, e.target.value)}
                      className="w-full text-[14px] font-semibold text-[#2C1810] bg-[#F7F3EE] rounded-lg px-2.5 py-1.5 text-center outline-none focus:ring-1 focus:ring-[#5A8A6A]"
                    />
                    <span className="text-[#B8A89A] text-[12px]">–</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      defaultValue={t[maxKey]}
                      onBlur={e => update(t.day_of_week, maxKey, e.target.value)}
                      className="w-full text-[14px] font-semibold text-[#2C1810] bg-[#F7F3EE] rounded-lg px-2.5 py-1.5 text-center outline-none focus:ring-1 focus:ring-[#5A8A6A]"
                    />
                    <span className="text-[11px] text-[#B8A89A] w-8 flex-shrink-0">{unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
