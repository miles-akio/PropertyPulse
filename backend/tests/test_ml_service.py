# ===== BACKEND/TESTS/TEST_ML_SERVICE.PY =====
import pytest
from app.services.ml_service import MLService

@pytest.fixture
def ml_service():
    return MLService()

def test_ml_service_initialization(ml_service):
    assert ml_service.price_model is not None
    assert ml_service.investment_model is not None
    assert ml_service.scaler is not None

def test_price_forecast_generation(ml_service):
    forecast = ml_service.predict_price_forecast("90210")
    
    assert "address" in forecast
    assert "current_value" in forecast
    assert "predicted_value" in forecast
    assert "chart_data" in forecast
    assert isinstance(forecast["chart_data"], list)
    assert len(forecast["chart_data"]) > 0

def test_investment_score_generation(ml_service):
    analysis = ml_service.predict_investment_score("Beverly Hills, CA")
    
    assert "investment_score" in analysis
    assert "shap_explanations" in analysis
    assert "metrics" in analysis
    assert 0 <= analysis["investment_score"] <= 100
    assert isinstance(analysis["shap_explanations"], list)

def test_top_areas_generation(ml_service):
    areas = ml_service.get_top_investment_areas()
    
    assert isinstance(areas, list)
    assert len(areas) == 5
    assert all("county" in area for area in areas)
    assert all("overall_score" in area for area in areas)

def test_feature_extraction(ml_service):
    features = ml_service._extract_features_from_address("90210")
    assert isinstance(features, list)
    assert len(features) > 0
    assert all(isinstance(f, (int, float)) for f in features)

def test_chart_data_generation(ml_service):
    chart_data = ml_service._generate_forecast_chart_data(5.0, 3.0, 7.0, [70000, 1.5, 2.5, 4.0, 30, 7.0, 300, 520, 0.0])
    
    assert isinstance(chart_data, list)
    assert len(chart_data) > 0
    assert all("date" in point for point in chart_data)
