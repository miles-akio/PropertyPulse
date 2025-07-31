// ===== FRONTEND/SRC/PAGES/TOPAREASPAGE.JSX =====
import React, { useEffect } from 'react'
import { MapPin, TrendingUp, DollarSign, Users, Star } from 'lucide-react'
import { useTopAreas } from '../hooks/useTopAreas'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const TopAreasPage = () => {
  const { areas, loading, error, getTopAreas } = useTopAreas()

  useEffect(() => {
    getTopAreas()
  }, [])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Top 5 Investment Areas</h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover the best investment opportunities across California counties based on our ML analysis
        </p>
      </div>

      {loading && <LoadingSpinner message="Analyzing investment opportunities..." />}
      
      {error && <ErrorMessage message={error} />}

      {areas && (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Star className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-blue-900">Rankings Updated Monthly</h2>
            </div>
            <p className="text-blue-800">
              Our algorithm considers price appreciation potential, rental yields, market stability, 
              economic growth, and demographic trends to identify the most promising investment areas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {areas.map((area, index) => (
              <AreaCard key={area.id} area={area} rank={index + 1} />
            ))}
          </div>

          {/* Methodology */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Ranking Methodology</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MethodologyItem
                title="Price Appreciation"
                weight="30%"
                description="Historical and predicted price growth patterns"
              />
              <MethodologyItem
                title="Rental Market"
                weight="25%"
                description="Rental yields, vacancy rates, and demand trends"
              />
              <MethodologyItem
                title="Economic Indicators"
                weight="25%"
                description="Employment growth, income levels, and business activity"
              />
              <MethodologyItem
                title="Market Stability"
                weight="20%"
                description="Price volatility, liquidity, and market maturity"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const AreaCard = ({ area, rank }) => {
  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return 'bg-yellow-500 text-white'
      case 2: return 'bg-gray-400 text-white'
      case 3: return 'bg-orange-600 text-white'
      default: return 'bg-blue-600 text-white'
    }
  }

  const getRankIcon = (rank) => {
    if (rank <= 3) {
      return <Star className="w-5 h-5" />
    }
    return <span className="font-bold">#{rank}</span>
  }

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankColor(rank)}`}>
              {getRankIcon(rank)}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{area.county}</h3>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{area.region}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{area.overall_score}</div>
            <div className="text-sm text-gray-500">Investment Score</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={<TrendingUp className="w-5 h-5 text-green-600" />}
            label="Price Growth"
            value={`+${area.price_growth}%`}
            subtext="12-month forecast"
          />
          <MetricCard
            icon={<DollarSign className="w-5 h-5 text-blue-600" />}
            label="Rental Yield"
            value={`${area.rental_yield}%`}
            subtext="Annual return"
          />
          <MetricCard
            icon={<Users className="w-5 h-5 text-purple-600" />}
            label="Population"
            value={area.population_growth >= 0 ? `+${area.population_growth}%` : `${area.population_growth}%`}
            subtext="Annual growth"
          />
          <MetricCard
            icon={<MapPin className="w-5 h-5 text-orange-600" />}
            label="Median Price"
            value={`$${(area.median_price / 1000).toFixed(0)}K`}
            subtext="Current market"
          />
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Investment Strength</span>
              <span className="font-medium">{area.overall_score}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${area.overall_score}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {area.highlights.map((highlight, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {highlight}
              </span>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed">
              {area.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const MetricCard = ({ icon, label, value, subtext }) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <div className="font-semibold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xs text-gray-400">{subtext}</div>
    </div>
  )
}

const MethodologyItem = ({ title, weight, description }) => {
  return (
    <div className="text-center">
      <div className="font-semibold text-gray-900">{title}</div>
      <div className="text-lg font-bold text-blue-600 my-1">{weight}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </div>
  )
}

export default TopAreasPage
