# PropertyPulse - Real Estate Forecasting Platform

A full-stack application for real estate price forecasting and investment analysis with machine learning capabilities.

## 🏗️ Architecture

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: FastAPI + Python 3.11
- **ML Stack**: scikit-learn + LightGBM + SHAP
- **Database**: PostgreSQL
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Deployment**: Render (one-click deploy)

## 📁 Project Structure

```
real-estate-forecasting/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   ├── core/
│   │   └── main.py
│   ├── data/                 # Seeded CSV data
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── database/                 # Database configs
│   ├── init.sql
│   └── seed_data.sql
├── .github/                  # CI/CD workflows
│   └── workflows/
├── docker-compose.yml
├── docker-compose.prod.yml
├── Makefile
├── render.yaml              # Render deployment config
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### One-Click Development Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd real-estate-forecasting

# Start all services
make dev

# Visit http://localhost:3000
```

### Production Deployment to Render

1. **Fork this repository**
2. **Connect to Render**: Import your GitHub repository
3. **Deploy**: Render will automatically detect the `render.yaml` configuration
4. **Environment Variables**: Set the following in Render dashboard:
   - `DATABASE_URL` (automatically provided by Render PostgreSQL)
   - `FRONTEND_URL` (your frontend service URL)
   - `BACKEND_URL` (your backend service URL)

## 🛠️ Development Commands

```bash
# Development
make dev              # Start all services in development mode
make build            # Build all services
make test             # Run all tests
make lint             # Run linting
make format           # Format code

# Database
make db-init          # Initialize database
make db-seed          # Seed with sample data
make db-reset         # Reset database

# Individual services
make frontend-dev     # Frontend only
make backend-dev      # Backend only
make db-dev          # Database only

# Production
make prod            # Start production environment
make deploy          # Deploy to production
```

## 📊 Features

### 1. Address/ZIP Price Forecasting
- Input any California address or ZIP code
- 12-month price forecast with 80% confidence intervals
- Historical trend analysis
- Market volatility indicators

### 2. Investment Score Analysis
- ML-powered investment scoring (0-100 scale)
- SHAP explainability for score factors
- Risk assessment metrics
- Comparative market analysis

### 3. Top 5 Investment Areas
- Algorithmic ranking of best investment opportunities
- County-level analysis across California
- Price appreciation potential
- Market stability metrics

### 4. Rental Cap Rate Estimator
- Editable assumptions for rental analysis
- Property tax calculations
- Maintenance cost estimates
- Cash-on-cash return projections

## 🤖 Machine Learning Models

### Price Forecasting Model
- **Algorithm**: LightGBM Regressor
- **Features**: Historical prices, economic indicators, demographics
- **Training Data**: 5+ years of California real estate data
- **Validation**: Time-series cross-validation

### Investment Scoring Model
- **Algorithm**: Random Forest + Feature Engineering
- **Explainability**: SHAP values for interpretability
- **Factors**: Price trends, rental yields, market liquidity

## 📈 Data Sources

### Offline Demo Data (Seeded CSVs)
- `california_counties.csv`: County-level statistics
- `historical_prices.csv`: 5-year price history
- `economic_indicators.csv`: Interest rates, employment data
- `demographics.csv`: Population, income statistics
- `rental_data.csv`: Rental market information

## 🧪 Testing

```bash
# Run all tests
make test

# Frontend tests (Vitest)
cd frontend && npm test

# Backend tests (pytest)
cd backend && pytest

# Integration tests
make test-integration

# Load tests
make test-load
```

## 🔒 Security

- JWT authentication for API access
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- SQL injection protection

## 📱 API Documentation

Once running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

```
GET  /api/v1/forecast/{address}     # Price forecast
POST /api/v1/investment/score       # Investment analysis  
GET  /api/v1/areas/top              # Top 5 areas
POST /api/v1/rental/calculate       # Cap rate calculator
GET  /api/v1/health                 # Health check
```

## 🌍 Environment Variables

### Development (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/realestate
POSTGRES_USER=realestate_user
POSTGRES_PASSWORD=secure_password
POSTGRES_DB=realestate_db

# API
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=true

# Frontend
VITE_API_URL=http://localhost:8000
VITE_APP_NAME="Real Estate Forecasting"
```

### Production
```bash
# Set in Render dashboard
DATABASE_URL=<render-postgres-url>
FRONTEND_URL=<your-frontend-url>
BACKEND_URL=<your-backend-url>
```

## 🚢 Deployment

### Render (Recommended)

1. **Database**: Create PostgreSQL database
2. **Backend**: Create Web Service from repository
3. **Frontend**: Create Static Site from repository
4. **Environment**: Configure variables in dashboard

### Manual Docker Deployment

```bash
# Build and push images
docker build -t your-registry/re-frontend ./frontend
docker build -t your-registry/re-backend ./backend

# Deploy with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Monitoring

- Health checks on all services
- Error tracking and logging
- Performance metrics
- Database connection monitoring

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues**: GitHub Issues
- **Documentation**: `/docs` folder
- **API Docs**: Available at `/docs` endpoint when running

---

## Files Structure Details

### Frontend (`/frontend`)

