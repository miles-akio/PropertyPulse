// ===== FRONTEND/SRC/COMPONENTS/LOADINGSPINNER.JSX =====
import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  )
}

export default LoadingSpinner
