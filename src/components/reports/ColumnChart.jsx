import { useState } from 'react'
import { niceTicks } from '../../utils/reportUtils'

// Single-series column chart. The latest column carries the accent and earlier
// ones sit a step lighter, so the current month reads first.
export default function ColumnChart({ data, formatValue, formatTick = formatValue }) {
  const [hovered, setHovered] = useState(null)
  const ticks = niceTicks(Math.max(...data.map((d) => d.value)))
  const top = ticks[ticks.length - 1]
  const pct = (value) => `${(value / top) * 100}%`

  return (
    <div className="flex gap-2">
      <div className="relative h-56 w-12 shrink-0" aria-hidden="true">
        {ticks.map((tick) => (
          <span
            key={tick}
            className="absolute right-0 translate-y-1/2 text-[11px] tabular-nums text-ink-400"
            style={{ bottom: pct(tick) }}
          >
            {formatTick(tick)}
          </span>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <div className="relative h-56">
          {ticks.map((tick) => (
            <div
              key={tick}
              className="pointer-events-none absolute inset-x-0 border-t border-ink-100"
              style={{ bottom: pct(tick) }}
            />
          ))}

          <div className="relative flex h-full items-end gap-0.5">
            {data.map((d, i) => {
              const isHovered = hovered === i
              const isLatest = i === data.length - 1
              return (
                <div key={d.key} className="relative h-full flex-1">
                  {isHovered && (
                    <div
                      className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink-900 px-2.5 py-1.5 text-xs text-white shadow-lg"
                      style={{ bottom: `calc(${pct(d.value)} + 6px)` }}
                    >
                      <span className="block text-ink-300">{d.fullLabel ?? d.label}</span>
                      <span className="font-semibold">{formatValue(d.value)}</span>
                    </div>
                  )}
                  {/* The whole column slot is the hit target, not just the thin bar. */}
                  <button
                    type="button"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    aria-label={`${d.fullLabel ?? d.label}: ${formatValue(d.value)}`}
                    className="group absolute inset-0 flex items-end justify-center outline-none"
                  >
                    <span
                      className={`block w-full max-w-6 rounded-t-[4px] transition-colors group-focus-visible:ring-2 group-focus-visible:ring-brand-400 ${
                        isHovered ? 'bg-brand-700' : isLatest ? 'bg-brand-600' : 'bg-brand-300'
                      }`}
                      style={{ height: pct(Math.max(d.value, top * 0.01)) }}
                    />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-2 flex gap-0.5">
          {data.map((d) => (
            <p key={d.key} className="flex-1 truncate text-center text-[11px] text-ink-400">
              {d.label}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
