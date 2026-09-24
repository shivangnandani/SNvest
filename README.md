# SNvest: Indian Stock Market Prediction Engine 📈

SNvest is an advanced, full-stack machine learning application designed specifically for the **Indian Stock Market (NSE/BSE)**. It leverages historical market data and aggressive time-series forecasting to generate live, multi-horizon stock predictions.

Built entirely as a serverless, automatically updating architecture, SNvest runs continuously for free using GitHub Actions and Hugging Face Spaces.

## 🚀 Key Features

* **Intraday Analysis (1-minute):** Analyzes the last 30 days of 1-minute interval data to capture micro-trends and volatility.
* **7-Day Strategic Forecast:** A rigorous daily prediction model that generates expected trend movements (Open/Close) for the upcoming 7 trading sessions.
* **Live Day Tracking:** A dedicated dashboard that fetches live market data during trading hours (9:15 AM - 3:30 PM IST) and calculates real-time percentage errors against the AI's predictions.
* **Nightly Auto-Updater:** The engine's background CSV dataset is automatically updated every night via GitHub Actions, meaning the AI is never out of sync with the market.
* **Fully Responsive UI:** Built with React & Tailwind CSS for a premium, responsive experience across mobile and desktop.

## 🧠 Machine Learning Approach
Instead of basic "tomorrow's price" algorithms, SNvest focuses on **Pattern-Based Learning** and honest backtesting:
1. **Feature Engineering:** We extract lagged observations across rolling windows to feed the AI historical relationships.
2. **Model:** Supervised Machine Learning using highly optimized `RandomForestRegressor` engines for both Intraday and Daily forecasts.
3. **Continuous Backtesting:** The platform explicitly overlays its past predictions directly against the actual historical market movements so users can visually verify accuracy.

## 🛠️ Technology Stack

**Frontend:**
* React 19 + TypeScript
* Vite (Deployed on GitHub Pages)
* Tailwind CSS + Shadcn UI
* Recharts (Data Visualization)

**Backend AI Engine:**
* FastAPI (Python)
* Scikit-Learn (Random Forest)
* Pandas & NumPy (Data Processing)
* `yfinance` API (Market Data)
* Deployed on Hugging Face Spaces (Docker / 16GB RAM)

**Automation Pipeline:**
* GitHub Actions (Nightly Cron Jobs)

## 💻 Local Development Setup

To run SNvest on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/shivangnandani/StockPrice-Forecast.git
cd StockPrice-Forecast
```

### 2. Start the Backend ML Engine
Ensure you have Python 3.10+ installed.
```bash
cd backend_v2
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
The backend API will boot up on `http://localhost:8000`.

### 3. Start the Frontend
```bash
cd ../frontend
npm install
npm run dev
```
The application will be running at `http://localhost:5173`.

## ⚠️ Disclaimer
SNvest is a technical experiment built for educational and research purposes. Financial markets contain unpredictable noise and external influences. This platform should **never** be used for real-world trading or financial decision-making.

---
**Developed by [Shivang Nandani](https://in.linkedin.com/in/shivangnandani)**  
*Computer Engineering Student | UI/UX & Machine Learning Enthusiast*
