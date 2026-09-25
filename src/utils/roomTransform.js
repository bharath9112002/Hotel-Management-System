import {
  AMENITIES_POOL,
  AVAILABILITY_STATUSES,
  ROOM_IMAGES,
  ROOM_TYPES,
  ROOM_TYPE_CAPACITY,
  ROOMS_PER_FLOOR,
} from '../data/roomConstants'

function roomTypeForPrice(price) {
  if (price < 3000) return ROOM_TYPES[0]
  if (price < 5000) return ROOM_TYPES[1]
  if (price < 8000) return ROOM_TYPES[2]
  if (price < 14000) return ROOM_TYPES[3]
  return ROOM_TYPES[4]
}

function availabilityForId(id) {
  const r = id % 5
  if (r === 0) return AVAILABILITY_STATUSES[2]
  if (r === 1 || r === 2) return AVAILABILITY_STATUSES[1]
  return AVAILABILITY_STATUSES[0]
}

function amenitiesForId(id) {
  return AMENITIES_POOL.filter((_, i) => (id + i) % 3 !== 0)
}

export function mapProductToRoom(product, index) {
  const floorNumber = Math.floor(index / ROOMS_PER_FLOOR) + 1
  const roomNumber = `${floorNumber}${String((index % ROOMS_PER_FLOOR) + 1).padStart(2, '0')}`
  const pricePerNight = Math.max(1500, Math.round((product.price * 70) / 50) * 50)
  const roomType = roomTypeForPrice(pricePerNight)

  return {
    id: product.id,
    roomNumber,
    roomType,
    floorNumber,
    pricePerNight,
    capacity: ROOM_TYPE_CAPACITY[roomType],
    availability: availabilityForId(product.id),
    amenities: amenitiesForId(product.id),
    image: ROOM_IMAGES[index % ROOM_IMAGES.length],
  }
}
