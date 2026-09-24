import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getHomeRoute } from '../utils/roleHome'

export default function AdminRoute() {
  const { user } = useAuth()

  if (user?.role !== 'Admin') {
    return <Navigate to={getHomeRoute(user)} replace />
  }

  return <Outlet />
}
