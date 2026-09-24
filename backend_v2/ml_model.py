import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from data_manager import get_intraday_data
import datetime
import yfinance as yf

def train_and_predict_intraday(ticker: str):
    df = get_intraday_data(ticker)
    
    df = df[['Open', 'Close']].dropna()
    
    if len(df) < 15:
        raise ValueError("Not enough intraday data points to generate a forecast. The stock might not be trading actively.")

    # Engineer Lagged Features for Machine Learning
    # We use the previous 10 minutes to predict the current minute
    lags = 10
    for i in range(1, lags + 1):
        df[f'Lag_{i}_Close'] = df['Close'].shift(i)
        df[f'Lag_{i}_Open'] = df['Open'].shift(i)
        
    df = df.dropna()
    
    feature_cols = [f'Lag_{i}_Close' for i in range(1, lags + 1)] + [f'Lag_{i}_Open' for i in range(1, lags + 1)]
    X = df[feature_cols].values
    y = df[['Open', 'Close']].values
    
    # Fast Random Forest model for time-series approximation (multi-output)
    model = RandomForestRegressor(n_estimators=50, random_state=42, n_jobs=-1)
    model.fit(X, y)
    
    # Get predictions for the chart (we'll just use Close for the main chart to keep it simple)
    y_pred_close = model.predict(X)[:, 1]
    
    # Predict the NEXT minute
    last_features_close = df['Close'].iloc[-lags:].values[::-1]
    last_features_open = df['Open'].iloc[-lags:].values[::-1]
    last_features = np.concatenate([last_features_close, last_features_open])
    
    future_pred = model.predict([last_features])[0]
    future_open = future_pred[0]
    future_close = future_pred[1]
    future_trend = "UP" if future_close >= future_open else "DOWN"
    
    # Ensure index is datetime before strftime, forcing UTC to handle tz-aware mixing
    df.index = pd.to_datetime(df.index, utc=True)
    dates = [d.isoformat() for d in df.index]
    
    # Compute next minute timestamp
    last_date = df.index[-1]
    future_date = last_date + datetime.timedelta(minutes=1)
    
    # Fetch currency mapping
    currency = "USD"
    ticker_upper = ticker.upper()
    currency_mapping = {
        '.NS': 'INR', '.BO': 'INR',
        '.L': 'GBP', '.PA': 'EUR', '.DE': 'EUR',
        '.TO': 'CAD', '.HK': 'HKD', '.T': 'JPY',
        '.AX': 'AUD', '.SS': 'CNY', '.SZ': 'CNY'
    }
    for suffix, curr in currency_mapping.items():
        if ticker_upper.endswith(suffix):
            currency = curr
            break
            
    if currency == "USD":
        try:
            info = yf.Ticker(ticker).fast_info
            if hasattr(info, 'currency'):
                currency = info.currency
        except:
            pass
            
    return {
        "dates": dates,
        "actual": [round(val, 2) for val in df['Close'].values],
        "predicted": [round(val, 2) for val in y_pred_close],
        "currency": currency,
        "future_date": future_date.isoformat(),
        "future_prediction": round(float(future_close), 2),
        "future_open": round(float(future_open), 2),
        "future_close": round(float(future_close), 2),
        "future_trend": future_trend,
        "current_price": round(float(df['Close'].values[-1]), 2),
        "generated_at": datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
