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
  let users = []
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (Array.isArray(parsed)) {
      users = parsed
    }
  } catch {
    users = []
  }

  const missingDemoUsers = DEMO_USERS.filter(
    (demo) => !users.some((u) => u.email.toLowerCase() === demo.email.toLowerCase()),
  )
  if (missingDemoUsers.length > 0) {
    users = [...users, ...missingDemoUsers]
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }

  return users
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
