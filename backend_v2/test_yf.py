import pandas as pd
from datetime import datetime, timedelta
import yfinance as yf

ticker = "RELIANCE.NS"
end_date = datetime.now()
all_data = []

# Fetch data in 5-day increments to stay safely under the 7-day limit
for i in range(6):
    start = end_date - timedelta(days=(i + 1) * 5)
    end = end_date - timedelta(days=i * 5)

    df = yf.download(
        ticker,
        start=start.strftime("%Y-%m-%d"),
        end=end.strftime("%Y-%m-%d"),
        interval="1m",
        progress=False,
    )
    if not df.empty:
        all_data.append(df)

if all_data:
    # Combine and sort chronological data
    final_df = pd.concat(all_data).sort_index()
    # Drop overlapping rows if any
    final_df = final_df[~final_df.index.duplicated(keep="first")]
    print(f"Total rows retrieved: {len(final_df)}")
else:
    print("Total rows retrieved: 0")
