import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { GuestsProvider } from '../../context/GuestsContext'
import { getHomeRoute } from '../../utils/roleHome'

// Guest records are admin-only (the sidebar hides the link for other roles),
// so the route guard lives here alongside the provider.
export default function GuestsLayout() {
  const { user } = useAuth()

  if (user?.role !== 'Admin') {
    return <Navigate to={getHomeRoute(user)} replace />
  }

  return (
    <GuestsProvider>
      <Outlet />
    </GuestsProvider>
  )
}
