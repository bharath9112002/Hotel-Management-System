import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  createRoomProduct,
  deleteRoomProduct,
  fetchRoomProducts,
  updateRoomProduct,
} from '../services/roomsApi'
import { mapProductToRoom } from '../utils/roomTransform'

const RoomsContext = createContext(null)

export function RoomsProvider({ children }) {
  const [rooms, setRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadRooms = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const products = await fetchRoomProducts()
      setRooms(products.map(mapProductToRoom))
    } catch {
      setError('Could not load rooms right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRooms()
  }, [loadRooms])

  const addRoom = useCallback(async (formValues) => {
    // DummyJSON's /products/add returns a fake id (e.g. 195) that isn't a
    // real record in their dataset -- later PUT/DELETE calls against it
    // 404. Rooms created this way are marked isLocal so edit/delete skip
    // the (doomed) network call and just update local state instead.
    const created = await createRoomProduct({
      title: `${formValues.roomType} ${formValues.roomNumber}`,
      price: formValues.pricePerNight,
    })
    const newRoom = {
      id: created?.id ?? Date.now(),
      roomNumber: formValues.roomNumber,
      roomType: formValues.roomType,
      floorNumber: Number(formValues.floorNumber),
      pricePerNight: Number(formValues.pricePerNight),
      capacity: Number(formValues.capacity),
      availability: formValues.availability,
      amenities: formValues.amenities ?? [],
      image: formValues.image,
      isLocal: true,
    }
    setRooms((prev) => [newRoom, ...prev])
    return newRoom
  }, [])

  const editRoom = useCallback(
    
    async (id, formValues) => {
      const existing = rooms.find((room) => room.id === id)
      if (!existing?.isLocal) {
        await updateRoomProduct(id, {
          title: `${formValues.roomType} ${formValues.roomNumber}`,
          price: formValues.pricePerNight,
        })
      }
      const updatedRoom = {
        id,
        roomNumber: formValues.roomNumber,
        roomType: formValues.roomType,
        floorNumber: Number(formValues.floorNumber),
        pricePerNight: Number(formValues.pricePerNight),
        capacity: Number(formValues.capacity),
        availability: formValues.availability,
        amenities: formValues.amenities ?? [],
        image: formValues.image,
        isLocal: existing?.isLocal ?? false,
      }
      setRooms((prev) => prev.map((room) => (room.id === id ? updatedRoom : room)))
      return updatedRoom
    },
    [rooms],
  )

  const removeRoom = useCallback(
    async (id) => {
      const existing = rooms.find((room) => room.id === id)
      if (!existing?.isLocal) {
        await deleteRoomProduct(id)
      }
      setRooms((prev) => prev.filter((room) => room.id !== id))
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
