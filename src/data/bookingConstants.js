export const BOOKING_STATUSES = ['Confirmed', 'Checked-in', 'Completed', 'Cancelled']

// Only these statuses hold a room for their dates; cancelled and completed
// bookings free it up again.
export const ACTIVE_BOOKING_STATUSES = ['Confirmed', 'Checked-in']

// Statuses written by earlier versions, mapped to their current name.
export const LEGACY_BOOKING_STATUSES = { 'Checked-out': 'Completed' }

export const BOOKING_PAGE_SIZE = 10
export const MAX_STAY_NIGHTS = 30

export const HISTORY_DATE_FIELDS = [
  { value: 'stay', label: 'Stay dates' },
  { value: 'booked', label: 'Booked on' },
]

export const HISTORY_SORTS = [
  { value: 'booked-desc', label: 'Newest booked' },
  { value: 'booked-asc', label: 'Oldest booked' },
  { value: 'checkin-desc', label: 'Latest check-in' },
  { value: 'checkin-asc', label: 'Earliest check-in' },
]
