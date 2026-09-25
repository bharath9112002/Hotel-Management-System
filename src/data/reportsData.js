// Sample history for the Reports module. Values are keyed by calendar month
// (0 = Jan) so the charts show a believable seasonal shape for whatever
// 12-month window ends today; live bookings are added on top of these.
export const SAMPLE_MONTHLY = [
  { revenue: 1184000, bookings: 212, cancelled: 14, occupancy: 71 },
  { revenue: 1096000, bookings: 196, cancelled: 12, occupancy: 68 },
  { revenue: 1232000, bookings: 221, cancelled: 15, occupancy: 72 },
  { revenue: 1018000, bookings: 184, cancelled: 17, occupancy: 63 },
  { revenue: 942000, bookings: 171, cancelled: 16, occupancy: 58 },
  { revenue: 876000, bookings: 158, cancelled: 13, occupancy: 54 },
  { revenue: 912000, bookings: 166, cancelled: 11, occupancy: 57 },
  { revenue: 968000, bookings: 175, cancelled: 12, occupancy: 60 },
  { revenue: 1054000, bookings: 189, cancelled: 14, occupancy: 64 },
  { revenue: 1268000, bookings: 228, cancelled: 15, occupancy: 76 },
  { revenue: 1392000, bookings: 247, cancelled: 18, occupancy: 82 },
  { revenue: 1486000, bookings: 263, cancelled: 21, occupancy: 88 },
]

// Share of sample bookings per room type (sums to 1).
export const SAMPLE_ROOM_TYPE_SHARE = {
  'Standard Single': 0.18,
  'Standard Double': 0.34,
  'Deluxe Room': 0.27,
  'Executive Suite': 0.15,
  'Presidential Suite': 0.06,
}

export const REPORT_PERIODS = [
  { value: 6, label: 'Last 6 months' },
  { value: 12, label: 'Last 12 months' },
]
