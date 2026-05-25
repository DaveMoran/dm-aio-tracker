interface Props {
  title: string
  description: string
  icon: string
  phase: number
}

export default function ComingSoon({ title, description, icon, phase }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 pb-24 text-center">
      <div className="w-20 h-20 rounded-3xl bg-[#EBF3ED] flex items-center justify-center mb-5 text-4xl">
        {icon}
      </div>
      <p className="text-[11px] font-semibold text-[#5A8A6A] uppercase tracking-widest mb-2">
        Phase {phase}
      </p>
      <h2 className="text-[22px] font-semibold text-[#2C1810] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h2>
      <p className="text-[15px] text-[#8B7355] leading-relaxed max-w-[260px]">
        {description}
      </p>
      <div className="mt-6 px-4 py-2 bg-[#EBF3ED] rounded-full">
        <span className="text-[13px] font-medium text-[#5A8A6A]">Coming soon</span>
      </div>
    </div>
  )
}
