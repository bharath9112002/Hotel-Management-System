import axios from 'axios'
import { withRetry } from './retry'

const client = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 6000,
})

const ROOM_COUNT = 48

// Rooms are derived from just each product's id and price; asking for only
// those keeps the response ~1KB instead of ~70KB, which the mock server
// handles far more reliably.
export function fetchRoomProducts() {
  return withRetry(async () => {
    const { data } = await client.get('/products', {
      params: { limit: ROOM_COUNT, select: 'price' },
    })
    return data.products
  })
}

export async function createRoomProduct(payload) {
  const { data } = await client.post('/products/add', payload)
  return data
}

export async function updateRoomProduct(id, payload) {
  const { data } = await client.put(`/products/${id}`, payload)
  return data
}

export async function deleteRoomProduct(id) {
  const { data } = await client.delete(`/products/${id}`)
  return data
}
