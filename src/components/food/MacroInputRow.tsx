interface Props {
  label: string
  unit: string
  value: number | null
  min: number
  max: number
  onBlur: (value: number | null) => void
}

function rangeColor(value: number | null, min: number, max: number): string {
  if (value === null) return 'text-[#B8A89A]'
  if (value < min) return 'text-[#C8903A]'
  if (value > max) return 'text-[#D4433A]'
  return 'text-[#5A8A6A]'
}

function formatTarget(min: number, max: number, unit: string): string {
  if (unit === 'kcal') return `/ ${min.toLocaleString()}–${max.toLocaleString()} kcal`
  return `/ ${min}–${max}${unit}`
}

export default function MacroInputRow({ label, unit, value, min, max, onBlur }: Props) {
  const color = rangeColor(value, min, max)

  return (
    <div className="bg-white border border-[#E8E0D5] rounded-2xl px-4 py-3.5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-semibold text-[#8B7355] uppercase tracking-wide">{label}</span>
        <span className="text-[12px] text-[#B8A89A]">{formatTarget(min, max, unit)}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <input
          type="number"
          min={0}
          inputMode="numeric"
          defaultValue={value ?? ''}
          key={value ?? 'empty'}
          placeholder="—"
          onBlur={e => {
            const raw = e.target.value.trim()
            onBlur(raw === '' ? null : Number(raw))
          }}
          className={[
            'w-full text-[28px] font-bold bg-transparent outline-none placeholder-[#D8CFC8]',
            color,
          ].join(' ')}
        />
        {unit !== 'kcal' && value !== null && (
          <span className={['text-[16px] font-semibold', color].join(' ')}>{unit}</span>
        )}
      </div>
    </div>
  )
}
