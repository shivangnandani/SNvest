import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from data_manager import get_intraday_data, DATA_DIR

def update_ticker(ticker):
    try:
        print(f"Updating {ticker}...")
        get_intraday_data(ticker)
        return f"Successfully updated {ticker}"
    except Exception as e:
        return f"Failed to update {ticker}: {str(e)}"

def main():
    if not os.path.exists(DATA_DIR):
        print("Data directory not found.")
        return

    csv_files = [f for f in os.listdir(DATA_DIR) if f.endswith('.csv')]
    tickers = [f.replace('.csv', '') for f in csv_files]
    
    print(f"Found {len(tickers)} tickers to update.")
    
    success_count = 0
    fail_count = 0
    
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_ticker = {executor.submit(update_ticker, ticker): ticker for ticker in tickers}
        for future in as_completed(future_to_ticker):
            result = future.result()
            print(result)
            if "Successfully" in result:
                success_count += 1
            else:
                fail_count += 1
                
    print(f"\nUpdate Complete! Success: {success_count} | Failed: {fail_count}")

if __name__ == "__main__":
    main()
