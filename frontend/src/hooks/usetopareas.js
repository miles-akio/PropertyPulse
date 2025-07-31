// ===== FRONTEND/SRC/HOOKS/USETOPAREAS.JS =====
import { useState } from 'react'
import axios from 'axios'

export const useTopAreas = () => {
  const [areas, setAreas] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getTopAreas = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.get('/api/v1/areas/top')
      setAreas(response.data.areas)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load top areas')
    } finally {
      setLoading(false)
    }
  }

  return { areas, loading, error, getTopAreas }
}
