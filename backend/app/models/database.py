# ===== BACKEND/APP/MODELS/DATABASE.PY =====
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.sql import func
from ..core.database import Base

class County(Base):
    __tablename__ = "counties"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    state = Column(String, default="CA")
    region = Column(String)
    population = Column(Integer)
    median_income = Column(Float)
    median_home_price = Column(Float)
    price_per_sqft = Column(Float)
    rental_yield = Column(Float)
    price_growth_1yr = Column(Float)
    price_growth_5yr = Column(Float)
    inventory_months = Column(Float)
    days_on_market = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class PriceHistory(Base):
    __tablename__ = "price_history"
    
    id = Column(Integer, primary_key=True, index=True)
    county_id = Column(Integer, index=True)
    zip_code = Column(String, index=True)
    date = Column(DateTime)
    median_price = Column(Float)
    price_per_sqft = Column(Float)
    sales_volume = Column(Integer)
    inventory = Column(Integer)

class EconomicIndicator(Base):
    __tablename__ = "economic_indicators"
    
    id = Column(Integer, primary_key=True, index=True)
    county_id = Column(Integer, index=True)
    date = Column(DateTime)
    unemployment_rate = Column(Float)
    employment_growth = Column(Float)
    population_growth = Column(Float)
    new_construction = Column(Integer)
    mortgage_rate = Column(Float)
