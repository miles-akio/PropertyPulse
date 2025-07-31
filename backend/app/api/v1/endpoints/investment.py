# ===== BACKEND/APP/API/V1/ENDPOINTS/INVESTMENT.PY =====
from fastapi import APIRouter, Depends, HTTPException
from ...models.schemas import InvestmentRequest, InvestmentResponse
from ...services.ml_service import MLService

router = APIRouter()
ml_service = MLService()

@router.post("/score", response_model=InvestmentResponse)
async def get_investment_score(request: InvestmentRequest):
    """
    Get investment analysis and score for a given address
    """
    try:
        if not request.address or len(request.address.strip()) < 3:
            raise HTTPException(status_code=400, detail="Address must be at least 3 characters")
        
        analysis_data = ml_service.predict_investment_score(request.address)
        return InvestmentResponse(**analysis_data)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing investment: {str(e)}")
