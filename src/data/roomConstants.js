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

// Curated interior-appropriate images (DummyJSON furniture/home-decoration
// categories), cycled across rooms — the general /products feed used for
// room data returns mostly unrelated product photos (cosmetics, gadgets),
// so images are sourced from this fixed set instead.
export const ROOM_IMAGES = [
  'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/home-decoration/plant-pot/thumbnail.webp',
]
