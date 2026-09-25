const STATUS_STYLES = {
  Confirmed: 'bg-blue-50 text-blue-700',
  'Checked-in': 'bg-emerald-50 text-emerald-700',
  Completed: 'bg-violet-50 text-violet-700',
  Pending: 'bg-amber-50 text-amber-700',
  Cancelled: 'bg-red-50 text-red-600',
}

export default function StatusBadge({ status }) {
  const className = STATUS_STYLES[status] ?? 'bg-ink-100 text-ink-600'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {status}
    </span>
  )
}
