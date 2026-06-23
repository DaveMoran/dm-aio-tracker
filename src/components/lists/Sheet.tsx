import { useEffect, useState, type ReactNode } from 'react'

interface Props {
  title: string
  onClose: () => void
  children: ReactNode
}

export default function Sheet({ title, onClose, children }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const close = () => {
    setVisible(false)
    setTimeout(onClose, 280)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center md:p-6">
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-280 ${visible ? 'opacity-30' : 'opacity-0'}`}
        onClick={close}
      />
      {/* Bottom sheet on mobile; centered dialog on tablet */}
      <div
        className={[
          'relative w-full max-w-[430px] md:max-w-md mx-auto bg-white rounded-t-3xl md:rounded-3xl md:max-h-[85vh] md:overflow-y-auto transition-all duration-280 ease-out',
          visible
            ? 'translate-y-0 opacity-100 md:scale-100'
            : 'translate-y-full opacity-100 md:translate-y-0 md:opacity-0 md:scale-95',
        ].join(' ')}
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 24px)' }}
      >
        <div className="w-10 h-1 bg-[#E8E0D5] rounded-full mx-auto mt-3 mb-1 md:hidden" />
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#F0EBE3]">
          <span className="text-[17px] font-semibold text-[#2C1810]">{title}</span>
          <button
            type="button"
            onClick={close}
            className="w-7 h-7 rounded-full bg-[#F0EBE3] flex items-center justify-center"
          >
            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#8B7355" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-5 pt-4 pb-2">{children}</div>
      </div>
    </div>
  )
}
