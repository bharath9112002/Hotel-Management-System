export const ROOM_TYPES = [
  'Standard Single',
  'Standard Double',
  'Deluxe Room',
  'Executive Suite',
  'Presidential Suite',
]

export const ROOM_TYPE_CAPACITY = {
  'Standard Single': 1,
  'Standard Double': 2,
  'Deluxe Room': 3,
  'Executive Suite': 4,
  'Presidential Suite': 6,
}

export const AVAILABILITY_STATUSES = ['Available', 'Occupied', 'Maintenance']

export const AMENITIES_POOL = [
  'Free WiFi',
  'Air Conditioning',
  'Flat-screen TV',
  'Mini Bar',
  'Room Service',
  'Balcony',
  'Sea View',
  'Bathtub',
  'Work Desk',
  'Coffee Maker',
]

export const ROOMS_PER_FLOOR = 8
export const ROOM_PAGE_SIZE = 8

// Real hotel-room interior photos (Pexels, free to use), cycled across
// rooms — the DummyJSON /products feed used for room data returns mostly
// unrelated product photos (cosmetics, gadgets, single furniture pieces),
// so images are sourced from this fixed set instead.
const PEXELS_ROOM_PHOTO_IDS = [
  34496715, 2889618, 97083, 6394559, 18651505, 34496702, 3754698, 279805,
  38624798, 7609139, 31967701, 11063185, 24461266, 37748240, 36916378,
]

export const ROOM_IMAGES = PEXELS_ROOM_PHOTO_IDS.map(
  (id) =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`,
)
