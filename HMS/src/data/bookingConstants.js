export const BOOKING_STATUSES = ['Confirmed', 'Checked-in', 'Checked-out', 'Cancelled']

// Only these statuses hold a room for their dates; cancelled and checked-out
// bookings free it up again.
export const ACTIVE_BOOKING_STATUSES = ['Confirmed', 'Checked-in']

export const BOOKING_PAGE_SIZE = 10
export const MAX_STAY_NIGHTS = 30
