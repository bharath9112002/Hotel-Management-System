import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import DataLayout from './components/layout/DataLayout'
import { useAuth } from './context/AuthContext'
import { getHomeRoute } from './utils/roleHome'
import BookingDetails from './pages/BookingDetails'
import Bookings from './pages/Bookings'
import Dashboard from './pages/Dashboard'
import ForgotPassword from './pages/ForgotPassword'
import GuestProfile from './pages/GuestProfile'
import Guests from './pages/Guests'
import Login from './pages/Login'
import NewBooking from './pages/NewBooking'
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
        <Route element={<DataLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/new" element={<NewBooking />} />
          <Route path="/bookings/:id" element={<BookingDetails />} />
          <Route element={<AdminRoute />}>
            <Route path="/guests" element={<Guests />} />
            <Route path="/guests/:id" element={<GuestProfile />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<FallbackRoute />} />
    </Routes>
  )
}

export default App
