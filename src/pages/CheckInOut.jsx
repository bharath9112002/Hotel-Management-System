import { useMemo, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import DashboardShell from '../components/layout/DashboardShell'
import Pagination from '../components/Pagination'
import StayTable from '../components/stays/StayTable'
import { BOOKING_PAGE_SIZE } from '../data/bookingConstants'
import { useBookings } from '../context/BookingsContext'
import { formatDuration, stayDurationMs, todayISO } from '../utils/bookingUtils'
import { useNow } from '../utils/useNow'
import { useStayActions } from '../utils/useStayActions'

const TABS = [
  { id: 'arrivals', label: 'Arrivals', empty: 'No guests are waiting to check in.' },
  { id: 'inhouse', label: 'In-house', empty: 'No guests are currently checked in.' },
  { id: 'checkin-history', label: 'Check-in history', empty: 'No check-ins recorded yet.' },
  { id: 'checkout-history', label: 'Check-out history', empty: 'No check-outs recorded yet.' },
]

function newestFirst(field) {
  return (a, b) => Date.parse(b[field]) - Date.parse(a[field])
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium text-ink-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink-900">{value}</p>
      <p className="mt-0.5 text-xs text-ink-400">{hint}</p>
    </div>
  )
}

export default function CheckInOut() {
  const { bookings } = useBookings()
  const { checkIn, checkOut } = useStayActions()
  const now = useNow()
  const today = todayISO()

  const [tab, setTab] = useState('arrivals')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [checkOutTarget, setCheckOutTarget] = useState(null)

  const lists = useMemo(
    () => ({
      arrivals: bookings
        .filter((b) => b.status === 'Confirmed')
        .sort((a, b) => a.checkIn.localeCompare(b.checkIn)),
      inhouse: bookings
        .filter((b) => b.status === 'Checked-in')
        .sort((a, b) => a.checkOut.localeCompare(b.checkOut)),
      'checkin-history': bookings.filter((b) => b.checkedInAt).sort(newestFirst('checkedInAt')),
      'checkout-history': bookings.filter((b) => b.checkedOutAt).sort(newestFirst('checkedOutAt')),
    }),
    [bookings],
  )

  const activeTab = TABS.find((t) => t.id === tab)
  const rows = useMemo(() => {
    const term = search.trim().toLowerCase()
    const list = lists[tab]
    if (!term) return list
    return list.filter(
      (b) =>
        b.id.toLowerCase().includes(term) ||
        b.guestName.toLowerCase().includes(term) ||
        b.roomNumber.toLowerCase().includes(term),
    )
  }, [lists, tab, search])

  const totalPages = Math.max(1, Math.ceil(rows.length / BOOKING_PAGE_SIZE))
  const page = Math.min(currentPage, totalPages)
  const pageStart = (page - 1) * BOOKING_PAGE_SIZE
  const pageRows = rows.slice(pageStart, pageStart + BOOKING_PAGE_SIZE)

  const arrivingToday = lists.arrivals.filter((b) => b.checkIn === today).length
  const departuresDue = lists.inhouse.filter((b) => b.checkOut <= today).length

  const selectTab = (id) => {
    setTab(id)
    setCurrentPage(1)
  }

  const handleCheckOutConfirm = () => {
    checkOut(checkOutTarget)
    setCheckOutTarget(null)
  }

  return (
    <DashboardShell
      title="Check-In / Check-Out"
      subtitle="Process arrivals and departures, and review stay history."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Arriving today" value={arrivingToday} hint="Confirmed bookings due today" />
          <StatCard label="In-house" value={lists.inhouse.length} hint="Guests currently checked in" />
          <StatCard label="Departures due" value={departuresDue} hint="Check-out today or overdue" />
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="tablist" className="flex flex-wrap gap-1.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => selectTab(t.id)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  tab === t.id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-500 hover:bg-ink-50 hover:text-ink-700'
                }`}
              >
                {t.label}
                <span className="ml-1.5 rounded-full bg-white/70 px-1.5 text-xs text-ink-400">
                  {lists[t.id].length}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-xs">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search ID, guest or room…"
              aria-label="Search stays"
              className="w-full rounded-xl border border-ink-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/60"
            />
          </div>
        </div>

        {rows.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
            <p className="text-sm font-medium text-ink-700">
              {search.trim() ? 'No results match your search' : activeTab.empty}
            </p>
            {tab === 'arrivals' && !search.trim() && (
              <p className="mt-1 text-xs text-ink-400">
                Bookings appear here once they are created and still confirmed.
              </p>
            )}
          </div>
        )}

        {rows.length > 0 && (
          <>
            <StayTable
              tab={tab}
              rows={pageRows}
              today={today}
              now={now}
              onCheckIn={checkIn}
              onCheckOut={setCheckOutTarget}
            />
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-xs text-ink-400">
                Showing {pageStart + 1}–{pageStart + pageRows.length} of {rows.length}
              </p>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(checkOutTarget)}
        tone="primary"
        title="Check out guest"
        message={
          checkOutTarget
            ? `Check ${checkOutTarget.guestName} out of Room ${checkOutTarget.roomNumber}? Stay so far: ${formatDuration(
                stayDurationMs(checkOutTarget, now),
              )}. The room will be marked available.`
            : ''
        }
        confirmLabel="Check out"
        onConfirm={handleCheckOutConfirm}
        onCancel={() => setCheckOutTarget(null)}
      />
    </DashboardShell>
  )
}
