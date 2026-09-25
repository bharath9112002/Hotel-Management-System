import { useForm } from 'react-hook-form'
import { PAYMENT_METHODS } from '../../data/paymentConstants'
import { formatCurrency } from '../../utils/format'
import Modal from '../Modal'
import TextInput from '../TextInput'

export default function RecordPaymentModal({ invoice, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { amount: invoice.balance, method: PAYMENT_METHODS[0] } })

  return (
    <Modal open onClose={onClose} title="Record payment" maxWidth="max-w-md">
      <div className="mb-4 grid grid-cols-3 gap-3 rounded-xl bg-ink-50 p-3 text-center">
        <div>
          <p className="text-[11px] text-ink-400">Total</p>
          <p className="text-sm font-semibold text-ink-800">{formatCurrency(invoice.total)}</p>
        </div>
        <div>
          <p className="text-[11px] text-ink-400">Paid</p>
          <p className="text-sm font-semibold text-ink-800">{formatCurrency(invoice.paid)}</p>
        </div>
        <div>
          <p className="text-[11px] text-ink-400">Balance</p>
          <p className="text-sm font-semibold text-brand-700">{formatCurrency(invoice.balance)}</p>
        </div>
      </div>
      <p className="mb-4 text-xs text-ink-400">
        {invoice.invoiceNumber} · {invoice.booking.guestName} · Room {invoice.booking.roomNumber}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <TextInput
          id="amount"
          label="Amount (₹)"
          type="number"
          step="0.01"
          min="0"
          error={errors.amount?.message}
          {...register('amount', {
            required: 'Amount is required.',
            validate: {
              positive: (v) => Number(v) > 0 || 'Enter an amount greater than zero.',
              precision: (v) => /^\d+(\.\d{1,2})?$/.test(String(v)) || 'Use at most 2 decimal places.',
              withinBalance: (v) =>
                Number(v) <= invoice.balance ||
                `Amount can't exceed the balance of ${formatCurrency(invoice.balance)}.`,
            },
          })}
        />

        <div>
          <label htmlFor="method" className="mb-1.5 block text-sm font-medium text-ink-700">
            Payment method
          </label>
          <select
            id="method"
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/60"
            {...register('method', { required: true })}
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 border-t border-ink-50 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-600 transition hover:bg-ink-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Record payment
          </button>
        </div>
      </form>
    </Modal>
  )
}
