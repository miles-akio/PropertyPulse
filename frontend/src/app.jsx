// ===== FRONTEND/SRC/APP.JSX =====
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Home, TrendingUp, MapPin, Calculator, BarChart3 } from 'lucide-react'
import HomePage from './pages/HomePage'
import ForecastPage from './pages/ForecastPage'
import InvestmentPage from './pages/InvestmentPage'
import TopAreasPage from './pages/TopAreasPage'
import CalculatorPage from './pages/CalculatorPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <span className="text-xl font-bold text-gray-900">
                    CA Real Estate Forecast
                  </span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-8">
                <NavLink to="/" icon={<Home className="w-4 h-4" />} text="Home" />
                <NavLink to="/forecast" icon={<TrendingUp className="w-4 h-4" />} text="Forecast" />
                <NavLink to="/investment" icon={<BarChart3 className="w-4 h-4" />} text="Investment" />
                <NavLink to="/top-areas" icon={<MapPin className="w-4 h-4" />} text="Top Areas" />
                <NavLink to="/calculator" icon={<Calculator className="w-4 h-4" />} text="Calculator" />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/investment" element={<InvestmentPage />} />
            <Route path="/top-areas" element={<TopAreasPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )∂
}

const NavLink = ({ to, icon, text }) => {
  return (
    <Link
      to={to}
      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
    >
      {icon}
      <span>{text}</span>
    </Link>
  )
}

export default App
