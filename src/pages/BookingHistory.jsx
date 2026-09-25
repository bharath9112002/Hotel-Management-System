import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import BookingHistoryModal from '../components/bookings/BookingHistoryModal'
import ConfirmDialog from '../components/ConfirmDialog'
import StatusBadge from '../components/dashboard/StatusBadge'
import DashboardShell from '../components/layout/DashboardShell'
import Pagination from '../components/Pagination'
import {
  BOOKING_PAGE_SIZE,
  BOOKING_STATUSES,
  HISTORY_DATE_FIELDS,
  HISTORY_SORTS,
} from '../data/bookingConstants'
import { useBookings } from '../context/BookingsContext'
import { localDateOf, matchesBookingSearch, matchesDateRange } from '../utils/bookingUtils'
import { formatCurrency, formatDate } from '../utils/format'

const inputClass =
  'rounded-xl border border-ink-200 px-3 py-2.5 text-sm text-ink-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/60'

const STATUS_CARD_TONES = {
  '': 'text-ink-900',
  Confirmed: 'text-blue-700',
  'Checked-in': 'text-emerald-700',
  Completed: 'text-violet-700',
  Cancelled: 'text-red-600',
}

const SORTERS = {
  'booked-desc': (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  'booked-asc': (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
  'checkin-desc': (a, b) => b.checkIn.localeCompare(a.checkIn),
  'checkin-asc': (a, b) => a.checkIn.localeCompare(b.checkIn),
}

function StatusCard({ label, count, amount, active, tone, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition ${
        active ? 'border-brand-400 ring-2 ring-brand-400/40' : 'border-ink-100 hover:border-ink-200'
      }`}
    >
      <p className="text-xs font-medium text-ink-400">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${tone}`}>{count}</p>
      <p className="mt-0.5 text-xs tabular-nums text-ink-400">{formatCurrency(amount)}</p>
    </button>
  )
}

export default function BookingHistory() {
  const { bookings, cancelBooking } = useBookings()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [dateField, setDateField] = useState('stay')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [sort, setSort] = useState('booked-desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedId, setSelectedId] = useState(null)
  const [cancelTarget, setCancelTarget] = useState(null)

  const invalidRange = Boolean(fromDate && toDate && fromDate > toDate)

  // Search and date filters apply first so the status cards show counts for
  // the current search/period; the status filter then narrows the table.
  const scopedBookings = useMemo(() => {
    if (invalidRange) return []
    const term = search.trim().toLowerCase()
    return bookings.filter(
      (b) => matchesBookingSearch(b, term) && matchesDateRange(b, dateField, fromDate, toDate),
    )
  }, [bookings, search, dateField, fromDate, toDate, invalidRange])

  const statusSummary = useMemo(() => {
    const summary = { '': { count: 0, amount: 0 } }
    BOOKING_STATUSES.forEach((s) => {
      summary[s] = { count: 0, amount: 0 }
    })
    scopedBookings.forEach((b) => {
      summary[''].count += 1
      summary[''].amount += b.amount
      if (summary[b.status]) {
        summary[b.status].count += 1
        summary[b.status].amount += b.amount
      }
    })
    return summary
  }, [scopedBookings])

  const rows = useMemo(
    () => scopedBookings.filter((b) => !status || b.status === status).sort(SORTERS[sort]),
    [scopedBookings, status, sort],
  )

  const totalPages = Math.max(1, Math.ceil(rows.length / BOOKING_PAGE_SIZE))
  const page = Math.min(currentPage, totalPages)
  const pageStart = (page - 1) * BOOKING_PAGE_SIZE
  const pageRows = rows.slice(pageStart, pageStart + BOOKING_PAGE_SIZE)

  // Looked up live so the modal reflects a cancellation made from inside it.
  const selectedBooking = bookings.find((b) => b.id === selectedId) ?? null

  const hasFilters = Boolean(search.trim() || status || fromDate || toDate)

  const withPageReset = (setter) => (value) => {
    setter(value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearch('')
    setStatus('')
    setFromDate('')
    setToDate('')
    setCurrentPage(1)
  }

  const handleCancelConfirm = () => {
    cancelBooking(cancelTarget.id)
    toast.success(`Booking ${cancelTarget.id} cancelled.`)
    setCancelTarget(null)
  }

  const statusCards = [
    { value: '', label: 'All bookings' },
    ...BOOKING_STATUSES.map((s) => ({ value: s, label: s })),
  ]

  return (
    <DashboardShell
      title="Booking History"
      subtitle={`${rows.length} of ${bookings.length} bookings`}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {statusCards.map((card) => (
            <StatusCard
              key={card.label}
              label={card.label}
              count={statusSummary[card.value].count}
              amount={statusSummary[card.value].amount}
              tone={STATUS_CARD_TONES[card.value]}
              active={status === card.value}
              onClick={() => withPageReset(setStatus)(status === card.value ? '' : card.value)}
            />
          ))}
        </div>

        <div className="space-y-3 rounded-2xl border border-ink-100 bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1 lg:max-w-sm">
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
                onChange={(e) => withPageReset(setSearch)(e.target.value)}
                placeholder="Search ID, guest, phone, email or room…"
                aria-label="Search bookings"
                className="w-full rounded-xl border border-ink-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/60"
              />
            </div>

            <select
              value={status}
              onChange={(e) => withPageReset(setStatus)(e.target.value)}
              aria-label="Filter by booking status"
              className={inputClass}
            >
              <option value="">All statuses</option>
              {BOOKING_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort bookings"
              className={inputClass}
            >
              {HISTORY_SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <label className="flex flex-col gap-1 text-xs font-medium text-ink-400">
              Filter date by
              <select
                value={dateField}
                onChange={(e) => withPageReset(setDateField)(e.target.value)}
                className={inputClass}
              >
                {HISTORY_DATE_FIELDS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-ink-400">
              From
              <input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => withPageReset(setFromDate)(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-ink-400">
              To
              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => withPageReset(setToDate)(e.target.value)}
                className={inputClass}
              />
            </label>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
              >
                Clear filters
              </button>
            )}
          </div>
          {invalidRange && (
            <p role="alert" className="text-xs text-red-600">
              The “From” date must be on or before the “To” date.
            </p>
          )}
        </div>

        {rows.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
            <p className="text-sm font-medium text-ink-700">
              {bookings.length === 0 ? 'No booking history yet' : 'No bookings match your filters'}
            </p>
            <p className="mt-1 text-xs text-ink-400">
              {bookings.length === 0
                ? 'Bookings will appear here once reservations are made.'
                : 'Try a different search, status or date range.'}
            </p>
          </div>
        )}

        {rows.length > 0 && (
          <>
            <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-sm">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="border-b border-ink-100 bg-ink-50/60 text-xs font-medium uppercase tracking-wide text-ink-400">
                  <tr>
                    <th className="px-4 py-3">Booking</th>
                    <th className="px-4 py-3">Guest</th>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Stay</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                  {pageRows.map((booking) => (
                    <tr key={booking.id} className="transition hover:bg-ink-50/50">
                      <td className="whitespace-nowrap px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedId(booking.id)}
                          className="font-mono text-xs text-ink-600 hover:text-brand-600"
                        >
                          {booking.id}
                        </button>
                        <span className="block text-xs text-ink-400">
                          Booked {formatDate(localDateOf(booking.createdAt))}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-ink-800">{booking.guestName}</span>
                        <span className="block text-xs text-ink-400">{booking.guestMobile}</span>
                      </td>
                      <td className="px-4 py-3 text-ink-600">
                        Room {booking.roomNumber}
                        <span className="block text-xs text-ink-400">{booking.roomType}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-600">
                        {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                        <span className="block text-xs text-ink-400">
                          {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-ink-800">
                        {formatCurrency(booking.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedId(booking.id)}
                            className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 transition hover:bg-ink-50"
                          >
                            Details
                          </button>
                          {booking.status === 'Confirmed' && (
                            <button
                              type="button"
                              onClick={() => setCancelTarget(booking)}
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-xs text-ink-400">
                Showing {pageStart + 1}–{pageStart + pageRows.length} of {rows.length}
              </p>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </div>

      <BookingHistoryModal
        booking={selectedBooking}
        onClose={() => setSelectedId(null)}
        onCancel={(booking) => {
          setSelectedId(null)
          setCancelTarget(booking)
        }}
      />

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        title="Cancel booking"
        message={`Cancel booking ${cancelTarget?.id} for ${cancelTarget?.guestName}? The room will become available for those dates again.`}
        confirmLabel="Cancel booking"
        cancelLabel="Keep booking"
        onConfirm={handleCancelConfirm}
        onCancel={() => setCancelTarget(null)}
      />
    </DashboardShell>
  )
}
