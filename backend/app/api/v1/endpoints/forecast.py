# ===== BACKEND/APP/API/V1/ENDPOINTS/FORECAST.PY =====
from fastapi import APIRouter, Depends, HTTPException
from ...models.schemas import ForecastResponse
from ...services.ml_service import MLService
from typing import str

router = APIRouter()
ml_service = MLService()

@router.get("/{address}", response_model=ForecastResponse)
async def get_price_forecast(address: str):
    """
    Get 12-month price forecast for a given address or ZIP code
    """
    try:
        if not address or len(address.strip()) < 3:
            raise HTTPException(status_code=400, detail="Address must be at least 3 characters")
        
        forecast_data = ml_service.predict_price_forecast(address)
        return ForecastResponse(**forecast_data)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating forecast: {str(e)}")
