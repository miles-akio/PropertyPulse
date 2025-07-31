# ===== DATABASE/INIT.SQL =====
-- Initialize PostgreSQL database for Real Estate Forecasting Platform

-- Create counties table
CREATE TABLE IF NOT EXISTS counties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    state VARCHAR(2) DEFAULT 'CA',
    region VARCHAR(100),
    population INTEGER,
    median_income DECIMAL(12,2),
    median_home_price DECIMAL(12,2),
    price_per_sqft DECIMAL(8,2),
    rental_yield DECIMAL(5,2),
    price_growth_1yr DECIMAL(5,2),
    price_growth_5yr DECIMAL(5,2),
    inventory_months DECIMAL(4,2),
    days_on_market INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create price history table
CREATE TABLE IF NOT EXISTS price_history (
    id SERIAL PRIMARY KEY,
    county_id INTEGER REFERENCES counties(id),
    zip_code VARCHAR(10),
    date TIMESTAMP,
    median_price DECIMAL(12,2),
    price_per_sqft DECIMAL(8,2),
    sales_volume INTEGER,
    inventory INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create economic indicators table
CREATE TABLE IF NOT EXISTS economic_indicators (
    id SERIAL PRIMARY KEY,
    county_id INTEGER REFERENCES counties(id),
    date TIMESTAMP,
    unemployment_rate DECIMAL(4,2),
    employment_growth DECIMAL(5,2),
    population_growth DECIMAL(5,2),
    new_construction INTEGER,
    mortgage_rate DECIMAL(4,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_counties_name ON counties(name);
CREATE INDEX IF NOT EXISTS idx_price_history_county_date ON price_history(county_id, date);
CREATE INDEX IF NOT EXISTS idx_price_history_zip ON price_history(zip_code);
CREATE INDEX IF NOT EXISTS idx_economic_county_date ON economic_indicators(county_id, date);

-- Insert initial California counties data
INSERT INTO counties (name, region, population, median_income, median_home_price, price_per_sqft, rental_yield, price_growth_1yr, price_growth_5yr, inventory_months, days_on_market) VALUES
('Los Angeles County', 'Southern California', 10040000, 68093, 849000, 650, 4.2, 3.8, 42.1, 3.2, 28),
('San Diego County', 'Southern California', 3338330, 79673, 825000, 620, 4.5, 4.2, 38.7, 2.8, 25),
('Orange County', 'Southern California', 3186989, 94441, 1150000, 750, 3.8, 2.9, 35.2, 2.5, 22),
('Riverside County', 'Inland Empire', 2458395, 64600, 625000, 380, 6.8, 5.1, 48.3, 4.2, 32),
('San Bernardino County', 'Inland Empire', 2180085, 58270, 520000, 320, 7.2, 5.8, 52.1, 4.8, 35),
('Santa Clara County', 'Bay Area', 1936259, 130890, 1650000, 950, 3.2, 1.8, 28.4, 2.1, 18),
('Alameda County', 'Bay Area', 1682353, 112017, 1425000, 850, 3.5, 2.1, 31.2, 2.3, 20),
('Sacramento County', 'Central Valley', 1585055, 68866, 575000, 420, 6.1, 6.2, 45.8, 3.8, 28),
('Contra Costa County', 'Bay Area', 1165927, 100296, 950000, 680, 4.1, 2.8, 33.7, 2.9, 24),
('Fresno County', 'Central Valley', 1008654, 55194, 420000, 280, 8.1, 7.8, 58.2, 5.2, 38)
ON CONFLICT (name) DO NOTHING;
