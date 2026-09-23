import { formatCurrency } from '../../utils/format'
import RevenueChart from './RevenueChart'

export default function RevenueSummary({ revenue, weeklyRevenue }) {
  const isUp = revenue.deltaVsYesterday >= 0

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink-400">Revenue summary</p>
          <p className="mt-1 text-3xl font-semibold text-ink-900">
            {formatCurrency(revenue.today)}
          </p>
          <p
            className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${
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
            {Math.abs(revenue.deltaVsYesterday)}% vs yesterday
          </p>
        </div>

        <div className="flex gap-6">
          <div>
            <p className="text-xs font-medium text-ink-400">This week</p>
            <p className="mt-1 text-lg font-semibold text-ink-800">
              {formatCurrency(revenue.week)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-ink-400">This month</p>
            <p className="mt-1 text-lg font-semibold text-ink-800">
              {formatCurrency(revenue.month)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <RevenueChart data={weeklyRevenue} />
      </div>
    </div>
  )
}
