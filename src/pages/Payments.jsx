import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import DashboardShell from '../components/layout/DashboardShell'
import Pagination from '../components/Pagination'
import PaymentStatusBadge from '../components/payments/PaymentStatusBadge'
import RecordPaymentModal from '../components/payments/RecordPaymentModal'
import { PAYMENT_METHODS, PAYMENT_PAGE_SIZE, PAYMENT_STATUSES } from '../data/paymentConstants'
import { usePayments } from '../context/PaymentsContext'
import { formatCurrency, formatDate, formatDateTime } from '../utils/format'
import { usePaymentActions } from '../utils/usePaymentActions'

const TABS = [
  { id: 'invoices', label: 'Invoices' },
  { id: 'history', label: 'Payment history' },
]

const selectClass =
  'rounded-xl border border-ink-200 px-3 py-2.5 text-sm text-ink-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/60'

function SummaryCard({ label, value, hint, tone = 'text-ink-900' }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium text-ink-400">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${tone}`}>{value}</p>
      <p className="mt-0.5 text-xs text-ink-400">{hint}</p>
    </div>
  )
}

function matchesSearch(term, invoice) {
  return (
    !term ||
    invoice.invoiceNumber.toLowerCase().includes(term) ||
    invoice.booking.id.toLowerCase().includes(term) ||
    invoice.booking.guestName.toLowerCase().includes(term) ||
    invoice.booking.roomNumber.toLowerCase().includes(term)
  )
}

