from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import requests
from functools import lru_cache
from typing import List, Dict

from prediction import train_and_predict

app = FastAPI(title="Stock Price Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    ticker: str
    start_date: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the Stock Price Prediction API"}

import time
_search_cache: Dict[str, tuple[float, List[Dict]]] = {}
CACHE_TTL = 90

def fetch_yahoo_suggestions(query: str) -> List[Dict]:
    now = time.time()
    if query in _search_cache:
        timestamp, cached_data = _search_cache[query]
        if now - timestamp < CACHE_TTL:
            return cached_data

    url = "https://query2.finance.yahoo.com/v1/finance/search"
    params = {
        "q": query,
        "quotesCount": 10,
        "newsCount": 0
    }
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
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
    return suggestions

@app.get("/search")
def search_stocks(q: str):
    if not q or len(q) < 1:
        return []
    
    try:
        suggestions = fetch_yahoo_suggestions(q)
        
        # Fallback: if no suggestions and text has spaces (e.g. "praj industry"),
        # try searching with just the most significant first word to find variations.
        if not suggestions and " " in q:
            first_word = q.split(" ")[0]
            suggestions = fetch_yahoo_suggestions(first_word)
            
        return list(suggestions)[:5]
    except Exception as e:
        import traceback
        print(f"Search error: {e}")
        traceback.print_exc()
        return []

@app.post("/predict")
def predict_stock(request: PredictionRequest):
    try:
        result = train_and_predict(ticker=request.ticker, start_date=request.start_date)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

import yfinance as yf

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
            
            # fast_info is often more reliable and faster for real-time current quotes
            if hasattr(fast_info, 'previous_close') and hasattr(fast_info, 'last_price'):
                prev_close = fast_info.previous_close
                current = fast_info.last_price
                
                if current and prev_close:
                    change = current - prev_close
                    pct_change = (change / prev_close) * 100
                    trend = "up" if change >= 0 else "down"
                    
                    results.append({
                        "symbol": symbol,
                        "name": name,
                        "current": round(current, 2),
                        "change": round(change, 2),
                        "pct_change": round(pct_change, 2),
                        "trend": trend
                    })
        return results
    except Exception as e:
        import traceback
        traceback.print_exc()
        return []

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
