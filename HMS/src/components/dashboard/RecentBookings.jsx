import { formatCurrency, formatShortDate } from '../../utils/format'
import StatusBadge from './StatusBadge'

export default function RecentBookings({ bookings }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-800">Recent bookings</p>
        <span className="text-xs font-medium text-ink-400">{bookings.length} shown</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs font-medium uppercase tracking-wide text-ink-400">
              <th className="py-2.5 pr-4">Guest</th>
              <th className="py-2.5 pr-4">Room</th>
              <th className="py-2.5 pr-4">Check-in</th>
              <th className="py-2.5 pr-4">Check-out</th>
              <th className="py-2.5 pr-4">Status</th>
              <th className="py-2.5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-ink-50 last:border-0">
                <td className="py-3 pr-4">
                  <p className="font-medium text-ink-800">{booking.guestName}</p>
                  <p className="text-xs text-ink-400">{booking.id}</p>
                </td>
                <td className="py-3 pr-4">
                  <p className="text-ink-700">Room {booking.roomNumber}</p>
                  <p className="text-xs text-ink-400">{booking.roomType}</p>
                </td>
                <td className="py-3 pr-4 text-ink-600">{formatShortDate(booking.checkIn)}</td>
                <td className="py-3 pr-4 text-ink-600">{formatShortDate(booking.checkOut)}</td>
                <td className="py-3 pr-4">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="py-3 text-right font-medium tabular-nums text-ink-800">
                  {formatCurrency(booking.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
