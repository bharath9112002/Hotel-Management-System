import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ConfirmDialog from '../components/ConfirmDialog'
import DashboardShell from '../components/layout/DashboardShell'
import RoomFormModal from '../components/rooms/RoomFormModal'
import RoomStatusBadge from '../components/rooms/RoomStatusBadge'
import { useAuth } from '../context/AuthContext'
import { useRooms } from '../context/RoomsContext'
import { formatCurrency } from '../utils/format'

export default function RoomDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'
  const { rooms, isLoading, error, editRoom, removeRoom } = useRooms()

  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const room = rooms.find((r) => String(r.id) === id)

  const handleEditSubmit = async (values) => {
    try {
      await editRoom(room.id, values)
      toast.success(`Room ${values.roomNumber} updated.`)
      setIsEditing(false)
    } catch {
      toast.error('Something went wrong saving this room. Please try again.')
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await removeRoom(room.id)
      toast.success(`Room ${room.roomNumber} deleted.`)
      navigate('/rooms', { replace: true })
    } catch {
      toast.error('Could not delete this room. Please try again.')
      setIsDeleting(false)
    }
  }

  return (
    <DashboardShell title="Room details" subtitle="Full information for this room.">
      <button
        type="button"
        onClick={() => navigate('/rooms')}
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
        Back to rooms
      </button>

      {isLoading && (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-ink-100 bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-300 border-t-brand-600" />
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {!isLoading && !error && !room && (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
          <p className="text-sm font-medium text-ink-700">Room not found</p>
          <p className="mt-1 text-xs text-ink-400">It may have been deleted.</p>
        </div>
      )}

      {room && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <img
              src={room.image}
              alt={`${room.roomType} interior`}
              className="h-72 w-full rounded-2xl object-cover shadow-sm"
            />
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm lg:col-span-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <RoomStatusBadge status={room.availability} />
                  <span className="text-xs text-ink-400">Floor {room.floorNumber}</span>
                </div>
                <h1 className="text-2xl font-semibold text-ink-900">Room {room.roomNumber}</h1>
                <p className="text-sm text-ink-500">{room.roomType}</p>
              </div>
              <p className="text-right">
                <span className="block text-2xl font-semibold text-ink-900">
                  {formatCurrency(room.pricePerNight)}
                </span>
                <span className="text-xs text-ink-400">per night</span>
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-ink-50 pt-5 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium text-ink-400">Capacity</p>
                <p className="mt-1 text-sm font-semibold text-ink-800">{room.capacity} guests</p>
              </div>
              <div>
                <p className="text-xs font-medium text-ink-400">Floor</p>
                <p className="mt-1 text-sm font-semibold text-ink-800">{room.floorNumber}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-ink-400">Room type</p>
                <p className="mt-1 text-sm font-semibold text-ink-800">{room.roomType}</p>
              </div>
            </div>

            <div className="mt-5 border-t border-ink-50 pt-5">
              <p className="mb-2 text-xs font-medium text-ink-400">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full bg-ink-50 px-3 py-1 text-xs text-ink-600"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-ink-50 pt-5">
              {room.availability !== 'Maintenance' && (
                <button
                  type="button"
                  onClick={() => navigate(`/bookings/new?room=${room.id}`)}
                  className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
                >
                  Book this room
                </button>
              )}
              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-600 transition hover:bg-ink-50"
                  >
                    Edit room
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleteOpen(true)}
                    className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Delete room
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isEditing && room && (
        <RoomFormModal room={room} onClose={() => setIsEditing(false)} onSubmit={handleEditSubmit} />
      )}

      <ConfirmDialog
        open={isDeleteOpen}
        title="Delete room"
        message={`Delete room ${room?.roomNumber}? This can't be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </DashboardShell>
  )
}
