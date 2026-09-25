import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'

export default function Topbar({ onMenuClick, title, subtitle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.info('You have been logged out.')
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-100 text-ink-500 lg:hidden"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-ink-900 sm:text-xl">{title}</h1>
            {subtitle && <p className="text-xs text-ink-400 sm:text-sm">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
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
  )
}
