# ===== BACKEND/APP/API/V1/ENDPOINTS/AREAS.PY =====
from fastapi import APIRouter, HTTPException
from ...models.schemas import TopAreasResponse
from ...services.ml_service import MLService
from datetime import datetime

router = APIRouter()
ml_service = MLService()

@router.get("/top", response_model=TopAreasResponse)
async def get_top_areas():
    """
    Get top 5 investment areas in California
    """
    try:
        areas_data = ml_service.get_top_investment_areas()
        return TopAreasResponse(
            areas=areas_data,
            last_updated=datetime.now()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading top areas: {str(e)}")
