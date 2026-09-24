import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import yfinance as yf
import datetime

def train_and_predict_daily(ticker: str):
    df = yf.download(ticker, period="2y", interval="1d", progress=False)
    
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
        
    df = df[['Open', 'Close']]
    
    # YFinance bug: Current day sometimes returns NaN for 1d interval
    if len(df) > 0 and pd.isna(df['Close'].iloc[-1]):
        last_date = df.index[-1]
        try:
            df_1m = yf.download(ticker, period="1d", interval="1m", progress=False)
            if isinstance(df_1m.columns, pd.MultiIndex):
                df_1m.columns = df_1m.columns.get_level_values(0)
            if not df_1m.empty:
                df.loc[last_date, 'Open'] = df_1m['Open'].iloc[0]
                df.loc[last_date, 'Close'] = df_1m['Close'].iloc[-1]
        except Exception:
            pass
            
    df = df.dropna()
    
    if len(df) < 50:
        raise ValueError("Not enough daily data to generate a forecast.")
        
    lags = 10
    for i in range(1, lags + 1):
        df[f'Lag_{i}_Close'] = df['Close'].shift(i)
        df[f'Lag_{i}_Open'] = df['Open'].shift(i)
        
    df = df.dropna()
    
    feature_cols = [f'Lag_{i}_Close' for i in range(1, lags + 1)] + [f'Lag_{i}_Open' for i in range(1, lags + 1)]
    X = df[feature_cols].values
    y = df[['Open', 'Close']].values
    
    model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X, y)
    
    predictions = []
    current_close_lags = list(df['Close'].iloc[-lags:].values)
    current_open_lags = list(df['Open'].iloc[-lags:].values)
    
    last_date = df.index[-1]
    
    for _ in range(7):
        features_close = np.array(current_close_lags[::-1])
        features_open = np.array(current_open_lags[::-1])
        features = np.concatenate([features_close, features_open])
        
        pred = model.predict([features])[0]
        pred_open = pred[0]
        pred_close = pred[1]
        trend = "UP" if pred_close >= pred_open else "DOWN"
        
        predictions.append({
            "open": round(float(pred_open), 2),
            "close": round(float(pred_close), 2),
            "trend": trend
        })
        
        current_close_lags.pop(0)
        current_close_lags.append(pred_close)
        current_open_lags.pop(0)
        current_open_lags.append(pred_open)
        
    future_dates = []
    curr_date = last_date
    
    # NSE / BSE Fixed Market Holidays
    indian_fixed_holidays = ['01-26', '04-14', '05-01', '08-15', '10-02', '12-25']
    
    while len(future_dates) < 7:
        curr_date += datetime.timedelta(days=1)
        md = curr_date.strftime('%m-%d')
        
        # Check weekends
        if curr_date.weekday() >= 5:
            continue
            
        # Check Indian holidays
        if md in indian_fixed_holidays:
            continue
            
        future_dates.append(curr_date)
            
    for i in range(7):
        predictions[i]["date"] = future_dates[i].strftime('%Y-%m-%d')
        
    recent_df = df.tail(30)
    recent_X = X[-30:]
    recent_preds = model.predict(recent_X)
    
    recent_df.index = pd.to_datetime(recent_df.index, utc=True)
    chart_dates = recent_df.index.strftime('%Y-%m-%d').tolist()
    chart_actual_close = [round(val, 2) for val in recent_df['Close'].values]
    chart_actual_open = [round(val, 2) for val in recent_df['Open'].values]
    chart_predicted_close = [round(float(val[1]), 2) for val in recent_preds]
    chart_predicted_open = [round(float(val[0]), 2) for val in recent_preds]
    
    currency = "USD"
    ticker_upper = ticker.upper()
    currency_mapping = {
        '.NS': 'INR', '.BO': 'INR',
        '.L': 'GBP', '.PA': 'EUR', '.DE': 'EUR'
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
        "historical": {
            "dates": chart_dates,
            "close": chart_actual_close,
            "open": chart_actual_open,
            "predicted_close": chart_predicted_close,
            "predicted_open": chart_predicted_open
        },
        "forecast": predictions,
        "currency": currency,
        "current_price": round(float(df['Close'].values[-1]), 2),
        "generated_at": datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
