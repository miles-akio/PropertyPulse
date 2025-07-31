# ===== BACKEND/TESTS/TEST_API.PY =====
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_api_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_price_forecast():
    response = client.get("/api/v1/forecast/90210")
    assert response.status_code == 200
    data = response.json()
    assert "address" in data
    assert "current_value" in data
    assert "predicted_value" in data
    assert "chart_data" in data
    assert isinstance(data["chart_data"], list)

def test_investment_analysis():
    response = client.post("/api/v1/investment/score", json={"address": "Beverly Hills, CA"})
    assert response.status_code == 200
    data = response.json()
    assert "investment_score" in data
    assert "shap_explanations" in data
    assert "metrics" in data
    assert 0 <= data["investment_score"] <= 100

def test_top_areas():
    response = client.get("/api/v1/areas/top")
    assert response.status_code == 200
    data = response.json()
    assert "areas" in data
    assert len(data["areas"]) == 5
    assert all("county" in area for area in data["areas"])

def test_rental_calculator():
    calculation_data = {
        "purchase_price": 500000,
        "down_payment_percent": 20,
        "interest_rate": 7.0,
        "loan_term_years": 30,
        "monthly_rent": 3500,
        "property_tax_percent": 1.2,
        "annual_insurance": 1200,
        "maintenance_percent": 2.0,
        "vacancy_percent": 5.0,
        "management_fee_percent": 8.0,
        "capex_percent": 1.0,
        "appreciation_percent": 3.5
    }
    
    response = client.post("/api/v1/rental/calculate", json=calculation_data)
    assert response.status_code == 200
    data = response.json()
    assert "cap_rate" in data
    assert "cash_on_cash_return" in data
    assert "monthly_cash_flow" in data
    assert isinstance(data["cap_rate"], float)

def test_invalid_address():
    response = client.get("/api/v1/forecast/ab")
    assert response.status_code == 400

def test_empty_investment_request():
    response = client.post("/api/v1/investment/score", json={"address": ""})
    assert response.status_code == 400
