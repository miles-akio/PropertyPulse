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
