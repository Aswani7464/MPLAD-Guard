import { useState } from 'react'
import {
  getProjectRisk,
  createRisk,
} from '../services/risk'

function useRiskAnalysis() {
  const [risk, setRisk] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRisk = async (projectId) => {
    setLoading(true)
    setError(null)

    try {
      const data = await getProjectRisk(projectId)
      setRisk(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const addRisk = async (riskData) => {
    setLoading(true)
    setError(null)

    try {
      const data = await createRisk(riskData)
      setRisk(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    risk,
    loading,
    error,
    fetchRisk,
    addRisk,
  }
}

export default useRiskAnalysis
