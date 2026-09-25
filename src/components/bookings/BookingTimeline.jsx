import { formatDateTime } from '../../utils/format'

const DOT_STYLES = {
  brand: 'bg-brand-500',
  emerald: 'bg-emerald-500',
  violet: 'bg-violet-500',
  red: 'bg-red-500',
}

function buildEvents(booking) {
  const events = [{ label: 'Booked', at: booking.createdAt, tone: 'brand' }]
  if (booking.checkedInAt) events.push({ label: 'Checked in', at: booking.checkedInAt, tone: 'emerald' })
  if (booking.checkedOutAt) {
    events.push({ label: 'Checked out · Completed', at: booking.checkedOutAt, tone: 'violet' })
  }
  if (booking.status === 'Cancelled') {
    // Bookings cancelled before cancellation times were recorded have no timestamp.
    events.push({ label: 'Cancelled', at: booking.cancelledAt, tone: 'red' })
  }
  return events
}

export default function BookingTimeline({ booking }) {
  const events = buildEvents(booking)

  return (
    <ol className="space-y-3">
      {events.map((event, index) => (
        <li key={event.label} className="relative flex gap-3">
          {index < events.length - 1 && (
            <span className="absolute left-[5px] top-4 h-[calc(100%+0.25rem)] w-px bg-ink-100" />
          )}
          <span className={`relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${DOT_STYLES[event.tone]}`} />
          <div>
            <p className="text-sm font-medium text-ink-800">{event.label}</p>
            <p className="text-xs text-ink-400">{event.at ? formatDateTime(event.at) : 'Time not recorded'}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
