import DashboardShell from '../components/layout/DashboardShell'
import QuickActions from '../components/dashboard/QuickActions'
import RecentBookings from '../components/dashboard/RecentBookings'
import RevenueSummary from '../components/dashboard/RevenueSummary'
import StatCard from '../components/dashboard/StatCard'
import {
  quickActions,
  recentBookings,
  revenue,
  roomStats,
  summaryStats,
  weeklyRevenue,
} from '../data/dashboardData'
import { useAuth } from '../context/AuthContext'

const ICONS = {
  rooms: (
    <path
      d="M3 21V8l9-5 9 5v13M9 21v-6h6v6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  available: (
    <path
      d="M5 21V5a2 2 0 0 1 2-2h6l6 6v12a1 1 0 0 1-1 1H5ZM9 12.5l2 2 4-4.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  occupied: (
    <>
      <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 19c.7-3.2 2.9-5 5.5-5s4.8 1.8 5.5 5M17 11v6m3-3h-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
  guests: (
    <>
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M2.5 20c.7-3.3 2.9-5.1 5.5-5.1s4.8 1.8 5.5 5.1M14.7 15.2c2 .2 3.6 1.7 4.2 4.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
  checkIn: (
    <path
      d="M11 6V4h9v16h-9v-2M3 12h11m0 0-3.5-3.5M14 12l-3.5 3.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  checkOut: (
    <path
      d="M13 6V4H4v16h9v-2M21 12H10m0 0 3.5-3.5M10 12l3.5 3.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  bookings: (
    <>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 9.5h17M8 3v3M16 3v3M8.5 14l2 2 4-4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
}

const USER_QUICK_ACTION_IDS = ['rooms', 'booking', 'checkin', 'payments']

export default function Dashboard() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'
  const firstName = user?.fullName?.split(' ')[0] ?? 'there'

  if (!isAdmin) {
    const userActions = quickActions.filter((action) => USER_QUICK_ACTION_IDS.includes(action.id))
    return (
      <DashboardShell
        title={`Welcome, ${firstName}`}
        subtitle="Here's your quick access to daily front-desk operations."
      >
        <div className="mx-auto max-w-2xl">
          <QuickActions actions={userActions} />
        </div>
      </DashboardShell>
    )
  }

  const stats = [
    { label: 'Total rooms', value: roomStats.totalRooms, icon: ICONS.rooms },
    {
      label: 'Available rooms',
      value: roomStats.availableRooms,
      icon: ICONS.available,
      tone: 'brand',
    },
    { label: 'Occupied rooms', value: roomStats.occupiedRooms, icon: ICONS.occupied },
    { label: 'Total guests', value: summaryStats.totalGuests, icon: ICONS.guests },
    {
      label: "Today's check-ins",
      value: summaryStats.todayCheckIns,
      icon: ICONS.checkIn,
      tone: 'brand',
    },
    { label: "Today's check-outs", value: summaryStats.todayCheckOuts, icon: ICONS.checkOut },
    { label: 'Total bookings', value: summaryStats.totalBookings, icon: ICONS.bookings },
  ]

  return (
    <DashboardShell
      title={`Welcome, ${firstName}`}
      subtitle="Here's what's happening at Grandview today."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueSummary revenue={revenue} weeklyRevenue={weeklyRevenue} />
        </div>
        <QuickActions actions={quickActions} />
      </div>

      <div className="mt-6">
        <RecentBookings bookings={recentBookings} />
      </div>
    </DashboardShell>
  )
}
