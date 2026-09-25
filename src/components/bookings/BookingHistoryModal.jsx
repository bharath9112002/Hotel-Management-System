import { Link } from 'react-router-dom'
import Modal from '../Modal'
import StatusBadge from '../dashboard/StatusBadge'
import BookingTimeline from './BookingTimeline'
import { formatCurrency, formatDate } from '../../utils/format'

function Field({ label, children, hint }) {
  return (
    <div>
      <dt className="text-xs font-medium text-ink-400">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold text-ink-800">
        {children}
        {hint && <span className="block text-xs font-normal text-ink-400">{hint}</span>}
      </dd>
    </div>
  )
}

export default function BookingHistoryModal({ booking, onClose, onCancel }) {
  return (
    <Modal open={Boolean(booking)} onClose={onClose} title="Booking details" maxWidth="max-w-2xl">
      {booking && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-ink-400">Booking ID</p>
              <p className="text-xl font-semibold text-ink-900">{booking.id}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <dl className="grid grid-cols-1 gap-4 border-t border-ink-50 pt-5 sm:grid-cols-2">
            <Field label="Guest" hint={booking.guestEmail}>
              {booking.guestName}
            </Field>
            <Field label="Mobile">{booking.guestMobile || '—'}</Field>
            <Field label="Room" hint={booking.roomType}>
              Room {booking.roomNumber}
            </Field>
            <Field label="Stay" hint={`${booking.nights} ${booking.nights === 1 ? 'night' : 'nights'}`}>
              {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
            </Field>
            <Field label="Rate">{formatCurrency(booking.pricePerNight)} / night</Field>
            <Field label="Total">{formatCurrency(booking.amount)}</Field>
          </dl>

          <div className="border-t border-ink-50 pt-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">Timeline</p>
            <BookingTimeline booking={booking} />
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-ink-50 pt-5">
            {booking.status === 'Confirmed' && (
              <button
                type="button"
                onClick={() => onCancel(booking)}
                className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Cancel booking
              </button>
            )}
            <Link
              to={`/payments/${booking.id}`}
              className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-600 transition hover:bg-ink-50"
            >
              View invoice
            </Link>
            <Link
              to={`/bookings/${booking.id}`}
              state={{ from: '/booking-history' }}
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
            >
              Open full details
            </Link>
          </div>
        </div>
      )}
    </Modal>
  )
}
