import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import GuestsLayout from './components/layout/GuestsLayout'
import RoomsLayout from './components/layout/RoomsLayout'
import { useAuth } from './context/AuthContext'
import { getHomeRoute } from './utils/roleHome'
import Dashboard from './pages/Dashboard'
import ForgotPassword from './pages/ForgotPassword'
import GuestProfile from './pages/GuestProfile'
import Guests from './pages/Guests'
import Login from './pages/Login'
import Register from './pages/Register'
import RoomDetails from './pages/RoomDetails'
import Rooms from './pages/Rooms'

function GuestOnlyRoute({ children }) {
  const { user, isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to={getHomeRoute(user)} replace /> : children
}

function FallbackRoute() {
  const { user, isAuthenticated } = useAuth()
  return <Navigate to={isAuthenticated ? getHomeRoute(user) : '/login'} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<FallbackRoute />} />

      <Route
        path="/login"
        element={
          <GuestOnlyRoute>
            <Login />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestOnlyRoute>
            <Register />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestOnlyRoute>
            <ForgotPassword />
          </GuestOnlyRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route element={<RoomsLayout />}>
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
        </Route>
        <Route element={<GuestsLayout />}>
          <Route path="/guests" element={<Guests />} />
          <Route path="/guests/:id" element={<GuestProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<FallbackRoute />} />
    </Routes>
  )
}

export default App
