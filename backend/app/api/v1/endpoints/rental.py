# ===== BACKEND/APP/API/V1/ENDPOINTS/RENTAL.PY =====
from fastapi import APIRouter, HTTPException
from ...models.schemas import RentalCalculationRequest, RentalCalculationResponse

router = APIRouter()

@router.post("/calculate", response_model=RentalCalculationResponse)
async def calculate_rental_returns(request: RentalCalculationRequest):
    """
    Calculate rental property investment returns and cap rate
    """
    try:
        # Extract values from request
        purchase_price = request.purchase_price
        down_payment_amount = purchase_price * (request.down_payment_percent / 100)
        loan_amount = purchase_price - down_payment_amount
        
        # Monthly mortgage payment calculation
        monthly_rate = request.interest_rate / 100 / 12
        num_payments = request.loan_term_years * 12
        
        if monthly_rate > 0:
            monthly_mortgage = (loan_amount * monthly_rate * (1 + monthly_rate)**num_payments) / \
                             ((1 + monthly_rate)**num_payments - 1)
        else:
            monthly_mortgage = loan_amount / num_payments
        
        # Monthly expenses
        monthly_property_tax = (purchase_price * request.property_tax_percent / 100) / 12
        monthly_insurance = request.annual_insurance / 12
        monthly_maintenance = (purchase_price * request.maintenance_percent / 100) / 12
        monthly_capex = (purchase_price * request.capex_percent / 100) / 12
        
        # Effective rental income (after vacancy)
        effective_monthly_rent = request.monthly_rent * (1 - request.vacancy_percent / 100)
        monthly_management_fee = effective_monthly_rent * (request.management_fee_percent / 100)
        
        # Net Operating Income calculation
        monthly_operating_expenses = (monthly_property_tax + monthly_insurance + 
                                    monthly_maintenance + monthly_capex + monthly_management_fee)
        monthly_noi = effective_monthly_rent - monthly_operating_expenses
        annual_noi = monthly_noi * 12
        
        # Cap rate calculation
        cap_rate = (annual_noi / purchase_price) * 100
        
        # Cash flow calculation
        monthly_cash_flow = monthly_noi - monthly_mortgage
        annual_cash_flow = monthly_cash_flow * 12
        
        # Cash-on-cash return
        closing_costs = purchase_price * 0.03  # Assume 3% closing costs
        total_cash_invested = down_payment_amount + closing_costs
        cash_on_cash_return = (annual_cash_flow / total_cash_invested) * 100
        
        # Total return including appreciation
        annual_appreciation = purchase_price * (request.appreciation_percent / 100)
        total_annual_return = annual_cash_flow + annual_appreciation
        total_return_percent = (total_annual_return / total_cash_invested) * 100
        
        return RentalCalculationResponse(
            cap_rate=round(cap_rate, 2),
            cash_on_cash_return=round(cash_on_cash_return, 2),
            monthly_cash_flow=round(monthly_cash_flow, 2),
            annual_cash_flow=round(annual_cash_flow, 2),
            total_return_percent=round(total_return_percent, 2),
            noi=round(annual_noi, 2),
            total_cash_invested=round(total_cash_invested, 2)
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating rental returns: {str(e)}")
