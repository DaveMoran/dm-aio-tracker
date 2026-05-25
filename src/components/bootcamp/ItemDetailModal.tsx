import { useState } from 'react'
import type { BootcampItemType } from '../../data/bootcampData'

const GH_PR_RE = /^https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+/

interface Props {
  type: Exclude<BootcampItemType, 'read'>
  text: string
  subtext?: string
  savedContent?: string
  onSave: (content: string) => void
  onClose: () => void
}

export default function ItemDetailModal({ type, text, subtext, savedContent, onSave, onClose }: Props) {
  const [value, setValue] = useState(savedContent ?? '')
  const isCode = type === 'code'

  const trimmed = value.trim()
  const isValid = isCode ? GH_PR_RE.test(trimmed) : trimmed.length > 0
  const showError = isCode && trimmed.length > 0 && !isValid

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F7F3EE]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 border-b border-[#E8E0D5] bg-white">
        <button
          type="button"
          onClick={onClose}
          className="text-[14px] text-[#8B7355] font-medium"
        >
          Cancel
        </button>
        <span className="text-[13px] font-semibold text-[#2C1810]">
          {isCode ? 'Link GitHub PR' : 'Write Answer'}
        </span>
        <button
          type="button"
          onClick={() => isValid && onSave(trimmed)}
          disabled={!isValid}
          className="text-[14px] font-semibold text-[#5A8A6A] disabled:text-[#C8B8A8]"
        >
          Save
        </button>
      </div>

      {/* Task description */}
      <div className="px-5 py-4 bg-white border-b border-[#E8E0D5]">
        <p className="text-[14px] text-[#2C1810] leading-snug">{text}</p>
        {subtext && <p className="text-[12px] text-[#B8A89A] mt-1">{subtext}</p>}
      </div>

      {/* Input area */}
      <div className="flex-1 p-5 overflow-y-auto">
        {isCode ? (
          <div>
            <p className="text-[12px] font-medium text-[#8B7355] mb-2">GitHub PR URL</p>
            <input
              type="url"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="https://github.com/owner/repo/pull/123"
              autoFocus
              className={[
                'w-full px-4 py-3 rounded-xl border text-[14px] bg-white outline-none transition-colors',
                showError
                  ? 'border-[#D4433A] focus:border-[#D4433A]'
                  : isValid && trimmed
                  ? 'border-[#5A8A6A] focus:border-[#5A8A6A]'
                  : 'border-[#E8E0D5] focus:border-[#8B7355]',
              ].join(' ')}
            />
            {showError && (
              <p className="text-[12px] text-[#D4433A] mt-1.5">Must be a valid GitHub PR URL</p>
            )}
            {isValid && trimmed && (
              <p className="text-[12px] text-[#5A8A6A] mt-1.5">Valid GitHub PR URL</p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-[12px] font-medium text-[#8B7355] mb-2">Your answer</p>
            <textarea
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Write your answer here…"
              autoFocus
              className="w-full h-52 px-4 py-3 rounded-xl border border-[#E8E0D5] text-[14px] bg-white resize-none outline-none focus:border-[#8B7355] transition-colors"
            />
          </div>
        )}
      </div>
    </div>
  )
}
