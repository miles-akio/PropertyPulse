// ===== FRONTEND/SRC/HOOKS/USEFORECAST.JS =====
import { useState } from 'react'
import axios from 'axios'

export const useForecast = () => {
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getForecast = async (address) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.get(`/api/v1/forecast/${encodeURIComponent(address)}`)
      setForecast(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate forecast')
    } finally {
      setLoading(false)
    }
  }

  return { forecast, loading, error, getForecast }
}
