// ===== FRONTEND/SRC/PAGES/CALCULATORPAGE.JSX =====
import React, { useState } from 'react'
import { Calculator, DollarSign, Home, TrendingUp, Settings } from 'lucide-react'

const CalculatorPage = () => {
  const [inputs, setInputs] = useState({
    purchasePrice: 500000,
    downPayment: 20,
    interestRate: 7.0,
    loanTerm: 30,
    monthlyRent: 3500,
    propertyTax: 1.2,
    insurance: 1200,
    maintenance: 2.0,
    vacancy: 5.0,
    managementFee: 8.0,
    capEx: 1.0,
    appreciation: 3.5,
  })

  const [results, setResults] = useState(null)

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }))
  }

  const calculateResults = () => {
    const purchasePrice = inputs.purchasePrice
    const downPaymentAmount = purchasePrice * (inputs.downPayment / 100)
    const loanAmount = purchasePrice - downPaymentAmount
    
    // Monthly mortgage payment
    const monthlyRate = inputs.interestRate / 100 / 12
    const numPayments = inputs.loanTerm * 12
    const monthlyMortgage = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                           (Math.pow(1 + monthlyRate, numPayments) - 1)

    // Monthly expenses
    const monthlyPropertyTax = (purchasePrice * inputs.propertyTax / 100) / 12
    const monthlyInsurance = inputs.insurance / 12
    const monthlyMaintenance = (purchasePrice * inputs.maintenance / 100) / 12
    const monthlyCapEx = (purchasePrice * inputs.capEx / 100) / 12
    
    // Gross rental income
    const grossMonthlyRent = inputs.monthlyRent
    const grossAnnualRent = grossMonthlyRent * 12
    
    // Vacancy adjustment
    const effectiveMonthlyRent = grossMonthlyRent * (1 - inputs.vacancy / 100)
    const effectiveAnnualRent = effectiveMonthlyRent * 12
    
    // Management fee
    const monthlyManagementFee = effectiveMonthlyRent * (inputs.managementFee / 100)
    
    // Net monthly cash flow
    const totalMonthlyExpenses = monthlyMortgage + monthlyPropertyTax + monthlyInsurance + 
                                monthlyMaintenance + monthlyCapEx + monthlyManagementFee
    const netMonthlyCashFlow = effectiveMonthlyRent - totalMonthlyExpenses
    const netAnnualCashFlow = netMonthlyCashFlow * 12
    
    // Cap rate (NOI / Purchase Price)
    const noi = effectiveAnnualRent - (monthlyPropertyTax + monthlyInsurance + monthlyMaintenance + 
                                      monthlyCapEx + monthlyManagementFee) * 12
    const capRate = (noi / purchasePrice) * 100
    
    // Cash on cash return
    const totalCashInvested = downPaymentAmount + (purchasePrice * 0.03) // Assume 3% closing costs
    const cashOnCashReturn = (netAnnualCashFlow / totalCashInvested) * 100
    
    // Total return with appreciation
    const annualAppreciation = purchasePrice * (inputs.appreciation / 100)
    const totalAnnualReturn = netAnnualCashFlow + annualAppreciation
    const totalReturnPercent = (totalAnnualReturn / totalCashInvested) * 100
    
    setResults({
      monthlyMortgage,
      monthlyPropertyTax,
      monthlyInsurance,
      monthlyMaintenance,
      monthlyCapEx,
      monthlyManagementFee,
      effectiveMonthlyRent,
      netMonthlyCashFlow,
      netAnnualCashFlow,
      capRate,
      cashOnCashReturn,
      totalReturnPercent,
      noi,
      totalCashInvested,
      grossAnnualRent,
      effectiveAnnualRent,
    })
  }

  React.useEffect(() => {
    calculateResults()
  }, [inputs])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Rental Cap Rate Calculator</h1>
        <p className="mt-4 text-lg text-gray-600">
          Analyze rental property investments with customizable assumptions and detailed cash flow projections
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Investment Parameters</h2>
            </div>

            <div className="space-y-6">
              {/* Property Details */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Property Details</h3>
                <div className="space-y-3">
                  <InputField
                    label="Purchase Price"
                    value={inputs.purchasePrice}
                    onChange={(value) => handleInputChange('purchasePrice', value)}
                    prefix="$"
                    type="number"
                  />
                  <InputField
                    label="Down Payment"
                    value={inputs.downPayment}
                    onChange={(value) => handleInputChange('downPayment', value)}
                    suffix="%"
                    type="number"
                  />
                  <InputField
                    label="Monthly Rent"
                    value={inputs.monthlyRent}
                    onChange={(value) => handleInputChange('monthlyRent', value)}
                    prefix="$"
                    type="number"
                  />
                </div>
              </div>

              {/* Financing */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Financing</h3>
                <div className="space-y-3">
                  <InputField
                    label="Interest Rate"
                    value={inputs.interestRate}
                    onChange={(value) => handleInputChange('interestRate', value)}
                    suffix="%"
                    type="number"
                    step="0.1"
                  />
                  <InputField
                    label="Loan Term"
                    value={inputs.loanTerm}
                    onChange={(value) => handleInputChange('loanTerm', value)}
                    suffix="years"
                    type="number"
                  />
                </div>
              </div>

              {/* Operating Expenses */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Operating Expenses</h3>
                <div className="space-y-3">
                  <InputField
                    label="Property Tax"
                    value={inputs.propertyTax}
                    onChange={(value) => handleInputChange('propertyTax', value)}
                    suffix="% of value"
                    type="number"
                    step="0.1"
                  />
                  <InputField
                    label="Insurance"
                    value={inputs.insurance}
                    onChange={(value) => handleInputChange('insurance', value)}
                    prefix="$"
                    suffix="/year"
                    type="number"
                  />
                  <InputField
                    label="Maintenance"
                    value={inputs.maintenance}
                    onChange={(value) => handleInputChange('maintenance', value)}
                    suffix="% of value"
                    type="number"
                    step="0.1"
                  />
                  <InputField
                    label="Capital Expenditures"
                    value={inputs.capEx}
                    onChange={(value) => handleInputChange('capEx', value)}
                    suffix="% of value"
                    type="number"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Management & Market */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Management & Market</h3>
                <div className="space-y-3">
                  <InputField
                    label="Vacancy Rate"
                    value={inputs.vacancy}
                    onChange={(value) => handleInputChange('vacancy', value)}
                    suffix="%"
                    type="number"
                    step="0.1"
                  />
                  <InputField
                    label="Management Fee"
                    value={inputs.managementFee}
                    onChange={(value) => handleInputChange('managementFee', value)}
                    suffix="% of rent"
                    type="number"
                    step="0.1"
                  />
                  <InputField
                    label="Annual Appreciation"
                    value={inputs.appreciation}
                    onChange={(value) => handleInputChange('appreciation', value)}
                    suffix="%"
                    type="number"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {results && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                  title="Cap Rate"
                  value={`${results.capRate.toFixed(2)}%`}
                  description="Net Operating Income / Purchase Price"
                  color="blue"
                  icon={<Calculator className="w-6 h-6" />}
                />
                <MetricCard
                  title="Cash-on-Cash Return"
                  value={`${results.cashOnCashReturn.toFixed(2)}%`}
                  description="Annual Cash Flow / Cash Invested"
                  color={results.cashOnCashReturn > 8 ? "green" : results.cashOnCashReturn > 5 ? "yellow" : "red"}
                  icon={<DollarSign className="w-6 h-6" />}
                />
                <MetricCard
                  title="Total Return"
                  value={`${results.totalReturnPercent.toFixed(2)}%`}
                  description="Cash Flow + Appreciation"
                  color={results.totalReturnPercent > 12 ? "green" : results.totalReturnPercent > 8 ? "yellow" : "red"}
                  icon={<TrendingUp className="w-6 h-6" />}
                />
              </div>

              {/* Monthly Cash Flow Breakdown */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Monthly Cash Flow Analysis</h3>
                <div className="space-y-3">
                  <CashFlowItem
                    label="Gross Monthly Rent"
                    amount={inputs.monthlyRent}
                    type="income"
                  />
                  <CashFlowItem
                    label="Vacancy Loss"
                    amount={-(inputs.monthlyRent * inputs.vacancy / 100)}
                    type="expense"
                  />
                  <CashFlowItem
                    label="Effective Rental Income"
                    amount={results.effectiveMonthlyRent}
                    type="income"
                    isSubtotal
                  />
                  
                  <div className="border-t pt-3 mt-3">
                    <CashFlowItem
                      label="Mortgage Payment"
                      amount={-results.monthlyMortgage}
                      type="expense"
                    />
                    <CashFlowItem
                      label="Property Tax"
                      amount={-results.monthlyPropertyTax}
                      type="expense"
                    />
                    <CashFlowItem
                      label="Insurance"
                      amount={-results.monthlyInsurance}
                      type="expense"
                    />
                    <CashFlowItem
                      label="Maintenance"
                      amount={-results.monthlyMaintenance}
                      type="expense"
                    />
                    <CashFlowItem
                      label="Capital Expenditures"
                      amount={-results.monthlyCapEx}
                      type="expense"
                    />
                    <CashFlowItem
                      label="Management Fee"
                      amount={-results.monthlyManagementFee}
                      type="expense"
                    />
                  </div>

                  <CashFlowItem
                    label="Net Monthly Cash Flow"
                    amount={results.netMonthlyCashFlow}
                    type={results.netMonthlyCashFlow >= 0 ? "income" : "expense"}
                    isTotal
                  />
                </div>
              </div>

              {/* Annual Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Annual Investment Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Income & Cash Flow</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gross Annual Rent</span>
                        <span className="font-medium">${results.grossAnnualRent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Effective Annual Rent</span>
                        <span className="font-medium">${results.effectiveAnnualRent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Net Operating Income</span>
                        <span className="font-medium">${results.noi.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-900 font-medium">Annual Cash Flow</span>
                        <span className={`font-bold ${results.netAnnualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${results.netAnnualCashFlow.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Investment Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Cash Invested</span>
                        <span className="font-medium">${results.totalCashInvested.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Appreciation</span>
                        <span className="font-medium">${(inputs.purchasePrice * inputs.appreciation / 100).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Annual Return</span>
                        <span className="font-medium">${(results.netAnnualCashFlow + inputs.purchasePrice * inputs.appreciation / 100).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-900 font-medium">ROI Percentage</span>
                        <span className="font-bold text-blue-600">{results.totalReturnPercent.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Investment Analysis */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Investment Analysis</h3>
                <div className="space-y-4">
                  <AnalysisItem
                    metric="Cap Rate"
                    value={results.capRate.toFixed(2)}
                    analysis={getCapRateAnalysis(results.capRate)}
                  />
                  <AnalysisItem
                    metric="Cash-on-Cash Return"
                    value={results.cashOnCashReturn.toFixed(2)}
                    analysis={getCashOnCashAnalysis(results.cashOnCashReturn)}
                  />
                  <AnalysisItem
                    metric="Monthly Cash Flow"
                    value={results.netMonthlyCashFlow >= 0 ? `+${results.netMonthlyCashFlow.toFixed(0)}` : `-${Math.abs(results.netMonthlyCashFlow).toFixed(0)}`}
                    analysis={getCashFlowAnalysis(results.netMonthlyCashFlow)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const InputField = ({ label, value, onChange, prefix, suffix, type = "text", step }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          step={step}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            prefix ? 'pl-8' : ''
          } ${suffix ? 'pr-16' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

const MetricCard = ({ title, value, description, color, icon }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    red: 'bg-red-50 border-red-200 text-red-600',
  }

  return (
    <div className={`rounded-lg border-2 p-4 ${colorClasses[color]}`}>
      <div className="flex items-center space-x-3 mb-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-80">{description}</div>
    </div>
  )
}

const CashFlowItem = ({ label, amount, type, isSubtotal, isTotal }) => {
  const getColorClass = () => {
    if (isTotal) return amount >= 0 ? 'text-green-600' : 'text-red-600'
    if (isSubtotal) return 'text-blue-600'
    return type === 'income' ? 'text-green-600' : 'text-red-600'
  }

  const getFontClass = () => {
    if (isTotal) return 'font-bold text-lg'
    if (isSubtotal) return 'font-semibold'
    return 'font-medium'
  }

  return (
    <div className={`flex justify-between items-center ${isTotal ? 'border-t-2 pt-3 mt-3' : ''}`}>
      <span className={`text-gray-700 ${getFontClass()}`}>{label}</span>
      <span className={`${getColorClass()} ${getFontClass()}`}>
        ${Math.abs(amount).toLocaleString()}
      </span>
    </div>
  )
}

const AnalysisItem = ({ metric, value, analysis }) => {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-32">
        <div className="font-medium text-gray-900">{metric}</div>
        <div className="text-lg font-bold text-blue-600">{value}%</div>
      </div>
      <div className="flex-1">
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${
          analysis.status === 'good' ? 'bg-green-100 text-green-800' :
          analysis.status === 'fair' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {analysis.status.toUpperCase()}
        </div>
        <p className="text-sm text-gray-600">{analysis.description}</p>
      </div>
    </div>
  )
}

// Analysis helper functions
const getCapRateAnalysis = (capRate) => {
  if (capRate >= 8) {
    return {
      status: 'good',
      description: 'Excellent cap rate indicating strong income potential relative to property value. This suggests good cash flow and return on investment.'
    }
  } else if (capRate >= 6) {
    return {
      status: 'fair',
      description: 'Decent cap rate that is acceptable for many markets. Consider comparing with local averages and factor in appreciation potential.'
    }
  } else {
    return {
      status: 'poor',
      description: 'Low cap rate may indicate overpriced property or low rental income. Consider if appreciation potential justifies the investment.'
    }
  }
}

const getCashOnCashAnalysis = (cashOnCash) => {
  if (cashOnCash >= 10) {
    return {
      status: 'good',
      description: 'Excellent cash-on-cash return that significantly outperforms most alternative investments. Strong cash flow relative to initial investment.'
    }
  } else if (cashOnCash >= 6) {
    return {
      status: 'fair',
      description: 'Reasonable return that may be acceptable depending on market conditions and investment goals. Compare with other opportunities.'
    }
  } else {
    return {
      status: 'poor',
      description: 'Low return on invested cash. Consider if appreciation, tax benefits, or other factors make this investment worthwhile.'
    }
  }
}

const getCashFlowAnalysis = (cashFlow) => {
  if (cashFlow >= 200) {
    return {
      status: 'good',
      description: 'Strong positive cash flow provides good monthly income and buffer for unexpected expenses or vacancy periods.'
    }
  } else if (cashFlow >= 0) {
    return {
      status: 'fair',
      description: 'Break-even or minimal positive cash flow. Property should cover expenses but provides limited monthly income.'
    }
  } else {
    return {
      status: 'poor',
      description: 'Negative cash flow means you\'ll need to contribute monthly to cover expenses. Ensure appreciation potential justifies the ongoing cost.'
    }
  }
}

export default CalculatorPage
