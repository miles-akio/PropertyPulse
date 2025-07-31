# ===== BACKEND/APP/CORE/CONFIG.PY =====
from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "Real Estate Forecasting API"
    VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # Server settings
    HOST: str = os.getenv("API_HOST", "0.0.0.0")
    PORT: int = int(os.getenv("API_PORT", "8000"))
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://realestate_user:secure_password@localhost:5432/realestate_db"
    )
    
    # CORS
    ALLOWED_HOSTS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://real-estate-frontend.onrender.com",
        "*"  # Remove in production
    ]
    
    # ML Model settings
    MODEL_PATH: str = "app/models/trained_models/"
    
    class Config:
        env_file = ".env"

settings = Settings()
