import { useState } from 'react'
import { loginUser, registerUser } from '../services/auth'

function useAuth() {
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

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
  }
}

export default useAuth
