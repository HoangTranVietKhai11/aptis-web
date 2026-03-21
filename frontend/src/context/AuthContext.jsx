import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('aptis_token'))
  const [loading, setLoading] = useState(!!localStorage.getItem('aptis_token'))

  useEffect(() => {
    if (token) {
      localStorage.setItem('aptis_token', token)
      // Fetch fresh user data including XP and Streak
      fetch('http://localhost:3003/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => setUser(data))
        .catch(() => {
          localStorage.removeItem('aptis_token')
          setToken(null)
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      localStorage.removeItem('aptis_token')
      setLoading(false)
    }
  }, [token])

  const login = (newToken, userData) => {
    setToken(newToken)
    setUser(userData)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'
  const isLoggedIn = !!user

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, isLoggedIn, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
