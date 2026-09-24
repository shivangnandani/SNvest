import sys
import os

sys.path.append(os.path.dirname(__file__))
from data_manager import get_intraday_data

tickers = [
    "ADANIENT", "ADANIPORTS", "APOLLOHOSP", "ASIANPAINT", "AXISBANK",
    "BAJAJ-AUTO", "BAJFINANCE", "BAJAJFINSV", "BEL", "BHARTIARTL",
    "CIPLA", "COALINDIA", "DRREDDY", "EICHERMOT", "ETERNAL",
    "GRASIM", "HCLTECH", "HDFCBANK", "HDFCLIFE", "HINDALCO",
    "HINDUNILVR", "ICICIBANK", "INDIGO", "INFY", "ITC",
    "JIOFIN", "JSWSTEEL", "KOTAKBANK", "LT", "M&M",
    "MARUTI", "MAXHEALTH", "NESTLEIND", "NTPC", "ONGC",
    "POWERGRID", "RELIANCE", "SBILIFE", "SHRIRAMFIN", "SBIN",
    "SUNPHARMA", "TCS", "TATACONSUM", "TMPV", "TATASTEEL",
    "TECHM", "TITAN", "TRENT", "ULTRACEMCO", "WIPRO"
]

failed = []

for base_ticker in tickers:
    ticker = f"{base_ticker}.BO"
    print(f"--- Processing {ticker} ---")
    try:
        get_intraday_data(ticker)
        print(f"Successfully cached 30-day 1m data for {ticker}")
    except Exception as e:
        print(f"Failed to fetch {ticker}: {e}")
        failed.append(ticker)

print("\nFinished fetching BSE SENSEX 50.")
if failed:
    print(f"Failed tickers: {failed}")
