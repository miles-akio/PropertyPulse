// ===== FRONTEND/SRC/PAGES/FORECASTPAGE.JSX =====
import React, { useState } from 'react'
import { Search, MapPin, TrendingUp, AlertCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { useForecast } from '../hooks/useForecast'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const ForecastPage = () => {
  const [address, setAddress] = useState('')
  const { forecast, loading, error, getForecast } = useForecast()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (address.trim()) {
      getForecast(address.trim())
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Price Forecasting</h1>
        <p className="mt-4 text-lg text-gray-600">
          Get 12-month price predictions with confidence intervals for any California address or ZIP code
        </p>
      </div>

      {/* Search Form */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter California address or ZIP code (e.g., 90210, Beverly Hills CA)"
              className="w-full pl-10 pr-20 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading || !address.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Forecast</span>
            </button>
          </div>
        </form>
      </div>

      {loading && <LoadingSpinner message="Generating forecast..." />}
      
      {error && <ErrorMessage message={error} />}

      {forecast && (
        <div className="space-y-8">
          {/* Current Property Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">{forecast.address}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                label="Current Value"
                value={`${forecast.current_value.toLocaleString()}`}
                change={forecast.recent_change}
                changeType={forecast.recent_change >= 0 ? 'positive' : 'negative'}
              />
              <StatCard
                label="12-Month Forecast"
                value={`${forecast.predicted_value.toLocaleString()}`}
                change={forecast.predicted_change}
                changeType={forecast.predicted_change >= 0 ? 'positive' : 'negative'}
              />
              <StatCard
                label="Market Type"
                value={forecast.market_type}
                subtext={forecast.county}
              />
              <StatCard
                label="Confidence"
                value={`${forecast.confidence}%`}
                subtext="Prediction accuracy"
              />
            </div>
          </div>

          {/* Price Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold">Price Forecast with Confidence Interval</h3>
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecast.chart_data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                  <Tooltip 
                    formatter={(value, name) => [`${value.toLocaleString()}`, name]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="upper_bound"
                    stackId="1"
                    stroke="none"
                    fill="#dbeafe"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="lower_bound"
                    stackId="1"
                    stroke="none"
                    fill="#ffffff"
                    fillOpacity={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted_price"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="historical_price"
                    stroke="#64748b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-blue-600"></div>
                <span>Predicted Price</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-gray-500" style={{borderTop: '1px dashed'}}></div>
                <span>Historical Price</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-200"></div>
                <span>80% Confidence Interval</span>
              </div>
            </div>
          </div>

          {/* Market Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Market Insights</h3>
              <div className="space-y-4">
                <InsightItem
                  label="Volatility"
                  value={forecast.volatility}
                  description="Price stability over the forecast period"
                />
                <InsightItem
                  label="Seasonal Trend"
                  value={forecast.seasonal_trend}
                  description="Expected seasonal price patterns"
                />
                <InsightItem
                  label="Market Momentum"
                  value={forecast.momentum}
                  description="Current market direction and strength"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Risk Factors</h3>
              <div className="space-y-3">
                {forecast.risk_factors.map((risk, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">{risk.factor}</div>
                      <div className="text-sm text-gray-600">{risk.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const StatCard = ({ label, value, change, changeType, subtext }) => {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
      {change !== undefined && (
        <div className={`text-sm font-medium ${
          changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </div>
      )}
      {subtext && (
        <div className="text-xs text-gray-500 mt-1">{subtext}</div>
      )}
    </div>
  )
}

const InsightItem = ({ label, value, description }) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="font-medium text-gray-900">{label}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      <div className="ml-4 font-semibold text-blue-600">{value}</div>
    </div>
  )
}

export default ForecastPage
