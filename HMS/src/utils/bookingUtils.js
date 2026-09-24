import { ACTIVE_BOOKING_STATUSES } from '../data/bookingConstants'

const MS_PER_DAY = 24 * 60 * 60 * 1000

// Dates are handled as plain 'YYYY-MM-DD' strings (what <input type="date">
// produces), which also compare correctly as strings.
export function todayISO() {
  return new Date().toLocaleDateString('en-CA')
}

export function addDays(isoDate, days) {
  const date = new Date(`${isoDate}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0
  const nights = Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / MS_PER_DAY)
  return Number.isFinite(nights) && nights > 0 ? nights : 0
}

// Stays are [checkIn, checkOut): one guest can check out the same day the
// next one checks in.
export function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB
}

export function findConflictingBooking(bookings, roomId, checkIn, checkOut, excludeId) {
  if (!roomId || !checkIn || !checkOut || checkOut <= checkIn) return null
  return (
    bookings.find(
      (booking) =>
        booking.id !== excludeId &&
        booking.roomId === roomId &&
        ACTIVE_BOOKING_STATUSES.includes(booking.status) &&
        rangesOverlap(checkIn, checkOut, booking.checkIn, booking.checkOut),
    ) ?? null
  )
}
