import { useState } from 'react'
import { niceTicks } from '../../utils/reportUtils'
import { useElementWidth } from '../../utils/useElementWidth'

const HEIGHT = 224
const PAD = { top: 12, right: 12, bottom: 26, left: 40 }

// Single-series line with an area wash and a crosshair tooltip. Hover anywhere
// in the plot, or focus it and use the arrow keys, to read the nearest month.
export default function LineChart({ data, formatValue, formatDetail, ariaLabel }) {
  const [ref, width] = useElementWidth()
  const [active, setActive] = useState(null)

  const ticks = niceTicks(Math.max(...data.map((d) => d.value)))
  const top = ticks[ticks.length - 1]
  const plotW = Math.max(width - PAD.left - PAD.right, 0)
  const plotH = HEIGHT - PAD.top - PAD.bottom
  const last = data.length - 1
  const x = (i) => PAD.left + (last === 0 ? plotW / 2 : (i / last) * plotW)
  const y = (v) => PAD.top + plotH - (v / top) * plotH

  const linePath = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.value)}`).join(' ')
  const areaPath = `${linePath} L${x(last)},${y(0)} L${x(0)},${y(0)} Z`

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const rel = (e.clientX - rect.left - PAD.left) / (plotW || 1)
    setActive(Math.min(last, Math.max(0, Math.round(rel * last))))
  }

  const handleKey = (e) => {
    if (e.key === 'ArrowRight') setActive((a) => Math.min(last, (a ?? -1) + 1))
    else if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, (a ?? data.length) - 1))
    else return
    e.preventDefault()
  }

  // The end marker always marks the latest month; hover moves it.
  const marked = active ?? last
  const tooltipLeft = Math.min(Math.max(x(marked), 72), width - 72)

  return (
    <div ref={ref} className="relative" style={{ height: HEIGHT }}>
      {width > 0 && (
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          aria-label={ariaLabel}
          tabIndex={0}
          onMouseMove={handleMove}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive(last)}
          onBlur={() => setActive(null)}
          onKeyDown={handleKey}
          className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={y(tick)}
                y2={y(tick)}
                className="stroke-ink-100"
              />
              <text
                x={PAD.left - 8}
                y={y(tick)}
                dy="0.32em"
                textAnchor="end"
                className="fill-ink-400 text-[11px]"
              >
                {formatValue(tick)}
              </text>
            </g>
          ))}
          {data.map((d, i) => (
            <text
              key={d.key}
              x={x(i)}
              y={HEIGHT - 6}
              textAnchor="middle"
              className="fill-ink-400 text-[11px]"
            >
              {d.label}
            </text>
          ))}

          <path d={areaPath} className="fill-brand-600" fillOpacity="0.1" />
          <path
            d={linePath}
            fill="none"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="stroke-brand-600"
          />

          {active !== null && (
            <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={y(0)} className="stroke-ink-300" />
          )}
          <circle
            cx={x(marked)}
            cy={y(data[marked].value)}
            r="5"
            strokeWidth="2"
            className="fill-brand-600 stroke-white"
          />
        </svg>
      )}

      {active !== null && width > 0 && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink-900 px-2.5 py-1.5 text-xs text-white shadow-lg"
          style={{ left: tooltipLeft }}
        >
          <span className="block text-ink-300">{data[active].fullLabel}</span>
          <span className="font-semibold">{formatValue(data[active].value)}</span>
          {formatDetail && <span className="block text-ink-300">{formatDetail(data[active])}</span>}
        </div>
      )}
    </div>
  )
}
