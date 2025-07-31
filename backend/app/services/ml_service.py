# ===== BACKEND/APP/SERVICES/ML_SERVICE.PY =====
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import lightgbm as lgb
import shap
import joblib
import os
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Any
import logging

logger = logging.getLogger(__name__)

class MLService:
    def __init__(self):
        self.price_model = None
        self.investment_model = None
        self.scaler = StandardScaler()
        self.shap_explainer = None
        self.feature_names = []
        self.load_models()
        
    def load_models(self):
        """Load pre-trained models or train new ones"""
        try:
            model_path = "app/models/trained_models/"
            if os.path.exists(f"{model_path}price_model.joblib"):
                self.price_model = joblib.load(f"{model_path}price_model.joblib")
                self.investment_model = joblib.load(f"{model_path}investment_model.joblib")
                self.scaler = joblib.load(f"{model_path}scaler.joblib")
                logger.info("Loaded pre-trained models")
            else:
                self.train_models()
        except Exception as e:
            logger.error(f"Error loading models: {e}")
            self.train_models()
    
    def train_models(self):
        """Train ML models with seeded data"""
        logger.info("Training new ML models...")
        
        # Generate synthetic training data
        train_data = self._generate_training_data()
        
        # Prepare features for price prediction
        price_features = [
            'median_income', 'population_growth', 'employment_growth',
            'inventory_months', 'days_on_market', 'mortgage_rate',
            'new_construction', 'price_per_sqft_lag', 'seasonal_factor'
        ]
        
        X_price = train_data[price_features]
        y_price = train_data['price_change_12m']
        
        # Train price prediction model
        self.price_model = lgb.LGBMRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=6,
            random_state=42
        )
        self.price_model.fit(X_price, y_price)
        
        # Investment scoring features
        investment_features = [
            'price_to_rent_ratio', 'rental_yield', 'price_growth_5yr',
            'population_growth', 'employment_growth', 'inventory_months',
            'median_income', 'new_construction', 'market_volatility'
        ]
        
        X_invest = train_data[investment_features]
        y_invest = train_data['investment_score']
        
        # Train investment scoring model
        self.investment_model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.investment_model.fit(X_invest, y_invest)
        
        # Fit scaler
        self.scaler.fit(X_invest)
        
        # Initialize SHAP explainer
        self.shap_explainer = shap.TreeExplainer(self.investment_model)
        self.feature_names = investment_features
        
        # Save models
        os.makedirs("app/models/trained_models/", exist_ok=True)
        joblib.dump(self.price_model, "app/models/trained_models/price_model.joblib")
        joblib.dump(self.investment_model, "app/models/trained_models/investment_model.joblib")
        joblib.dump(self.scaler, "app/models/trained_models/scaler.joblib")
        
        logger.info("Models trained and saved successfully")
    
    def _generate_training_data(self) -> pd.DataFrame:
        """Generate synthetic training data for CA counties"""
        np.random.seed(42)
        n_samples = 1000
        
        # California county characteristics
        ca_counties = [
            "Los Angeles", "San Diego", "Orange", "Riverside", "San Bernardino",
            "Santa Clara", "Alameda", "Sacramento", "Contra Costa", "Fresno",
            "Kern", "San Francisco", "Ventura", "San Joaquin", "Stanislaus",
            "Sonoma", "Tulare", "Santa Barbara", "Solano", "Monterey"
        ]
        
        data = []
        for i in range(n_samples):
            county = np.random.choice(ca_counties)
            
            # Base characteristics by county type
            if county in ["San Francisco", "Santa Clara", "San Mateo"]:
                # High-cost Bay Area
                base_price = np.random.normal(1200000, 200000)
                base_income = np.random.normal(120000, 20000)
                base_rent_yield = np.random.normal(3.5, 0.5)
            elif county in ["Los Angeles", "Orange", "San Diego"]:
                # Major metro areas
                base_price = np.random.normal(800000, 150000)
                base_income = np.random.normal(80000, 15000)
                base_rent_yield = np.random.normal(4.5, 0.8)
            else:
                # Other California areas
                base_price = np.random.normal(500000, 100000)
                base_income = np.random.normal(60000, 12000)
                base_rent_yield = np.random.normal(6.0, 1.0)
            
            # Generate correlated features
            median_income = max(base_income, 30000)
            population_growth = np.random.normal(1.2, 0.8)
            employment_growth = np.random.normal(2.1, 1.2)
            inventory_months = np.random.normal(3.5, 1.5)
            days_on_market = max(int(np.random.normal(25, 10)), 5)
            mortgage_rate = np.random.normal(6.8, 0.5)
            new_construction = max(int(np.random.normal(500, 200)), 0)
            price_per_sqft_lag = base_price / np.random.normal(2000, 300)
            seasonal_factor = np.sin(np.random.uniform(0, 2*np.pi))
            
            # Calculate derived metrics
            rental_yield = max(base_rent_yield, 1.0)
            price_to_rent_ratio = (base_price / 12) / (base_price * rental_yield / 100 / 12)
            price_growth_5yr = np.random.normal(25, 15)
            market_volatility = np.random.normal(0.15, 0.05)
            
            # Generate target variables with realistic relationships
            price_change_12m = (
                0.3 * employment_growth +
                0.2 * population_growth +
                -0.4 * inventory_months +
                -0.2 * mortgage_rate +
                0.1 * seasonal_factor +
                np.random.normal(0, 2)
            )
            
            investment_score = min(100, max(0, 
                50 +
                rental_yield * 5 +
                employment_growth * 3 +
                population_growth * 2 +
                -abs(price_to_rent_ratio - 25) * 0.5 +
                price_growth_5yr * 0.3 +
                -market_volatility * 20 +
                np.random.normal(0, 5)
            ))
            
            data.append({
                'county': county,
                'median_income': median_income,
                'population_growth': population_growth,
                'employment_growth': employment_growth,
                'inventory_months': max(inventory_months, 0.5),
                'days_on_market': days_on_market,
                'mortgage_rate': max(mortgage_rate, 3.0),
                'new_construction': new_construction,
                'price_per_sqft_lag': price_per_sqft_lag,
                'seasonal_factor': seasonal_factor,
                'rental_yield': rental_yield,
                'price_to_rent_ratio': price_to_rent_ratio,
                'price_growth_5yr': price_growth_5yr,
                'market_volatility': market_volatility,
                'price_change_12m': price_change_12m,
                'investment_score': investment_score
            })
        
        return pd.DataFrame(data)
    
    def predict_price_forecast(self, address: str) -> Dict[str, Any]:
        """Generate 12-month price forecast for given address"""
        # Simulate address lookup and feature extraction
        features = self._extract_features_from_address(address)
        
        # Generate base prediction
        base_prediction = self.price_model.predict([features])[0]
        
        # Generate confidence intervals
        predictions = []
        for _ in range(100):  # Monte Carlo simulation
            noise = np.random.normal(0, 2)  # Add uncertainty
            pred = base_prediction + noise
            predictions.append(pred)
        
        predictions = np.array(predictions)
        lower_bound = np.percentile(predictions, 10)  # 80% CI
        upper_bound = np.percentile(predictions, 90)
        
        # Generate time series data
        chart_data = self._generate_forecast_chart_data(
            base_prediction, lower_bound, upper_bound, features
        )
        
        # Extract location info
        county, current_price = self._get_location_info(address)
        
        return {
            'address': address,
            'county': county,
            'current_value': current_price,
            'predicted_value': current_price * (1 + base_prediction / 100),
            'recent_change': np.random.normal(0.5, 2),
            'predicted_change': base_prediction,
            'market_type': self._determine_market_type(features),
            'confidence': max(70, min(95, int(85 + np.random.normal(0, 5)))),
            'volatility': self._assess_volatility(features),
            'seasonal_trend': self._assess_seasonal_trend(),
            'momentum': self._assess_momentum(features),
            'chart_data': chart_data,
            'risk_factors': self._generate_risk_factors(features)
        }
    
    def predict_investment_score(self, address: str) -> Dict[str, Any]:
        """Generate investment analysis for given address"""
        features = self._extract_investment_features(address)
        
        # Predict investment score
        score = self.investment_model.predict([features])[0]
        score = max(0, min(100, int(score)))
        
        # Generate SHAP explanations
        shap_values = self.shap_explainer.shap_values([features])[0]
        shap_explanations = [
            {
                'feature': self._format_feature_name(feat),
                'impact': float(shap_val)
            }
            for feat, shap_val in zip(self.feature_names, shap_values)
        ]
        
        # Sort by absolute impact
        shap_explanations.sort(key=lambda x: abs(x['impact']), reverse=True)
        
        # Generate detailed metrics
        metrics = self._generate_investment_metrics(features)
        
        return {
            'address': address,
            'investment_score': score,
            'risk_level': self._assess_risk_level(score, features),
            'expected_return': self._calculate_expected_return(features),
            'liquidity_score': self._calculate_liquidity_score(features),
            'recommendation': self._generate_recommendation(score),
            'recommendation_reason': self._generate_recommendation_reason(score, features),
            'key_highlights': self._generate_key_highlights(features, score),
            'shap_explanations': shap_explanations[:8],  # Top 8 factors
            'metrics': metrics
        }
    
    def get_top_investment_areas(self) -> List[Dict[str, Any]]:
        """Get top 5 investment areas in California"""
        # Generate data for top CA counties
        top_counties = [
            {
                'id': 1,
                'county': 'Riverside County',
                'region': 'Inland Empire',
                'overall_score': 92,
                'price_growth': 8.5,
                'rental_yield': 7.2,
                'population_growth': 2.8,
                'median_price': 650000,
                'highlights': ['Strong population growth', 'Affordable entry point', 'High rental demand'],
                'description': 'Riverside County offers excellent growth potential with strong job creation in logistics and manufacturing, driving consistent population growth and rental demand.'
            },
            {
                'id': 2,
                'county': 'Sacramento County',
                'region': 'Central Valley',
                'overall_score': 89,
                'price_growth': 7.8,
                'rental_yield': 6.8,
                'population_growth': 2.1,
                'median_price': 580000,
                'highlights': ['State capital benefits', 'Tech spillover growth', 'Strong rental market'],
                'description': 'Sacramento benefits from government stability and tech industry expansion, creating a balanced market with steady appreciation and strong rental yields.'
            },
            {
                'id': 3,
                'county': 'Fresno County',
                'region': 'Central Valley',
                'overall_score': 85,
                'price_growth': 9.2,
                'rental_yield': 8.1,
                'population_growth': 1.9,
                'median_price': 420000,
                'highlights': ['High cash flow potential', 'Agricultural stability', 'Low entry costs'],
                'description': 'Fresno offers exceptional cash flow opportunities with strong agricultural economy and growing logistics sector driving consistent demand.'
            },
            {
                'id': 4,
                'county': 'San Joaquin County',
                'region': 'Central Valley',
                'overall_score': 82,
                'price_growth': 7.1,
                'rental_yield': 6.9,
                'population_growth': 1.7,
                'median_price': 525000,
                'highlights': ['Bay Area commuter market', 'Industrial growth', 'Value appreciation'],
                'description': 'San Joaquin County benefits from Bay Area proximity while maintaining affordability, with strong industrial development supporting local economy.'
            },
            {
                'id': 5,
                'county': 'Kern County',
                'region': 'Central Valley',
                'overall_score': 78,
                'price_growth': 6.8,
                'rental_yield': 7.5,
                'population_growth': 1.4,
                'median_price': 385000,
                'highlights': ['Energy sector growth', 'Affordable housing', 'Strong yields'],
                'description': 'Kern County offers strong rental yields supported by energy sector employment and agricultural stability, with significant upside potential.'
            }
        ]
        
        return top_counties
    
    def _extract_features_from_address(self, address: str) -> List[float]:
        """Extract features for price prediction from address"""
        # Simulate feature extraction based on address
        # In real implementation, this would geocode and lookup actual data
        
        # Generate realistic features based on address patterns
        if any(city in address.lower() for city in ['beverly hills', '90210', 'malibu']):
            # High-end area
            return [120000, 0.8, 1.5, 2.0, 15, 6.5, 200, 800, 0.2]
        elif any(city in address.lower() for city in ['downtown', 'dtla', 'hollywood']):
            # Urban area
            return [80000, 1.2, 2.1, 3.5, 25, 6.8, 500, 650, -0.1]
        else:
            # Suburban/average area
            return [70000, 1.5, 2.5, 4.0, 30, 7.0, 300, 520, 0.0]
    
    def _extract_investment_features(self, address: str) -> List[float]:
        """Extract features for investment analysis"""
        # Generate realistic investment features
        if any(city in address.lower() for city in ['beverly hills', '90210', 'malibu']):
            return [35, 3.2, 15, 0.8, 1.5, 2.0, 120000, 200, 0.12]
        elif any(city in address.lower() for city in ['riverside', 'inland empire']):
            return [22, 6.8, 25, 2.8, 3.5, 4.5, 65000, 800, 0.18]
        else:
            return [28, 5.5, 20, 1.8, 2.2, 3.5, 75000, 450, 0.15]
    
    def _generate_forecast_chart_data(self, base_pred: float, lower: float, upper: float, features: List[float]) -> List[Dict]:
        """Generate chart data for forecast visualization"""
        data = []
        current_price = 650000  # Base price
        
        # Historical data (6 months)
        for i in range(-6, 0):
            date = (datetime.now() + timedelta(days=i*30)).strftime('%Y-%m-%d')
            price_variation = np.random.normal(0, 2)
            historical_price = current_price * (1 + price_variation/100)
            
            data.append({
                'date': date,
                'historical_price': round(historical_price),
                'predicted_price': None,
                'upper_bound': None,
                'lower_bound': None
            })
        
        # Forecast data (12 months)
        for i in range(0, 12):
            date = (datetime.now() + timedelta(days=i*30)).strftime('%Y-%m-%d')
            
            # Progressive change over time
            progress = i / 12.0
            predicted_change = base_pred * progress
            predicted_price = current_price * (1 + predicted_change/100)
            
            # Widening confidence intervals
            ci_width = (upper - lower) * (0.5 + progress * 0.5)
            upper_bound = predicted_price + ci_width * current_price / 100
            lower_bound = predicted_price - ci_width * current_price / 100
            
            data.append({
                'date': date,
                'historical_price': None,
                'predicted_price': round(predicted_price),
                'upper_bound': round(upper_bound),
                'lower_bound': round(lower_bound)
            })
        
        return data
    
    def _get_location_info(self, address: str) -> Tuple[str, float]:
        """Extract county and current price from address"""
        # Simulate location lookup
        if 'los angeles' in address.lower() or '90210' in address:
            return "Los Angeles County", 850000
        elif 'san diego' in address.lower():
            return "San Diego County", 720000
        elif 'orange' in address.lower():
            return "Orange County", 950000
        elif 'riverside' in address.lower():
            return "Riverside County", 520000
        else:
            return "Los Angeles County", 650000  # Default
    
    def _determine_market_type(self, features: List[float]) -> str:
        """Determine market type based on features"""
        if features[0] > 100000:  # High median income
            return "Luxury Market"
        elif features[4] < 20:  # Low days on market
            return "Seller's Market"
        elif features[3] > 5:  # High inventory
            return "Buyer's Market"
        else:
            return "Balanced Market"
    
    def _assess_volatility(self, features: List[float]) -> str:
        if features[3] > 5:  # High inventory
            return "High"
        elif features[4] < 20:  # Low days on market
            return "Low"
        else:
            return "Moderate"
    
    def _assess_seasonal_trend(self) -> str:
        month = datetime.now().month
        if month in [3, 4, 5, 6]:
            return "Spring buying season"
        elif month in [7, 8, 9]:
            return "Summer peak activity"
        elif month in [10, 11]:
            return "Fall market cooling"
        else:
            return "Winter slow season"
    
    def _assess_momentum(self, features: List[float]) -> str:
        if features[1] > 2:  # High population growth
            return "Strong upward"
        elif features[2] > 2.5:  # High employment growth
            return "Positive"
        elif features[3] > 5:  # High inventory
            return "Weakening"
        else:
            return "Stable"
    
    def _generate_risk_factors(self, features: List[float]) -> List[Dict[str, str]]:
        """Generate risk factors based on market conditions"""
        risks = []
        
        if features[5] > 7:  # High mortgage rates
            risks.append({
                'factor': 'Rising Interest Rates',
                'description': 'Higher mortgage rates may reduce buyer demand and affordability'
            })
        
        if features[3] > 4:  # High inventory
            risks.append({
                'factor': 'Market Oversupply',
                'description': 'Increased inventory levels could lead to price pressure'
            })
        
        if features[1] < 1:  # Low population growth
            risks.append({
                'factor': 'Demographic Trends',
                'description': 'Slow population growth may limit long-term demand'
            })
        
        # Always include at least one risk
        if not risks:
            risks.append({
                'factor': 'Market Uncertainty',
                'description': 'General economic conditions may impact real estate values'
            })
        
        return risks[:3]  # Limit to 3 risks
    
    def _generate_investment_metrics(self, features: List[float]) -> Dict[str, Any]:
        """Generate detailed investment metrics"""
        return {
            'price_to_rent_ratio': round(features[0], 1),
            'price_appreciation_5yr': round(features[2], 1),
            'rental_yield': round(features[1], 1),
            'market_cap_rate': round(features[1] * 0.8, 1),
            'days_on_market': int(features[4] * 10),
            'inventory_level': 'Low' if features[5] < 3 else 'High' if features[5] > 5 else 'Balanced',
            'population_growth': round(features[3], 1),
            'employment_growth': round(features[4], 1)
        }
    
    def _assess_risk_level(self, score: int, features: List[float]) -> str:
        if score >= 80:
            return "Low"
        elif score >= 60:
            return "Moderate"
        else:
            return "High"
    
    def _calculate_expected_return(self, features: List[float]) -> float:
        return round(features[1] + features[2] * 0.2, 1)
    
    def _calculate_liquidity_score(self, features: List[float]) -> int:
        # Based on days on market and inventory
        base_score = 10 - (features[4] * 10 / 30)  # Normalize days on market
        return max(1, min(10, int(base_score)))
    
    def _generate_recommendation(self, score: int) -> str:
        if score >= 85:
            return "Strong Buy"
        elif score >= 70:
            return "Buy"
        elif score >= 55:
            return "Hold"
        else:
            return "Avoid"
    
    def _generate_recommendation_reason(self, score: int, features: List[float]) -> str:
        if score >= 85:
            return "Excellent investment opportunity with strong fundamentals, high rental yields, and positive market trends."
        elif score >= 70:
            return "Good investment potential with favorable market conditions and solid return prospects."
        elif score >= 55:
            return "Moderate investment with mixed signals. Consider timing and personal investment goals."
        else:
            return "Investment risks outweigh potential returns based on current market conditions."
    
    def _generate_key_highlights(self, features: List[float], score: int) -> List[str]:
        highlights = []
        
        if features[1] > 6:  # High rental yield
            highlights.append(f"Strong rental yield of {features[1]:.1f}%")
        
        if features[2] > 20:  # High price appreciation
            highlights.append(f"Excellent 5-year price growth of {features[2]:.1f}%")
        
        if features[3] > 2:  # High population growth
            highlights.append(f"Strong population growth of {features[3]:.1f}%")
        
        if features[0] < 25:  # Good price-to-rent ratio
            highlights.append("Favorable price-to-rent ratio")
        
        if score >= 80:
            highlights.append("Top-tier investment score")
        
        # Ensure at least 2 highlights
        if len(highlights) < 2:
            highlights.extend([
                "Positive market fundamentals",
                "Stable investment environment"
            ])
        
        return highlights[:4]  # Limit to 4 highlights
    
    def _format_feature_name(self, feature_name: str) -> str:
        """Format feature names for display"""
        name_mapping = {
            'price_to_rent_ratio': 'Price-to-Rent Ratio',
            'rental_yield': 'Rental Yield',
            'price_growth_5yr': '5-Year Price Growth',
            'population_growth': 'Population Growth',
            'employment_growth': 'Employment Growth',
            'inventory_months': 'Market Inventory',
            'median_income': 'Median Income',
            'new_construction': 'New Construction',
            'market_volatility': 'Market Volatility'
        }
        return name_mapping.get(feature_name, feature_name.replace('_', ' ').title())
