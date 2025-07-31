# ===== BACKEND/APP/API/V1/ROUTER.PY =====
from fastapi import APIRouter
from .endpoints import forecast, investment, areas, rental

api_router = APIRouter()

api_router.include_router(forecast.router, prefix="/forecast", tags=["forecasting"])
api_router.include_router(investment.router, prefix="/investment", tags=["investment"])
api_router.include_router(areas.router, prefix="/areas", tags=["areas"])
api_router.include_router(rental.router, prefix="/rental", tags=["rental"])

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "real-estate-api"}
