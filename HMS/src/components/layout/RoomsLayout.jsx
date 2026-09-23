import { Outlet } from 'react-router-dom'
import { RoomsProvider } from '../../context/RoomsContext'

export default function RoomsLayout() {
  return (
    <RoomsProvider>
      <Outlet />
    </RoomsProvider>
  )
}
