const STATUS_STYLES = {
  Available: 'bg-emerald-50 text-emerald-700',
  Occupied: 'bg-amber-50 text-amber-700',
  Maintenance: 'bg-red-50 text-red-600',
}

export default function RoomStatusBadge({ status }) {
  const className = STATUS_STYLES[status] ?? 'bg-ink-100 text-ink-600'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {status}
    </span>
  )
}
