import os
import pandas as pd
import yfinance as yf

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

def get_intraday_data(ticker: str) -> pd.DataFrame:
    """
    Fetches 1-minute intraday data.
    If CSV exists, fetches recent data and appends.
    If not, fetches the maximum allowed by yf for 1m (7 days) and saves.
    Over time, the CSV will grow to contain 30+ days.
    """
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        
    csv_path = os.path.join(DATA_DIR, f"{ticker}.csv")
    
    existing_df = None
    if os.path.exists(csv_path):
        try:
            existing_df = pd.read_csv(csv_path, index_col='Datetime', parse_dates=True)
        except Exception as e:
            print(f"Error reading existing CSV: {e}")
            existing_df = None
    
    print(f"Fetching 1m data for {ticker} using 5-day chunks (max 30 days)...")
    
    end_date = pd.Timestamp.now()
    all_data = []

    # Fetch data in 5-day increments to stay safely under the 7-day chunk limit, up to 30 days
    for i in range(6):
        start = end_date - pd.Timedelta(days=(i + 1) * 5)
        # Add 1 day to end date because yf.download end date is exclusive
        end = end_date - pd.Timedelta(days=i * 5) + pd.Timedelta(days=1)

        try:
            df = yf.download(
                ticker,
                start=start.strftime("%Y-%m-%d"),
                end=end.strftime("%Y-%m-%d"),
                interval="1m",
                progress=False,
            )
            if not df.empty:
                all_data.append(df)
        except:
            pass
            
    if all_data:
        new_df = pd.concat(all_data).sort_index()
        new_df = new_df[~new_df.index.duplicated(keep="last")]
    else:
        new_df = pd.DataFrame()
    
    if new_df.empty:
        if existing_df is not None and not existing_df.empty:
            return existing_df
        raise ValueError(f"No intraday data found for {ticker}")
        
    # Handle yfinance MultiIndex columns (like ('Close', 'RELIANCE.NS'))
    if isinstance(new_df.columns, pd.MultiIndex):
        new_df.columns = new_df.columns.get_level_values(0)
        
    new_df.index.name = 'Datetime'
    
    if existing_df is not None and not existing_df.empty:
        # Align timezones if needed
        if getattr(existing_df.index, 'tz', None) is None and getattr(new_df.index, 'tz', None) is not None:
            existing_df.index = existing_df.index.tz_localize(new_df.index.tz)
        elif getattr(existing_df.index, 'tz', None) is not None and getattr(new_df.index, 'tz', None) is None:
            new_df.index = new_df.index.tz_localize(existing_df.index.tz)
            
        combined_df = pd.concat([existing_df, new_df])
        combined_df = combined_df[~combined_df.index.duplicated(keep='last')]
    else:
        combined_df = new_df
        
    combined_df = combined_df.sort_index()
    combined_df.to_csv(csv_path)
    
    return combined_df
