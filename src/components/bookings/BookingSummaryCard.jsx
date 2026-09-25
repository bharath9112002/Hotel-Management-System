import { formatCurrency, formatDate } from '../../utils/format'

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <dt className="text-ink-400">{label}</dt>
      <dd className="text-right font-medium text-ink-800">{children}</dd>
    </div>
  )
}

const PLACEHOLDER = <span className="font-normal text-ink-300">—</span>

// Presentational: takes plain values so it can show a live preview in the
// form and a saved booking on the details page.
export default function BookingSummaryCard({
  guestName,
  guestEmail,
  roomNumber,
  roomType,
  pricePerNight,
  checkIn,
  checkOut,
  nights,
  total,
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-ink-800">Booking summary</p>

      <dl className="mt-3 divide-y divide-ink-50">
        <Row label="Guest">
          {guestName ? (
            <>
              {guestName}
              {guestEmail && <span className="block text-xs font-normal text-ink-400">{guestEmail}</span>}
            </>
          ) : (
            PLACEHOLDER
          )}
        </Row>
        <Row label="Room">
          {roomNumber ? (
            <>
              Room {roomNumber}
              <span className="block text-xs font-normal text-ink-400">{roomType}</span>
            </>
          ) : (
            PLACEHOLDER
          )}
        </Row>
        <Row label="Check-in">{checkIn ? formatDate(checkIn) : PLACEHOLDER}</Row>
        <Row label="Check-out">{checkOut ? formatDate(checkOut) : PLACEHOLDER}</Row>
        <Row label="Nights">{nights > 0 ? nights : PLACEHOLDER}</Row>
        <Row label="Rate per night">{pricePerNight ? formatCurrency(pricePerNight) : PLACEHOLDER}</Row>
      </dl>

      <div className="mt-2 flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">
        <span className="text-sm font-medium text-brand-700">Total amount</span>
        <span className="text-xl font-semibold text-brand-700">
          {total > 0 ? formatCurrency(total) : '—'}
        </span>
      </div>
    </div>
  )
}
