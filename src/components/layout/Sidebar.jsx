import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    active: true,
    icon: (
      <path
        d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: 'Rooms',
    icon: (
      <path
        d="M3 21V8l9-5 9 5v13M9 21v-6h6v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: 'Bookings',
    icon: (
      <>
        <rect x="3.5" y="4.5" width="17" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3.5 9.5h17M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: 'Check-In / Out',
    icon: (
      <path
        d="M9 6V4h11v16H9v-2M4 12h11m0 0-3.5-3.5M15 12l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: 'Payments',
    icon: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 10.5h18M7 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: 'Guests',
    adminOnly: true,
    icon: (
      <>
        <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M3.5 20c.8-3.4 3-5.2 5.5-5.2s4.7 1.8 5.5 5.2M15.5 8.5a3 3 0 1 1 3.6 2.94M17 14.3c2 .3 3.3 1.7 3.9 4.2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    label: 'History',
    adminOnly: true,
    icon: (
      <path
        d="M4 4.5V10h5.5M4.3 13.5A8 8 0 1 0 6 6.3L4 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: 'Reports',
    adminOnly: true,
    icon: (
      <path
        d="M5 20V10m6.5 10V4M18 20v-6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
]

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin)

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-ink-900/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-ink-100 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-5">
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
          <div>
            <p className="text-sm font-semibold text-ink-800">Grandview</p>
            <p className="text-[11px] text-ink-400">Hotel Management</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {items.map((item) => (
            <div
              key={item.label}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                item.active
                  ? 'bg-brand-50 text-brand-700'
                  : 'cursor-default text-ink-400 opacity-70'
              }`}
            >
              <span className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
                  {item.icon}
                </svg>
                {item.label}
              </span>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
