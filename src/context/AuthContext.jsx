import { createContext, useContext, useMemo, useState } from 'react'
import {
  clearSession,
  getSession,
  getUsers,
  saveUsers,
  setSession,
} from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession())

  const login = ({ email, password }) => {
    const users = getUsers()
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    )
    if (!match) {
      throw new Error('Invalid email or password.')
    }
    const { password: _pw, ...safeUser } = match
    setSession(safeUser)
    setUser(safeUser)
    return safeUser
  }

  const register = ({ fullName, email, password, role }) => {
    const users = getUsers()
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase())
    if (exists) {
      throw new Error('An account with this email already exists.')
    }
    const newUser = {
      id: crypto.randomUUID(),
      fullName,
      email,
      password,
      role: role || 'Staff',
      createdAt: new Date().toISOString(),
    }
    saveUsers([...users, newUser])
    return newUser
  }

  const logout = () => {
    clearSession()
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, register, logout }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
