import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.info('You have been logged out.')
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M3 21V8l9-5 9 5v13"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-ink-800">Grandview HMS</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-ink-800">{user?.fullName}</p>
              <p className="text-xs text-ink-400">{user?.role}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-ink-200 px-3 py-2 text-xs font-semibold text-ink-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="animate-fade-in rounded-2xl border border-ink-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-brand-600">Signed in successfully</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink-900">
            Welcome, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-400">
            The authentication module is wired up with protected routes, session persistence and
            logout. Dashboard analytics, room management and the rest of the hotel console land in
            the next modules.
          </p>
        </div>
      </main>
    </div>
  )
}
