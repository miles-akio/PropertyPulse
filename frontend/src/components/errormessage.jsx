// ===== FRONTEND/SRC/COMPONENTS/ERRORMESSAGE.JSX =====
import React from 'react'
import { AlertCircle } from 'lucide-react'

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
        <div>
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-1 text-sm text-red-700">{message}</div>
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage
