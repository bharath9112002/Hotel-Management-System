import axios from 'axios'
import { withRetry } from './retry'

const client = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 6000,
})

const GUEST_COUNT = 40
const GUEST_FIELDS = 'firstName,lastName,email,phone,address'

export function fetchGuestUsers() {
  return withRetry(async () => {
    const { data } = await client.get('/users', {
      params: { limit: GUEST_COUNT, select: GUEST_FIELDS },
    })
    return data.users
  })
}

export async function createGuestUser(payload) {
  const { data } = await client.post('/users/add', payload)
  return data
}

export async function updateGuestUser(id, payload) {
  const { data } = await client.put(`/users/${id}`, payload)
  return data
}

export async function deleteGuestUser(id) {
  const { data } = await client.delete(`/users/${id}`)
  return data
}
