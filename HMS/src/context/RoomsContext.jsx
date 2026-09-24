import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import {
  createRoomProduct,
  deleteRoomProduct,
  fetchRoomProducts,
  updateRoomProduct,
} from '../services/roomsApi'
import { readListCache, writeListCache } from '../utils/listCache'
import { mapProductToRoom } from '../utils/roomTransform'

const RoomsContext = createContext(null)

const ROOMS_CACHE_KEY = 'hms_cache_rooms'

function roomFromForm(id, formValues, isLocal) {
  return {
    id,
    roomNumber: formValues.roomNumber,
    roomType: formValues.roomType,
    floorNumber: Number(formValues.floorNumber),
    pricePerNight: Number(formValues.pricePerNight),
    capacity: Number(formValues.capacity),
    availability: formValues.availability,
    amenities: formValues.amenities ?? [],
    image: formValues.image,
    isLocal,
  }
}

function roomPayload(formValues) {
  return {
    title: `${formValues.roomType} ${formValues.roomNumber}`,
    price: formValues.pricePerNight,
  }
}

export function RoomsProvider({ children }) {
  // Cached rooms render immediately; the fetch below then refreshes them.
  const [rooms, setRooms] = useState(() => readListCache(ROOMS_CACHE_KEY) ?? [])
  const [isLoading, setIsLoading] = useState(() => readListCache(ROOMS_CACHE_KEY) === null)
  const [error, setError] = useState(null)

  const latestLoadId = useRef(0)
  const hasData = useRef(rooms.length > 0)

  const loadRooms = useCallback(async () => {
    // Only the most recent request may write state, so a slow earlier
    // response (e.g. StrictMode's double effect run) can't clobber newer data.
    const loadId = ++latestLoadId.current
    setError(null)
    // Only show the spinner when there is nothing to display yet.
    if (!hasData.current) setIsLoading(true)
    try {
      const products = await fetchRoomProducts()
      if (loadId !== latestLoadId.current) return
      const fetched = products.map(mapProductToRoom)
      writeListCache(ROOMS_CACHE_KEY, fetched)
      hasData.current = true
      // Keep rooms added locally while the request was in flight.
      setRooms((prev) => [...prev.filter((room) => room.isLocal), ...fetched])
    } catch {
      if (loadId !== latestLoadId.current) return
      // A failed background refresh is harmless when cached data is showing.
      if (!hasData.current) setError('Could not load rooms right now. Please try again.')
    } finally {
      if (loadId === latestLoadId.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRooms()
  }, [loadRooms])

  // DummyJSON is a slow mock (a write can take several seconds) and doesn't
  // persist anything, so changes are applied to local state straight away and
  // synced in the background instead of making the user wait on the request.
  const addRoom = useCallback(async (formValues) => {
    // /products/add returns the same fake id every time (and it isn't a real
    // record, so later PUT/DELETE would 404), so the id is generated locally
    // and the room is marked isLocal to skip the network on edit/delete.
    const newRoom = roomFromForm(Date.now(), formValues, true)
    setRooms((prev) => [newRoom, ...prev])
    createRoomProduct(roomPayload(formValues)).catch(() => {})
    return newRoom
  }, [])

  const editRoom = useCallback(
    async (id, formValues) => {
      const existing = rooms.find((room) => room.id === id)
      const updatedRoom = roomFromForm(id, formValues, existing?.isLocal ?? false)
      setRooms((prev) => prev.map((room) => (room.id === id ? updatedRoom : room)))
      if (existing && !existing.isLocal) {
        updateRoomProduct(id, roomPayload(formValues)).catch(() => {
          setRooms((prev) => prev.map((room) => (room.id === id ? existing : room)))
          toast.error(`Could not save changes to room ${formValues.roomNumber}. They were reverted.`)
        })
      }
      return updatedRoom
    },
    [rooms],
  )

  const removeRoom = useCallback(
    async (id) => {
      const index = rooms.findIndex((room) => room.id === id)
      const existing = rooms[index]
      setRooms((prev) => prev.filter((room) => room.id !== id))
      if (existing && !existing.isLocal) {
        deleteRoomProduct(id).catch(() => {
          setRooms((prev) => {
            const restored = [...prev]
            restored.splice(Math.min(index, restored.length), 0, existing)
            return restored
          })
          toast.error(`Could not delete room ${existing.roomNumber}. It was restored.`)
        })
      }
    },
    [rooms],
  )

  const value = useMemo(
    () => ({ rooms, isLoading, error, refetch: loadRooms, addRoom, editRoom, removeRoom }),
    [rooms, isLoading, error, loadRooms, addRoom, editRoom, removeRoom],
  )

  return <RoomsContext.Provider value={value}>{children}</RoomsContext.Provider>
}

export function useRooms() {
  const ctx = useContext(RoomsContext)
  if (!ctx) {
    throw new Error('useRooms must be used within a RoomsProvider')
  }
  return ctx
}
