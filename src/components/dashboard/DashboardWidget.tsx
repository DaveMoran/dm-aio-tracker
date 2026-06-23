import type { ReactNode } from 'react'

interface Props {
  title: string
  onClick: () => void
  children: ReactNode
}

/** Tappable card chrome shared by every dashboard summary tile. */
export default function DashboardWidget({ title, onClick, children }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-white rounded-2xl border border-[#E8E0D5] p-5 flex flex-col gap-3 transition-all hover:border-[#D8CFC8] hover:shadow-sm active:scale-[0.99]"
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold text-[#8B7355] uppercase tracking-wider">{title}</span>
        <svg viewBox="0 0 8 14" fill="none" className="w-2 h-3 flex-shrink-0">
          <path d="M1 1l6 6-6 6" stroke="#B8A89A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="min-h-[64px] flex flex-col justify-center">{children}</div>
    </button>
  )
}
