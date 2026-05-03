import { createContext, useState, useEffect, useContext } from 'react'
import { getCurrentUser } from '../api/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setUser(null)
      return null
    }

    try {
      const response = await getCurrentUser()
      const backendUser = response?.data?.user || null
      setUser(backendUser)
      return backendUser
    } catch (error) {
      localStorage.removeItem('token')
      setUser(null)
      return null
    }
  }

  useEffect(() => {
    const checkUser = async () => {
      await refreshUser()
      setLoading(false)
    }

    void checkUser()
  }, [])

  const login = async (userData, token) => {
    if (token) {
      localStorage.setItem('token', token)
    }

    if (userData) {
      setUser(userData)
      return userData
    }

    return refreshUser()
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
