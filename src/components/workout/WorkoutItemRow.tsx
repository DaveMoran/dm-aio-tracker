import { useState } from 'react'
import type { WorkoutScheduleItem, WorkoutProgramExercise } from '../../types'
import { toggleExerciseCompletion } from '../../lib/workoutStorage'

const CATEGORY_STYLES = {
  run:      { dot: 'bg-[#5A8A6A]', label: 'Run' },
  strength: { dot: 'bg-[#C8903A]', label: 'Strength' },
  race:     { dot: 'bg-[#D4433A]', label: 'Race' },
  cross:    { dot: 'bg-[#5A7A9A]', label: 'Cross' },
}

interface Props {
  item: WorkoutScheduleItem
  completed: boolean
  exercises: WorkoutProgramExercise[]
  exerciseCompletions: Set<string>
  date: string
  onToggle: (id: string, complete: boolean) => void
  onExerciseCompletionsChange: (newSet: Set<string>) => void
}

export default function WorkoutItemRow({
  item, completed, exercises, exerciseCompletions, date, onToggle, onExerciseCompletionsChange,
}: Props) {
  const [expanded, setExpanded] = useState(false)
  const cat = CATEGORY_STYLES[item.category]

  const isProgram = item.type === 'program' && exercises.length > 0
  const anyExerciseChecked = exercises.some(e => exerciseCompletions.has(e.id))
  const canCompleteProgram = !isProgram || anyExerciseChecked

  const handleToggle = () => {
    if (!canCompleteProgram) return
    onToggle(item.id, !completed)
  }

  const handleExerciseToggle = async (exerciseId: string) => {
    const nowComplete = !exerciseCompletions.has(exerciseId)
    await toggleExerciseCompletion(exerciseId, date, nowComplete)
    const next = new Set(exerciseCompletions)
    if (nowComplete) next.add(exerciseId)
    else next.delete(exerciseId)
    onExerciseCompletionsChange(next)

    // If unchecking an exercise and top-level was complete, uncheck top level too
    if (!nowComplete && completed) {
      const anyLeft = exercises.some(e => e.id !== exerciseId && next.has(e.id))
      if (!anyLeft) onToggle(item.id, false)
    }
  }

  return (
    <div className={[
      'rounded-2xl border transition-colors',
      completed ? 'bg-[#F7F3EE] border-[#E8E0D5]' : 'bg-white border-[#E8E0D5]',
    ].join(' ')}>
      {/* Main row */}
      <div className="flex items-start gap-3 px-4 py-3.5">
        {/* Checkbox */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={!canCompleteProgram}
          className="flex-shrink-0 mt-0.5 disabled:opacity-40"
        >
          <span className={[
            'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
            completed ? 'bg-[#5A8A6A] border-[#5A8A6A]' : 'border-[#B8A89A]',
          ].join(' ')}>
            {completed && (
              <svg viewBox="0 0 12 9" fill="none" className="w-3 h-3">
                <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={['w-2 h-2 rounded-full flex-shrink-0', cat.dot].join(' ')} />
            <p className={[
              'text-[15px] leading-snug',
              completed ? 'text-[#B8A89A] line-through' : 'text-[#2C1810]',
            ].join(' ')}>
              {item.label}
            </p>
          </div>
          {item.notes && (
            <p className="text-[12px] text-[#B8A89A] mt-0.5 pl-4">{item.notes}</p>
          )}
        </div>

        {/* Expand arrow for programs */}
        {isProgram && (
          <button
            type="button"
            onClick={() => setExpanded(e => !e)}
            className="flex-shrink-0 mt-0.5 p-1"
          >
            <svg viewBox="0 0 10 6" fill="none" className={['w-3 h-3 transition-transform', expanded ? 'rotate-180' : ''].join(' ')}>
              <path d="M1 1l4 4 4-4" stroke="#B8A89A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Program sub-exercises */}
      {isProgram && expanded && (
        <div className="border-t border-[#F0EBE3] px-4 py-2 flex flex-col gap-2 pb-3">
          {exercises.map(ex => {
            const exDone = exerciseCompletions.has(ex.id)
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => handleExerciseToggle(ex.id)}
                className="flex items-center gap-3 text-left"
              >
                <span className={[
                  'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
                  exDone ? 'bg-[#5A8A6A] border-[#5A8A6A]' : 'border-[#B8A89A]',
                ].join(' ')}>
                  {exDone && (
                    <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className={['text-[13px]', exDone ? 'text-[#B8A89A] line-through' : 'text-[#2C1810]'].join(' ')}>
                  {ex.label}
                </span>
              </button>
            )
          })}
          {!anyExerciseChecked && (
            <p className="text-[11px] text-[#B8A89A] italic pl-8">Check at least one exercise to mark complete</p>
          )}
        </div>
      )}
    </div>
  )
}
