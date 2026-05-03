<<<<<<< HEAD
import { createContext, useState, useEffect, useContext } from 'react'
import { getCurrentUser } from '../api/api'
=======
import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser } from '../api/api';
>>>>>>> 170e9b3 (resolve conflicts (keep my changes))

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

<<<<<<< HEAD
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
    } catch {
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
=======
    const refreshUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return null;
        }

        try {
            const res = await getCurrentUser();
            const userData = res.data.user;
            
            // Normalize name if needed
            if (userData && userData.username && !userData.name) {
                userData.name = userData.username;
            }
            
            setUser(userData);
            return userData;
        } catch (error) {
            console.error("Auth check failed:", error);
            // If it's a 401, the interceptor in api.js will handle clearing token
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);
>>>>>>> 170e9b3 (resolve conflicts (keep my changes))

  const login = async (userData, token) => {
    if (token) {
      localStorage.setItem('token', token)
    }

    if (userData) {
      setUser(userData)
      return userData
    }

<<<<<<< HEAD
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
=======
    return (
        <AuthContext.Provider value={{ user, login, logout, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};
>>>>>>> 170e9b3 (resolve conflicts (keep my changes))

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
