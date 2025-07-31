# ===== BACKEND/APP/SCRIPTS/SEED_DATA.PY =====
import pandas as pd
import numpy as np
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from ..core.config import settings
from ..models.database import County, PriceHistory, EconomicIndicator
import os
from datetime import datetime, timedelta

def create_seeded_csvs():
    """Create seeded CSV files for offline demo"""
    
    # California counties data
    ca_counties_data = [
        {
            'county': 'Los Angeles County',
            'region': 'Southern California',
            'population': 10040000,
            'median_income': 68093,
            'median_home_price': 849000,
            'price_per_sqft': 650,
            'rental_yield': 4.2,
            'price_growth_1yr': 3.8,
            'price_growth_5yr': 42.1,
            'inventory_months': 3.2,
            'days_on_market': 28
        },
        {
            'county': 'San Diego County',
            'region': 'Southern California',
            'population': 3338330,
            'median_income': 79673,
            'median_home_price': 825000,
            'price_per_sqft': 620,
            'rental_yield': 4.5,
            'price_growth_1yr': 4.2,
            'price_growth_5yr': 38.7,
            'inventory_months': 2.8,
            'days_on_market': 25
        },
        {
            'county': 'Orange County',
            'region': 'Southern California',
            'population': 3186989,
            'median_income': 94441,
            'median_home_price': 1150000,
            'price_per_sqft': 750,
            'rental_yield': 3.8,
            'price_growth_1yr': 2.9,
            'price_growth_5yr': 35.2,
            'inventory_months': 2.5,
            'days_on_market': 22
        },
        {
            'county': 'Riverside County',
            'region': 'Inland Empire',
            'population': 2458395,
            'median_income': 64600,
            'median_home_price': 625000,
            'price_per_sqft': 380,
            'rental_yield': 6.8,
            'price_growth_1yr': 5.1,
            'price_growth_5yr': 48.3,
            'inventory_months': 4.2,
            'days_on_market': 32
        },
        {
            'county': 'San Bernardino County',
            'region': 'Inland Empire',
            'population': 2180085,
            'median_income': 58270,
            'median_home_price': 520000,
            'price_per_sqft': 320,
            'rental_yield': 7.2,
            'price_growth_1yr': 5.8,
            'price_growth_5yr': 52.1,
            'inventory_months': 4.8,
            'days_on_market': 35
        },
        {
            'county': 'Santa Clara County',
            'region': 'Bay Area',
            'population': 1936259,
            'median_income': 130890,
            'median_home_price': 1650000,
            'price_per_sqft': 950,
            'rental_yield': 3.2,
            'price_growth_1yr': 1.8,
            'price_growth_5yr': 28.4,
            'inventory_months': 2.1,
            'days_on_market': 18
        },
        {
            'county': 'Alameda County',
            'region': 'Bay Area',
            'population': 1682353,
            'median_income': 112017,
            'median_home_price': 1425000,
            'price_per_sqft': 850,
            'rental_yield': 3.5,
            'price_growth_1yr': 2.1,
            'price_growth_5yr': 31.2,
            'inventory_months': 2.3,
            'days_on_market': 20
        },
        {
            'county': 'Sacramento County',
            'region': 'Central Valley',
            'population': 1585055,
            'median_income': 68866,
            'median_home_price': 575000,
            'price_per_sqft': 420,
            'rental_yield': 6.1,
            'price_growth_1yr': 6.2,
            'price_growth_5yr': 45.8,
            'inventory_months': 3.8,
            'days_on_market': 28
        },
        {
            'county': 'Contra Costa County',
            'region': 'Bay Area',
            'population': 1165927,
            'median_income': 100296,
            'median_home_price': 950000,
            'price_per_sqft': 680,
            'rental_yield': 4.1,
            'price_growth_1yr': 2.8,
            'price_growth_5yr': 33.7,
            'inventory_months': 2.9,
            'days_on_market': 24
        },
        {
            'county': 'Fresno County',
            'region': 'Central Valley',
            'population': 1008654,
            'median_income': 55194,
            'median_home_price': 420000,
            'price_per_sqft': 280,
            'rental_yield': 8.1,
            'price_growth_1yr': 7.8,
            'price_growth_5yr': 58.2,
            'inventory_months': 5.2,
            'days_on_market': 38
        }
    ]
    
    # Save counties CSV
    counties_df = pd.DataFrame(ca_counties_data)
    os.makedirs('backend/data', exist_ok=True)
    counties_df.to_csv('backend/data/california_counties.csv', index=False)
    
    # Generate historical price data
    historical_data = []
    base_date = datetime.now() - timedelta(days=5*365)  # 5 years ago
    
    for county in ca_counties_data:
        county_name = county['county']
        base_price = county['median_home_price']
        
        for i in range(60):  # Monthly data for 5 years
            date = base_date + timedelta(days=i*30)
            
            # Simulate price evolution with trend and noise
            trend_factor = 1 + (county['price_growth_5yr'] / 100) * (i / 60)
            seasonal_factor = 1 + 0.02 * np.sin(2 * np.pi * i / 12)  # Annual seasonality
            noise_factor = 1 + np.random.normal(0, 0.02)
            
            price = base_price * trend_factor * seasonal_factor * noise_factor / 1.4  # Adjust for current vs historical
            
            historical_data.append({
                'county': county_name,
                'date': date.strftime('%Y-%m-%d'),
                'median_price': round(price),
                'price_per_sqft': round(price / (base_price / county['price_per_sqft'])),
                'sales_volume': max(50, int(np.random.normal(200, 50))),
                'inventory': max(100, int(np.random.normal(500, 150)))
            })
    
    historical_df = pd.DataFrame(historical_data)
    historical_df.to_csv('backend/data/historical_prices.csv', index=False)
    
    # Generate economic indicators
    economic_data = []
    for county in ca_counties_data:
        county_name = county['county']
        
        for i in range(60):
            date = base_date + timedelta(days=i*30)
            
            # Base unemployment rate with variation
            base_unemployment = 4.5 if 'Bay Area' in county['region'] else 6.2
            unemployment = max(2.0, base_unemployment + np.random.normal(0, 1.5))
            
            economic_data.append({
                'county': county_name,
                'date': date.strftime('%Y-%m-%d'),
                'unemployment_rate': round(unemployment, 1),
                'employment_growth': round(np.random.normal(2.1, 1.2), 1),
                'population_growth': round(np.random.normal(1.5, 0.8), 1),
                'new_construction': max(0, int(np.random.normal(300, 150))),
                'mortgage_rate': round(max(3.0, np.random.normal(5.5, 1.5)), 2)
            })
    
    economic_df = pd.DataFrame(economic_data)
    economic_df.to_csv('backend/data/economic_indicators.csv', index=False)
    
    # Generate rental data
    rental_data = []
    for county in ca_counties_data:
        rental_data.append({
            'county': county['county'],
            'median_rent_1br': round(county['median_home_price'] * county['rental_yield'] / 100 / 12 * 0.7),
            'median_rent_2br': round(county['median_home_price'] * county['rental_yield'] / 100 / 12 * 0.9),
            'median_rent_3br': round(county['median_home_price'] * county['rental_yield'] / 100 / 12 * 1.1),
            'vacancy_rate': round(np.random.normal(5.5, 2.0), 1),
            'rent_growth_1yr': round(np.random.normal(4.2, 2.5), 1),
            'cap_rate': round(county['rental_yield'] * 0.8, 1)
        })
    
    rental_df = pd.DataFrame(rental_data)
    rental_df.to_csv('backend/data/rental_data.csv', index=False)
    
    print("Seeded CSV files created successfully!")

def seed_database():
    """Seed database with initial data"""
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create seeded CSVs first
    create_seeded_csvs()
    
    # Load data into database
    db = SessionLocal()
    
    try:
        # Load counties
        counties_df = pd.read_csv('backend/data/california_counties.csv')
        for _, row in counties_df.iterrows():
            county = County(
                name=row['county'],
                region=row['region'],
                population=row['population'],
                median_income=row['median_income'],
                median_home_price=row['median_home_price'],
                price_per_sqft=row['price_per_sqft'],
                rental_yield=row['rental_yield'],
                price_growth_1yr=row['price_growth_1yr'],
                price_growth_5yr=row['price_growth_5yr'],
                inventory_months=row['inventory_months'],
                days_on_market=row['days_on_market']
            )
            db.add(county)
        
        db.commit()
        print("Database seeded successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
