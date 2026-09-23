export default function StatCard({ label, value, icon, delta, deltaLabel, tone = 'brand' }) {
  const isUp = typeof delta === 'number' && delta >= 0
  const toneClasses = {
    brand: 'bg-brand-50 text-brand-600',
    ink: 'bg-ink-100 text-ink-600',
  }

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-ink-400">{label}</p>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            {icon}
          </svg>
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold text-ink-900">{value}</p>
      {typeof delta === 'number' && (
        <p
          className={`mt-1.5 inline-flex items-center gap-1 text-xs font-medium ${
            isUp ? 'text-emerald-600' : 'text-red-500'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" className={`h-3 w-3 ${isUp ? '' : 'rotate-180'}`}>
            <path
              d="M12 19V5m0 0-6 6m6-6 6 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {Math.abs(delta)}% {deltaLabel ?? 'vs yesterday'}
        </p>
      )}
    </div>
  )
}