export default function Payments() {
  const { invoices } = usePayments()
  const { pay, refund } = usePaymentActions()

  const [tab, setTab] = useState('invoices')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [method, setMethod] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [payTarget, setPayTarget] = useState(null)
  const [refundTarget, setRefundTarget] = useState(null)

  const summary = useMemo(() => {
    const live = invoices.filter((inv) => inv.booking.status !== 'Cancelled')
    return {
      billed: live.reduce((sum, inv) => sum + inv.total, 0),
      collected: invoices.reduce((sum, inv) => sum + inv.paid, 0),
      outstanding: live.reduce((sum, inv) => sum + inv.balance, 0),
      refunded: invoices.reduce(
        (sum, inv) => sum + inv.entries.filter((e) => e.type === 'refund').reduce((s, e) => s - e.amount, 0),
        0,
      ),
      refundsDue: invoices.filter((inv) => inv.status === 'Refund due').length,
      unpaid: live.filter((inv) => inv.balance > 0).length,
    }
  }, [invoices])

  const historyEntries = useMemo(
    () =>
      invoices
        .flatMap((invoice) => invoice.entries.map((entry) => ({ ...entry, invoice })))
        .sort((a, b) => Date.parse(b.paidAt) - Date.parse(a.paidAt)),
    [invoices],
  )

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (tab === 'invoices') {
      return invoices.filter(
        (inv) =>
          matchesSearch(term, inv) &&
          (!status || inv.status === status) &&
          (!method || inv.methods.includes(method)),
      )
    }
    return historyEntries.filter(
      (entry) => matchesSearch(term, entry.invoice) && (!method || entry.method === method),
    )
  }, [tab, invoices, historyEntries, search, status, method])

  const totalPages = Math.max(1, Math.ceil(rows.length / PAYMENT_PAGE_SIZE))
  const page = Math.min(currentPage, totalPages)
  const pageStart = (page - 1) * PAYMENT_PAGE_SIZE
  const pageRows = rows.slice(pageStart, pageStart + PAYMENT_PAGE_SIZE)

  const resetPage = () => setCurrentPage(1)
  const hasFilters = Boolean(search.trim() || status || method)

  const clearFilters = () => {
    setSearch('')
    setStatus('')
    setMethod('')
    resetPage()
  }

  const handlePaySubmit = (values) => {
    if (pay(payTarget, values)) setPayTarget(null)
  }

  const handleRefundConfirm = () => {
    refund(refundTarget)
    setRefundTarget(null)
  }

  return (
    <DashboardShell title="Payments" subtitle="Invoices, payment status and payment history.">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total billed"
            value={formatCurrency(summary.billed)}
            hint="Across all active bookings"
          />
          <SummaryCard
            label="Collected"
            value={formatCurrency(summary.collected)}
            hint="Payments received, net of refunds"
            tone="text-emerald-700"
          />
          <SummaryCard
            label="Outstanding"
            value={formatCurrency(summary.outstanding)}
            hint={`${summary.unpaid} ${summary.unpaid === 1 ? 'invoice' : 'invoices'} awaiting payment`}
            tone="text-amber-700"
          />
          <SummaryCard
            label="Refunded"
            value={formatCurrency(summary.refunded)}
            hint={
              summary.refundsDue > 0
                ? `${summary.refundsDue} ${summary.refundsDue === 1 ? 'refund' : 'refunds'} still due`
                : 'No refunds pending'
            }
          />
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white p-4">
          <div role="tablist" className="flex flex-wrap gap-1.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => {
                  setTab(t.id)
                  resetPage()
                }}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  tab === t.id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-500 hover:bg-ink-50 hover:text-ink-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300"
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  resetPage()
                }}
                placeholder="Search invoice, booking, guest or room…"
                aria-label="Search payments"
                className="w-full rounded-xl border border-ink-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/60"
              />
            </div>

            {tab === 'invoices' && (
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  resetPage()
                }}
                aria-label="Filter by payment status"
                className={selectClass}
              >
                <option value="">All statuses</option>
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}

            <select
              value={method}
              onChange={(e) => {
                setMethod(e.target.value)
                resetPage()
              }}
              aria-label="Filter by payment method"
              className={selectClass}
            >
              <option value="">All methods</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {rows.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
            <p className="text-sm font-medium text-ink-700">
              {hasFilters
                ? 'No results match your filters'
                : tab === 'invoices'
                  ? 'No invoices yet'
                  : 'No payments recorded yet'}
            </p>
            <p className="mt-1 text-xs text-ink-400">
              {hasFilters
                ? 'Try a different search or clear the filters.'
                : tab === 'invoices'
                  ? 'An invoice is created automatically for every booking.'
                  : 'Record a payment against an invoice and it will appear here.'}
            </p>
          </div>
        )}

        {rows.length > 0 && tab === 'invoices' && (
          <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-ink-100 bg-ink-50/60 text-xs font-medium uppercase tracking-wide text-ink-400">
                <tr>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Paid</th>
                  <th className="px-4 py-3 text-right">Balance</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {pageRows.map((inv) => (
                  <tr key={inv.invoiceNumber} className="transition hover:bg-ink-50/50">
                    <td className="whitespace-nowrap px-4 py-3">
                      <Link
                        to={`/payments/${inv.booking.id}`}
                        className="font-mono text-xs font-semibold text-ink-700 hover:text-brand-600"
                      >
                        {inv.invoiceNumber}
                      </Link>
                      <span className="block text-xs text-ink-400">{inv.booking.id}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-ink-800">{inv.booking.guestName}</td>
                    <td className="px-4 py-3 text-ink-600">
                      Room {inv.booking.roomNumber}
                      <span className="block text-xs text-ink-400">
                        {formatDate(inv.booking.checkIn)} → {formatDate(inv.booking.checkOut)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-ink-800">
                      {formatCurrency(inv.total)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-emerald-700">
                      {formatCurrency(inv.paid)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-ink-800">
                      {formatCurrency(inv.balance)}
                    </td>
                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={inv.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/payments/${inv.booking.id}`}
                          className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 transition hover:bg-ink-50"
                        >
                          Invoice
                        </Link>
                        {inv.balance > 0 && (
                          <button
                            type="button"
                            onClick={() => setPayTarget(inv)}
                            className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
                          >
                            Record payment
                          </button>
                        )}
                        {inv.status === 'Refund due' && (
                          <button
                            type="button"
                            onClick={() => setRefundTarget(inv)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {rows.length > 0 && tab === 'history' && (
          <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-sm">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-ink-100 bg-ink-50/60 text-xs font-medium uppercase tracking-wide text-ink-400">
                <tr>
                  <th className="px-4 py-3">Receipt</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {pageRows.map((entry) => (
                  <tr key={entry.id} className="transition hover:bg-ink-50/50">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink-600">{entry.id}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-600">{formatDateTime(entry.paidAt)}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Link
                        to={`/payments/${entry.invoice.booking.id}`}
                        className="font-mono text-xs text-ink-600 hover:text-brand-600"
                      >
                        {entry.invoice.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium text-ink-800">{entry.invoice.booking.guestName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          entry.type === 'refund' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {entry.type === 'refund' ? 'Refund' : 'Payment'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{entry.method}</td>
                    <td
                      className={`whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums ${
                        entry.amount < 0 ? 'text-red-600' : 'text-ink-800'
                      }`}
                    >
                      {entry.amount < 0 ? '−' : ''}
                      {formatCurrency(Math.abs(entry.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {rows.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-ink-400">
              Showing {pageStart + 1}–{pageStart + pageRows.length} of {rows.length}
            </p>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      {payTarget && (
        <RecordPaymentModal invoice={payTarget} onClose={() => setPayTarget(null)} onSubmit={handlePaySubmit} />
      )}

      <ConfirmDialog
        open={Boolean(refundTarget)}
        tone="primary"
        title="Refund payment"
        message={
          refundTarget
            ? `Refund ${formatCurrency(refundTarget.paid)} to ${refundTarget.booking.guestName} for cancelled booking ${refundTarget.booking.id}?`
            : ''
        }
        confirmLabel="Refund"
        onConfirm={handleRefundConfirm}
        onCancel={() => setRefundTarget(null)}
      />
    </DashboardShell>
  )
}
