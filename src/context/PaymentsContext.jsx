import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useBookings } from './BookingsContext'
import { buildInvoice, roundMoney } from '../utils/paymentUtils'
import { formatCurrency } from '../utils/format'

const PAYMENTS_KEY = 'hms_payments'

const PaymentsContext = createContext(null)

function readPayments() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PAYMENTS_KEY))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writePayments(payments) {
  try {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments))
  } catch {
    // Storage unavailable/full: payments still work for this session.
  }
}

function nextPaymentId(payments) {
  const highest = payments.reduce((max, p) => Math.max(max, Number(p.id.replace('PAY-', '')) || 0), 2000)
  return `PAY-${highest + 1}`
}

export function PaymentsProvider({ children }) {
  const { bookings } = useBookings()
  const [payments, setPayments] = useState(readPayments)

  const invoices = useMemo(() => {
    const byBooking = new Map()
    for (const entry of payments) {
      if (!byBooking.has(entry.bookingId)) byBooking.set(entry.bookingId, [])
      byBooking.get(entry.bookingId).push(entry)
    }
    return bookings.map((booking) => buildInvoice(booking, byBooking.get(booking.id) ?? []))
  }, [bookings, payments])

  const commit = useCallback((entry) => {
    setPayments((prev) => {
      const next = [{ ...entry, id: nextPaymentId(prev) }, ...prev]
      writePayments(next)
      return next
    })
  }, [])

  // Authoritative validation; the form mirrors it for instant feedback.
  const recordPayment = useCallback(
    (bookingId, { amount, method }) => {
      const invoice = invoices.find((inv) => inv.booking.id === bookingId)
      if (!invoice) throw new Error('Invoice not found.')
      if (invoice.booking.status === 'Cancelled') {
        throw new Error('This booking was cancelled, so no payment can be taken.')
      }
      const value = roundMoney(Number(amount))
      if (!Number.isFinite(value) || value <= 0) throw new Error('Enter an amount greater than zero.')
      if (value > invoice.balance) {
        throw new Error(`Amount exceeds the outstanding balance of ${formatCurrency(invoice.balance)}.`)
      }
      commit({ bookingId, type: 'payment', amount: value, method, paidAt: new Date().toISOString() })
    },
    [invoices, commit],
  )

  const refundBooking = useCallback(
    (bookingId) => {
      const invoice = invoices.find((inv) => inv.booking.id === bookingId)
      if (!invoice || invoice.status !== 'Refund due') {
        throw new Error('There is nothing to refund on this invoice.')
      }
      commit({
        bookingId,
        type: 'refund',
        amount: -invoice.paid,
        method: invoice.methods[0] ?? 'Cash',
        paidAt: new Date().toISOString(),
      })
    },
    [invoices, commit],
  )

  const value = useMemo(
    () => ({ invoices, payments, recordPayment, refundBooking }),
    [invoices, payments, recordPayment, refundBooking],
  )

  return <PaymentsContext.Provider value={value}>{children}</PaymentsContext.Provider>
}

export function usePayments() {
  const ctx = useContext(PaymentsContext)
  if (!ctx) {
    throw new Error('usePayments must be used within a PaymentsProvider')
  }
  return ctx
}
