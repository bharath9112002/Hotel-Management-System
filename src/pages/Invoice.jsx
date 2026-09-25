import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ConfirmDialog from '../components/ConfirmDialog'
import DashboardShell from '../components/layout/DashboardShell'
import PaymentStatusBadge from '../components/payments/PaymentStatusBadge'
import RecordPaymentModal from '../components/payments/RecordPaymentModal'
import { usePayments } from '../context/PaymentsContext'
import { formatCurrency, formatDate, formatDateTime } from '../utils/format'
import { usePaymentActions } from '../utils/usePaymentActions'

function Meta({ label, children }) {
  return (
    <div>
      <p className="text-xs font-medium text-ink-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink-800">{children}</p>
    </div>
  )
}

function TotalRow({ label, value, strong, tone = 'text-ink-800' }) {
  return (
    <div className={`flex items-center justify-between py-1.5 text-sm ${strong ? 'font-semibold' : ''}`}>
      <span className="text-ink-500">{label}</span>
      <span className={`tabular-nums ${tone}`}>{value}</span>
    </div>
  )
}

export default function Invoice() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { invoices } = usePayments()
  const { pay, refund } = usePaymentActions()

  const [isPayOpen, setIsPayOpen] = useState(false)
  const [isRefundOpen, setIsRefundOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const downloadTimer = useRef(null)

  useEffect(() => () => clearTimeout(downloadTimer.current), [])

  const invoice = invoices.find((inv) => inv.booking.id === bookingId)

  // UI-only: no file is generated, the button just simulates the download.
  const handleDownload = () => {
    setIsDownloading(true)
    downloadTimer.current = setTimeout(() => {
      setIsDownloading(false)
      toast.success(`${invoice.invoiceNumber}.pdf downloaded (demo — no file is created).`)
    }, 900)
  }

  const handlePaySubmit = (values) => {
    if (pay(invoice, values)) setIsPayOpen(false)
  }

  const handleRefundConfirm = () => {
    refund(invoice)
    setIsRefundOpen(false)
  }

  return (
    <DashboardShell title="Invoice" subtitle="Billing details for this stay.">
      <button
        type="button"
        onClick={() => navigate('/payments')}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-700"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to payments
      </button>

      {!invoice && (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
          <p className="text-sm font-medium text-ink-700">Invoice not found</p>
          <p className="mt-1 text-xs text-ink-400">Check the booking ID and try again.</p>
        </div>
      )}

      {invoice && (
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <PaymentStatusBadge status={invoice.status} />
            <div className="flex flex-wrap gap-3">
              {invoice.balance > 0 && (
                <button
                  type="button"
                  onClick={() => setIsPayOpen(true)}
                  className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
                >
                  Record payment
                </button>
              )}
              {invoice.status === 'Refund due' && (
                <button
                  type="button"
                  onClick={() => setIsRefundOpen(true)}
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Refund {formatCurrency(invoice.paid)}
                </button>
              )}
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDownloading ? 'Preparing PDF…' : 'Download invoice'}
              </button>
            </div>
          </div>

          <article className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8">
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-100 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path
                      d="M3 21V8l9-5 9 5v13"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-ink-900">Grandview Hotel</p>
                  <p className="text-xs text-ink-400">12 Lakeview Road, Chennai · +91 44 5555 0100</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Invoice</p>
                <p className="font-mono text-lg font-semibold text-ink-900">{invoice.invoiceNumber}</p>
                <p className="text-xs text-ink-400">Issued {formatDate(invoice.booking.createdAt.slice(0, 10))}</p>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-5 border-b border-ink-100 py-6 sm:grid-cols-3">
              <Meta label="Billed to">
                {invoice.booking.guestName}
                <span className="block text-xs font-normal text-ink-400">{invoice.booking.guestEmail}</span>
                <span className="block text-xs font-normal text-ink-400">{invoice.booking.guestMobile}</span>
              </Meta>
              <Meta label="Booking">
                {invoice.booking.id}
                <span className="block text-xs font-normal text-ink-400">{invoice.booking.status}</span>
              </Meta>
              <Meta label="Stay">
                {formatDate(invoice.booking.checkIn)} → {formatDate(invoice.booking.checkOut)}
                <span className="block text-xs font-normal text-ink-400">
                  {invoice.booking.nights} {invoice.booking.nights === 1 ? 'night' : 'nights'}
                </span>
              </Meta>
            </div>

            <div className="overflow-x-auto py-6">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead className="border-b border-ink-100 text-xs font-medium uppercase tracking-wide text-ink-400">
                  <tr>
                    <th className="pb-2">Description</th>
                    <th className="pb-2 text-right">Nights</th>
                    <th className="pb-2 text-right">Rate</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 text-ink-800">
                      Room {invoice.booking.roomNumber} · {invoice.booking.roomType}
                    </td>
                    <td className="py-3 text-right tabular-nums text-ink-600">{invoice.booking.nights}</td>
                    <td className="py-3 text-right tabular-nums text-ink-600">
                      {formatCurrency(invoice.booking.pricePerNight)}
                    </td>
                    <td className="py-3 text-right tabular-nums text-ink-800">{formatCurrency(invoice.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="ml-auto max-w-xs border-t border-ink-100 pt-4">
              <TotalRow label="Subtotal" value={formatCurrency(invoice.total)} />
              <TotalRow label="Total" value={formatCurrency(invoice.total)} strong />
              <TotalRow label="Paid" value={formatCurrency(invoice.paid)} tone="text-emerald-700" />
              <div className="mt-1 border-t border-ink-100 pt-1">
                <TotalRow
                  label="Balance due"
                  value={formatCurrency(invoice.balance)}
                  strong
                  tone={invoice.balance > 0 ? 'text-brand-700' : 'text-ink-800'}
                />
              </div>
            </div>

            {invoice.entries.length > 0 && (
              <div className="mt-8 border-t border-ink-100 pt-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">
                  Payment history
                </p>
                <ul className="divide-y divide-ink-50">
                  {invoice.entries.map((entry) => (
                    <li key={entry.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                      <span className="text-ink-600">
                        <span className="font-mono text-xs text-ink-400">{entry.id}</span>
                        <span className="mx-2 text-ink-300">·</span>
                        {entry.type === 'refund' ? 'Refund' : 'Payment'} via {entry.method}
                        <span className="block text-xs text-ink-400">{formatDateTime(entry.paidAt)}</span>
                      </span>
                      <span
                        className={`font-medium tabular-nums ${
                          entry.amount < 0 ? 'text-red-600' : 'text-ink-800'
                        }`}
                      >
                        {entry.amount < 0 ? '−' : ''}
                        {formatCurrency(Math.abs(entry.amount))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <footer className="mt-8 border-t border-ink-100 pt-4 text-center text-xs text-ink-400">
              Thank you for staying with Grandview. This is a computer-generated invoice.
            </footer>
          </article>
        </div>
      )}

      {isPayOpen && invoice && (
        <RecordPaymentModal invoice={invoice} onClose={() => setIsPayOpen(false)} onSubmit={handlePaySubmit} />
      )}

      <ConfirmDialog
        open={isRefundOpen}
        tone="primary"
        title="Refund payment"
        message={
          invoice
            ? `Refund ${formatCurrency(invoice.paid)} to ${invoice.booking.guestName} for cancelled booking ${invoice.booking.id}?`
            : ''
        }
        confirmLabel="Refund"
        onConfirm={handleRefundConfirm}
        onCancel={() => setIsRefundOpen(false)}
      />
    </DashboardShell>
  )
}
