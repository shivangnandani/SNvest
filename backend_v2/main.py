from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import requests
from typing import List, Dict
import time
import yfinance as yf

from ml_model import train_and_predict_intraday

app = FastAPI(title="SNvest Intraday ML API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    ticker: str
    start_date: str # Ignored in backend_v2

_search_cache = {}
CACHE_TTL = 90

@app.get("/search")
def search_stock(q: str = Query(..., min_length=1)):
    query = q.upper()
    now = time.time()
    
    if query in _search_cache:
        timestamp, cached_data = _search_cache[query]
        if now - timestamp < CACHE_TTL:
            return cached_data

    url = "https://query2.finance.yahoo.com/v1/finance/search"
    params = {"q": query, "quotesCount": 15, "newsCount": 0}
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    try:
        response = requests.get(url, params=params, headers=headers, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        suggestions = []
        for quote in data.get('quotes', []):
            if quote.get('quoteType') in ['EQUITY', 'ETF']:
                symbol = quote.get('symbol', '')
                if symbol.endswith('.NS') or symbol.endswith('.BO'):
                    suggestions.append({
                        'symbol': symbol,
                        'name': quote.get('shortname') or quote.get('longname') or symbol,
                        'exchDisp': quote.get('exchDisp'),
                        'type': quote.get('quoteType')
                    })
                    
        _search_cache[query] = (now, suggestions)
        return suggestions[:10]
    except Exception as e:
        return []



@app.get("/market-indices")
def get_market_indices():
    indices = {
        "^NSEI": "NIFTY 50",
        "^BSESN": "SENSEX",
        "^NSEBANK": "BANK NIFTY",
        "^CNXIT": "NIFTY IT"
    }
    results = []
    try:
        for symbol, name in indices.items():
            ticker = yf.Ticker(symbol)
            fast_info = ticker.fast_info
            if hasattr(fast_info, 'previous_close') and hasattr(fast_info, 'last_price'):
                prev_close = fast_info.previous_close
                current = fast_info.last_price
                if current and prev_close:
                    change = current - prev_close
                    pct_change = (change / prev_close) * 100
                    trend = "up" if change >= 0 else "down"
                    results.append({
                        "symbol": symbol, "name": name,
                        "current": round(current, 2), "change": round(change, 2),
                        "pct_change": round(pct_change, 2), "trend": trend
                    })
        return results
    except:
        return []

@app.post("/predict")
def predict_stock(request: PredictionRequest):
    try:
        result = train_and_predict_intraday(ticker=request.ticker)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

from ml_model_daily import train_and_predict_daily

@app.post("/predict-daily")
def predict_stock_daily(request: PredictionRequest):
    try:
        result = train_and_predict_daily(ticker=request.ticker)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
