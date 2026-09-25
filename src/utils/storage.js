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
]

// The demo user account was removed; browsers that already stored it get it
// dropped on the next read instead of keeping a dead login around.
const REMOVED_DEMO_USER_ID = 'demo-user'

export function getUsers() {
  let users = []
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (Array.isArray(parsed)) {
      users = parsed.filter((u) => u.id !== REMOVED_DEMO_USER_ID)
      if (users.length !== parsed.length) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
      }
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
    const session = raw ? JSON.parse(raw) : null
    if (session?.id === REMOVED_DEMO_USER_ID) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
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
