import type { Task } from '../../types'

interface Props {
  task: Task
  completed: boolean
  onToggle: (taskId: string, completed: boolean) => void
}

export default function TaskItem({ task, completed, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={() => onToggle(task.id, completed)}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-[#F7F3EE]"
    >
      <span
        className={[
          'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
          completed
            ? 'bg-[#5A8A6A] border-[#5A8A6A]'
            : 'border-[#B8A89A] bg-transparent',
        ].join(' ')}
      >
        {completed && (
          <svg
            viewBox="0 0 12 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3"
          >
            <path
              d="M1 4L4.5 7.5L11 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span
        className={[
          'flex-1 text-[15px] leading-snug',
          completed
            ? 'text-[#B8A89A] line-through decoration-[#B8A89A]'
            : 'text-[#2C1810]',
        ].join(' ')}
      >
        {task.name}
      </span>
    </button>
  )
}
