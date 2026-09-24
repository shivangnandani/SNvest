import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { MarketTicker } from './components/MarketTicker'
import { StockPredictionForm } from './components/StockPredictionForm'
import { PredictionChart } from './components/PredictionChart'
import { StockInfo } from './components/StockInfo'
import { Footer } from './components/Footer'
import { AboutModel } from './components/AboutModel'
import { Documentation } from './components/Documentation'
import { ScrollToTop } from './components/ScrollToTop'
import { Disclaimer } from './components/Disclaimer'
import { TermsOfService } from './components/TermsOfService'
import { FuturePrediction } from './components/FuturePrediction'
import { LiveTracking } from './components/LiveTracking'
import { RecentPredictions } from './components/RecentPredictions'
import { Developer } from './components/Developer'
import { type PredictionData } from './lib/mockData'

function App() {
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null)
  const [dailyPredictionData, setDailyPredictionData] = useState<any | null>(null)
  const [predictionHistory, setPredictionHistory] = useState<PredictionData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('snvest_history');
    if (savedHistory) {
      try {
        setPredictionHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const handlePredict = async (stockName: string, startDate: string) => {
    setIsLoading(true)
    setPredictionData(null)
    setDailyPredictionData(null)

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      
      const intradayPromise = fetch(`${baseUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: stockName, start_date: startDate }),
      });
      
      const dailyPromise = fetch(`${baseUrl}/predict-daily`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: stockName }),
      });

      const [intradayRes, dailyRes] = await Promise.all([intradayPromise, dailyPromise]);

      if (!intradayRes.ok) {
        const errorData = await intradayRes.json();
        throw new Error(errorData.detail || 'Failed to fetch predictions');
      }

      const rawData = await intradayRes.json();
      
      if (dailyRes.ok) {
         const dailyRaw = await dailyRes.json();
         setDailyPredictionData(dailyRaw);
      }

      const chartData = rawData.dates.map((date: string, index: number) => ({
        date: date,
        actual: rawData.actual[index],
        predicted: rawData.predicted[index]
      }));

      const endDate = rawData.dates.length > 0 ? rawData.dates[rawData.dates.length - 1] : '';

      const data: PredictionData = {
        stockName: stockName,
        startDate: startDate,
        endDate: endDate,
        currency: rawData.currency || 'USD',
        chartData: chartData,
        futureDate: rawData.future_date,
        futurePrediction: rawData.future_prediction,
        futureOpen: rawData.future_open,
        futureClose: rawData.future_close,
        futureTrend: rawData.future_trend,
        generatedAt: rawData.generated_at
      };

      setPredictionData(data)
      
      // Save to history (keep last 8)
      setPredictionHistory(prev => {
        // Remove if it already exists to move it to the front
        const filtered = prev.filter(p => p.stockName !== data.stockName);
        const newHistory = [data, ...filtered].slice(0, 8);
        localStorage.setItem('snvest_history', JSON.stringify(newHistory));
        return newHistory;
      });

    } catch (error: any) {
      console.error(error);
      alert(error.message);
      setPredictionData(null);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF0F6] via-white to-[#EFF0F6] dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 text-foreground font-sans selection:bg-primary/20 relative flex flex-col">
      {/* Stock Market Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5 dark:opacity-10 z-0">
        <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 1000">
          <path d="M0 800 L200 600 L400 700 L600 400 L800 500 L1000 200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
          <path d="M0 900 L250 850 L500 950 L750 750 L1000 650" fill="none" stroke="currentColor" strokeWidth="4" />
          <g transform="translate(100, 500)">
             <rect x="0" y="-50" width="20" height="100" fill="currentColor" />
             <line x1="10" y1="-80" x2="10" y2="80" stroke="currentColor" strokeWidth="2" />
          </g>
          <g transform="translate(300, 600)">
             <rect x="0" y="-30" width="20" height="60" fill="currentColor" />
             <line x1="10" y1="-50" x2="10" y2="70" stroke="currentColor" strokeWidth="2" />
          </g>
          <g transform="translate(500, 300)">
             <rect x="0" y="-80" width="20" height="160" fill="currentColor" />
             <line x1="10" y1="-120" x2="10" y2="100" stroke="currentColor" strokeWidth="2" />
          </g>
          <g transform="translate(700, 400)">
             <rect x="0" y="-40" width="20" height="80" fill="currentColor" />
             <line x1="10" y1="-60" x2="10" y2="100" stroke="currentColor" strokeWidth="2" />
          </g>
        </svg>
      </div>

      <ScrollToTop />
      <Header />
      <MarketTicker />

      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 lg:p-8 relative z-10 flex flex-col">
        <Routes>
          <Route path="/" element={<>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 animate-in fade-in duration-700">
              {/* Left Column: Command Center */}
              <aside className="w-full lg:w-[420px] flex-shrink-0 flex flex-col gap-8 lg:sticky lg:top-28 h-fit">
                <section>
                  <div className="inline-flex items-center rounded-full border border-black/5 dark:border-white/20 bg-white/40 dark:bg-white/5 backdrop-blur-md px-4 py-1.5 text-sm font-medium text-foreground/80 mb-6 shadow-sm">
                    <span className="flex h-2 w-2 rounded-full bg-foreground/50 mr-3 animate-pulse"></span>
                    AI-Powered Indian Market Analysis
                  </div>
                  <h1 className="mb-4 text-4xl lg:text-5xl font-light tracking-tight text-foreground text-balance">
                    SNvest - <br/>
                    <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">See Tomorrow. Trade Today.</span>
                  </h1>
                  <p className="text-base text-muted-foreground mt-4">
                    Advanced time-series forecasting designed exclusively for Indian equities (NSE/BSE).
                  </p>
                </section>

                <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                  <StockPredictionForm onPredict={handlePredict} isLoading={isLoading} />
                </div>

              </aside>

              {/* Right Column: Canvas / Results */}
              <div className="flex-1 min-w-0">
                {predictionData ? (
                  <section className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                    <h2 className="text-2xl font-bold tracking-tight">{predictionData.stockName} Analysis (1m)</h2>
                    <StockInfo data={predictionData} />
                    <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl p-2 lg:p-6 shadow-sm">
                      <PredictionChart data={predictionData} />
                    </div>
                    
                    {dailyPredictionData && (
                      <div className="pt-8 border-t border-border/50">
                        <h2 className="text-2xl font-bold tracking-tight mb-8">7-Day Strategic Forecast</h2>
                        <FuturePrediction predictionDataOverride={dailyPredictionData} />
                      </div>
                    )}
                  </section>
                ) : (
                  <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-black/10 dark:border-white/10 rounded-3xl bg-white/20 dark:bg-white/5 backdrop-blur-sm p-8 text-center">
                     <div className="w-16 h-16 mb-4 text-foreground/20">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                     </div>
                     <h3 className="text-xl font-medium text-foreground/60 mb-2">Ready to Analyze</h3>
                     <p className="text-muted-foreground max-w-sm">Search for an Indian stock symbol on the left to generate an AI-powered forecast.</p>
                  </div>
                )}
              </div>
            </div>
          </>} />
          <Route path="/aboutmodel" element={<AboutModel />} />
          <Route path="/future-prediction" element={<FuturePrediction />} />
          <Route path="/live-tracking" element={<LiveTracking />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
