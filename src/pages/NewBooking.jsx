import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import BookingSummaryCard from '../components/bookings/BookingSummaryCard'
import ConfirmDialog from '../components/ConfirmDialog'
import DashboardShell from '../components/layout/DashboardShell'
import TextInput from '../components/TextInput'
import { MAX_STAY_NIGHTS } from '../data/bookingConstants'
import { useBookings } from '../context/BookingsContext'
import { useGuests } from '../context/GuestsContext'
import { useRooms } from '../context/RoomsContext'
import { addDays, calculateNights, findConflictingBooking, todayISO } from '../utils/bookingUtils'
import { formatCurrency, formatDate } from '../utils/format'

const selectClass =
  'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition focus:ring-2 focus:ring-brand-400/60'

function fieldBorder(hasError) {
  return hasError ? 'border-red-400 focus:ring-red-300' : 'border-ink-200 focus:border-brand-400'
}

export default function NewBooking() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { rooms, isLoading: roomsLoading, error: roomsError, refetch: refetchRooms } = useRooms()
  const {
    guests,
    isLoading: guestsLoading,
    error: guestsError,
    refetch: refetchGuests,
  } = useGuests()
  const { bookings, addBooking } = useBookings()

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const today = todayISO()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      guestId: searchParams.get('guest') ?? '',
      roomId: searchParams.get('room') ?? '',
      checkIn: today,
      checkOut: addDays(today, 1),
    },
  })

  const [guestId, roomId, checkIn, checkOut] = watch(['guestId', 'roomId', 'checkIn', 'checkOut'])

  const nights = calculateNights(checkIn, checkOut)
  const guest = guests.find((g) => String(g.id) === guestId)
  const room = rooms.find((r) => String(r.id) === roomId)
  const total = room ? nights * room.pricePerNight : 0

  const sortedGuests = useMemo(
    () => [...guests].sort((a, b) => a.fullName.localeCompare(b.fullName)),
    [guests],
  )

  const roomOptions = useMemo(
    () =>
      rooms.map((r) => {
        let unavailable = ''
        if (r.availability === 'Maintenance') {
          unavailable = 'under maintenance'
        } else if (findConflictingBooking(bookings, r.id, checkIn, checkOut)) {
          unavailable = 'booked for these dates'
        }
        return { room: r, unavailable }
      }),
    [rooms, bookings, checkIn, checkOut],
  )

  const conflict = room ? findConflictingBooking(bookings, room.id, checkIn, checkOut) : null
  const roomProblem =
    room?.availability === 'Maintenance'
      ? `Room ${room.roomNumber} is under maintenance and can't be booked.`
      : conflict
        ? `Room ${room.roomNumber} is already booked from ${formatDate(conflict.checkIn)} to ${formatDate(
            conflict.checkOut,
          )} (${conflict.id}). Choose different dates or another room.`
        : ''

  const handleCheckInChange = (e) => {
    const value = e.target.value
    // Keep check-out valid when check-in moves past it.
    if (value && checkOut <= value) {
      setValue('checkOut', addDays(value, 1), { shouldValidate: true })
    }
  }

  const handleConfirm = () => {
    setIsSaving(true)
    try {
      const booking = addBooking({ guest, room, checkIn, checkOut })
      toast.success(`Booking ${booking.id} confirmed.`)
      navigate(`/bookings/${booking.id}`, { replace: true, state: { justBooked: true } })
    } catch (err) {
      toast.error(err.message)
      setIsConfirmOpen(false)
      setIsSaving(false)
    }
  }

  const isLoading = roomsLoading || guestsLoading
  const loadError = roomsError || guestsError

  // Only reload whichever list actually failed; the other is already usable.
  const handleRetry = () => {
    if (roomsError) refetchRooms()
    if (guestsError) refetchGuests()
  }

  return (
    <DashboardShell title="New booking" subtitle="Reserve a room for a guest.">
      <button
        type="button"
        onClick={() => navigate('/bookings')}
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
        Back to bookings
      </button>

      {isLoading && (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-ink-100 bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-300 border-t-brand-600" />
          <p className="text-xs text-ink-400">Loading guests and rooms…</p>
        </div>
      )}

      {!isLoading && loadError && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-10 text-center">
          <p className="text-sm font-medium text-red-700">{loadError}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-lg border border-red-300 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !loadError && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <form
            onSubmit={handleSubmit(() => setIsConfirmOpen(true))}
            noValidate
            className="space-y-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm lg:col-span-3"
          >
            <div>
              <label htmlFor="guestId" className="mb-1.5 block text-sm font-medium text-ink-700">
                Guest
              </label>
              <select
                id="guestId"
                className={`${selectClass} ${fieldBorder(errors.guestId)}`}
                {...register('guestId', { required: 'Please select a guest.' })}
              >
                <option value="">Select guest</option>
                {sortedGuests.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.fullName} — {g.mobile}
                  </option>
                ))}
              </select>
              {errors.guestId && (
                <p className="mt-1.5 text-xs font-medium text-red-500">{errors.guestId.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextInput
                id="checkIn"
                label="Check-in date"
                type="date"
                min={today}
                error={errors.checkIn?.message}
                {...register('checkIn', {
                  required: 'Check-in date is required.',
                  validate: (v) => v >= today || 'Check-in cannot be in the past.',
                  onChange: handleCheckInChange,
                })}
              />
              <TextInput
                id="checkOut"
                label="Check-out date"
                type="date"
                min={checkIn ? addDays(checkIn, 1) : today}
                error={errors.checkOut?.message}
                {...register('checkOut', {
                  required: 'Check-out date is required.',
                  validate: {
                    after: (v, form) => v > form.checkIn || 'Check-out must be after check-in.',
                    maxStay: (v, form) =>
                      calculateNights(form.checkIn, v) <= MAX_STAY_NIGHTS ||
                      `Stays are limited to ${MAX_STAY_NIGHTS} nights.`,
                  },
                })}
              />
            </div>

            <div>
              <label htmlFor="roomId" className="mb-1.5 block text-sm font-medium text-ink-700">
                Room
              </label>
              <select
                id="roomId"
                className={`${selectClass} ${fieldBorder(errors.roomId || roomProblem)}`}
                {...register('roomId', { required: 'Please select a room.' })}
              >
                <option value="">Select room</option>
                {roomOptions.map(({ room: r, unavailable }) => (
                  <option key={r.id} value={r.id} disabled={Boolean(unavailable) && String(r.id) !== roomId}>
                    Room {r.roomNumber} · {r.roomType} · {formatCurrency(r.pricePerNight)}/night
                    {unavailable ? ` — ${unavailable}` : ''}
                  </option>
                ))}
              </select>
              {errors.roomId && (
                <p className="mt-1.5 text-xs font-medium text-red-500">{errors.roomId.message}</p>
              )}
              <p className="mt-1.5 text-xs text-ink-400">
                Rooms already booked for the chosen dates, or under maintenance, are marked and can't
                be selected.
              </p>
            </div>

            <div>
              <label htmlFor="nights" className="mb-1.5 block text-sm font-medium text-ink-700">
                Number of nights
              </label>
              <input
                id="nights"
                readOnly
                value={nights > 0 ? nights : ''}
                placeholder="Calculated from the dates"
                className="w-full rounded-xl border border-ink-100 bg-ink-50 px-4 py-2.5 text-sm text-ink-700 outline-none"
              />
            </div>

            {roomProblem && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {roomProblem}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-ink-50 pt-4">
              <button
                type="button"
                onClick={() => navigate('/bookings')}
                className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-600 transition hover:bg-ink-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={Boolean(roomProblem)}
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Review booking
              </button>
            </div>
          </form>

          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <BookingSummaryCard
                guestName={guest?.fullName}
                guestEmail={guest?.email}
                roomNumber={room?.roomNumber}
                roomType={room?.roomType}
                pricePerNight={room?.pricePerNight}
                checkIn={checkIn}
                checkOut={checkOut}
                nights={nights}
                total={total}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={isConfirmOpen}
        tone="primary"
        title="Confirm booking"
        message={
          guest && room
            ? `Book Room ${room.roomNumber} for ${guest.fullName} from ${formatDate(checkIn)} to ${formatDate(
                checkOut,
              )} (${nights} ${nights === 1 ? 'night' : 'nights'}) — total ${formatCurrency(total)}?`
            : ''
        }
        confirmLabel="Confirm booking"
        isConfirming={isSaving}
        onConfirm={handleConfirm}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </DashboardShell>
  )
}
