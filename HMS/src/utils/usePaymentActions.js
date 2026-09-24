import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { usePayments } from '../context/PaymentsContext'
import { formatCurrency } from './format'

// Wraps payment/refund with user feedback; both return true on success.
export function usePaymentActions() {
  const { recordPayment, refundBooking } = usePayments()

  const pay = useCallback(
    (invoice, values) => {
      try {
        recordPayment(invoice.booking.id, values)
        toast.success(`${formatCurrency(Number(values.amount))} received for ${invoice.invoiceNumber}.`)
        return true
      } catch (err) {
        toast.error(err.message)
        return false
      }
    },
    [recordPayment],
  )

  const refund = useCallback(
    (invoice) => {
      try {
        refundBooking(invoice.booking.id)
        toast.success(`${formatCurrency(invoice.paid)} refunded for ${invoice.invoiceNumber}.`)
        return true
      } catch (err) {
        toast.error(err.message)
        return false
      }
    },
    [refundBooking],
  )

  return { pay, refund }
}
