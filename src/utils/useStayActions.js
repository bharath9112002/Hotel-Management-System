import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { useBookings } from '../context/BookingsContext'

// Wraps check-in/out with user feedback. Both return true on success; the
// context throws a readable Error when the action isn't allowed.
export function useStayActions() {
  const { checkInBooking, checkOutBooking } = useBookings()

  const checkIn = useCallback(
    (booking) => {
      try {
        checkInBooking(booking.id)
        toast.success(`${booking.guestName} checked in to Room ${booking.roomNumber}.`)
        return true
      } catch (err) {
        toast.error(err.message)
        return false
      }
    },
    [checkInBooking],
  )

  const checkOut = useCallback(
    (booking) => {
      try {
        checkOutBooking(booking.id)
        toast.success(`${booking.guestName} checked out. Room ${booking.roomNumber} is available again.`)
        return true
      } catch (err) {
        toast.error(err.message)
        return false
      }
    },
    [checkOutBooking],
  )

  return { checkIn, checkOut }
}
