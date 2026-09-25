// Horizontal bars ranked high to low. Only the leader carries the accent; the
// rest recede to gray so the most booked item is the first thing read.
export default function RankedBars({ data, formatValue }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1

  return (
    <ul className="space-y-3.5">
      {data.map((d, i) => (
        <li key={d.label}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className={i === 0 ? 'font-semibold text-ink-800' : 'text-ink-600'}>{d.label}</span>
            <span className="shrink-0 tabular-nums text-ink-600">
              {formatValue(d.value)}
              <span className="ml-1.5 text-xs text-ink-400">
                {Math.round((d.value / total) * 100)}%
              </span>
            </span>
          </div>
          <div className="h-2.5 rounded-r-[4px] bg-ink-50">
            <div
              className={`h-full rounded-r-[4px] ${i === 0 ? 'bg-brand-600' : 'bg-ink-200'}`}
              style={{ width: `${Math.max((d.value / max) * 100, 1)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
