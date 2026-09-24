import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ConfirmDialog from '../components/ConfirmDialog'
import StatusBadge from '../components/dashboard/StatusBadge'
import DashboardShell from '../components/layout/DashboardShell'
import Pagination from '../components/Pagination'
import { BOOKING_PAGE_SIZE, BOOKING_STATUSES } from '../data/bookingConstants'
import { useBookings } from '../context/BookingsContext'
import { formatCurrency, formatDate } from '../utils/format'

export default function Bookings() {
  const navigate = useNavigate()
  const { bookings, cancelBooking } = useBookings()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [cancelTarget, setCancelTarget] = useState(null)

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase()
    return bookings.filter((booking) => {
      const matchesSearch =
        !term ||
        booking.id.toLowerCase().includes(term) ||
        booking.guestName.toLowerCase().includes(term) ||
        booking.roomNumber.toLowerCase().includes(term)
      return matchesSearch && (!status || booking.status === status)
    })
  }, [bookings, search, status])

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / BOOKING_PAGE_SIZE))
  const page = Math.min(currentPage, totalPages)
  const pageStart = (page - 1) * BOOKING_PAGE_SIZE
  const paginatedBookings = filteredBookings.slice(pageStart, pageStart + BOOKING_PAGE_SIZE)

  const handleCancelConfirm = () => {
    cancelBooking(cancelTarget.id)
    toast.success(`Booking ${cancelTarget.id} cancelled.`)
    setCancelTarget(null)
  }

  return (
    <DashboardShell
      title="Bookings"
      subtitle={`${filteredBookings.length} of ${bookings.length} bookings`}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
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
                aria-label="Search bookings"
                className="w-full rounded-xl border border-ink-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/60"
              />
            </div>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setCurrentPage(1)
              }}
              aria-label="Filter by status"
              className="rounded-xl border border-ink-200 px-3 py-2.5 text-sm text-ink-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/60"
            >
              <option value="">All statuses</option>
              {BOOKING_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => navigate('/bookings/new')}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Booking
          </button>
        </div>

        {filteredBookings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
            <p className="text-sm font-medium text-ink-700">
              {bookings.length === 0 ? 'No bookings yet' : 'No bookings match your filters'}
            </p>
            <p className="mt-1 text-xs text-ink-400">
              {bookings.length === 0
                ? 'Create the first reservation with New Booking.'
                : 'Try a different search or status.'}
            </p>
          </div>
        )}

        {filteredBookings.length > 0 && (
          <>
            <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-sm">
              <table className="w-full min-w-[860px] text-left text-sm">
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
                  {paginatedBookings.map((booking) => (
                    <tr key={booking.id} className="transition hover:bg-ink-50/50">
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink-600">
                        <Link to={`/bookings/${booking.id}`} className="hover:text-brand-600">
                          {booking.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-medium text-ink-800">{booking.guestName}</td>
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
                          <Link
                            to={`/bookings/${booking.id}`}
                            className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 transition hover:bg-ink-50"
                          >
                            View
                          </Link>
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
                Showing {pageStart + 1}–{pageStart + paginatedBookings.length} of{' '}
                {filteredBookings.length}
              </p>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </div>

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
