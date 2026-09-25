// Money is whole rupees in practice, but users can type paise; rounding after
// every sum keeps float noise (0.1 + 0.2) out of balances and statuses.
export function roundMoney(value) {
  return Math.round(value * 100) / 100
}

export function invoiceNumberFor(bookingId) {
  return `INV-${bookingId.replace('BK-', '')}`
}

// An invoice is derived, never stored: it is the booking plus whatever
// payment/refund entries exist for it. Refunds are stored as negative amounts.
export function buildInvoice(booking, entries) {
  const sorted = [...entries].sort((a, b) => Date.parse(b.paidAt) - Date.parse(a.paidAt))
  const paid = roundMoney(entries.reduce((sum, entry) => sum + entry.amount, 0))
  const payments = sorted.filter((entry) => entry.type === 'payment')

  let status
  let balance = 0
  if (booking.status === 'Cancelled') {
    // A cancelled booking owes nothing; money already taken must go back.
    if (paid > 0) status = 'Refund due'
    else status = entries.length > 0 ? 'Refunded' : 'Cancelled'
  } else {
    balance = roundMoney(Math.max(0, booking.amount - paid))
    if (paid <= 0) status = 'Pending'
    else status = balance > 0 ? 'Partial' : 'Paid'
  }

  return {
    invoiceNumber: invoiceNumberFor(booking.id),
    booking,
    entries: sorted,
    total: booking.amount,
    paid,
    balance,
    status,
    methods: [...new Set(payments.map((entry) => entry.method))],
    lastPaymentAt: payments[0]?.paidAt ?? null,
  }
}
