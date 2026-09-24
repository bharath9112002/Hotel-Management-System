import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import BookingSummaryCard from '../components/bookings/BookingSummaryCard'
import ConfirmDialog from '../components/ConfirmDialog'
import StatusBadge from '../components/dashboard/StatusBadge'
import DashboardShell from '../components/layout/DashboardShell'
import { useBookings } from '../context/BookingsContext'
import { formatDuration, stayDurationMs } from '../utils/bookingUtils'
import { formatDate, formatDateTime } from '../utils/format'
import { useNow } from '../utils/useNow'
import { useStayActions } from '../utils/useStayActions'

export default function BookingDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { bookings, cancelBooking } = useBookings()
  const [isCancelOpen, setIsCancelOpen] = useState(false)
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false)
  const { checkIn, checkOut } = useStayActions()
  const now = useNow()

  const booking = bookings.find((b) => b.id === id)
  const justBooked = Boolean(location.state?.justBooked)

  const handleCancel = () => {
    cancelBooking(booking.id)
    toast.success(`Booking ${booking.id} cancelled.`)
    setIsCancelOpen(false)
  }

  const handleCheckOut = () => {
    checkOut(booking)
    setIsCheckOutOpen(false)
  }

  return (
    <DashboardShell title="Booking details" subtitle="Reservation information and status.">
      <button
        type="button"
        onClick={() => navigate('/bookings')}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-700"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to bookings
      </button>

      {!booking && (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
          <p className="text-sm font-medium text-ink-700">Booking not found</p>
          <p className="mt-1 text-xs text-ink-400">Check the booking ID and try again.</p>
        </div>
      )}

      {booking && (
        <div className="space-y-6">
          {justBooked && booking.status === 'Confirmed' && (
            <div
              role="status"
              className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path
                    d="m5 12.5 4.5 4.5L19 7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-emerald-800">Booking confirmed</p>
                <p className="mt-0.5 text-sm text-emerald-700">
                  Room {booking.roomNumber} is reserved for {booking.guestName} from{' '}
                  {formatDate(booking.checkIn)} to {formatDate(booking.checkOut)}. Reference{' '}
                  <span className="font-mono font-semibold">{booking.id}</span>.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="space-y-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm lg:col-span-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-ink-400">Booking ID</p>
                  <h1 className="text-2xl font-semibold text-ink-900">{booking.id}</h1>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <dl className="grid grid-cols-1 gap-5 border-t border-ink-50 pt-5 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium text-ink-400">Guest</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink-800">{booking.guestName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-ink-400">Contact</dt>
                  <dd className="mt-1 break-words text-sm font-semibold text-ink-800">
                    {booking.guestMobile}
                    <span className="block text-xs font-normal text-ink-400">{booking.guestEmail}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-ink-400">Room</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink-800">
                    Room {booking.roomNumber}
                    <span className="block text-xs font-normal text-ink-400">{booking.roomType}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-ink-400">Booked on</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink-800">
                    {formatDate(booking.createdAt.slice(0, 10))}
                  </dd>
                </div>
                {booking.checkedInAt && (
                  <div>
                    <dt className="text-xs font-medium text-ink-400">Checked in</dt>
                    <dd className="mt-1 text-sm font-semibold text-ink-800">
                      {formatDateTime(booking.checkedInAt)}
                    </dd>
                  </div>
                )}
                {booking.checkedOutAt && (
                  <div>
                    <dt className="text-xs font-medium text-ink-400">Checked out</dt>
                    <dd className="mt-1 text-sm font-semibold text-ink-800">
                      {formatDateTime(booking.checkedOutAt)}
                    </dd>
                  </div>
                )}
                {booking.checkedInAt && (
                  <div>
                    <dt className="text-xs font-medium text-ink-400">Stay duration</dt>
                    <dd className="mt-1 text-sm font-semibold text-ink-800">
                      {formatDuration(stayDurationMs(booking, now))}
                      {!booking.checkedOutAt && (
                        <span className="block text-xs font-normal text-ink-400">Still in-house</span>
                      )}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="flex flex-wrap gap-3 border-t border-ink-50 pt-5">
                {booking.status === 'Confirmed' && (
                  <button
                    type="button"
                    onClick={() => checkIn(booking)}
                    className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
                  >
                    Check in
                  </button>
                )}
                {booking.status === 'Checked-in' && (
                  <button
                    type="button"
                    onClick={() => setIsCheckOutOpen(true)}
                    className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
                  >
                    Check out
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate(`/payments/${booking.id}`)}
                  className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-600 transition hover:bg-ink-50"
                >
                  View invoice
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/bookings/new')}
                  className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-600 transition hover:bg-ink-50"
                >
                  New booking
                </button>
                {booking.status === 'Confirmed' && (
                  <button
                    type="button"
                    onClick={() => setIsCancelOpen(true)}
                    className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Cancel booking
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <BookingSummaryCard
                guestName={booking.guestName}
                guestEmail={booking.guestEmail}
                roomNumber={booking.roomNumber}
                roomType={booking.roomType}
                pricePerNight={booking.pricePerNight}
                checkIn={booking.checkIn}
                checkOut={booking.checkOut}
                nights={booking.nights}
                total={booking.amount}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={isCheckOutOpen}
        tone="primary"
        title="Check out guest"
        message={`Check ${booking?.guestName} out of Room ${booking?.roomNumber}? The room will be marked available.`}
        confirmLabel="Check out"
        onConfirm={handleCheckOut}
        onCancel={() => setIsCheckOutOpen(false)}
      />

      <ConfirmDialog
        open={isCancelOpen}
        title="Cancel booking"
        message={`Cancel booking ${booking?.id}? The room will become available for those dates again.`}
        confirmLabel="Cancel booking"
        cancelLabel="Keep booking"
        onConfirm={handleCancel}
        onCancel={() => setIsCancelOpen(false)}
      />
    </DashboardShell>
  )
}
