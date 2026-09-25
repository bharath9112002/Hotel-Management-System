import { useState } from 'react'
import { formatCurrency } from '../../utils/format'

export default function RevenueChart({ data }) {
  const [hovered, setHovered] = useState(null)
  const max = Math.max(...data.map((d) => d.amount))

  return (
    <div>
      <div className="relative h-40">
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-px">
          <div className="border-t border-ink-100" />
          <div className="border-t border-ink-100" />
          <div className="border-t border-ink-100" />
        </div>

        <div className="relative flex h-full items-end justify-between gap-2 sm:gap-3">
          {data.map((d, i) => {
            const heightPct = Math.max((d.amount / max) * 100, 4)
            const isHovered = hovered === i
            return (
              <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end">
                {isHovered && (
                  <div className="mb-1 whitespace-nowrap rounded-lg bg-ink-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg">
                    {formatCurrency(d.amount)}
                  </div>
                )}
                <button
                  type="button"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  aria-label={`${d.day}: ${formatCurrency(d.amount)}`}
                  className={`w-full max-w-6 rounded-t-[4px] outline-none transition-colors ${
                    isHovered ? 'bg-brand-700' : 'bg-brand-600'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-2 flex justify-between gap-2 sm:gap-3">
        {data.map((d) => (
          <p key={d.day} className="flex-1 text-center text-xs text-ink-400">
            {d.day}
          </p>
        ))}
      </div>
    </div>
  )
}
