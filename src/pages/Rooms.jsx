import DashboardShell from '../components/layout/DashboardShell'
import { useAuth } from '../context/AuthContext'

export default function Rooms() {
  const { user } = useAuth()

  return (
    <DashboardShell
      title="Rooms"
      subtitle={`Welcome, ${user?.fullName?.split(' ')[0] ?? 'there'} — browse and book a room.`}
    >
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
            <path
              d="M3 21V8l9-5 9 5v13M9 21v-6h6v6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-lg font-semibold text-ink-900">Room browsing & booking is next</p>
        <p className="mt-1.5 max-w-sm text-sm text-ink-400">
          This is where you'll search available rooms, check rates and start a booking. It's
          under active development.
        </p>
      </div>
    </DashboardShell>
  )
}
