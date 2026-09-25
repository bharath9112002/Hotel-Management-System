import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useRooms } from './RoomsContext'
import { LEGACY_BOOKING_STATUSES } from '../data/bookingConstants'
import { calculateNights, findConflictingBooking, todayISO } from '../utils/bookingUtils'
import { formatDate } from '../utils/format'

const BOOKINGS_KEY = 'hms_bookings'

const BookingsContext = createContext(null)

function readBookings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(BOOKINGS_KEY))
    if (!Array.isArray(parsed)) return []
    return parsed.map((b) =>
      LEGACY_BOOKING_STATUSES[b.status] ? { ...b, status: LEGACY_BOOKING_STATUSES[b.status] } : b,
    )
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
  const { rooms, setRoomAvailability } = useRooms()

  const commit = useCallback((updater) => {
    setBookings((prev) => {
      const next = updater(prev)
      writeBookings(next)
      return next
    })
  }, [])

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
      const cancelledAt = new Date().toISOString()
      commit((prev) =>
        prev.map((b) =>
          b.id === id && b.status === 'Confirmed' ? { ...b, status: 'Cancelled', cancelledAt } : b,
        ),
      )
    },
    [commit],
  )

  const checkInBooking = useCallback(
    (id) => {
      const booking = bookings.find((b) => b.id === id)
      if (!booking) throw new Error('Booking not found.')
      if (booking.status !== 'Confirmed') {
        throw new Error(`Only confirmed bookings can be checked in (this one is ${booking.status}).`)
      }

      const today = todayISO()
      if (today < booking.checkIn) {
        throw new Error(`Check-in opens on ${formatDate(booking.checkIn)}.`)
      }
      if (today >= booking.checkOut) {
        throw new Error('The stay period for this booking has already ended.')
      }

      const room = rooms.find((r) => r.id === booking.roomId)
      if (room?.availability === 'Maintenance') {
        throw new Error(`Room ${booking.roomNumber} is under maintenance and can't be checked in to.`)
      }
      const occupant = bookings.find(
        (b) => b.id !== id && b.roomId === booking.roomId && b.status === 'Checked-in',
      )
      if (occupant) {
        throw new Error(
          `Room ${booking.roomNumber} is still occupied by ${occupant.guestName} (${occupant.id}). Check them out first.`,
        )
      }

      const checkedInAt = new Date().toISOString()
      commit((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'Checked-in', checkedInAt } : b)),
      )
      setRoomAvailability(booking.roomId, 'Occupied')
      return { ...booking, status: 'Checked-in', checkedInAt }
    },
    [bookings, rooms, commit, setRoomAvailability],
  )

  const checkOutBooking = useCallback(
    (id) => {
      const booking = bookings.find((b) => b.id === id)
      if (!booking) throw new Error('Booking not found.')
      if (booking.status !== 'Checked-in') {
        throw new Error(`Only checked-in guests can be checked out (this booking is ${booking.status}).`)
      }

      const checkedOutAt = new Date().toISOString()
      commit((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'Completed', checkedOutAt } : b)),
      )
      setRoomAvailability(booking.roomId, 'Available')
      return { ...booking, status: 'Completed', checkedOutAt }
    },
    [bookings, commit, setRoomAvailability],
  )

  const value = useMemo(
    () => ({ bookings, addBooking, cancelBooking, checkInBooking, checkOutBooking }),
    [bookings, addBooking, cancelBooking, checkInBooking, checkOutBooking],
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
