export const roomStats = {
  totalRooms: 84,
  availableRooms: 31,
  occupiedRooms: 53,
}

export const summaryStats = {
  totalGuests: 142,
  todayCheckIns: 12,
  todayCheckOuts: 8,
  totalBookings: 316,
}

export const revenue = {
  today: 48250,
  week: 286400,
  month: 1142800,
  deltaVsYesterday: 8.4,
}

export const weeklyRevenue = [
  { day: 'Mon', amount: 32400 },
  { day: 'Tue', amount: 28900 },
  { day: 'Wed', amount: 35100 },
  { day: 'Thu', amount: 41200 },
  { day: 'Fri', amount: 52800 },
  { day: 'Sat', amount: 61500 },
  { day: 'Sun', amount: 48250 },
]

export const recentBookings = [
  {
    id: 'BK-1042',
    guestName: 'Ariana Coleman',
    roomNumber: '204',
    roomType: 'Deluxe King',
    checkIn: '2026-09-23',
    checkOut: '2026-09-26',
    status: 'Checked-in',
    amount: 18600,
  },
  {
    id: 'BK-1041',
    guestName: 'Marcus Chen',
    roomNumber: '312',
    roomType: 'Executive Suite',
    checkIn: '2026-09-24',
    checkOut: '2026-09-27',
    status: 'Confirmed',
    amount: 27300,
  },
  {
    id: 'BK-1040',
    guestName: 'Priya Nair',
    roomNumber: '118',
    roomType: 'Standard Twin',
    checkIn: '2026-09-20',
    checkOut: '2026-09-23',
    status: 'Checked-out',
    amount: 9600,
  },
  {
    id: 'BK-1039',
    guestName: 'Tom Alvarez',
    roomNumber: '406',
    roomType: 'Deluxe King',
    checkIn: '2026-09-22',
    checkOut: '2026-09-25',
    status: 'Pending',
    amount: 15900,
  },
  {
    id: 'BK-1038',
    guestName: 'Sofia Rossi',
    roomNumber: '227',
    roomType: 'Standard Queen',
    checkIn: '2026-09-19',
    checkOut: '2026-09-21',
    status: 'Cancelled',
    amount: 7200,
  },
]

export const quickActions = [
  {
    id: 'rooms',
    label: 'Manage Rooms',
    description: 'View, add or update room inventory',
    module: 'Module 3',
    to: '/rooms',
  },
  {
    id: 'guests',
    label: 'Add Guest',
    description: 'Register a new guest profile',
    module: 'Module 4',
    to: '/guests',
  },
  {
    id: 'booking',
    label: 'New Booking',
    description: 'Create a reservation for a guest',
    module: 'Module 5',
    to: '/bookings/new',
  },
  {
    id: 'checkin',
    label: 'Check-In / Check-Out',
    description: 'Process arrivals and departures',
    module: 'Module 6',
    to: '/check-in-out',
  },
  {
    id: 'payments',
    label: 'Payments',
    description: 'Review invoices and payment status',
    module: 'Module 7',
  },
  {
    id: 'reports',
    label: 'Reports',
    description: 'Occupancy, revenue and trends',
    module: 'Module 9',
  },
]
