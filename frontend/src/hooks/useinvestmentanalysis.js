// ===== FRONTEND/SRC/HOOKS/USEINVESTMENTANALYSIS.JS =====
import { useState } from 'react'
import axios from 'axios'

export const useInvestmentAnalysis = () => {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getAnalysis = async (address) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.post('/api/v1/investment/score', { address })
      setAnalysis(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze investment')
    } finally {
      setLoading(false)
    }
  }

  return { analysis, loading, error, getAnalysis }
}
