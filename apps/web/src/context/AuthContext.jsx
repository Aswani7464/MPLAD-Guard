import { createContext, useContext, useState } from 'react'
import { loginUser, registerUser } from '../services/auth'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (loginData) => {
    setLoading(true)
    setError(null)

    try {
      const data = await loginUser(loginData)
      setUser(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const data = await registerUser(userData)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuthContext must be used inside AuthProvider'
    )
  }

  return context
}

export { AuthProvider, useAuthContext }
