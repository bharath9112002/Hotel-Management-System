import { Link } from 'react-router-dom'
import StatusBadge from '../dashboard/StatusBadge'
import { formatDuration, stayDurationMs } from '../../utils/bookingUtils'
import { formatCurrency, formatDate, formatDateTime } from '../../utils/format'

function BookingCell({ booking }) {
  return (
    <Link to={`/bookings/${booking.id}`} className="font-mono text-xs text-ink-600 hover:text-brand-600">
      {booking.id}
    </Link>
  )
}

function RoomCell({ booking }) {
  return (
    <>
      Room {booking.roomNumber}
      <span className="block text-xs text-ink-400">{booking.roomType}</span>
    </>
  )
}

function PlannedStayCell({ booking }) {
  return (
    <>
      {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
      <span className="block text-xs text-ink-400">
        {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}
      </span>
    </>
  )
}

function Pill({ tone, children }) {
  const tones = {
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-600',
  }
  return (
    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}

function ActionButton({ tone = 'primary', disabled, title, onClick, children }) {
  const styles =
    tone === 'primary'
      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700'
      : 'border border-ink-200 text-ink-700 hover:bg-ink-50'
  return (
    <button
      type="button"
      disabled={disabled}
      title={title}
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles}`}
    >
      {children}
    </button>
  )
}

// One table, four views: what differs per tab is just the column set.
function getColumns({ tab, today, now, onCheckIn, onCheckOut }) {
  const base = [
    { header: 'Booking', cell: (b) => <BookingCell booking={b} /> },
    { header: 'Guest', cell: (b) => <span className="font-medium text-ink-800">{b.guestName}</span> },
    { header: 'Room', cell: (b) => <RoomCell booking={b} /> },
  ]

  if (tab === 'arrivals') {
    return [
      ...base,
      { header: 'Planned stay', cell: (b) => <PlannedStayCell booking={b} /> },
      {
        header: 'Arrival',
        cell: (b) => {
          if (b.checkIn === today) return <Pill tone="green">Arriving today</Pill>
          if (b.checkIn < today) return <Pill tone="amber">Due since {formatDate(b.checkIn)}</Pill>
          return <span className="text-ink-500">{formatDate(b.checkIn)}</span>
        },
      },
      {
        header: 'Action',
        align: 'right',
        cell: (b) => {
          const early = today < b.checkIn
          const ended = today >= b.checkOut
          const reason = early
            ? `Check-in opens on ${formatDate(b.checkIn)}`
            : ended
              ? 'The stay period has ended'
              : undefined
          return (
            <ActionButton disabled={early || ended} title={reason} onClick={() => onCheckIn(b)}>
              Check in
            </ActionButton>
          )
        },
      },
    ]
  }

  if (tab === 'inhouse') {
    return [
      ...base,
      { header: 'Checked in', cell: (b) => formatDateTime(b.checkedInAt) },
      {
        header: 'Stay so far',
        cell: (b) => (
          <span className="font-medium text-ink-800">{formatDuration(stayDurationMs(b, now))}</span>
        ),
      },
      {
        header: 'Departs',
        cell: (b) => (
          <>
            {formatDate(b.checkOut)}
            {b.checkOut === today && (
              <span className="block">
                <Pill tone="amber">Due today</Pill>
              </span>
            )}
            {b.checkOut < today && (
              <span className="block">
                <Pill tone="red">Overdue</Pill>
              </span>
            )}
          </>
        ),
      },
      {
        header: 'Action',
        align: 'right',
        cell: (b) => (
          <ActionButton tone="secondary" onClick={() => onCheckOut(b)}>
            Check out
          </ActionButton>
        ),
      },
    ]
  }

  if (tab === 'checkin-history') {
    return [
      ...base,
      { header: 'Checked in', cell: (b) => formatDateTime(b.checkedInAt) },
      { header: 'Planned stay', cell: (b) => <PlannedStayCell booking={b} /> },
      { header: 'Status', cell: (b) => <StatusBadge status={b.status} /> },
    ]
  }

  return [
    ...base,
    { header: 'Checked in', cell: (b) => formatDateTime(b.checkedInAt) },
    { header: 'Checked out', cell: (b) => formatDateTime(b.checkedOutAt) },
    {
      header: 'Stay duration',
      cell: (b) => (
        <>
          <span className="font-medium text-ink-800">{formatDuration(stayDurationMs(b))}</span>
          <span className="block text-xs text-ink-400">
            {b.nights} {b.nights === 1 ? 'night' : 'nights'} booked
          </span>
        </>
      ),
    },
    {
      header: 'Amount',
      align: 'right',
      cell: (b) => <span className="font-medium tabular-nums">{formatCurrency(b.amount)}</span>,
    },
  ]
}

export default function StayTable({ tab, rows, today, now, onCheckIn, onCheckOut }) {
  const columns = getColumns({ tab, today, now, onCheckIn, onCheckOut })

  return (
    <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-sm">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="border-b border-ink-100 bg-ink-50/60 text-xs font-medium uppercase tracking-wide text-ink-400">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-50">
          {rows.map((booking) => (
            <tr key={booking.id} className="transition hover:bg-ink-50/50">
              {columns.map((col) => (
                <td
                  key={col.header}
                  className={`px-4 py-3 text-ink-600 ${col.align === 'right' ? 'text-right' : ''}`}
                >
                  {col.align === 'right' ? (
                    <div className="flex justify-end">{col.cell(booking)}</div>
                  ) : (
                    col.cell(booking)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
