import { SAMPLE_MONTHLY, SAMPLE_ROOM_TYPE_SHARE } from '../data/reportsData'

const monthLabel = new Intl.DateTimeFormat('en-IN', { month: 'short' })
const monthYearLabel = new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' })

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

// One entry per month for the `count` months ending with the current one:
// sample history plus live bookings, bucketed by their check-in month.
// Cancelled bookings count toward bookings/cancellations but not revenue.
export function buildMonthlySeries(bookings, count, now = new Date()) {
  const months = Array.from({ length: count }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1)
    const sample = SAMPLE_MONTHLY[date.getMonth()]
    return {
      key: monthKey(date),
      label: monthLabel.format(date),
      fullLabel: monthYearLabel.format(date),
      revenue: sample.revenue,
      bookings: sample.bookings,
      cancelled: sample.cancelled,
      occupancy: sample.occupancy,
    }
  })

  const byKey = new Map(months.map((m) => [m.key, m]))
  bookings.forEach((booking) => {
    const month = byKey.get(booking.checkIn.slice(0, 7))
    if (!month) return
    month.bookings += 1
    if (booking.status === 'Cancelled') month.cancelled += 1
    else month.revenue += booking.amount
  })
  return months
}

// Booking counts per room type over the period, most booked first.
export function buildRoomTypeCounts(roomTypes, series, bookings) {
  const keys = new Set(series.map((m) => m.key))
  const sampleTotal = series.reduce((sum, m) => sum + m.bookings, 0)
  const liveInWindow = bookings.filter((b) => keys.has(b.checkIn.slice(0, 7)))
  const sampleOnly = sampleTotal - liveInWindow.length

  return roomTypes
    .map((type) => ({
      label: type,
      value:
        Math.round(sampleOnly * (SAMPLE_ROOM_TYPE_SHARE[type] ?? 0)) +
        liveInWindow.filter((b) => b.roomType === type).length,
    }))
    .sort((a, b) => b.value - a.value)
}

// Percent change from `previous` to `current`, to one decimal place.
export function percentChange(current, previous) {
  if (!previous) return null
  return Math.round(((current - previous) / previous) * 1000) / 10
}

// Clean axis ticks from 0 up to a round number at or above `max`.
export function niceTicks(max, count = 4) {
  if (max <= 0) return [0, 1]
  const rough = max / count
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= rough)
  const steps = Math.ceil(max / step)
  return Array.from({ length: steps + 1 }, (_, i) => i * step)
}
