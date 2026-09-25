import { useMemo, useState } from 'react'
import StatCard from '../components/dashboard/StatCard'
import DashboardShell from '../components/layout/DashboardShell'
import ChartCard from '../components/reports/ChartCard'
import ColumnChart from '../components/reports/ColumnChart'
import LineChart from '../components/reports/LineChart'
import RankedBars from '../components/reports/RankedBars'
import { ROOM_TYPES } from '../data/roomConstants'
import { REPORT_PERIODS } from '../data/reportsData'
import { useBookings } from '../context/BookingsContext'
import { useGuests } from '../context/GuestsContext'
import { useRooms } from '../context/RoomsContext'
import { todayISO } from '../utils/bookingUtils'
import { formatCompactNumber, formatCurrency } from '../utils/format'
import { buildMonthlySeries, buildRoomTypeCounts, percentChange } from '../utils/reportUtils'

const ICONS = {
  revenue: (
    <path
      d="M7 5h10M7 9h10M13 9c0 3-2.5 4.5-6 4.5L14 20"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  bookings: (
    <>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 9.5h17M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  occupancy: (
    <path
      d="M3 21V8l9-5 9 5v13M9 21v-6h6v6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  roomType: (
    <path
      d="M4 18V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9M4 14h16M4 18v2m16-2v2M8 11h3"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  guests: (
    <>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 20c.8-3.4 3-5.2 5.5-5.2s4.7 1.8 5.5 5.2M17 11v6m3-3h-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
}

const compactCurrency = (value) => `₹${formatCompactNumber(value)}`

function StatRow({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-4">
      <p className="text-xs font-medium text-ink-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-ink-900">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-ink-400">{hint}</p>}
    </div>
  )
}

export default function Reports() {
  const { bookings } = useBookings()
  const { rooms } = useRooms()
  const { guests } = useGuests()
  const [period, setPeriod] = useState(12)

  const series = useMemo(() => buildMonthlySeries(bookings, period), [bookings, period])
  const roomTypeCounts = useMemo(
    () => buildRoomTypeCounts(ROOM_TYPES, series, bookings),
    [series, bookings],
  )

  const current = series[series.length - 1]
  const previous = series[series.length - 2]
  const totalRevenue = series.reduce((sum, m) => sum + m.revenue, 0)
  const periodBookings = series.reduce((sum, m) => sum + m.bookings, 0)
  const topRoomType = roomTypeCounts[0]
  const avgOccupancy = Math.round(series.reduce((sum, m) => sum + m.occupancy, 0) / series.length)

  // Live figures from the current room and booking state.
  const live = useMemo(() => {
    const today = todayISO()
    const count = (status) => bookings.filter((b) => b.status === status).length
    const occupied = rooms.filter((r) => r.availability === 'Occupied').length
    const maintenance = rooms.filter((r) => r.availability === 'Maintenance').length
    const sellable = rooms.length - maintenance
    const inHouse = bookings.filter((b) => b.status === 'Checked-in')
    const nonCancelled = bookings.filter((b) => b.status !== 'Cancelled')
    return {
      totalRooms: rooms.length,
      occupied,
      maintenance,
      available: rooms.filter((r) => r.availability === 'Available').length,
      occupancyRate: sellable > 0 ? Math.round((occupied / sellable) * 100) : null,
      activeGuests: new Set(inHouse.map((b) => b.guestId)).size,
      arrivalsToday: bookings.filter((b) => b.status === 'Confirmed' && b.checkIn === today).length,
      upcoming: count('Confirmed'),
      completed: count('Completed'),
      cancelled: count('Cancelled'),
      cancellationRate: bookings.length
        ? Math.round((count('Cancelled') / bookings.length) * 100)
        : 0,
      avgNights: nonCancelled.length
        ? (nonCancelled.reduce((s, b) => s + b.nights, 0) / nonCancelled.length).toFixed(1)
        : '0',
      avgValue: nonCancelled.length
        ? nonCancelled.reduce((s, b) => s + b.amount, 0) / nonCancelled.length
        : 0,
      liveRevenue: nonCancelled.reduce((s, b) => s + b.amount, 0),
    }
  }, [bookings, rooms])

  const periodLabel = REPORT_PERIODS.find((p) => p.value === period).label.toLowerCase()

  const kpis = [
    {
      label: 'Total revenue',
      value: formatCurrency(totalRevenue),
      icon: ICONS.revenue,
      hint: `Over the ${periodLabel}`,
    },
    {
      label: 'Monthly bookings',
      value: current.bookings.toLocaleString('en-IN'),
      icon: ICONS.bookings,
      delta: percentChange(current.bookings, previous.bookings) ?? undefined,
      deltaLabel: 'vs last month',
    },
    {
      label: 'Room occupancy rate',
      value: live.occupancyRate === null ? '—' : `${live.occupancyRate}%`,
      icon: ICONS.occupancy,
      hint: `${live.occupied} of ${live.totalRooms - live.maintenance} rooms occupied now`,
    },
    {
      label: 'Most booked room type',
      value: topRoomType.label,
      icon: ICONS.roomType,
      hint: `${Math.round((topRoomType.value / (periodBookings || 1)) * 100)}% of bookings`,
    },
    {
      label: 'Active guests',
      value: live.activeGuests,
      icon: ICONS.guests,
      hint: `${live.arrivalsToday} ${live.arrivalsToday === 1 ? 'arrival' : 'arrivals'} expected today`,
    },
  ]

  return (
    <DashboardShell title="Reports" subtitle="Revenue, occupancy and booking performance.">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-400">
            Revenue and trend charts combine sample history with live bookings. Occupancy, guests and
            statistics are live.
          </p>
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            aria-label="Report period"
            className="rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/60"
          >
            {REPORT_PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {kpis.map((kpi) => (
            <StatCard key={kpi.label} {...kpi} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ChartCard
              title="Revenue by month"
              subtitle={`Room revenue, ${periodLabel} (sample data)`}
              headline={
                <>
                  {formatCurrency(current.revenue)}
                  <span className="ml-2 text-xs font-normal text-ink-400">in {current.fullLabel}</span>
                </>
              }
              columns={['Month', 'Revenue']}
              rows={series.map((m) => [m.fullLabel, formatCurrency(m.revenue)])}
            >
              <ColumnChart
                data={series.map((m) => ({ ...m, value: m.revenue }))}
                formatValue={formatCurrency}
                formatTick={compactCurrency}
              />
            </ChartCard>
          </div>

          <ChartCard
            title="Bookings by room type"
            subtitle={`${periodBookings.toLocaleString('en-IN')} bookings, ${periodLabel}`}
            columns={['Room type', 'Bookings']}
            rows={roomTypeCounts.map((r) => [r.label, r.value.toLocaleString('en-IN')])}
          >
            <RankedBars data={roomTypeCounts} formatValue={(v) => v.toLocaleString('en-IN')} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ChartCard
              title="Booking trends"
              subtitle={`Bookings per month, ${periodLabel}`}
              columns={['Month', 'Bookings', 'Cancelled']}
              rows={series.map((m) => [m.fullLabel, m.bookings, m.cancelled])}
            >
              <LineChart
                data={series.map((m) => ({ ...m, value: m.bookings }))}
                formatValue={(v) => v.toLocaleString('en-IN')}
                formatDetail={(m) => `${m.cancelled} cancelled`}
                ariaLabel={`Line chart of bookings per month. Latest: ${current.fullLabel}, ${current.bookings} bookings.`}
              />
            </ChartCard>
          </div>

          <ChartCard title="Room occupancy" subtitle="Current room status">
            <div className="space-y-5">
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-semibold text-ink-900">
                    {live.occupancyRate === null ? '—' : `${live.occupancyRate}%`}
                  </p>
                  <p className="text-xs text-ink-400">excl. maintenance</p>
                </div>
                <div
                  role="meter"
                  aria-label="Room occupancy rate"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={live.occupancyRate ?? 0}
                  className="mt-3 h-2.5 rounded-full bg-brand-100"
                >
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{ width: `${live.occupancyRate ?? 0}%` }}
                  />
                </div>
              </div>

              <dl className="grid grid-cols-3 gap-3 border-t border-ink-50 pt-4 text-center">
                {[
                  ['Occupied', live.occupied],
                  ['Available', live.available],
                  ['Maintenance', live.maintenance],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs text-ink-400">{label}</dt>
                    <dd className="mt-1 text-lg font-semibold text-ink-800">{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="border-t border-ink-50 pt-4 text-xs text-ink-400">
                Average occupancy over the {periodLabel}:{' '}
                <span className="font-semibold text-ink-700">{avgOccupancy}%</span> (sample data)
              </p>
            </div>
          </ChartCard>
        </div>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-ink-800">Dashboard statistics</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <StatRow label="Total rooms" value={live.totalRooms} />
            <StatRow label="Available rooms" value={live.available} />
            <StatRow label="Occupied rooms" value={live.occupied} />
            <StatRow label="Under maintenance" value={live.maintenance} />
            <StatRow label="Registered guests" value={guests.length} />
            <StatRow label="Total bookings" value={bookings.length} />
            <StatRow label="Upcoming bookings" value={live.upcoming} hint="Confirmed, not yet arrived" />
            <StatRow label="Completed stays" value={live.completed} />
            <StatRow label="Cancelled" value={live.cancelled} hint={`${live.cancellationRate}% of bookings`} />
            <StatRow label="Avg. stay length" value={`${live.avgNights} nights`} />
            <StatRow label="Avg. booking value" value={formatCurrency(live.avgValue)} />
            <StatRow label="Booked revenue" value={formatCurrency(live.liveRevenue)} hint="Live, excl. cancelled" />
          </div>
        </section>
      </div>
    </DashboardShell>
  )
}
