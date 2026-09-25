import { NATIONALITIES } from '../data/guestConstants'

// DummyJSON's /users feed has no nationality (everyone is "United States"),
// so it's assigned from a fixed list to give the seed guests some variety.
export function mapUserToGuest(user) {
  const { address = {} } = user

  return {
    id: user.id,
    fullName: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    mobile: user.phone,
    address: [address.address, address.city, address.state].filter(Boolean).join(', '),
    nationality: NATIONALITIES[user.id % NATIONALITIES.length],
  }
}

export function guestToUserPayload(values) {
  const [firstName, ...rest] = values.fullName.trim().split(/\s+/)
  return {
    firstName,
    lastName: rest.join(' '),
    email: values.email,
    phone: values.mobile,
  }
}

export function getInitials(fullName) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}
