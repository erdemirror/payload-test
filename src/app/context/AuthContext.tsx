'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getCookie, deleteCookie } from '@/lib/cookies'

type User = {
  id: string
  email: string
}

type AuthContextType = {
  user: User | null
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

  const logout = () => {
    deleteCookie('token')
    deleteCookie('user')
    setUser(null)
    window.location.href = '/login'
  }

  return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
