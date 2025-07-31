# ===== BACKEND/APP/MODELS/SCHEMAS.PY =====
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ForecastRequest(BaseModel):
    address: str = Field(..., description="Address or ZIP code to forecast")

class ChartDataPoint(BaseModel):
    date: str
    historical_price: Optional[float] = None
    predicted_price: Optional[float] = None
    upper_bound: Optional[float] = None
    lower_bound: Optional[float] = None

class RiskFactor(BaseModel):
    factor: str
    description: str

class ForecastResponse(BaseModel):
    address: str
    county: str
    current_value: float
    predicted_value: float
    recent_change: float
    predicted_change: float
    market_type: str
    confidence: int
    volatility: str
    seasonal_trend: str
    momentum: str
    chart_data: List[ChartDataPoint]
    risk_factors: List[RiskFactor]

class InvestmentMetrics(BaseModel):
    price_to_rent_ratio: float
    price_appreciation_5yr: float
    rental_yield: float
    market_cap_rate: float
    days_on_market: int
    inventory_level: str
    population_growth: float
    employment_growth: float

class InvestmentResponse(BaseModel):
    address: str
    investment_score: int
    risk_level: str
    expected_return: float
    liquidity_score: int
    recommendation: str
    recommendation_reason: str
    key_highlights: List[str]
    shap_explanations: List[ShapExplanation]
    metrics: InvestmentMetrics

class TopArea(BaseModel):
    id: int
    county: str
    region: str
    overall_score: int
    price_growth: float
    rental_yield: float
    population_growth: float
    median_price: float
    highlights: List[str]
    description: str

class TopAreasResponse(BaseModel):
    areas: List[TopArea]
    last_updated: datetime

class RentalCalculationRequest(BaseModel):
    purchase_price: float
    down_payment_percent: float
    interest_rate: float
    loan_term_years: int
    monthly_rent: float
    property_tax_percent: float
    annual_insurance: float
    maintenance_percent: float
    vacancy_percent: float
    management_fee_percent: float
    capex_percent: float
    appreciation_percent: float

class RentalCalculationResponse(BaseModel):
    cap_rate: float
    cash_on_cash_return: float
    monthly_cash_flow: float
    annual_cash_flow: float
    total_return_percent: float
    noi: float
    total_cash_invested: float
