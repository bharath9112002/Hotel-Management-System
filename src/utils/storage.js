const USERS_KEY = 'hms_users'
const SESSION_KEY = 'hms_current_user'

const DEMO_USERS = [
  {
    id: 'demo-admin',
    fullName: 'Demo Admin',
    email: 'admin@hms.com',
    password: 'Admin@123',
    role: 'Admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-user',
    fullName: 'Demo User',
    email: 'user@hms.com',
    password: 'User@123',
    role: 'Front Desk',
    createdAt: new Date().toISOString(),
  },
]

export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const users = raw ? JSON.parse(raw) : []
    if (!Array.isArray(users) || users.length === 0) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_USERS))
      return DEMO_USERS
    }
    return users
  } catch {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_USERS))
    return DEMO_USERS
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
