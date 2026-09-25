import { useState } from 'react'

// Card wrapper for a report chart with a Chart / Table toggle, so every
// plotted value is also readable without relying on the graphic.
export default function ChartCard({ title, subtitle, headline, columns, rows, children }) {
  const [view, setView] = useState('chart')

  return (
    <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink-800">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-ink-400">{subtitle}</p>}
          {headline && <p className="mt-2 text-2xl font-semibold text-ink-900">{headline}</p>}
        </div>
        {rows && (
          <div
            role="group"
            aria-label={`${title} view`}
            className="flex rounded-lg border border-ink-100 p-0.5"
          >
            {['chart', 'table'].map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition ${
                  view === v ? 'bg-ink-100 text-ink-800' : 'text-ink-400 hover:text-ink-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        )}
      </div>

      {view === 'chart' || !rows ? (
        children
      ) : (
        <div className="max-h-72 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-white text-xs font-medium text-ink-400">
              <tr>
                {columns.map((col, i) => (
                  <th key={col} className={`py-2 ${i > 0 ? 'text-right' : ''}`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td
                      key={columns[i]}
                      className={`py-2 ${i > 0 ? 'text-right tabular-nums text-ink-800' : 'text-ink-600'}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
