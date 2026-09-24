import { Outlet } from 'react-router-dom'
import { BookingsProvider } from '../../context/BookingsContext'
import { GuestsProvider } from '../../context/GuestsContext'
import { PaymentsProvider } from '../../context/PaymentsContext'
import { RoomsProvider } from '../../context/RoomsContext'

// Rooms, guests and bookings reference each other (a booking needs a guest and
// a room), so they share one provider scope instead of each page group
// remounting its own and dropping locally added records on navigation.
export default function DataLayout() {
  return (
    <RoomsProvider>
      <GuestsProvider>
        <BookingsProvider>
          <PaymentsProvider>
            <Outlet />
          </PaymentsProvider>
        </BookingsProvider>
      </GuestsProvider>
    </RoomsProvider>
  )
}
