import axios from 'axios'

const client = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
})

const ROOM_COUNT = 48

export async function fetchRoomProducts() {
  const { data } = await client.get('/products', { params: { limit: ROOM_COUNT } })
  return data.products
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
