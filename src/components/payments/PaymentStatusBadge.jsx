const STATUS_STYLES = {
  Paid: 'bg-emerald-50 text-emerald-700',
  Partial: 'bg-amber-50 text-amber-700',
  Pending: 'bg-blue-50 text-blue-700',
  'Refund due': 'bg-red-50 text-red-600',
  Refunded: 'bg-ink-100 text-ink-600',
  Cancelled: 'bg-ink-100 text-ink-500',
}

export default function PaymentStatusBadge({ status }) {
  const className = STATUS_STYLES[status] ?? 'bg-ink-100 text-ink-600'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {status}
    </span>
  )
}
