import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import {
  createGuestUser,
  deleteGuestUser,
  fetchGuestUsers,
  updateGuestUser,
} from '../services/guestsApi'
import { guestToUserPayload, mapUserToGuest } from '../utils/guestTransform'

const GuestsContext = createContext(null)

function normalizeGuestValues(formValues) {
  return {
    fullName: formValues.fullName.trim(),
    email: formValues.email.trim(),
    mobile: formValues.mobile.trim(),
    address: formValues.address.trim(),
    nationality: formValues.nationality,
  }
}

export function GuestsProvider({ children }) {
  const [guests, setGuests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const latestLoadId = useRef(0)

  const loadGuests = useCallback(async () => {
    // Only the most recent request may write state, so a slow earlier
    // response (e.g. StrictMode's double effect run) can't clobber newer data.
    const loadId = ++latestLoadId.current
    setIsLoading(true)
    setError(null)
    try {
      const users = await fetchGuestUsers()
      if (loadId !== latestLoadId.current) return
      // Keep guests added locally while the request was in flight.
      setGuests((prev) => [...prev.filter((guest) => guest.isLocal), ...users.map(mapUserToGuest)])
    } catch {
      if (loadId !== latestLoadId.current) return
      setError('Could not load guests right now. Please try again.')
    } finally {
      if (loadId === latestLoadId.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGuests()
  }, [loadGuests])

  // DummyJSON is a slow mock (a write can take several seconds) and doesn't
  // persist anything, so changes are applied to local state straight away and
  // synced in the background instead of making the user wait on the request.
  const addGuest = useCallback(async (formValues) => {
    // /users/add returns the same fake id every time (and it isn't a real
    // record, so later PUT/DELETE would 404), so the id is generated locally
    // and the guest is marked isLocal to skip the network on edit/delete.
    const values = normalizeGuestValues(formValues)
    const newGuest = { id: Date.now(), ...values, isLocal: true }
    setGuests((prev) => [newGuest, ...prev])
    createGuestUser(guestToUserPayload(values)).catch(() => {})
    return newGuest
  }, [])

  const editGuest = useCallback(
    async (id, formValues) => {
      const existing = guests.find((guest) => guest.id === id)
      const values = normalizeGuestValues(formValues)
      const updatedGuest = { id, ...values, isLocal: existing?.isLocal ?? false }
      setGuests((prev) => prev.map((guest) => (guest.id === id ? updatedGuest : guest)))
      if (existing && !existing.isLocal) {
        updateGuestUser(id, guestToUserPayload(values)).catch(() => {
          setGuests((prev) => prev.map((guest) => (guest.id === id ? existing : guest)))
          toast.error(`Could not save changes to ${values.fullName}. They were reverted.`)
        })
      }
      return updatedGuest
    },
    [guests],
  )

  const removeGuest = useCallback(
    async (id) => {
      const index = guests.findIndex((guest) => guest.id === id)
      const existing = guests[index]
      setGuests((prev) => prev.filter((guest) => guest.id !== id))
      if (existing && !existing.isLocal) {
        deleteGuestUser(id).catch(() => {
          setGuests((prev) => {
            const restored = [...prev]
            restored.splice(Math.min(index, restored.length), 0, existing)
            return restored
          })
          toast.error(`Could not delete ${existing.fullName}. They were restored.`)
        })
      }
    },
    [guests],
  )

  const value = useMemo(
    () => ({ guests, isLoading, error, refetch: loadGuests, addGuest, editGuest, removeGuest }),
    [guests, isLoading, error, loadGuests, addGuest, editGuest, removeGuest],
  )

  return <GuestsContext.Provider value={value}>{children}</GuestsContext.Provider>
}

export function useGuests() {
  const ctx = useContext(GuestsContext)
  if (!ctx) {
    throw new Error('useGuests must be used within a GuestsProvider')
  }
  return ctx
}
