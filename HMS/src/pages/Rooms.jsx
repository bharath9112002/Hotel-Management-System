import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import ConfirmDialog from '../components/ConfirmDialog'
import DashboardShell from '../components/layout/DashboardShell'
import Pagination from '../components/Pagination'
import RoomCard from '../components/rooms/RoomCard'
import RoomCardSkeleton from '../components/rooms/RoomCardSkeleton'
import RoomFilters from '../components/rooms/RoomFilters'
import RoomFormModal from '../components/rooms/RoomFormModal'
import { ROOM_PAGE_SIZE } from '../data/roomConstants'
import { useAuth } from '../context/AuthContext'
import { useRooms } from '../context/RoomsContext'

export default function Rooms() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'
  const { rooms, isLoading, error, refetch, addRoom, editRoom, removeRoom } = useRooms()

  const [search, setSearch] = useState('')
  const [roomType, setRoomType] = useState('')
  const [availability, setAvailability] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [formState, setFormState] = useState(null) // null | { room: null | Room }
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setCurrentPage(1)
  }, [search, roomType, availability, sortOrder])

  const filteredRooms = useMemo(() => {
    const term = search.trim().toLowerCase()
    let result = rooms.filter((room) => {
      const matchesSearch =
        !term ||
        room.roomNumber.toLowerCase().includes(term) ||
        room.roomType.toLowerCase().includes(term)
      const matchesType = !roomType || room.roomType === roomType
      const matchesAvailability = !availability || room.availability === availability
      return matchesSearch && matchesType && matchesAvailability
    })

    if (sortOrder === 'asc') {
      result = [...result].sort((a, b) => a.pricePerNight - b.pricePerNight)
    } else if (sortOrder === 'desc') {
      result = [...result].sort((a, b) => b.pricePerNight - a.pricePerNight)
    }

    return result
  }, [rooms, search, roomType, availability, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / ROOM_PAGE_SIZE))
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * ROOM_PAGE_SIZE,
    currentPage * ROOM_PAGE_SIZE,
  )

  const handleAddRoom = () => setFormState({ room: null })
  const handleEditRoom = (room) => setFormState({ room })
  const closeForm = () => setFormState(null)

  const handleFormSubmit = async (values) => {
    try {
      if (formState.room) {
        await editRoom(formState.room.id, values)
        toast.success(`Room ${values.roomNumber} updated.`)
      } else {
        await addRoom(values)
        toast.success(`Room ${values.roomNumber} added.`)
      }
      closeForm()
    } catch {
      toast.error('Something went wrong saving this room. Please try again.')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await removeRoom(deleteTarget.id)
      toast.success(`Room ${deleteTarget.roomNumber} deleted.`)
      setDeleteTarget(null)
    } catch {
      toast.error('Could not delete this room. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DashboardShell
      title="Rooms"
      subtitle={`${filteredRooms.length} of ${rooms.length} rooms${
        isAdmin ? '' : ' — browse and book a room'
      }`}
    >
      <div className="space-y-4">
        <RoomFilters
          search={search}
          onSearchChange={setSearch}
          roomType={roomType}
          onRoomTypeChange={setRoomType}
          availability={availability}
          onAvailabilityChange={setAvailability}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          isAdmin={isAdmin}
          onAddRoom={handleAddRoom}
        />

        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <RoomCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-10 text-center">
            <p className="text-sm font-medium text-red-700">{error}</p>
            <button
              type="button"
              onClick={refetch}
              className="rounded-lg border border-red-300 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && filteredRooms.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
            <p className="text-sm font-medium text-ink-700">No rooms match your filters</p>
            <p className="mt-1 text-xs text-ink-400">Try a different search or clear filters.</p>
          </div>
        )}

        {!isLoading && !error && filteredRooms.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  isAdmin={isAdmin}
                  onEdit={handleEditRoom}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {formState && (
        <RoomFormModal room={formState.room} onClose={closeForm} onSubmit={handleFormSubmit} />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete room"
        message={`Delete room ${deleteTarget?.roomNumber}? This can't be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardShell>
  )
}