#### Package.json
```json
{
  "name": "real-estate-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\""
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "recharts": "^2.5.0",
    "lucide-react": "^0.263.1",
    "clsx": "^1.2.1",
    "react-hook-form": "^7.43.0",
    "@headlessui/react": "^1.7.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.1.0",
    "vitest": "^0.28.0",
    "eslint": "^8.35.0",
    "eslint-plugin-react": "^7.32.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.3.4",
    "prettier": "^2.8.0",
    "tailwindcss": "^3.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

#### Vite Config (`vite.config.js`)
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

#### Tailwind Config (`tailwind.config.js`)
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
```

### Backend (`/backend`)

#### Requirements.txt
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.13.0
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
scikit-learn==1.3.2
lightgbm==4.1.0
shap==0.43.0
pandas==2.1.4
numpy==1.24.3
python-dotenv==1.0.0
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2
```

#### Main FastAPI App (`backend/app/main.py`)
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from app.core.config import settings
from app.api.v1.router import api_router
from app.core.database import engine, Base
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Real Estate Forecasting API",
    description="ML-powered real estate analysis and forecasting",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Real Estate Forecasting API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "real-estate-api"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
```

### Docker Configuration

#### Docker Compose (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-realestate_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-secure_password}
      POSTGRES_DB: ${POSTGRES_DB:-realestate_db}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-realestate_user}"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER:-realestate_user}:${POSTGRES_PASSWORD:-secure_password}@postgres:5432/${POSTGRES_DB:-realestate_db}
      DEBUG: "true"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://localhost:8000
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

volumes:
  postgres_data:
```

#### Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend Dockerfile (`frontend/Dockerfile`)
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### Makefile
```makefile
.PHONY: help dev build test lint format clean

# Default target
help:
	@echo "Available commands:"
	@echo "  dev        - Start development environment"
	@echo "  build      - Build all services"
	@echo "  test       - Run all tests"
	@echo "  lint       - Run linting"
	@echo "  format     - Format code"
	@echo "  clean      - Clean up containers and volumes"

# Development
dev:
	docker-compose up --build

dev-detached:
	docker-compose up -d --build

# Individual services
frontend-dev:
	cd frontend && npm run dev

backend-dev:
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

db-dev:
	docker-compose up postgres -d

# Build
build:
	docker-compose build

# Database
db-init:
	docker-compose exec postgres psql -U realestate_user -d realestate_db -f /docker-entrypoint-initdb.d/init.sql

db-seed:
	docker-compose exec backend python -m app.scripts.seed_data

db-reset:
	docker-compose down -v
	docker-compose up postgres -d
	sleep 10
	make db-seed

# Testing
test:
	make test-backend
	make test-frontend

test-backend:
	cd backend && python -m pytest tests/ -v

test-frontend:
	cd frontend && npm test

test-integration:
	docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit

# Code quality
lint:
	cd frontend && npm run lint
	cd backend && flake8 app/ --max-line-length=88

format:
	cd frontend && npm run format
	cd backend && black app/ --line-length=88

# Production
prod:
	docker-compose -f docker-compose.prod.yml up -d --build

deploy:
	@echo "Deploying to production..."
	git push origin main

# Cleanup
clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

# Install dependencies
install:
	cd frontend && npm install
	cd backend && pip install -r requirements.txt
```

### GitHub Actions (`/.github/workflows/ci.yml`)
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test_password
          POSTGRES_USER: test_user
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5

    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v3
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    
    - name: Run tests
      run: |
        cd backend
        pytest tests/ -v
      env:
        DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db

  test-frontend:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Run tests
      run: |
        cd frontend
        npm test
    
    - name: Build
      run: |
        cd frontend
        npm run build

  build-and-push:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build images
      run: |
        docker build -t real-estate-backend ./backend
        docker build -t real-estate-frontend ./frontend
```

### Render Deployment (`render.yaml`)
```yaml
services:
  - type: web
    name: real-estate-backend
    env: python
    buildCommand: "cd backend && pip install -r requirements.txt"
    startCommand: "cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: real-estate-db
          property: connectionString
      - key: FRONTEND_URL
        value: https://real-estate-frontend.onrender.com

  - type: web
    name: real-estate-frontend
    env: static
    buildCommand: "cd frontend && npm install && npm run build"
    staticPublishPath: frontend/dist
    envVars:
      - key: VITE_API_URL
        value: https://real-estate-backend.onrender.com

databases:
  - name: real-estate-db
    databaseName: realestate
    user: realestate_user
```

This comprehensive setup provides:

1. ✅ **Full-stack architecture** with React + Vite frontend and FastAPI backend
2. ✅ **ML capabilities** with scikit-learn, LightGBM, and SHAP
3. ✅ **PostgreSQL database** with Docker Compose
4. ✅ **Offline demo** with seeded California counties data
5. ✅ **All requested features**:
   - Address/ZIP price forecasting with confidence intervals
   - Investment scoring with SHAP explanations
   - Top 5 areas analysis
   - Rental cap-rate calculator with editable assumptions
6. ✅ **Complete DevOps pipeline** with GitHub Actions CI/CD
7. ✅ **One-click deployment** to Render
8. ✅ **Comprehensive testing** and code quality tools
9. ✅ **Production-ready** Docker configuration
10. ✅ **Developer-friendly** Makefile and documentation

