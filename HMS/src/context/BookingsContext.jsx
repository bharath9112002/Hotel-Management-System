import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { calculateNights, findConflictingBooking } from '../utils/bookingUtils'

const BOOKINGS_KEY = 'hms_bookings'

const BookingsContext = createContext(null)

function readBookings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(BOOKINGS_KEY))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeBookings(bookings) {
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
  } catch {
    // Storage unavailable/full: bookings still work for this session.
  }
}

function nextBookingId(bookings) {
  const highest = bookings.reduce((max, b) => Math.max(max, Number(b.id.replace('BK-', '')) || 0), 1000)
  return `BK-${highest + 1}`
}

export function BookingsProvider({ children }) {
  const [bookings, setBookings] = useState(readBookings)

  const commit = useCallback((updater) => {
    setBookings((prev) => {
      const next = updater(prev)
      writeBookings(next)
      return next
    })
  }, [])

  // guest/room are snapshotted onto the booking so it still reads correctly
  // if that guest or room is later edited, deleted, or (for locally added
  // ones) lost on refresh.
  const addBooking = useCallback(
    ({ guest, room, checkIn, checkOut }) => {
      const nights = calculateNights(checkIn, checkOut)
      if (nights < 1) {
        throw new Error('Check-out must be after check-in.')
      }
      // Authoritative double-booking guard; the form only mirrors this for UX.
      if (findConflictingBooking(bookings, room.id, checkIn, checkOut)) {
        throw new Error(`Room ${room.roomNumber} is already booked for those dates.`)
      }

      const booking = {
        id: nextBookingId(bookings),
        guestId: guest.id,
        guestName: guest.fullName,
        guestEmail: guest.email,
        guestMobile: guest.mobile,
        roomId: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        pricePerNight: room.pricePerNight,
        checkIn,
        checkOut,
        nights,
        amount: nights * room.pricePerNight,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      }
      commit((prev) => [booking, ...prev])
      return booking
    },
    [bookings, commit],
  )

  const cancelBooking = useCallback(
    (id) => {
      commit((prev) =>
        prev.map((b) => (b.id === id && b.status === 'Confirmed' ? { ...b, status: 'Cancelled' } : b)),
      )
    },
    [commit],
  )

  const value = useMemo(
    () => ({ bookings, addBooking, cancelBooking }),
    [bookings, addBooking, cancelBooking],
  )

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>
}

export function useBookings() {
  const ctx = useContext(BookingsContext)
  if (!ctx) {
    throw new Error('useBookings must be used within a BookingsProvider')
  }
  return ctx
}
