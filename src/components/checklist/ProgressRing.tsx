interface Props {
  completed: number
  total: number
  size?: number
}

export default function ProgressRing({ completed, total, size = 64 }: Props) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const progress = total === 0 ? 0 : completed / total
  const dash = progress * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E8E0D5"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#5A8A6A"
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
      </svg>
      <span className="absolute text-[13px] font-semibold text-[#2C1810]">
        {completed}/{total}
      </span>
    </div>
  )
}
