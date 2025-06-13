'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getCookie, setCookie, deleteCookie } from '@/lib/cookies'

type User = {
  id: string
  email: string
}

type AuthContextType = {
  user: User | null
  login: (user: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = getCookie('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse user cookie', e)
      }
    }
  }, [])

  const login = (user: User, token: string) => {
    setCookie('user', JSON.stringify(user))
    setCookie('token', token)
    setUser(user) // ✅ Update React state immediately
  }

  const logout = () => {
    deleteCookie('user')
    deleteCookie('token')
    setUser(null)
    window.location.href = '/login'
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
