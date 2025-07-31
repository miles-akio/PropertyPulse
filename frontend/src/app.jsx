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

// ===== FRONTEND/SRC/PAGES/HOMEPAGE.JSX =====
import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, MapPin, Calculator, BarChart3, ArrowRight } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          California Real Estate Intelligence
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          AI-powered forecasting and investment analysis for California real estate markets. 
          Get 12-month price predictions, investment scores, and rental analysis.
        </p>
        <div className="mt-10">
          <Link
            to="/forecast"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <span>Start Forecasting</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={<TrendingUp className="w-8 h-8 text-blue-600" />}
          title="Price Forecasting"
          description="12-month price predictions with 80% confidence intervals for any CA address or ZIP code"
          link="/forecast"
        />
        <FeatureCard
          icon={<BarChart3 className="w-8 h-8 text-green-600" />}
          title="Investment Analysis"
          description="ML-powered investment scores with SHAP explanations and risk assessment"
          link="/investment"
        />
        <FeatureCard
          icon={<MapPin className="w-8 h-8 text-purple-600" />}
          title="Top Investment Areas"
          description="Discover the best 5 investment opportunities across California counties"
          link="/top-areas"
        />
        <FeatureCard
          icon={<Calculator className="w-8 h-8 text-orange-600" />}
          title="Rental Calculator"
          description="Cap rate estimator with editable assumptions for rental property analysis"
          link="/calculator"
        />
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">58</div>
            <div className="text-gray-600">Counties Covered</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">5+ Years</div>
            <div className="text-gray-600">Historical Data</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">85%</div>
            <div className="text-gray-600">Prediction Accuracy</div>
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Demo Mode
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                This is an offline demo using seeded California real estate data. 
                All predictions and analyses are generated using machine learning models 
                trained on historical market data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const FeatureCard = ({ icon, title, description, link }) => {
  return (
    <Link to={link} className="block">
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer h-full">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-lg mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  )
}

export default HomePage
