// ===== FRONTEND/SRC/PAGES/INVESTMENTPAGE.JSX =====
import React, { useState } from 'react'
import { Search, BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useInvestmentAnalysis } from '../hooks/useInvestmentAnalysis'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const InvestmentPage = () => {
  const [address, setAddress] = useState('')
  const { analysis, loading, error, getAnalysis } = useInvestmentAnalysis()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (address.trim()) {
      getAnalysis(address.trim())
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Investment Analysis</h1>
        <p className="mt-4 text-lg text-gray-600">
          Get ML-powered investment scores with SHAP explanations and comprehensive risk assessment
        </p>
      </div>

      {/* Search Form */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter California address or ZIP code for investment analysis"
            className="w-full pl-4 pr-20 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !address.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Analyze</span>
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner message="Analyzing investment potential..." />}
      
      {error && <ErrorMessage message={error} />}

      {analysis && (
        <div className="space-y-8">
          {/* Investment Score */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">{analysis.address}</h2>
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center mx-auto">
                  <div className={`text-4xl font-bold ${
                    analysis.investment_score >= 80 ? 'text-green-600' :
                    analysis.investment_score >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {analysis.investment_score}
                  </div>
                </div>
                <div className="mt-4 text-lg font-medium text-gray-700">Investment Score</div>
                <div className="text-sm text-gray-500">Out of 100</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{analysis.risk_level}</div>
                <div className="text-gray-600">Risk Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{analysis.expected_return}%</div>
                <div className="text-gray-600">Expected Annual Return</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{analysis.liquidity_score}/10</div>
                <div className="text-gray-600">Market Liquidity</div>
              </div>
            </div>
          </div>

          {/* SHAP Explanations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">Score Explanation (SHAP Analysis)</h3>
            </div>
            <div className="space-y-4">
              {analysis.shap_explanations.map((factor, index) => (
                <ShapFactorBar key={index} factor={factor} />
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>How to read this:</strong> Green bars show factors that positively impact your investment score,
                while red bars show factors that negatively impact it. The length of each bar represents the strength of the impact.
              </p>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Financial Metrics</h3>
              <div className="space-y-4">
                <MetricRow
                  label="Price to Rent Ratio"
                  value={analysis.metrics.price_to_rent_ratio}
                  benchmark="25-30 is ideal"
                />
                <MetricRow
                  label="Price Appreciation (5yr)"
                  value={`${analysis.metrics.price_appreciation_5yr}%`}
                  benchmark="3-7% annually"
                />
                <MetricRow
                  label="Rental Yield"
                  value={`${analysis.metrics.rental_yield}%`}
                  benchmark="6-12% annually"
                />
                <MetricRow
                  label="Market Cap Rate"
                  value={`${analysis.metrics.market_cap_rate}%`}
                  benchmark="4-10% typical"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Market Indicators</h3>
              <div className="space-y-4">
                <MetricRow
                  label="Days on Market"
                  value={`${analysis.metrics.days_on_market} days`}
                  benchmark="<30 is strong"
                />
                <MetricRow
                  label="Inventory Level"
                  value={analysis.metrics.inventory_level}
                  benchmark="Balanced preferred"
                />
                <MetricRow
                  label="Population Growth"
                  value={`${analysis.metrics.population_growth}%`}
                  benchmark="1-3% annually"
                />
                <MetricRow
                  label="Employment Growth"
                  value={`${analysis.metrics.employment_growth}%`}
                  benchmark="2-4% annually"
                />
              </div>
            </div>
          </div>

          {/* Investment Recommendation */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Investment Recommendation</h3>
            <div className={`p-6 rounded-lg ${
              analysis.recommendation === 'Strong Buy' ? 'bg-green-50 border border-green-200' :
              analysis.recommendation === 'Buy' ? 'bg-blue-50 border border-blue-200' :
              analysis.recommendation === 'Hold' ? 'bg-yellow-50 border border-yellow-200' :
              'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className={`text-xl font-bold ${
                  analysis.recommendation === 'Strong Buy' ? 'text-green-700' :
                  analysis.recommendation === 'Buy' ? 'text-blue-700' :
                  analysis.recommendation === 'Hold' ? 'text-yellow-700' :
                  'text-red-700'
                }`}>
                  {analysis.recommendation}
                </div>
              </div>
              <p className="text-gray-700 mb-4">{analysis.recommendation_reason}</p>
              <div className="space-y-2">
                <div className="font-medium text-gray-900">Key Highlights:</div>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {analysis.key_highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const ShapFactorBar = ({ factor }) => {
  const isPositive = factor.impact > 0
  const maxImpact = 0.3 // Normalize to reasonable bar width
  const barWidth = Math.abs(factor.impact / maxImpact) * 100

  return (
    <div className="flex items-center space-x-4">
      <div className="w-32 text-sm font-medium text-gray-700 text-right">
        {factor.feature}
      </div>
      <div className="flex-1 flex items-center">
        <div className="relative h-6 w-full bg-gray-100 rounded">
          <div 
            className={`absolute h-full rounded transition-all ${
              isPositive ? 'bg-green-500 left-1/2' : 'bg-red-500 right-1/2'
            }`}
            style={{ width: `${Math.min(barWidth, 50)}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0.5 h-full bg-gray-300"></div>
          </div>
        </div>
        <div className="ml-3 text-sm font-medium text-gray-600">
          {isPositive ? '+' : ''}{factor.impact.toFixed(3)}
        </div>
      </div>
    </div>
  )
}

const MetricRow = ({ label, value, benchmark }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="font-medium text-gray-900">{label}</div>
        <div className="text-sm text-gray-500">{benchmark}</div>
      </div>
      <div className="font-semibold text-blue-600">{value}</div>
    </div>
  )
}

export default InvestmentPage
